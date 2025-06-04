const express = require('express');
const prisma = require('./prismaClient');
const cors = require('cors');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const app = express();
const port = 4000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // 허용할 출처
    credentials: true,
  }),
);

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: '토큰이 없습니다. 로그인 해주세요.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // 필요 시 req.user.id 등 사용 가능
    next();
  } catch (err) {
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

app.post('/auth/login', async (req, res) => {
  const { userId, userPassword } = req.body;

  if (!userId || !userPassword) {
    return res
      .status(400)
      .json({ message: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await prisma.member.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      userPassword,
      user.user_password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign({ id: user.id, userId: user.user_id }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return res.json({
      message: '로그인 성공',
      user: {
        id: user.id,
        userId: user.user_id,
        userName: user.user_name,
      },
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    return res.status(500).json({ message: '서버 오류' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '로그아웃 되었습니다.' });
});

app.get('/list', verifyToken, async (req, res) => {
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

app.post('/add', verifyToken, async (req, res) => {
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

app.put('/update', verifyToken, async (req, res) => {
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

app.get('/month', verifyToken, async (req, res) => {
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

app.get('/year', verifyToken, async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
