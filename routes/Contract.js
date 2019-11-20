// index.js
const express = require('express');
const bodyParser = require('body-parser');
const contract = express.Router();
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
contract.use(bodyParser.json());
//parse application/x-www-form-urlencoded
contract.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
contract.use(bodyParser.json());

contract.use(passport.initialize());
contract.use(passport.session());

contract.use(upload_express({useTempFiles: true}));
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
// contractname: 'w1yLRuhdZi' ,
// password: 'dOyDIS05iR',
// dialect: 'mysql',
// var sessionStore = new MySQLStore(options);

//parse application/x-www-form-urlencoded
contract.use(bodyParser.urlencoded({ extended: true }));
  //express session
  contract.use(session({
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
  const updatecontract = async({profile_pic,id_contract})=>
  {
    // const id = req.params.id;
    //         const name = req.body.name;
    //         const lastname = req.body.lastname;
    //         const tele = req.body.tele;
    //         const price = req.body.price;
    
    return await db.contract.update(
      {
        profile_pic : profile_pic ,
       
      },
      {
        returning:true, plain:true,where :{id:id_contract}
      }
    )


  }

  const createcontract = async ({id_host,id_join,id_contest,price}) =>
  {

      return await db.contract.create({id_host,id_join,id_contest,status:'progress',price});
  };

  
  const getAllcontracts = async() =>
  {
      return db.contract.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}
        ]});
  };



  
  const getAllcontractsByUserId = async({id_host}) =>
  {
      return db.contract.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}
        ],where:{id_host:id_host}});
  };


  const getAllcontractsByUserIdJoin = async({id_join}) =>
  {
      return db.contract.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}
        ],where:{id_join:id_join}});
  };

   
  const getAllcontractsById= async({id}) =>
  {
      return db.contract.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}        ],where:{id:id}});
  };

  const getcontract = async obj => {
    return await db.contract.findOne({
    where: obj
  });
  };


  const getcontractProfile = async({ idnumber }) =>
  {
    
      return db.contract.findAll({where :{id:idnumber},include:[{ model:db.profile}]});
  };


  const getAllContests = async({ idnumber }) =>
  {
    
      return db.contract.findAll({where :{id:idnumber},include:[{ model:db.Contest}]});
  };

 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let contract = getcontract({ id: jwt_payload.id });
    if (contract) {
      next(null, contract);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);




 

//upload
contract.post('/upload', function(req, res) {
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
updatecontract({profile_pic:file_name,id_contract:I})
+
    res.send('File uploaded!with path'+I);

    

  });

  
//upload file TEST
// contract.post('/upload', function(req, res) {
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
// updatecontract({profile_pic:file_name,id_contract:I})
// +
//     res.send('File uploaded!with path '+ I);

    

//   });
// });
//   contract.post('/upload', function(req, res) {
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
// updatecontract({profile_pic:file_name,id_contract:I})
// +
//     res.send('File uploaded!with path'+I);

    

//   });
// });
  

//contractProfile
contract.post('/get_profile',async function(req,res){

  const { id } = req.body ;
  console.log(id)

  let profile = await getcontractProfile({ idnumber:id })
  res.json(profile)
})

contract.post('/get_current',async function(req,res){


  const { id } = req.body ;
  console.log(id)
  let contract = await getcontract({ id });
res.json(contract);
})
  // login route
  contract.post('/login', async function(req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { email, password } = req.body;
    if (email && password) {
      // we get the contract with the name and save the resolved promise
      
      let contract = await getcontract({ email });
     // console.log(contract);
      if (!contract) {
        res.status(401).json({ msg: 'No such contract found', contract });
      }
    else if (bcrypt.compareSync(password, contract.password)) {
        // from now on we’ll identify the contract by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: contract.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let contract_id = contract.id;
        req.login(contract_id,function(err)
        {
          res.json(contract);
         // console.log(contract.dataValues);
          // console.log(req.contract);
          // console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: "Password is incorrect" });
      } 
    }
  });
  //serialization and deserialization

  contract.post('/contracts_user', function(req, res) {
    const {id_host} =req.body ;


    getAllcontractsByUserId({id_host:id_host}).then(result=>res.json(result));
  });


  contract.post('/contracts_user_join', function(req, res) {
    const {id_join} =req.body ;


    getAllcontractsByUserIdJoin({id_join:id_join}).then(result=>res.json(result));
  });


  contract.post('/contract_id', function(req, res) {
    const {id} =req.body ;


    getAllcontractsById({id:id}).then(result=>res.json(result));
  });


  // get all contracts
  contract.get('/contracts', function(req, res) {

  getAllcontracts().then(contract => res.json(contract)); 
});

//create contract
contract.post('/create_contract',function(req,res){
  const {id_host,id_join,id_contest,status,price} = req.body ;
console.log(id_host,id_join,id_contest,status);

        // Store hash in your password DB.


        createcontract({id_host,id_join,id_contest,status,price})
        .then(contract => res.json({contract,msg:'has been created'}))
        .catch(e=>{
            res.status(400).json("problem creating")
        })
       
 
 
   
  

})




module.exports = contract ;

