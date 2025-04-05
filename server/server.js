const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // 허용할 출처
}));

const users = {
    id: 1,
    member: [  // 'member'로 수정
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
    ]
};

app.get('/list', (req, res) => {
    console.log('Fetching list');
    res.json(users);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
