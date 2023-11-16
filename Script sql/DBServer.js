const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bcrypt = require('bcrypt');
const e = require('express');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if(req.url === '/register' || req.url === '/updateUser'){
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
        res.status(400).json({code:400, message: 'Email already in use' });
      } else {
        res.status(200).json({code:200, message: 'User registered' });
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
          const imagePromise = new Promise((resolve, reject) => {
            const sqlSelectImages = 'SELECT picture FROM tourpicture WHERE idTour = ? LIMIT 1';
            connection.query(sqlSelectImages, [tour.idTour], (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                console.log(result);
                tour.image = result[0].picture;
                resolve();
              }
            });
          });

          const amenitiesPromise = new Promise((resolve, reject) => {
            const sqlSelectAmenities = 'SELECT * FROM amenities WHERE idTour = ?';
            connection.query(sqlSelectAmenities, [tour.idTour], (err, result) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                console.log(result);
                tour.amenities = result[0];
                resolve();
              }
            });
          });

          Promise.all([imagePromise, amenitiesPromise])
            .then(() => resolve(tour))
            .catch(err => reject(err));
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
      

    




app.get('/getToursPreviewsFav/:idUser', async (req, res) => {
  const { idUser } = req.params;
  const sqlSelect = 'SELECT * FROM tour INNER JOIN favorite ON tour.idTour = favorite.idTour WHERE favorite.idUser = ?';
  connection.query(sqlSelect, [idUser], (err, result) => {
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
  const sqlSelect = 'SELECT C.idComment, C.idTour, C.idUser, C.comment, C.stars, U.name, U.lastName, U.profilePicture, C.postDate FROM comment C INNER JOIN user U ON C.idUser = U.idUser WHERE C.idTour = ?';
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

app.get('/getAmenitiesTour/:idTour', async (req, res) => {
  const { idTour } = req.params;
  const sqlSelect = 'SELECT * FROM amenities WHERE idTour = ?';
  connection.query(sqlSelect, [idTour], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error getting amenities' });
    } else {
      console.log(result);
      res.status(200).json({ code:200, message: 'Amenities retrieved', amenities: result[0] });
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

app.post('/toggleFav', async (req, res) => {
  const { idTour, idUser } = req.body;
  const sqlCheck = 'SELECT * FROM favorite WHERE idTour = ? AND idUser = ?';
  connection.query(sqlCheck, [idTour, idUser], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400, message: 'Error checking favorites' });
    } else {
      if (result.length > 0) {
        const sqlDelete = 'DELETE FROM favorite WHERE idTour = ? AND idUser = ?';
        connection.query(sqlDelete, [idTour, idUser], (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).json({ code:400, message: 'Error removing from favorites' });
          } else {
            res.status(200).json({ code:200, message: 'Removed from favorites' });
          }
        });
      } else {
        const sqlInsert = 'INSERT INTO favorite (idTour, idUser) VALUES (?,?)';
        connection.query(sqlInsert, [idTour, idUser], (err, result) => {
          if (err) {
            console.log(err);
            res.status(400).json({ code:400, message: 'Error adding to favorites' });
          } else {
            res.status(200).json({ code:200, message: 'Added to favorites' });
          }
        });
      }
    }
  });
});

app.get('/getInfoProfile/:idUser', async (req, res) => {
  const { idUser } = req.params;
  const sqlSelect = 'SELECT '+
                      'user.idUser, '+
                      'user.name, '+
                      'user.lastName, '+
                      'user.email, '+
                      'user.phone, '+
                      'user.profilePicture, '+
                      '(SELECT COUNT(*) FROM tour WHERE tour.idUser = user.idUser) AS numberOfPosts, '+
                      '(SELECT COUNT(*) FROM comment WHERE comment.idUser = user.idUser) AS numberOfComments, '+
                      '(SELECT COUNT(*) FROM favorite WHERE favorite.idUser = user.idUser) AS numberOfFavorites '+
                      'FROM '+
                      'user WHERE user.idUser = ?';
  connection.query(sqlSelect, [idUser], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400,  message: 'Error getting info' });
    } else {
      console.log(result);
      res.status(200).json({ code:200, message: 'Info retrieved', user: result[0] });
    }
  });
});

app.get('/getUser/:idUser', async (req, res) => {
  const { idUser } = req.params;
  const sqlSelect = 'SELECT * FROM user WHERE idUser = ?';
  connection.query(sqlSelect, [idUser], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400,  message: 'Error getting info' });
    } else {
      console.log(result);
      res.status(200).json({ code:200, message: 'Info retrieved', user: result[0] });
    }
  });
});

app.post('/updateUser', upload.single('profilePicUpload'), async (req, res) => {
  console.log("updateUser");
  console.log(req.body);
  console.log(req.file);
  let pfp = req.file;
  if(pfp === undefined){
    console.log("no pfp")
    pfp = req.body.oldProfilePicture;
  }else{
    console.log("pfp")
    pfp = req.file.filename;
    fs.unlink('../touriza/public/uploads/pfp/'+req.body.oldProfilePicture, (err) => {
      if (err) {
        console.error('Error deleting old profile picture:', err);
      }
    });
  }
  const { idUser, name, lastName, phone, password, newPassword } = req.body;
  const sqlSelect = 'SELECT * FROM user WHERE idUser = ?';
  connection.query(sqlSelect, [idUser], async (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400,  message: 'Error getting info' });
    } else {
      console.log(result);
      const user = result[0];
      bcrypt.compare(password, user.password, async (err, response) => {
        if (response) {
          console.log('Password match');
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          if(req.file){
            const sqlUpdate =
              'UPDATE user SET name = ?, lastName = ?, phone = ?, password = ?, profilePicture = ? WHERE idUser = ?';
            connection.query(sqlUpdate, [name, lastName, phone, hashedPassword, req.file.filename, idUser], (err, result) => {
              if (err) {
                console.log(err);
                res.status(400).json({ code:400,  message: 'Error updating user' });
              } else {
                console.log(result);
                res.status(200).json({ code:200, message: 'User updated', profilePicture: req.file.filename });
              }
            });
          }else{
            const sqlUpdate =
              'UPDATE user SET name = ?, lastName = ?, phone = ?, password = ? WHERE idUser = ?';
            connection.query(sqlUpdate, [name, lastName, phone, hashedPassword, idUser], (err, result) => {
              if (err) {
                console.log(err);
                res.status(400).json({ code:400,  message: 'Error updating user' });
              } else {
                console.log(result);
                res.status(200).json({ code:200, message: 'User updated' });
              }
            });
          }
        } else {
          console.log('Wrong password');
          res.status(400).json({ code:400,  message: 'Wrong password' });
        }
      });
    }
  });
});


app.get('/isFav/:idUser/:idTour', async (req, res) => {
  const { idUser, idTour } = req.params;
  const sqlSelect = 'SELECT * FROM favorite WHERE idUser = ? AND idTour = ?';
  connection.query(sqlSelect, [idUser, idTour], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ code:400,  message: 'Error getting info' });
    } else {
      console.log(result);
      if(result.length > 0){
        res.status(200).json({ code:200, message: 'Is fav', isFav: true });
      }else{
        res.status(200).json({ code:200, message: 'Is not fav', isFav: false });
      }
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
