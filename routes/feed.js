// index.js
const express = require('express');
const bodyParser = require('body-parser');
const feed = express.Router();
const db = require('../database')

const session = require('express-session')

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
feed.use(bodyParser.json());
//parse application/x-www-form-urlencoded
feed.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
feed.use(bodyParser.json());

feed.use(passport.initialize());
feed.use(passport.session());

feed.use(upload_express({useTempFiles: true}));
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
// feedname: 'w1yLRuhdZi' ,
// password: 'dOyDIS05iR',
// dialect: 'mysql',
// var sessionStore = new MySQLStore(options);

//parse application/x-www-form-urlencoded
feed.use(bodyParser.urlencoded({ extended: true }));
  //express session
  feed.use(session({
    secret: 'keyboarde cat',
    resave: false,
    // store : sessionStore,
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
  const updatefeed = async({profile_pic,id_feed})=>
  {
    // const id = req.params.id;
    //         const name = req.body.name;
    //         const lastname = req.body.lastname;
    //         const tele = req.body.tele;
    //         const price = req.body.price;
    
    return await db.feed.update(
      {
        profile_pic : profile_pic ,
       
      },
      {
        returning:true, plain:true,where :{id:id_feed}
      }
    )


  }

  const createfeed = async ({feed_file,id_user,id_contract}) =>
  {
      return await db.feed.create({feed_file,id_user,id_contract});
  };

  

  feed.post('/upload', function(req, res) {
    var {	contract} = req.body ;
    console.log(req.body)
    var contract = JSON.parse(contract);
    console.log(contract)
    console.log(contract.id_user)
    console.log(contract.id_contract)
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    var real_id = contract.id_user;
    var id_contract = contract.id_contract
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const feed_file = req.files.file;
    let ok = req.files.file.path
    console.log(feed_file)
    
    let file_name = (Date.now()+real_id+feed_file.name.split(' ').join('')).split(' ').join('');
    // {public_id: file_name.substr(0,file_name.lastIndexOf('.')),folder:'/Demos'}
  //   // Use the mv() method to place the file somewhere on your server
    cloudinary.uploader.upload(feed_file.tempFilePath, {public_id: file_name.substr(0,file_name.lastIndexOf('.')),folder:'/Demos',resource_type:"video"}, function(error, result)
     { console.log(result,"error here"+error) })+
  //   sampleFile.mv('uploads/'+file_name, function(err) {
  //     if (err)
  //       return res.status(500).send(err);
  // +
  createfeed({feed_file:file_name,id_user:real_id,id_contract:id_contract}).then(feed => res.json(feed))
  
      
  
  //   });
  });
  const getAllfeeds = async() =>
  {
      return db.feed.findAll({      
       where:{contract_id:contract_id}});
  };


  const deleteById = async({id})=>
  {
    return db.feed.destroy({where: {id:id}});
  }
  
  const getAllfeedsByUserId = async({id_host}) =>
  {
      return db.feed.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}
        ],where:{id_host:id_host}});
  };

   
  const getAllfeedsById= async({id_contract}) =>
  {
      return db.feed.findAll({      
     where:{id_contract:id_contract}});
  };

  const getfeed = async obj => {
    return await db.feed.findOne({
    where: obj
  });
  };


  const getfeedProfile = async({ idnumber }) =>
  {
    
      return db.feed.findAll({where :{id:idnumber},include:[{ model:db.profile}]});
  };


   //audition delete

   feed.delete('/delete',async function(req,res)
   {
     const {id} = req.body ;
     console.log(id);

  

 res.json("DELETED"+id).then(deleteById({id}));
 
   })
  const getAllContests = async({ idnumber }) =>
  {
    
      return db.feed.findAll({where :{id:idnumber},include:[{ model:db.Contest}]});
  };

 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let feed = getfeed({ id: jwt_payload.id });
    if (feed) {
      next(null, feed);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);




 

//upload
feed.post('/upload', function(req, res) {
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
updatefeed({profile_pic:file_name,id_feed:I})
+
    res.send('File uploaded!with path'+I);

    

  });

  
//upload file TEST
// feed.post('/upload', function(req, res) {
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
// updatefeed({profile_pic:file_name,id_feed:I})
// +
//     res.send('File uploaded!with path '+ I);

    

//   });
// });
//   feed.post('/upload', function(req, res) {
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
// updatefeed({profile_pic:file_name,id_feed:I})
// +
//     res.send('File uploaded!with path'+I);

    

//   });
// });
  

//feedProfile
feed.post('/get_profile',async function(req,res){

  const { id } = req.body ;
  console.log(id)

  let profile = await getfeedProfile({ idnumber:id })
  res.json(profile)
})

feed.post('/get_current',async function(req,res){


  const { id } = req.body ;
  console.log(id)
  let feed = await getfeed({ id });
res.json(feed);
})
  // login route
  feed.post('/login', async function(req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { email, password } = req.body;
    if (email && password) {
      // we get the feed with the name and save the resolved promise
      
      let feed = await getfeed({ email });
     // console.log(feed);
      if (!feed) {
        res.status(401).json({ msg: 'No such feed found', feed });
      }
    else if (bcrypt.compareSync(password, feed.password)) {
        // from now on we’ll identify the feed by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: feed.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let feed_id = feed.id;
        req.login(feed_id,function(err)
        {
          res.json(feed);
         // console.log(feed.dataValues);
          // console.log(req.feed);
          // console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: "Password is incorrect" });
      } 
    }
  });
  //serialization and deserialization

  feed.post('/feeds_user', function(req, res) {
    const {id_host} =req.body ;


    getAllfeedsByUserId({id_host:id_host}).then(result=>res.json(result));
  });


  feed.post('/feed_id', function(req, res) {
    const {id_contract} =req.body ;
console.log(id_contract)


    getAllfeedsById({id_contract:id_contract}).then(result=>res.json(result));
  });


  // get all feeds
  feed.get('/feeds', function(req, res) {

  getAllfeeds().then(feed => res.json(feed)); 
});

//create feed
feed.post('/create_feed',function(req,res){
  const {id_host,id_join,id_contest,status,price} = req.body ;
console.log(id_host,id_join,id_contest,status);

        // Store hash in your password DB.


        createfeed({id_host,id_join,id_contest,status,price})
        .then(feed => res.json({feed,msg:'has been created'}))
        .catch(e=>{
            res.status(400).json("problem creating")
        })
       
 
 
   
  

})




module.exports = feed ;

