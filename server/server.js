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
        connection.query("SELECT ROW_NUMBER() OVER (ORDER BY create_date_time desc) AS no, id, writer, type, amount, description, DATE_FORMAT(create_date_time, '%Y-%m-%d %H:%i:%s') AS date FROM history ORDER BY create_date_time DESC", function (err, result) {
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
    const { writer, type, amount, description } = req.body.transformedData;

    if (!writer || !amount || !description) {
        return res.status(400).send('Missing required fields');
    }

    db.getConnection((err, connection) => {
        if (err) {
            console.log('db error', err);
            res.status(500).send('db error');
            return;
        }

        console.log('Inserting new record');
        const query = "INSERT INTO history (writer, type, amount, description) VALUES (?, ?, ?, ?)";
        connection.query(query, [writer, type, amount, description], (err, result) => {
            connection.release();
            if (err) {
                console.log('query error', err);
                res.status(500).send('Query execution error');
            } else {
                res.status(201).send('Record inserted successfully');
            }
        });
    });
});

app.put('/update', (req, res) => {
    const { id, writer, type, amount, description } = req.body.transformedData;

    if (!writer || !amount || !description) {
        return res.status(400).send('Missing required fields');
    }

    db.getConnection((err, connection) => {
        if (err) {
            console.log('db error', err);
            res.status(500).send('db error');
            return;
        }

        const query = "UPDATE history SET writer = ?, type = ?, amount = ?, description = ?, update_date_time = NOW() WHERE id = ?";
        connection.query(query, [writer, type, amount, description, id], (err, result) => {
            connection.release();
            if (err) {
                console.log('query error', err);
                res.status(500).send('Query execution error');
            } else {
                if (result.affectedRows === 0) {
                    return res.status(404).send('Record not found');
                }
                res.status(200).send('Record updated successfully');
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
