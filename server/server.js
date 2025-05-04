const express = require('express');
const prisma = require('./prismaClient');
const cors = require('cors');
const dayjs = require('dayjs');

const app = express();
const port = 4000;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // 허용할 출처
  }),
);

app.get('/list', async (req, res) => {
  try {
    const result = await prisma.history.findMany({
      orderBy: [{ target_date: 'desc' }, { create_date_time: 'desc' }],
    });

    // ROW NUMBER
    const formatted = result.map((row, index) => ({
      no: index + 1,
      ...row,
      date: row.target_date,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching list', err);
    res.status(500).send('DB 오류');
  }
});

app.post('/add', async (req, res) => {
  const { writer, type, amount, description, date } = req.body;

  if (!writer || !amount || !description) {
    return res.status(400).json({ message: '필수 입력 필드를 확인해주세요.' });
  }

  try {
    await prisma.history.create({
      data: {
        writer,
        type,
        amount,
        description,
        target_date: date,
        create_date_time: new Date(),
      },
    });

    res.status(201).json({ message: '저장이 완료 되었습니다.' });
  } catch (err) {
    console.error('Insert error', err);
    res.status(500).json({ message: '저장 중 에러가 발생하였습니다.' });
  }
});

app.put('/update', async (req, res) => {
  const { id, writer, type, amount, description, date } = req.body;

  if (!writer || !amount || !description) {
    return res.status(400).json({ message: '필수 입력 필드를 확인해주세요.' });
  }

  try {
    await prisma.history.update({
      where: { id: Number(id) },
      data: {
        writer,
        type,
        amount,
        description,
        target_date: date,
        update_date_time: new Date(),
      },
    });

    res.status(201).json({ message: '수정이 완료 되었습니다.' });
  } catch (err) {
    console.error('Update error', err);
    res.status(500).json({ message: '수정 중 에러가 발생하였습니다.' });
  }
});

app.get('/month', async (req, res) => {
  const { month } = req.query; // 예: 2025-05

  if (!month || typeof month !== 'string' || !/^\d{4}-\d{1,2}$/.test(month)) {
    return res.status(400).send('올바른 month 쿼리 파라미터가 필요합니다');
  }

  try {
    const result = await prisma.history.groupBy({
      by: ['target_date'],
      where: {
        target_date: {
          startsWith: month, // e.g., '2025-05'
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        target_date: 'asc',
      },
    });

    // 📌 result를 Map으로 변환해서 빠르게 조회
    const resultMap = new Map(
      result.map((row) => [row.target_date, row._sum.amount ?? 0]),
    );

    // 📌 해당 월의 총 일 수 계산
    const daysInMonth = dayjs(`${month}-01`).daysInMonth();

    // 📌 1일부터 말일까지 모든 날짜 생성
    const formatted = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const paddedDay = String(day).padStart(2, '0'); // '01' ~ '31'
      const fullDate = `${month}-${paddedDay}`; // '2025-05-01' 등

      return {
        date: paddedDay, // 차트용 (x축)
        totalAmount: resultMap.get(fullDate) ?? 0, // 데이터 있으면 금액, 없으면 0
      };
    });
    res.json(formatted);
    // const result = await prisma.history.groupBy({
    //   by: ['target_date'],
    //   where: {
    //     target_date: {
    //       startsWith: month, // LIKE '2025-05%'
    //     },
    //   },
    //   _sum: {
    //     amount: true,
    //   },
    //   orderBy: {
    //     target_date: 'asc',
    //   },
    // });

    // const formatted = result.map((row) => ({
    //   date: row.target_date.slice(-2),
    //   totalAmount: row._sum.amount ?? 0,
    // }));

    // res.json(formatted);
  } catch (err) {
    console.error('Error fetching grouped data', err);
    res.status(500).send('DB 오류');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
