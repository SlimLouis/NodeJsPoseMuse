// index.js
const express = require('express');
const bodyParser = require('body-parser');
const join_contest = express.Router();
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
join_contest.use(bodyParser.json());
//parse application/x-www-form-urlencoded
join_contest.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
join_contest.use(bodyParser.json());

join_contest.use(passport.initialize());
join_contest.use(passport.session());

//fileupload
join_contest.use(upload_express());



//parse application/x-www-form-urlencoded
join_contest.use(bodyParser.urlencoded({ extended: true }));
  //express session
 





  
  
  
  






  //helper function pre-defined function that can execute queries from and to mysql db


   //delete by id
 const deleteById = async({id})=>
 {
   return db.join_contest.destroy({where: {id:id}});
 }
  //filter by gender
  const join_contestByGender = async({ gender_1 }) =>
  {
    
      return db.join_contest.findAll({where :{gender:gender_1}});
  };

    //filter by type_use
    const join_contestByType = async({ type_use }) =>
    {
      
        return db.join_contest.findAll({where :{type_use:type_use}});
    };

    //filter by style
    const join_contestByStyle = async({ style }) =>
    {
      
        return db.join_contest.findAll({where :{style:style}});
    };


  

  const createjoin_contest = async ({contestId,id_host,bid}) =>
  {

      return await db.join_contest.create({contestId,id_host,bid});
  };


  const getAlljoin_contests = async() =>
  {
      return db.join_contest.findAll();
  };

  const getjoin_contest = async obj => {
    return await db.join_contest.findOne({
    where: obj,
  });
  };
  const getjoin_contests = async obj => {
    return await db.join_contest.findAll({
    where: obj,include:db.User
  });
  };


 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let join_contest = getjoin_contest({ id: jwt_payload.id });
    if (join_contest) {
      next(null, join_contest);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);




 

  

  
  // login route
  join_contest.post('/login', async function(req, res, next) { 
    const { email, password } = req.body;
    if (email && password) {
      // we get the join_contest with the name and save the resolved promise
      
      let join_contest = await getjoin_contest({ email });
      if (!join_contest) {
        res.status(401).json({ msg: 'No such join_contest found', join_contest });
      }
     if (bcrypt.compareSync(password, join_contest.password)) {
        // from now on we’ll identify the join_contest by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: join_contest.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let join_contest_id = join_contest.id;
        req.login(join_contest_id,function(err)
        {
          res.json({ msg: 'ok', token: token });
          console.log(req.join_contest);
          console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: 'Password is incorrect' });
      }
    }
  });
  //serialization and deserialization



  // get all join_contests
  join_contest.get('/join_contests', function(req, res) {
  getAlljoin_contests().then(join_contest => res.json(join_contest)); 
});

  // get all join_contests by contest id
  join_contest.get('/join_contests_contest', function(req, res) {
    getAlljoin_contests().then(join_contest => res.json(join_contest)); 
  });
  


//upload file
join_contest.post('/upload', function(req, res) {
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

//create join_contest

join_contest.post('/create',async function(req,res)
{


const {contestId,id_host,bid} = req.body ;
createjoin_contest({contestId,id_host,bid}).then(result=>res.json(result))


})
  //delete
join_contest.delete('/delete',async function(req,res)
 {
   const {id} = req.body ;

res.json("deleted").then(deleteById({id}));

 })

join_contest.post('/create_join_contest',async function(req,res,next){


const {Demo} = req.files ;
const {join_contest} = (req.body)
var join_contest_j = JSON.parse(join_contest)
const {name,typeuse,gender,style,price,endedAt,description,muserId} = join_contest_j ;
if (!req.files || Object.keys(req.files).length === 0) {
  return res.status(400).send('No files were uploaded.');
}

id_p = sha1(muserId+name+Date.now());
id_p = id_p.slice(0,12);

createjoin_contest({id_p,name,typeuse,gender,style,price,endedAt,description,audio:Demo.name,muserId})
  .then(join_contest => res.json({join_contest,msg:'has been created'}))
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
  res.send('join_contest Created!');


  

});


 
 

 


})


//find join_contest

join_contest.post('/find_join_contest_bycontest', async function(req,res)
{
    const {id} = req.body ;
    let join_contest = await getjoin_contests({ contestId:id } );
    if (join_contest==null)
    {
res.json("No Bids are found");
    }
else

{
  res.json(join_contest);
}   
})

//find join_contest

join_contest.post('/find_join_contest', async function(req,res)
{
    const {id_host} = req.body ;
    let join_contest = await getjoin_contest({ id_host } );
    if (join_contest==null)
    {
res.json("null");
    }
else

{
  res.json(join_contest);
}   
})


//find join_contest by gender

join_contest.post('/join_contest_gender', async function(req,res)
{
    const {gender_1} = req.body ;
    console.log(gender_1);
    let join_contest = await join_contestByGender({gender_1} );

    res.json(join_contest);
})
//find join_contest by type

join_contest.post('/join_contest_type', async function(req,res)
{
    const {type} = req.body ;
    console.log(type);
    let join_contest = await join_contestByType({type_use:type} );

    res.json(join_contest);
})
//find join_contest by style

join_contest.post('/join_contest_style', async function(req,res)
{
    const {style} = req.body ;
    console.log(style);
    let join_contest = await join_contestByStyle({style} );

    res.json(join_contest);
})


  //protection
  // protected route
  join_contest.get('/protected', passport.authenticate('jwt', { session: true }), function(req, res) {
    const {token} = req.body
    console.log(token)
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
    });


 


   // app.post('/create_post',passport.authenticate('jwt',{session: false}))
        // add a basic route
        join_contest.get('/', function(req, res) {
 
  console.log(req.join_contest);
  console.log(req.isAuthenticated());

   res.json('the join_contest id of this session depending on the cookie is ' +req.join_contest);
  
});


module.exports = join_contest ;

