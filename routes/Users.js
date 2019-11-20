// index.js
const express = require('express');
const bodyParser = require('body-parser');
const user = express.Router();
const db = require('../database')
const Sequelize = require('sequelize')
const session = require('express-session')

var MySQLStore = require('express-mysql-session')(session);

const upload_express = require('express-fileupload')

///bcrypt

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


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
user.use(bodyParser.json());
//parse application/x-www-form-urlencoded
user.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
user.use(bodyParser.json());

user.use(passport.initialize());
user.use(passport.session());

user.use(upload_express({useTempFiles: true}));
//DATABASE opTIONS
var options = {
  host: 'remotemysql.com',
  port: 3306,
  user: 'w1yLRuhdZi',
  password: 'dOyDIS05iR',
  database: 'w1yLRuhdZi'
};

// host: 'remotemysql.com',
// port:3306,
// database: 'w1yLRuhdZi',
// username: 'w1yLRuhdZi' ,
// password: 'dOyDIS05iR',
// dialect: 'mysql',
var sessionStore = new MySQLStore(options);

//parse application/x-www-form-urlencoded
user.use(bodyParser.urlencoded({ extended: true }));
  //express session
  user.use(session({
    secret: 'keyboarde cat',
    resave: false,
    store : sessionStore,
    saveUninitialized: true,
    //cookie: { secure: true }
  }))



var path =require('path')

  var cloudinary = require('cloudinary').v2;
  cloudinary.config({ 
    cloud_name: 'dprrnjk66', 
    api_key: '666682518578465', 
     
    api_secret: 'PhuV_cPsVZCUzE2xTnvMe3wdlcQ' 
  });
  // console.log(__dirname);
  // cloudinary.uploader.upload(__dirname+"/batman.png", function(error, result)
  //  { console.log(result,error) });
  
  
  
  //upload image using cloudinary
  // cloudinary.uploader.upload("http://localhost/passeportauth/uploads/images/batman.png", 
  //  function(error, result) {console.log(result, error)});

  
  
  







  //helper function pre-defined function that can execute queries from and to mysql db
  const updateUser = async({profile_pic,id_user})=>
  {
    // const id = req.params.id;
    //         const name = req.body.name;
    //         const lastname = req.body.lastname;
    //         const tele = req.body.tele;
    //         const price = req.body.price;
    
    return await db.User.update(
      {
        profile_pic : profile_pic ,
       
      },
      {
        returning:true, plain:true,where :{id:id_user}
      }
    )


  }
  const getUserTransactions = async obj => {
    return await db.User.findOne({
    where: obj , include: db.transaction
  });
  };




  const createUser = async ({username,password,email,first_name,last_name}) =>
  {

      return await db.User.create({username,password,email,first_name,last_name,profile_pic:'batman.png'});
  };


  const getAllusers = async() =>
  {
      return db.User.findAll({include:db.profile});
  };

  const getUser = async obj => {
    return await db.User.findOne({
    where: obj
  });
  };
  const Op = Sequelize.Op;


  const getUserLike = async (name) => {
    return await db.User.findAll({
    where: {email:{
      [Op.like]: '%'+name+'%'
    }} , 
  });
  };


  user.get('/search_Key/',async function(req,res)
  {
    const {name} = req.query
    console.log(name);
    var users={
       users : await getUserLike(name)

    }
    res.json(users); 
   })
  const getUserProfile = async({ idnumber }) =>
  {
    
      return db.User.findAll({where :{id:idnumber},include:[{ model:db.profile}]});
  };
  const getUserProfiles = async() =>
  {
    
      return db.User.findAll({include:[{ model:db.profile}]});
  };


  const getAllTransactions = async({ idnumber }) =>
  {
    
      return db.User.findAll({where :{id:idnumber},include:db.transaction});
  };

  const getAllContests = async({ idnumber }) =>
  {
    
      return db.User.findAll({where :{id:idnumber},include:[{ model:db.Contest}]});
  };

 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser({ id: jwt_payload.id });
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);




 

//upload
user.post('/upload', function(req, res) {
  var id = req.body ;
  console.log(id)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  
  console.log(id.id)
var I = id.id
console.log("this is the id",I)
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;
  console.log(sampleFile)
  
  let file_name = (Date.now()+I+sampleFile.name.split(' ').join('')).split(' ').join('');
  console.log("image nameis"+file_name)

  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv('uploads/images/'+file_name, function(err) {
  //   if (err)
  //     return res.status(500).send(err);

      cloudinary.uploader.upload(sampleFile.tempFilePath,{public_id: file_name.substr(0,file_name.lastIndexOf('.')),folder:'/images'}, function(error, result)
   { console.log(result,error) });
+
updateUser({profile_pic:file_name,id_user:I})
+
    res.send('File uploaded!with path'+I);

    

  });

  
//upload file TEST
// user.post('/upload', function(req, res) {
//   var {id} = req.body ;
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }

//   console.log(id);
//   var j_id = JSON.parse(id);
//   var I = j_id.id;
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   const sampleFile = req.files.file;
//   console.log(sampleFile)
  
//   let file_name = (Date.now()+I+sampleFile.name.split(' ').join('')).split(' ').join('');
//   console.log("image nameis"+file_name)

//   console.log(sampleFile.data);
//   // Use the mv() method to place the file somewhere on your server
// //   sampleFile.mv('uploads/images/'+file_name, function(err) {
// //     if (err)
// //       return res.status(500).send(err);
// // +}
// cloudinary.uploader.upload(sampleFile.tempFilePath,{public_id: file_name.substr(0,file_name.lastIndexOf('.')),folder:'/images'}, function(error, result)
//    { console.log(result,error) });
  
// +
// updateUser({profile_pic:file_name,id_user:I})
// +
//     res.send('File uploaded!with path '+ I);

    

//   });
// });
//   user.post('/upload', function(req, res) {
//   var {id} = req.body ;
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }

//   console.log(id);
//   var j_id = JSON.parse(id);
//   var I = j_id.id;
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.file;
//   console.log(sampleFile)
  
//   let file_name = (Date.now()+I+sampleFile.name.split(' ').join('')).split(' ').join('');
//   console.log("image nameis"+file_name)

//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('uploads/images/'+file_name, function(err) {
//     if (err)
//       return res.status(500).send(err);
// +
// updateUser({profile_pic:file_name,id_user:I})
// +
//     res.send('File uploaded!with path'+I);

    

//   });
// });
  

//get all users with profiles
user.get('/profiles',async function(req,res)
{
  getUserProfiles().then(resultat=>res.json(resultat));
})

//userProfile
user.post('/get_profile',async function(req,res){

  const { id } = req.body ;
  console.log(id)

  let profile = await getUserProfile({ idnumber:id })
  res.json(profile)
})

user.post('/get_current',async function(req,res){


  const { id } = req.body ;
  console.log(id)
  let user = await getUser({ id });
res.json(user);
})
  // login route
  user.post('/login', async function(req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { email, password } = req.body;
    if (email && password) {
      // we get the user with the name and save the resolved promise
      
      let user = await getUser({ email });
     // console.log(user);
      if (!user) {
        res.status(401).json({ msg: 'No such user found', user });
      }
    else if (bcrypt.compareSync(password, user.password)) {
        // from now on we’ll identify the user by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: user.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let user_id = user.id;
        req.login(user_id,function(err)
        {
          res.json(user);
         // console.log(user.dataValues);
          // console.log(req.user);
          // console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: "Password is incorrect" });
      } 
    }
  });
  //serialization and deserialization

  passport.serializeUser(function(user_id, done) {
    done(null, user_id);
  });
  
  passport.deserializeUser(function(user_id, done) {
      done(null, user_id);
    
  });


  // get all users
  user.get('/users',async function(req, res) {

   getAllusers().then(user => res.json(user)); 

});

user.get('/users_search',async function(req, res) {

  // var users=[]; getAllusers().then(user => res.json(user)); 
  var users={
    users : await getAllusers() 
  } ;

  res.json(users);
});

//create user


user.post('/user_search',function(req,res)
{
    const {q} = req.params ;






})
user.post('/create_user',function(req,res){
  const {username,password,email,first_name,last_name} = req.body ;
console.log(username);
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.


        createUser({username,password:hash,email,first_name,last_name})
        .then(user => res.json({user,msg:'has been created'}))
        .catch(e=>{
            res.status(400).json(e.fields.email+ ' '+'already exists')
        })
       
  console.log(username,password);
        console.log(hash)
    });
  });
   
  

})



//check_password
user.post('/check_password',async function(req,res)
{
  
  const {email,password} = req.body; 
  let user = await getUser({ email }) ;
  res.json(bcrypt.compareSync(password, user.password))



})

//find user

user.get('/find_user', async function(req,res)
{
    
  try
  {
    var {id} = req.body ;
    //      console.log(email);

       var user = await getUser({ id } );
       if (user==null)
       {

         res.json("no such email");
       }
       else
       {
        res.send((user));

       }
    
  }
  catch(err)
  {
    console.log(err)
  }
    
  
})


//find contest of this user

user.get('/contests', async function(req,res)
{
    const {idnumber} = req.body ;
    let user = await getAllContests({ idnumber } );


    res.json(user);

})


user.post('/transactions', async function(req,res)
{
  console.log(req.body);
    const {idnumber} = req.body ;
    let user = await getAllTransactions({ idnumber:idnumber } );


    res.json(user);

})


user.get('/user/:username',async function(req,res)
{
  const {username} = req.params ;
  let user =  await getUser({ username } );
    if (user==null)
    {
      res.status(406).json("not found")
    }
  console.log(user)
  res.json(user);


})

  //protection
  // protected route
  user.get('/protected', passport.authenticate('jwt', { session: true }), function(req, res) {
    const {token} = req.body
    console.log(token)
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
    });


 


   // app.post('/create_post',passport.authenticate('jwt',{session: false}))
        // add a basic route
        user.get('/', function(req, res) {
 
  console.log(req.user);
  console.log(req.isAuthenticated());

   res.json('the user id of this session depending on the cookie is ' +req.user);
  
});


module.exports = user ;

