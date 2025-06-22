
// const express = require('express');
// const mysql = require('mysql2');
// const bcrypt = require('bcryptjs');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // MySQL connection setup
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Kam@mysql21', // <-- replace with your MySQL password
//   database: 'studycrate'
// });

// // Create users table if not exists
// db.query(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
//   )
// `);

// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

//   db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     if (results.length === 0) return res.status(400).json({ error: 'User not found' });

//     const user = results[0];
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ error: 'Invalid credentials' });

//     res.json({ message: 'Login successful' });
//   });
// });

// app.post('/api/signup', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

//   db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     if (results.length > 0) return res.status(400).json({ error: 'User already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed], (err) => {
//       if (err) return res.status(500).json({ error: 'Database error' });
//       res.json({ message: 'Signup successful' });
//     });
//   });
// });

// app.listen(5000, () => console.log('Backend server running on port 5000'));

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Create users table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`);

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful', email: user.email });
  });
});

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Signup successful' });
    });
  });
});

app.listen(5000, () => console.log('Backend server running on port 5000'));