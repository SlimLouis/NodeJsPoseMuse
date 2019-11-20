// index.js
const express = require('express');
const bodyParser = require('body-parser');
const audition = express.Router();
const db = require('../database')

const session = require('express-session')
var CryptoJS = require('crypto-js');
var sha1 = require('sha1');
 
var fs = require('fs');

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
audition.use(bodyParser.json());
//parse application/x-www-form-urlencoded
audition.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
audition.use(bodyParser.json());

audition.use(passport.initialize());
audition.use(passport.session());

//fileupload
audition.use(upload_express({useTempFiles: true}));



//parse application/x-www-form-urlencoded
audition.use(bodyParser.urlencoded({ extended: true }));
  //express session
 





  
  
  
  






  //helper function pre-defined function that can execute queries from and to mysql db


  //delete by id
  const deleteById = async({id})=>
  {
    return db.audition.destroy({where: {id:id}});
  }
  //filter by gender
  const auditionByGender = async({ gender_1 }) =>
  {
    
      return db.audition.findAll({where :{gender:gender_1}});
  };

    //filter by type_use
    const auditionByType = async({ type_use }) =>
    {
      
        return db.audition.findAll({where :{type_use:type_use}});
    };

    //filter by style
    const auditionByStyle = async({ style }) =>
    {
    
        return db.audition.findAll({where :{style:style}});
    };


  

  const createaudition = async ({demo_file,id_user}) =>
  {

      return await db.audition.create({demo_file,id_user});
  };


  const getAllauditions = async(id_user) =>
  {
      return db.audition.findAll(
        {
          returning:true,where:id_user
        }
      );
  };

  const getaudition = async obj => {
    return await db.audition.findOne({
    where: obj,
  });
  };


 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let audition = getaudition({ id: jwt_payload.id });
    if (audition) {
      next(null, audition);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);


  var cloudinary = require('cloudinary').v2;
  cloudinary.config({ 
    cloud_name: 'dprrnjk66', 
    api_key: '666682518578465', 
     
    api_secret: 'PhuV_cPsVZCUzE2xTnvMe3wdlcQ' 
  });

 
  audition.post('/delete_cloud',async function(req,res)
  {

  })
  

  //audition delete

  audition.delete('/delete',async function(req,res)
  {
    const {id} = req.body ;
    console.log(id);
    let audition =  await getaudition({id} );
var aud = audition.dataValues
console.log(aud.demo_file)
let path = 'C:/xampp/htdocs/passeportAuth/uploads/'+aud.demo_file
cloudinary.uploader.destroy('Demos/'+aud.demo_file.substr(0,aud.demo_file.lastIndexOf('.'))
,{resource_type:"video"}, function(error,result) {
  console.log(result, error) });

res.json(audition).then(deleteById({id}));

  })
  // login route
  audition.post('/login', async function(req, res, next) { 
    const { email, password } = req.body;
    if (email && password) {
      // we get the audition with the name and save the resolved promise
      
      let audition = await getaudition({ email });
      if (!audition) {
        res.status(401).json({ msg: 'No such audition found', audition });
      }
     if (bcrypt.compareSync(password, audition.password)) {
        // from now on we’ll identify the audition by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: audition.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let audition_id = audition.id;
        req.login(audition_id,function(err)
        {
          res.json({ msg: 'ok', token: token });
          console.log(req.audition);
          console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: 'Password is incorrect' });
      }
    }
  });
  //serialization and deserialization



  // get all auditions
  audition.get('/auditions', function(req, res) {
  getAllauditions().then(audition => res.json(audition)); 
});


// //upload file
// audition.post('/upload', function(req, res) {
//   const {id} = req.body ;
//   console.log(id)
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }
//   const jsoned = JSON.parse(id);
//   var real_id = jsoned.id;

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.file;
//   let file_name = (Date.now()+real_id+sampleFile.name.split(' ').join('')).split(' ').join('');

//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('uploads/'+file_name, function(err) {
//     if (err)
//       return res.status(500).send(err);
// +
// createaudition({demo_file:file_name,id_user:real_id})
// +
//     res.send('File uploaded!with path'+jsoned.id);



//   });
// });
audition.post('/upload', function(req, res) {
  var id = req.body ;
  console.log(id)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  var real_id = id.id;
  console.log(real_id);

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const sampleFile = req.files.file;
  let ok = req.files.file.path
  console.log(sampleFile)
  
  let file_name = (Date.now()+real_id+sampleFile.name.split(' ').join('')).split(' ').join('');
  // {public_id: file_name.substr(0,file_name.lastIndexOf('.')),folder:'/Demos'}
  // Use the mv() method to place the file somewhere on your server
  cloudinary.uploader.upload(sampleFile.tempFilePath, {public_id: file_name.substr(0,file_name.lastIndexOf('.')),folder:'/Demos',resource_type:"video"}, function(error, result)
   { console.log(result,"error here"+error) })
+
createaudition({demo_file:file_name,id_user:real_id}).then(audition => res.json(audition))

    

  });

//upload file TEST
// audition.post('/upload', function(req, res) {
//   var id = req.body ;
//   console.log(id)
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }
//   var real_id = JSON.parse(id.id);
// console.log(real_id)

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   const sampleFile = req.files.file;
//   // console.log(sampleFile)
  
//   let file_name = (Date.now()+real_id.id_user+sampleFile.name.split(' ').join('')).split(' ').join('');

//   // Use the mv() method to place the file somewhere on your server
//   // sampleFile.mv('uploads/'+file_name, function(err) {
//   //   if (err)
//   //     return res.status(500).send(err);
//   cloudinary.uploader.upload(sampleFile.tempFilePath,{public_id: file_name.substr(0,file_name.lastIndexOf('.')),folder:'/Demos'}, function(error, result)
//    { console.log(result,error) });
// +
// createaudition({demo_file:file_name,id_user:real_id.id_user}).then(audition => res.json(audition))

    

//   });

//single upload

//upload file
audition.post('/single_upload', function(req, res) {

  var id = req.body
  console.log(id.id)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;
  if (!sampleFile)
  {
    res.status(251).send("problem with file header")
  }

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('uploads/'+sampleFile.name, function(err) {
    if (err)
      return res.status(360).send("test");
+
    res.send('File uploaded!with path brobro');

    

  });
});
//create audition
  
audition.post('/create_audition',async function(req,res,next){


const {audition} = (req.body)
var audition_j = JSON.parse(audition)
const {name,typeuse,gender,style,price,endedAt,description,muserId} = audition_j ;
if ( !req.files || Object.keys(req.files).length === 0 ) {
  return res.status(400).send('No files were uploaded.');
}
const {Demo} = req.files ;

id_p = sha1(muserId+name+Date.now());
id_p = id_p.slice(0,12);

createaudition({id_p,name,typeuse,gender,style,price,endedAt,description,audio:Demo.name,muserId})
  .then(audition => res.json({audition,msg:'has been created'}))
  .catch(e=>{
    res.status(400).json(e)
  })
// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
let sampleFile = req.files.Demo;
// Use the mv() method to place the file somewhere on your server
sampleFile.mv('uploads/demos/'+id_p+sampleFile.name, function(err) {
  if (err)
    return res.status(500).send(err);
+
  res.send('audition Created!');


  

});


 
 

 


})



//find audition

audition.post('/find_audition', async function(req,res)
{
    const {id_user} = req.body ;
    console.log(id_user);
     let audition = await getAllauditions({id_user} );

    res.json(audition);
})


//find audition by gender

audition.post('/audition_gender', async function(req,res)
{
    const {gender_1} = req.body ;
    console.log(gender_1);
    let audition = await auditionByGender({gender_1} );

    res.json(audition);
})
//find audition by type

audition.post('/audition_type', async function(req,res)
{
    const {type} = req.body ;
    console.log(type);
    // let audition = await auditionByType({type_use:type} );

    // res.json(audition);
})
//find audition by style

audition.post('/audition_style', async function(req,res)
{
    const {style} = req.body ;
    console.log(style);
    // let audition = await auditionByStyle({style} );

    // res.json(audition);
})


  //protection
  // protected route
  audition.get('/protected', passport.authenticate('jwt', { session: true }), function(req, res) {
    const {token} = req.body
    console.log(token)
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
    });


 


   // app.post('/create_post',passport.authenticate('jwt',{session: false}))
        // add a basic route
        audition.get('/', function(req, res) {
 
  console.log(req.audition);
  console.log(req.isAuthenticated());

   res.json('the audition id of this session depending on the cookie is ' +req.audition);
  
});


module.exports = audition ;

