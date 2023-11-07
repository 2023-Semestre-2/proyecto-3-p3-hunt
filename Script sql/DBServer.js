const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bcrypt = require('bcrypt');
const e = require('express');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if(req.url === '/register'){
      cb(null, '../touriza/public/uploads/pfp');
    }else if(req.url === '/createTour'){
      cb(null, '../touriza/public/uploads/tours');
    }
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


//crear un nuevo tour
//idUser, name, description, stars

app.post('/createTour', upload.array('images'), async (req, res) => {
  console.log(req.body, req.files);


  const { idUser, name, description, stars } = req.body;
  const sqlInsert =
    'INSERT INTO tour (idUser, name, description, stars) VALUES (?,?,?,?)';
  connection.query(
    sqlInsert,
    [idUser, name, description, stars],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).json({ code:400, message: 'Error creating tour' });
      } else {
        const idTour = result.insertId;
        console.log("inserting images")
        req.files.forEach(file => {
          console.log(file);
          const sqlInsertImage = 'INSERT INTO tourpicture (idTour, picture) VALUES (?,?)';
          connection.query(
            sqlInsertImage,
            [idTour, file.filename],
            (err, result) => {
              if (err) {
                console.log(err);
              }else{
                console.log('image inserted');
              }
            }
          );
        });
        res.status(200).json({ code:200, message: 'Tour created', idTour: idTour });
      }
    }
  );
});

app.post('/createContact', async (req, res) => {
  const {idTour, email, phone, website } = req.body;
  const sqlInsert =
    'INSERT INTO contact (idTour, email, phone, website) VALUES (?,?,?,?)';
  connection.query(sqlInsert, [idTour, email, phone, website], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error creating contact' });
    } else {
      res.status(200).json({ code:200, message: 'Contact created' });
    }
  });
});

app.post('/createLocation', async (req, res) => {
  const {idTour, address, lat, lng } = req.body;
  const sqlInsert =
    'INSERT INTO location (idTour, address, lat, lng) VALUES (?,?,?,?)';
  connection.query(sqlInsert, [idTour, address, lat, lng], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error creating location' });
    } else {
      res.status(200).json({ code:200, message: 'Location created' });
    }
  });
});

app.post('/createAmenities', async (req, res) => {
  
  const {idTour, isHotel, isRestaurant, isRiver, 
    isBeach, isMountain, hasRanch, 
    hasPool, hasBreakfast, hasBar, 
    hasWifi, hasFireplace, hasParking, 
    hasAirConditioner, hasGym, hasSpa, 
    hasRoomService, hasGreatView, isAccessible, 
    isPetFriendly, isFree
  } = req.body;

  const sqlInsert =
    'INSERT INTO amenities (idTour,isHotel, isRestaurant, isRiver, isBeach, isMountain,'+
      'hasRanch, hasPool, hasBreakfast, hasBar, hasWifi, hasFireplace, hasParking,'+
      'hasAirConditioner, hasGym, hasSpa, hasRoomService, hasGreatView, isAccessible,'+
      'isPetFriendly, isFree) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  connection.query(sqlInsert, [idTour, isHotel, isRestaurant, isRiver,
    isBeach, isMountain, hasRanch, hasPool, hasBreakfast, hasBar,
    hasWifi, hasFireplace, hasParking, hasAirConditioner, hasGym, hasSpa,
    hasRoomService, hasGreatView, isAccessible, isPetFriendly, isFree], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error creating amenities' });
    } else {
      res.status(200).json({ code:200, message: 'Amenities created' });
    }
  });
});
  

app.get('/getToursPreviews', async (req, res) => {
  const sqlSelect = 'SELECT * FROM tour';
  connection.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error getting tours' });
    } else {
      tours = result;
      let tourPromises = tours.map(tour => {
        return new Promise((resolve, reject) => {
          const sqlSelectImages = 'SELECT picture FROM tourpicture WHERE idTour = ? LIMIT 1';
          connection.query(sqlSelectImages, [tour.idTour], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              console.log(result);
              tour.image = result[0].picture;
              resolve(tour);
            }
          });
        });
      });
 
      Promise.all(tourPromises)
        .then(toursWithImages => {
          res.status(200).json({ code:200, message: 'Tours retrieved', tours: toursWithImages });
        })
        .catch(err => {
          // handle error
          console.log(err);
          res.status(500).json({ code:500, message: 'An error occurred' });
        });



      console.log(result);
    }
  });
});

app.get('/getImagesTour/:idTour', async (req, res) => {
  const { idTour } = req.params;
  const sqlSelect = 'SELECT picture FROM tourpicture WHERE idTour = ?';
  connection.query(sqlSelect, [idTour], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error getting images' });
    } else {
      console.log(result);
      res.status(200).json({ code:200, message: 'Images retrieved', images: result });
    }
  });
});

app.get('/getContactTour/:idTour', async (req, res) => {
  const { idTour } = req.params;
  const sqlSelect = 'SELECT * FROM contact WHERE idTour = ?';
  connection.query(sqlSelect, [idTour], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error getting contact' });
    } else {
      console.log(result);
      res.status(200).json({ code:200, message: 'Contact retrieved', contact: result[0] });
    }
  });
});


app.get('/getLocationTour/:idTour', async (req, res) => {
  const { idTour } = req.params;
  const sqlSelect = 'SELECT * FROM location WHERE idTour = ?';
  connection.query(sqlSelect, [idTour], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error getting location' });
    } else {
      console.log(result);
      res.status(200).json({ code:200, message: 'Location retrieved', location: result[0] });
    }
  });
});

app.get('/getCommentsTour/:idTour', async (req, res) => {
  const { idTour } = req.params;
  const sqlSelect = 'SELECT C.idComment, C.idTour, C.idUser, C.comment, C.stars, U.name, U.lastName, U.profilePicture FROM comment C INNER JOIN user U ON C.idUser = U.idUser WHERE C.idTour = ?';
  connection.query(sqlSelect, [idTour], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error getting comments' });
    } else {
      console.log(result);
      res.status(200).json({ code:200, message: 'Comments retrieved', comments: result });
    }
  });
});


app.post('/postComment', async (req, res) => {
  const { idTour, idUser, comment, stars } = req.body;
  const sqlInsert =
    'INSERT INTO comment (idTour, idUser, comment, stars) VALUES (?,?,?,?)';
  connection.query(sqlInsert, [idTour, idUser, comment, stars], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error posting comment' });
    } else {
      res.status(200).json({ code:200, message: 'Comment posted' });
    }
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
