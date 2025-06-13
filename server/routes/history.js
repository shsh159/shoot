const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const verifyToken = require('../middleware/verifyToken');

const dayjs = require('dayjs');

router.get('/list', verifyToken, async (req, res) => {
  try {
    const result = await prisma.history.findMany({
      orderBy: [{ target_date: 'desc' }, { create_date_time: 'desc' }],
      include: {
        category: {
          select: {
            name: true, // category 테이블의 name 컬럼만 포함
          },
        },
      },
    });

    // ROW NUMBER + 날짜 포맷 + category.name 추가
    const formatted = result.map((row, index) => {
      const { category, category_id, ...rest } = row; // category 필드 제거
      return {
        no: index + 1,
        ...rest,
        date: row.target_date,
        categoryId: row?.category_id || null,
        categoryName: category?.name || null,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching list', err);
    res.status(500).send('DB 오류');
  }
});

router.post('/add', verifyToken, async (req, res) => {
  const { writer, type, amount, description, date, categoryId } = req.body;

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
        category_id: categoryId,
      },
    });

    res.status(201).json({ message: '저장이 완료 되었습니다.' });
  } catch (err) {
    console.error('Insert error', err);
    res.status(500).json({ message: '저장 중 에러가 발생하였습니다.' });
  }
});

router.put('/update', verifyToken, async (req, res) => {
  const { id, writer, type, amount, description, date, categoryId } = req.body;

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
        category_id: categoryId,
      },
    });

    res.status(201).json({ message: '수정이 완료 되었습니다.' });
  } catch (err) {
    console.error('Update error', err);
    res.status(500).json({ message: '수정 중 에러가 발생하였습니다.' });
  }
});

router.delete('/delete', verifyToken, async (req, res) => {
  const { historyId } = req.query;

  if (!historyId) {
    return res.status(400).json({ message: '필수 입력 필드를 확인해주세요.' });
  }

  try {
    const targetHistory = await prisma.history.findUnique({
      where: { id: Number(historyId) },
    });
    if (!targetHistory) {
      return res.status(404).json({ message: '삭제 가능한 내역이 없습니다.' });
    }
    await prisma.history.delete({
      where: { id: Number(historyId) },
    });
    return res.status(200).json({ message: '삭제가 완료되었습니다.' });
  } catch (err) {
    console.log('Delete error', err);
    res.status(500).json({ message: '삭제 중 에러가 발생하였습니다.' });
  }
});

router.get('/dashboard/month', verifyToken, async (req, res) => {
  const { month } = req.query; // 예: 2025-05

  if (!month || typeof month !== 'string' || !/^\d{4}-\d{1,2}$/.test(month)) {
    return res.status(400).send('올바른 month 쿼리 파라미터가 필요합니다');
  }

  const currentMonth = dayjs(`${month}-01`);
  const prevMonth = currentMonth.subtract(1, 'month');
  const currentMonthStr = currentMonth.format('YYYY-MM');
  const prevMonthStr = prevMonth.format('YYYY-MM');

  try {
    // 두 달 데이터 모두 포함해서 가져오기
    const result = await prisma.history.groupBy({
      by: ['target_date'],
      where: {
        target_date: {
          gte: `${prevMonthStr}-01`,
          lt: `${currentMonth.add(1, 'month').format('YYYY-MM')}-01`,
        },
        type: 'expense',
      },
      _sum: {
        amount: true,
      },
    });

    const resultMap = new Map(
      result.map((row) => [row.target_date, row._sum.amount ?? 0]),
    );

    // 최대 일 수 계산 (28~31일)
    const maxDays = Math.max(
      currentMonth.daysInMonth(),
      prevMonth.daysInMonth(),
    );

    const mergedData = [];

    for (let i = 1; i <= maxDays; i++) {
      const day = String(i).padStart(2, '0');
      const prevDate = `${prevMonthStr}-${day}`;
      const currDate = `${currentMonthStr}-${day}`;

      mergedData.push({
        date: day,
        prevAmount: resultMap.get(prevDate) ?? 0,
        currentAmount: resultMap.get(currDate) ?? 0,
      });
    }
    const totals = mergedData.reduce(
      (acc, item) => {
        acc.prevTotal += item.prevAmount;
        acc.currentTotal += item.currentAmount;
        return acc;
      },
      { prevTotal: 0, currentTotal: 0 },
    );

    res.json({ amountList: mergedData, totalAmount: totals });
  } catch (err) {
    console.error('Error fetching grouped data', err);
    res.status(500).send('DB 오류');
  }
});

router.get('/dashboard/year', verifyToken, async (req, res) => {
  const currentYear = dayjs().year(); // 현재 연도 (예: 2025)

  try {
    const result = await prisma.history.groupBy({
      by: ['target_date'],
      where: {
        target_date: {
          gte: `${currentYear}-01-01`,
          lt: `${currentYear + 1}-01-01`, // 다음 해 1월 1일 전까지
        },
        type: 'expense',
      },
      _sum: {
        amount: true,
      },
    });

    // 월별 합계로 변환
    const monthlyMap = new Map();

    for (const row of result) {
      const monthStr = dayjs(row.target_date).format('YYYY-MM');
      const prevAmount = monthlyMap.get(monthStr) ?? 0;
      monthlyMap.set(monthStr, prevAmount + (row._sum.amount ?? 0));
    }

    // 1월부터 12월까지 데이터 구성
    const monthlyExpenses = Array.from({ length: 12 }, (_, i) => {
      const month = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      return {
        month,
        amount: monthlyMap.get(month) ?? 0,
      };
    });

    res.json({ amountList: monthlyExpenses });
  } catch (err) {
    console.error('Error fetching yearly data', err);
    res.status(500).send('DB 오류');
  }
});

module.exports = router;
