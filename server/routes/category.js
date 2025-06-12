const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const verifyToken = require('../middleware/verifyToken');

router.get('/list', verifyToken, async (req, res) => {
  try {
    const result = await prisma.category.findMany({
      orderBy: [{ id: 'asc' }],
      select: {
        id: true,
        name: true,
      },
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching category', err);
    res.status(500).send('DB 오류');
  }
});

module.exports = router;
