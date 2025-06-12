const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { userId, userPassword } = req.body;
  if (!userId || !userPassword) {
    return res
      .status(400)
      .json({ message: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await prisma.member.findUnique({ where: { user_id: userId } });
    if (!user)
      return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });

    const isPasswordCorrect = await bcrypt.compare(
      userPassword,
      user.user_password,
    );
    if (!isPasswordCorrect)
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

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

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '로그아웃 되었습니다.' });
});

module.exports = router;
