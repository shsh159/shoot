const express = require('express');
const cors = require('cors');
const db = require("./config.js");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // 허용할 출처
}));

app.get('/list', (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.log('errrr', err);
            res.status(500).send('db error');
            return;
        }
        console.log('Fetching list');
        connection.query("SELECT ROW_NUMBER() OVER (ORDER BY create_date_time desc) AS no, id, writer, type, amount, description, target_date AS date FROM history ORDER BY target_date DESC, create_date_time DESC", function (err, result) {
            connection.release();
            if (err) {
                console.log('query error', err);
                res.status(500).send('Query execution error');
            } else {
                res.json(result);
            }
        });
    });
});

app.post('/add', (req, res) => {
    const { writer, type, amount, description, date } = req.body;

    if (!writer || !amount || !description) {
        return res.status(400).json({message: '필수 입력 필드를 확인해주세요.'});
    }

    db.getConnection((err, connection) => {
        if (err) {
            console.log('db error', err);
            res.status(500).send('db error');
            return;
        }

        console.log('Inserting new record');
        const query = "INSERT INTO history (writer, type, amount, description, target_date, create_date_time) VALUES (?, ?, ?, ?, ?, NOW())";
        connection.query(query, [writer, type, amount, description, date], (err, result) => {
            connection.release();
            if (err) {
                console.log('query error', err);
                res.status(500).json({message: '저장 중 에러가 발생하였습니다.'});
            } else {
                res.status(201).json({message: '저장이 완료 되었습니다.'});
                return res;
            }
        });
    });
});

app.put('/update', (req, res) => {
    const { id, writer, type, amount, description, date } = req.body;

    if (!writer || !amount || !description) {
        return res.status(400).json({message: '필수 입력 필드를 확인해주세요.'});
    }

    db.getConnection((err, connection) => {
        if (err) {
            console.log('db error', err);
            res.status(500).send('db error');
            return;
        }

        const query = "UPDATE history SET writer = ?, type = ?, amount = ?, description = ?, target_date = ?, update_date_time = NOW() WHERE id = ?";
        connection.query(query, [writer, type, amount, description, date, id], (err, result) => {
            connection.release();
            if (err) {
                console.log('query error', err);
                res.status(500).json({message: '저장 중 에러가 발생하였습니다.'});
            } else {
                res.status(201).json({message: '저장이 완료 되었습니다.'});
                return res;
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
