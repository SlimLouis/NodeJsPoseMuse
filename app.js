// index.js
//All consts

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');


const session = require('express-session')

var MySQLStore = require('express-mysql-session')(session);


///bcrypt

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

//routes definition

var users = require('./routes/Users')
var contest = require('./routes/Contest')
var profile = require('./routes/Profile')
var audition = require('./routes/Audition')
var join_contest = require('./routes/Join_contest')
var contract = require('./routes/Contract')
var feed = require('./routes/feed')
var transaction = require('./routes/Transaction')
var notification = require('./routes/Notification')







// import passport and passport-jwt modules
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'posemuse';

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



// parse application/json
app.use(bodyParser.json());

app.use(passport.initialize());
  app.use(passport.session());

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use("/users",users);
app.use("/contest",contest);
app.use("/profile",profile);
app.use("/audition",audition);
app.use("/join_contest",join_contest);
app.use("/contract",contract);
app.use("/feed",feed);
app.use("/transaction",transaction);
app.use("/notification",notification);




const path = require('path');



// start the app
app.listen(process.env.PORT || 3000, function(req,res) {
   // Website you wish to allow to connect
  console.log("Express is running on port");
});



app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
console.log(__dirname)  //__dirname : It will resolve to your project folder.
});






  




 

  

  
 
  
  