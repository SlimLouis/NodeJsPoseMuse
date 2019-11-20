// index.js
const express = require('express');
const bodyParser = require('body-parser');
const transaction = express.Router();
const db = require('../database')
const stripe = require('stripe')("sk_test_4ljsaZQLtNjnFttka3Em9n5X00bRv7V2Tu")

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
transaction.use(bodyParser.json());
//parse application/x-www-form-urlencoded
transaction.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
transaction.use(bodyParser.json());

transaction.use(passport.initialize());
transaction.use(passport.session());

transaction.use(upload_express({useTempFiles: true}));
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
// transactionname: 'w1yLRuhdZi' ,
// password: 'dOyDIS05iR',
// dialect: 'mysql',
// var sessionStore = new MySQLStore(options);

//parse application/x-www-form-urlencoded
transaction.use(bodyParser.urlencoded({ extended: true }));
  //express session
  transaction.use(session({
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
  const updatetransaction = async({profile_pic,id_transaction})=>
  {
    // const id = req.params.id;
    //         const name = req.body.name;
    //         const lastname = req.body.lastname;
    //         const tele = req.body.tele;
    //         const price = req.body.price;
    
    return await db.transaction.update(
      {
        profile_pic : profile_pic ,
       
      },
      {
        returning:true, plain:true,where :{id:id_transaction}
      }
    )


  }

  const createtransaction = async ({id_user,price}) =>
  {

      return await db.transaction.create({id_user:id_user,amount:price});
  };

  
  const getAlltransactions = async() =>
  {
      return db.transaction.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}
        ]});
  };



  
  const getAlltransactionsByUserId = async({id_host}) =>
  {
      return db.transaction.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}
        ],where:{id_host:id_host}});
  };


  const getAlltransactionsByUserIdJoin = async({id_join}) =>
  {
      return db.transaction.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}
        ],where:{id_join:id_join}});
  };

   
  const getAlltransactionsById= async({id}) =>
  {
      return db.transaction.findAll({      
        include:[
          {model: db.User, as: 'host'},
          {model: db.User, as: 'join'},
          {model: db.Contest,as:'contest'}        ],where:{id:id}});
  };

  const gettransaction = async obj => {
    return await db.transaction.findOne({
    where: obj
  });
  };


  const gettransactionProfile = async({ idnumber }) =>
  {
    
      return db.transaction.findAll({where :{id:idnumber},include:[{ model:db.profile}]});
  };


  const getAllContests = async({ idnumber }) =>
  {
    
      return db.transaction.findAll({where :{id:idnumber},include:[{ model:db.Contest}]});
  };

 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let transaction = gettransaction({ id: jwt_payload.id });
    if (transaction) {
      next(null, transaction);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);


  transaction.post('/paynow',async function(req,res)
{

console.log(req.body)
  var token = req.body.token;
  var price = req.body.price ;
  var id_user = req.body.id_user

  
    const charge = await stripe.charges.create({
      amount: price,
      currency: 'usd',
      description: 'Example charge',
      source: token,
    })
    .then(
      createtransaction({id_user:id_user,price:price/100})
    )
    .catch(err=>res.json(err));

 


})

  transaction.post('/success',function(req,res)
  { 

    
      var stripeToken = req.body.stripeToken ;
      var type = req.body.stripeTokenType; 
      var chargeAmount = Math.round(req.body.amount);
      var email = req.body.stripeEmail;
      var currency = req.body.currency;
      stripe.token.create(
        {
          card: {
            number: '4242424242424242',
            exp_month: 11,
            exp_year: 2020,
            cvc: '314',
          },
        },function(err,token)
        {
        }
      )

      // console.log(req.body)
      // var charge = stripe.charges.create({
      //   amount: 2000,
      //   currency: 'usd',
      //   source: 'tok_amex',
      //   description: 'Charge for jenny.rosen@example.com',
      // },function(err,charge)
      // {
      //     if (err && err.type=="StripeCardError")
      //     {
      //         console.log("your card declined")
      //         return; 
      //     }
      //     // res.sendFile(path.join(__dirname+'../success.html'));
      //     res.json(charge);
  
      //     console.log("this is the amount that has been charged from your account")
          
           
      // })
  })
 

//upload
transaction.post('/upload', function(req, res) {
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
updatetransaction({profile_pic:file_name,id_transaction:I})
+
    res.send('File uploaded!with path'+I);

    

  });

  
//upload file TEST
// transaction.post('/upload', function(req, res) {
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
// updatetransaction({profile_pic:file_name,id_transaction:I})
// +
//     res.send('File uploaded!with path '+ I);

    

//   });
// });
//   transaction.post('/upload', function(req, res) {
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
// updatetransaction({profile_pic:file_name,id_transaction:I})
// +
//     res.send('File uploaded!with path'+I);

    

//   });
// });
  

//transactionProfile
transaction.post('/get_profile',async function(req,res){

  const { id } = req.body ;
  console.log(id)

  let profile = await gettransactionProfile({ idnumber:id })
  res.json(profile)
})

transaction.post('/get_current',async function(req,res){


  const { id } = req.body ;
  console.log(id)
  let transaction = await gettransaction({ id });
res.json(transaction);
})
  // login route
  transaction.post('/login', async function(req, res, next) { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { email, password } = req.body;
    if (email && password) {
      // we get the transaction with the name and save the resolved promise
      
      let transaction = await gettransaction({ email });
     // console.log(transaction);
      if (!transaction) {
        res.status(401).json({ msg: 'No such transaction found', transaction });
      }
    else if (bcrypt.compareSync(password, transaction.password)) {
        // from now on we’ll identify the transaction by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: transaction.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let transaction_id = transaction.id;
        req.login(transaction_id,function(err)
        {
          res.json(transaction);
         // console.log(transaction.dataValues);
          // console.log(req.transaction);
          // console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: "Password is incorrect" });
      } 
    }
  });
  //serialization and deserialization

  transaction.post('/transactions_user', function(req, res) {
    const {id_host} =req.body ;


    getAlltransactionsByUserId({id_host:id_host}).then(result=>res.json(result));
  });


  transaction.post('/transactions_user_join', function(req, res) {
    const {id_join} =req.body ;


    getAlltransactionsByUserIdJoin({id_join:id_join}).then(result=>res.json(result));
  });


  transaction.post('/transaction_id', function(req, res) {
    const {id} =req.body ;


    getAlltransactionsById({id:id}).then(result=>res.json(result));
  });


  // get all transactions
  transaction.get('/transactions', function(req, res) {

  getAlltransactions().then(transaction => res.json(transaction)); 
});

//create transaction
transaction.post('/create_transaction',function(req,res){
  const {id_host,id_join,id_contest,status,price} = req.body ;
console.log(id_host,id_join,id_contest,status);

        // Store hash in your password DB.


        createtransaction({id_host,id_join,id_contest,status,price})
        .then(transaction => res.json({transaction,msg:'has been created'}))
        .catch(e=>{
            res.status(400).json("problem creating")
        })
       
 
 
   
  

})




module.exports = transaction ;

