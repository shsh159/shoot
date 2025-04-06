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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
