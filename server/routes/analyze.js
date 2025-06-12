const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const verifyToken = require('../middleware/verifyToken');

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const dayjs = require('dayjs');

router.post('/spending', verifyToken, async (req, res) => {
  const today = dayjs();
  const currentMonthStart = today.startOf('month');
  const prevMonthSameDay = today.subtract(1, 'month');
  const prevMonthStart = prevMonthSameDay.startOf('month');

  // 예외 처리된 이전 달의 종료일
  const prevMonthEndCandidate = prevMonthStart.date(today.date());
  const prevMonthEnd = prevMonthEndCandidate.isAfter(
    prevMonthStart.endOf('month'),
  )
    ? prevMonthStart.endOf('month')
    : prevMonthEndCandidate;

  try {
    const [thisMonthData, prevMonthData] = await Promise.all([
      prisma.history.findMany({
        where: {
          type: 'expense',
          target_date: {
            gte: currentMonthStart.toISOString(),
            lt: today.add(1, 'day').startOf('day').toISOString(),
          },
        },
        include: { category: true },
      }),
      prisma.history.findMany({
        where: {
          type: 'expense',
          target_date: {
            gte: prevMonthStart.toISOString(),
            lt: prevMonthEnd.add(1, 'day').startOf('day').toISOString(),
          },
        },
        include: { category: true },
      }),
    ]);

    const sumByCategory = (data) => {
      return data.reduce((acc, cur) => {
        const category = cur.category?.name || '기타';
        acc[category] = (acc[category] || 0) + cur.amount;
        return acc;
      }, {});
    };

    const input = {
      last_month: sumByCategory(prevMonthData),
      this_month: sumByCategory(thisMonthData),
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '너는 데이터 분석가야. 사용자에게 전달할 분석 결과를 작성할 때는 분석 내용만 간결하게 전달하고, 추가 정보 요청이나 제안은 포함하지 마.',
        },
        {
          role: 'user',
          content: `아래 두 달의 소비 데이터를 비교해서 분석해줘. 분석은 3~5문장 정도로 간단하고 명확하게 해줘. 어느 항목에서 소비가 큰지, 소비가 줄어든 부분이 어떤 부분인지 포함해줘. 마지막에 "추가 정보가 필요하다"는 문구는 포함하지 마.\n\n${JSON.stringify(
            input,
            null,
            2,
          )}`,
        },
      ],
    });

    res.json({ analysis: completion.choices[0].message.content });
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({
        message:
          'OpenAI 사용 한도를 초과했습니다. 요금제와 사용량을 확인해주세요.',
      });
    }
    console.error('분석 실패:', err);
    res.status(500).json({ message: '서버 오류로 분석에 실패했습니다.' });
  }
});

module.exports = router;
