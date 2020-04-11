const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5002;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./build'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect();

app.get('/api/roomlist', (req, res) => {
    connection.query(
      'SELECT * FROM ROOMLIST WHERE isDeleted = 0',
      (err, rows, fields) => {
        res.send(rows);
      }
    )
  });

app.post('/api/roomlist', (req, res) => {
  let sql = 'INSERT INTO ROOMLIST VALUES (null, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, 0)';
  let dep = req.body.dep;
  let dest = req.body.dest;
  let maxNum = req.body.maxNum;
  let desc = req.body.desc;
  let writer = req.body.writer;
  let params = [dep, dest, maxNum, desc, writer];
  connection.query(sql, params, (err, rows, fields) => {
    res.send(rows);
  });
});

app.delete('/api/roomlist/:id', (req, res) => {
  let sql = 'UPDATE ROOMLIST SET isDeleted = 1 WHERE roomid = ?';
  let params = [req.params.id];
  connection.query(sql, params, (err, rows, fields) => {
      res.send(rows);
  })
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));