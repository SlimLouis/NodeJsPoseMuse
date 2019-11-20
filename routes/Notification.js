// index.js
const express = require('express');
const bodyParser = require('body-parser');
const notification = express.Router();
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
notification.use(bodyParser.json());
//parse application/x-www-form-urlencoded
notification.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
notification.use(bodyParser.json());

notification.use(passport.initialize());
notification.use(passport.session());

//fileupload
notification.use(upload_express({useTempFiles: true}));



//parse application/x-www-form-urlencoded
notification.use(bodyParser.urlencoded({ extended: true }));
  //express session
 





  
  
  
  






  //helper function pre-defined function that can execute queries from and to mysql db


  //delete by id
  const deleteById = async({id})=>
  {
    return db.notification.destroy({where: {id:id}});
  }
  //filter by gender
  const notificationByGender = async({ gender_1 }) =>
  {
    
      return db.notification.findAll({where :{gender:gender_1}});
  };

  const notifications = async({ id_user }) =>
  {
    
      return db.notification.findAll({where :{user_notified:id_user , status:'unopened'}});
  };
    //filter by type_use
    const notificationByType = async({ type_use }) =>
    {
      
        return db.notification.findAll({where :{type_use:type_use}});
    };

    //filter by style
    const notificationByStyle = async({ style }) =>
    {
    
        return db.notification.findAll({where :{style:style}});
    };


  

  const createnotification = async ({description,id_user}) =>
  {

      return await db.notification.create({description,user_notified:id_user,status:'unopened'});
  };


  const getAllnotifications = async(id_user) =>
  {
      return db.notification.findAll(
        {
          returning:true,where:{user_notified:id_user,status:'unopened'}
        }
      );
  };

  const getnotification = async obj => {
    return await db.notification.findOne({
    where: obj,
  });
  };


 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let notification = getnotification({ id: jwt_payload.id });
    if (notification) {
      next(null, notification);
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

 
  notification.post('/delete_cloud',async function(req,res)
  {

  })
  

  //notification delete

  notification.delete('/delete',async function(req,res)
  {
    const {id} = req.body ;
    console.log(id);
    let notification =  await getnotification({id} );
var aud = notification.dataValues
console.log(aud.demo_file)
let path = 'C:/xampp/htdocs/passeportAuth/uploads/'+aud.demo_file
cloudinary.uploader.destroy('Demos/'+aud.demo_file.substr(0,aud.demo_file.lastIndexOf('.'))
,{resource_type:"video"}, function(error,result) {
  console.log(result, error) });

res.json(notification).then(deleteById({id}));

  })
  // login route
  notification.post('/login', async function(req, res, next) { 
    const { email, password } = req.body;
    if (email && password) {
      // we get the notification with the name and save the resolved promise
      
      let notification = await getnotification({ email });
      if (!notification) {
        res.status(401).json({ msg: 'No such notification found', notification });
      }
     if (bcrypt.compareSync(password, notification.password)) {
        // from now on we’ll identify the notification by the id and the id is
  // the only personalized value that goes into our token
        let payload = { name: notification.name };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        let notification_id = notification.id;
        req.login(notification_id,function(err)
        {
          res.json({ msg: 'ok', token: token });
          console.log(req.notification);
          console.log(req.isAuthenticated())
        })
      } else {
        res.status(401).json({ msg: 'Password is incorrect' });
      }
    }
  });
  //serialization and deserialization



  

  // get all notifications
  notification.post('/notifications',  function(req, res) {

    const id_user = req.body.id_user
 var not =  getAllnotifications(id_user)
  .then(notification => res.json(notification))
  .catch(err=>res.json(err)); 
});


const updateNotifications = async({id_user})=>
{
  // const id = req.params.id;
  //         const name = req.body.name;
  //         const lastname = req.body.lastname;
  //         const tele = req.body.tele;
  //         const price = req.body.price;
  
  return await db.notification.update(
    {
      status : 'opened' 
    },
    {
      returning:true, plain:true,where :{user_notified:id_user}
    }
  )


}

notification.put('/update',async function(req,res)
{
  const id_user = req.body.id_user ;
  updateNotifications({id_user})
  .then(result=>res.json(result))
  .catch(err=>res.json(err).sendStatus(401))



})


// //upload file
// notification.post('/upload', function(req, res) {
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
// createnotification({demo_file:file_name,id_user:real_id})
// +
//     res.send('File uploaded!with path'+jsoned.id);



//   });
// });
notification.post('/upload', function(req, res) {
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
createnotification({demo_file:file_name,id_user:real_id}).then(notification => res.json(notification))

    

  });

//upload file TEST
// notification.post('/upload', function(req, res) {
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
// createnotification({demo_file:file_name,id_user:real_id.id_user}).then(notification => res.json(notification))

    

//   });

//single upload

//upload file
notification.post('/single_upload', function(req, res) {

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
//create notification
  
notification.post('/create_notification',async function(req,res,next){

const {description,id_user} = req.body

var notification = await createnotification({description,id_user})
.then(notifications=>console.log(notifications)+
res.json(notifications))
.catch(err=>res.sendStatus(401).json(err))


  

});



 
 

 





//find notification

notification.post('/find_notification', async function(req,res)
{
    const {id_user} = req.body ;
    console.log(id_user);
     let notification = await getAllnotifications({id_user} );

    res.json(notification);
})


//find notification by gender

notification.post('/notification_gender', async function(req,res)
{
    const {gender_1} = req.body ;
    console.log(gender_1);
    let notification = await notificationByGender({gender_1} );

    res.json(notification);
})
//find notification by type

notification.post('/notification_type', async function(req,res)
{
    const {type} = req.body ;
    console.log(type);
    // let notification = await notificationByType({type_use:type} );

    // res.json(notification);
})
//find notification by style

notification.post('/notification_style', async function(req,res)
{
    const {style} = req.body ;
    console.log(style);
    // let notification = await notificationByStyle({style} );

    // res.json(notification);
})


  //protection
  // protected route
  notification.get('/protected', passport.authenticate('jwt', { session: true }), function(req, res) {
    const {token} = req.body
    console.log(token)
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
    });


 


   // app.post('/create_post',passport.authenticate('jwt',{session: false}))
        // add a basic route
        notification.get('/', function(req, res) {
 
  console.log(req.notification);
  console.log(req.isAuthenticated());

   res.json('the notification id of this session depending on the cookie is ' +req.notification);
  
});


module.exports = notification ;

