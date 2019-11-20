// index.js
const express = require('express');
const bodyParser = require('body-parser');
const Contest = express.Router();
const db = require('../database')

const session = require('express-session')
var CryptoJS = require('crypto-js');
var sha1 = require('sha1');
 

var fs = require('fs')
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
Contest.use(bodyParser.json());
//parse application/x-www-form-urlencoded
Contest.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
Contest.use(bodyParser.json());

Contest.use(passport.initialize());
Contest.use(passport.session());

//fileupload
Contest.use(upload_express());



//parse application/x-www-form-urlencoded
Contest.use(bodyParser.urlencoded({ extended: true }));
  //express session
 





  
  
  
  






  //helper function pre-defined function that can execute queries from and to mysql db

  //filter by gender
  const ContestByGender = async({ gender_1 }) =>
  {
    
      return db.Contest.findAll({where :{gender:gender_1}});
  };

    //filter by type_use
    const ContestByType = async({ type_use }) =>
    {
      
        return db.Contest.findAll({where :{type_use:type_use}});
    };

    //filter by style
    const ContestByStyle = async({ style }) =>
    {
      
        return db.Contest.findAll({where :{style:style}});
    };


    const ContestByID = async({ id_user }) =>
    {
      
        return db.Contest.findAll({where :{muserId:id_user}});
    };

  

  const createContest = async ({id_p,name,type_use,gender,style,price,endedAt,description,audio,muserId}) =>
  {

      return await db.Contest.create({id_p,name,type_use,gender,muserId,style,price,endedAt,description,audio,status:"open"});
  };


  const getAllContests = async() =>
  {
      return db.Contest.findAll({include:db.User});
  };

  const getContest = async obj => {
    return await db.Contest.findOne({
    where: obj, include: db.User
  });
  };


 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let Contest = getContest({ id: jwt_payload.id });
    if (Contest) {
      next(null, Contest);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);


//show contests

Contest.get('/allContests',async function(req,res,next)
{

getAllContests().then(result=>res.json(result));


})

 

  

  
  // login route
  Contest.post('/login', async function(req, res, next) { 
    const { email, password } = req.body;
    if (email && password) {
      // we get the Contest with the name and save the resolved promise
      
      let Contest = await getContest({ email });
      if (!Contest) {
        res.status(401).json({ msg: 'No such Contest found', Contest });
      }
     if (bcrypt.compareSync(password, Contest.password)) {
        // from now on we’ll identify the Contest by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: Contest.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let Contest_id = Contest.id;
        req.login(Contest_id,function(err)
        {
          res.json({ msg: 'ok', token: token });
          console.log(req.Contest);
          console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: 'Password is incorrect' });
      }
    }
  });
  //serialization and deserialization

  const getAllcont = async(muserId) =>
  {
      return db.Contest.findAll(
        {
          returning:true,where:muserId
        }
      );
  };

  //find contests

Contest.post('/find_contest_user', async function(req,res)
{
    const {id_user} = req.body ;
    console.log(id_user);
     let cont = await getAllcont({muserId:id_user} );

    res.json(cont);
})
  // get all Contests
  Contest.get('/Contests', function(req, res) {
    const {id_user} = req.body
  ContestByID({id_user}).then(Contest => res.status(200).json(Contest)); 
  
});

 //delete by id
 const deleteById = async({id})=>
 {
   return db.Contest.destroy({where: {id:id}});
 }


 //update

 const updateContest = async({id})=>
  {
    // const id = req.params.id;
    //         const name = req.body.name;
    //         const lastname = req.body.lastname;
    //         const tele = req.body.tele;
    //         const price = req.body.price;
    
    return await db.Contest.update(
      {
       status:'closed'
      },
      {
      where :{id:id}
      }
    )


  }
 //audition delete


 Contest.delete('/delete',async function(req,res)
 {
   const {id} = req.body ;
   console.log(id);
   let contest =  await getContest({id} );
var aud = contest.dataValues
console.log(aud)
let path = 'C:/xampp/htdocs/passeportAuth/uploads/'+aud.audio
console.log(path);
fs.unlink(path,function()
{
 console.log('deleted')
})
res.json(contest).then(deleteById({id}));

 })
//upload file
Contest.post('/upload', function(req, res) {
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


//
Contest.post('/update',function(req,res)
{
  var {id}= req.body;
  console.log(id);
  updateContest({id}).then(result=>res.json(result[0]))
})
//create Contest
  
Contest.post('/create_contest',async function(req,res,next){


const {contest} = (req.body)
console.log(contest)
console.log("test")
try {
  var contest_j = JSON.parse(contest)
} catch(e) {
  console.log(e); // error in the above string (in this case, yes)!
}

const {name,type_use,gender,style,price,audio,endedAt,description,muserId} = contest_j ;
// if ( !req.files || Object.keys(req.files).length === 0 ) {
//   return res.status(400).send('No files were uploaded.');
// }
// const {Demo} = req.files ;

id_p = sha1(muserId+name+Date.now());
id_p = id_p.slice(0,12);


// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
// let sampleFile = req.files.Demo;
// Use the mv() method to place the file somewhere on your server
// sampleFile.mv('uploads/demos/'+id_p+sampleFile.name, function(err) {
//   if (err)
//     return res.status(500).send(err);

createContest({id_p,name,type_use,gender,style,price,audio,endedAt,description,muserId:muserId})
  .then(Contest => res.json({Contest,msg:'has been created'}))
  .catch(e=>{
    // console.log("testbro")
    res.status(345).json(e)
  })

  

});


 
 

 






//find Contest

Contest.post('/find_Contest', async function(req,res)
{
    const {id} = req.body ;
    let Contest = await getContest({ id } );

    res.json(Contest);
})


//find Contest by gender

Contest.post('/contest_gender', async function(req,res)
{
    const {gender_1} = req.body ;
    console.log(gender_1);
    let Contest = await ContestByGender({gender_1} );

    res.json(Contest);
})
//find Contest by type

Contest.post('/contest_type', async function(req,res)
{
    const {type} = req.body ;
    console.log(type);
    let Contest = await ContestByType({type_use:type} );

    res.json(Contest);
})
//find Contest by style

Contest.post('/contest_style', async function(req,res)
{
    const {style} = req.body ;
    console.log(style);
    let Contest = await ContestByStyle({style} );

    res.json(Contest);
})


  //protection
  // protected route
  Contest.get('/protected', passport.authenticate('jwt', { session: true }), function(req, res) {
    const {token} = req.body
    console.log(token)
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
    });


 


   // app.post('/create_post',passport.authenticate('jwt',{session: false}))
        // add a basic route
        Contest.get('/', function(req, res) {
 
  console.log(req.Contest);
  console.log(req.isAuthenticated());

   res.json('the Contest id of this session depending on the cookie is ' +req.Contest);
  
});


module.exports = Contest ;

