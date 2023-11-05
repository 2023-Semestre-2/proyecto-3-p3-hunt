const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../touriza/public/uploads/pfp');
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4()+'.jpg');
  }
});
const upload = multer({ storage: storage });


// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Hunt',
  password: '04102000',
  database: 'touriza',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  const sqlSelect = 'SELECT * FROM user WHERE email = ?';
  connection.query(sqlSelect, [email], (err, result) => {
    if (err) {
      console.log(err);
      console.log('Wrong email or password');
      res.status(400).json({code:400,  message: 'Wrong email or password' });
    } else {
      if (result.length > 0) {
        const user = result[0];
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            console.log('User logged in');
            res.status(200).json({code:200, message: 'User logged in', user: result[0] });
          } else {
            console.log('Wrong email or password');
            res.status(400).json({code:400, message: 'Wrong email or password' });
          }
        });

      } else {
        console.log('Wrong email or password');
        res.status(400).json({code:400, message: 'Wrong email or password' });
      }
    }
  });
});




//register a new user, if email is already in use, return error
//name , lastname , email , phone , password, profilePic

app.post('/register', upload.single('profilePicUpload'),async (req, res) => {
  if (!req.file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const { name, lastname, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const profilePic = req.file.filename;
  const sqlInsert =
    'INSERT INTO user (name, lastName, email, phone, password, profilePicture) VALUES (?,?,?,?,?,?)';
  connection.query(
    sqlInsert,
    [name, lastname, email, phone, hashedPassword, profilePic],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: 'Email already in use' });
      } else {
        res.status(200).json({ message: 'User registered' });
      }
    }
  );
});





const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
