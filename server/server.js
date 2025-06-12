const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = 4000;

require('dotenv').config();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// 라우트 등록
app.use('/auth', require('./routes/auth'));
app.use('/history', require('./routes/history'));
app.use('/category', require('./routes/category'));
app.use('/analyze', require('./routes/analyze'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
