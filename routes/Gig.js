// index.js
const express = require('express');
const bodyParser = require('body-parser');
const Gig = express.Router();
const db = require('../database')

const session = require('express-session')
var CryptoJS = require('crypto-js');
var sha1 = require('sha1');
 


var MySQLStore = require('express-mysql-session')(session);
const upload_express = require('express-fileupload')

///bcrypt

const bcrypt = require('bcrypt');
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
Gig.use(bodyParser.json());
//parse application/x-www-form-urlencoded
Gig.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
Gig.use(bodyParser.json());

Gig.use(passport.initialize());
Gig.use(passport.session());

//fileupload
Gig.use(upload_express());



//parse application/x-www-form-urlencoded
Gig.use(bodyParser.urlencoded({ extended: true }));
  //express session
 





  
  
  
  






  //helper function pre-defined function that can execute queries from and to mysql db

  //filter by gender
  const GigByGender = async({ gender_1 }) =>
  {
    
      return db.Gig.findAll({where :{gender:gender_1}});
  };

    //filter by type_use
    const GigByType = async({ type_use }) =>
    {
      
        return db.Gig.findAll({where :{type_use:type_use}});
    };

    //filter by style
    const GigByStyle = async({ style }) =>
    {
      
        return db.Gig.findAll({where :{style:style}});
    };


  

  const createGig = async ({id_p,name,typeuse,gender,style,price,endedAt,description,audio,muserId}) =>
  {

      return await db.Gig.create({id_p,name,type_use:typeuse,gender,style,price,endedAt,description,audio,muserId});
  };


  const getAllGigs = async() =>
  {
      return db.Gig.findAll();
  };

  const getGig = async obj => {
    return await db.Gig.findOne({
    where: obj,
  });
  };


 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let Gig = getGig({ id: jwt_payload.id });
    if (Gig) {
      next(null, Gig);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);




 

  

  
  // login route
  Gig.post('/login', async function(req, res, next) { 
    const { email, password } = req.body;
    if (email && password) {
      // we get the Gig with the name and save the resolved promise
      
      let Gig = await getGig({ email });
      if (!Gig) {
        res.status(401).json({ msg: 'No such Gig found', Gig });
      }
     if (bcrypt.compareSync(password, Gig.password)) {
        // from now on we’ll identify the Gig by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: Gig.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let Gig_id = Gig.id;
        req.login(Gig_id,function(err)
        {
          res.json({ msg: 'ok', token: token });
          console.log(req.Gig);
          console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: 'Password is incorrect' });
      }
    }
  });
  //serialization and deserialization



  // get all Gigs
  Gig.get('/Gigs', function(req, res) {
  getAllGigs().then(Gig => res.json(Gig)); 
});


//upload file
Gig.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.Demo;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('uploads/'+sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);
+
    res.send('File uploaded!');

    

  });
});

//create Gig
  
Gig.post('/create_Gig',async function(req,res,next){


const {Demo} = req.files ;
const {Gig} = (req.body)
var Gig_j = JSON.parse(Gig)
const {name,typeuse,gender,style,price,endedAt,description,muserId} = Gig_j ;
if (!req.files || Object.keys(req.files).length === 0) {
  return res.status(400).send('No files were uploaded.');
}

id_p = sha1(muserId+name+Date.now());
id_p = id_p.slice(0,12);

createGig({id_p,name,typeuse,gender,style,price,endedAt,description,audio:Demo.name,muserId})
  .then(Gig => res.json({Gig,msg:'has been created'}))
  .catch(e=>{
    res.status(400).json(e)
  })
// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
let sampleFile = req.files.Demo;

// Use the mv() method to place the file somewhere on your server
sampleFile.mv('uploads/'+sampleFile.name, function(err) {
  if (err)
    return res.status(500).send(err);
+
  res.send('Gig Created!');


  

});


 
 

 


})



//find Gig

Gig.post('/find_Gig', async function(req,res)
{
    const {Gigname,password} = req.body ;
    let Gig = await getGig({ Gigname,password } );

    res.json(Gig);
})


//find Gig by gender

Gig.post('/Gig_gender', async function(req,res)
{
    const {gender_1} = req.body ;
    console.log(gender_1);
    let Gig = await GigByGender({gender_1} );

    res.json(Gig);
})
//find Gig by type

Gig.post('/Gig_type', async function(req,res)
{
    const {type} = req.body ;
    console.log(type);
    let Gig = await GigByType({type_use:type} );

    res.json(Gig);
})
//find Gig by style

Gig.post('/Gig_style', async function(req,res)
{
    const {style} = req.body ;
    console.log(style);
    let Gig = await GigByStyle({style} );

    res.json(Gig);
})


  //protection
  // protected route
  Gig.get('/protected', passport.authenticate('jwt', { session: true }), function(req, res) {
    const {token} = req.body
    console.log(token)
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
    });


 


   // app.post('/create_post',passport.authenticate('jwt',{session: false}))
        // add a basic route
        Gig.get('/', function(req, res) {
 
  console.log(req.Gig);
  console.log(req.isAuthenticated());

   res.json('the Gig id of this session depending on the cookie is ' +req.Gig);
  
});


module.exports = Gig ;

