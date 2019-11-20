// index.js
const express = require('express');
const bodyParser = require('body-parser');
const profile = express.Router();
const db = require('../database')

const session = require('express-session')

var MySQLStore = require('express-mysql-session')(session);


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
//parse application/x-www-form-urlencoded
profile.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
profile.use(bodyParser.json());

profile.use(passport.initialize());
profile.use(passport.session());


//DATABASE opTIONS
var options = {
  host: 'localhost',
  port: 3306,
  profile: 'root',
  password: '',
  database: 'posemuse'
};

var sessionStore = new MySQLStore(options);

//parse application/x-www-form-urlencoded






  
  
  
  






  //helper function pre-defined function that can execute queries from and to mysql db


  const createprofile = async ({description,gender,type,country,id_user}) =>
  {

      return await db.profile.create({description,gender,type,country,id_user});
  };

 


  const getAllprofiles = async() =>
  {
      return db.profile.findAll();
  };

  const getprofile = async obj => {
    return await db.profile.findOne({
    where: obj,
  });
  };


  const updateProfile = async({description,gender,type,country,id_user})=>
  {
    // const id = req.params.id;
    //         const name = req.body.name;
    //         const lastname = req.body.lastname;
    //         const tele = req.body.tele;
    //         const price = req.body.price;
    
    return await db.profile.update(
      {
        description : description ,
        gender : gender , 
        type : type ,
        country : country
      },
      {
        returning:true, plain:true,where :{id_user:id_user}
      }
    )


  }

  const getAllContests = async({ idnumber }) =>
  {
    
      return db.profile.findAll({where :{id:idnumber},include:[{ model:db.Contest}]});
  };

 // lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let profile = getprofile({ id: jwt_payload.id });
    if (profile) {
      next(null, profile);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  
  
  passport.use(strategy);




 


  
  // login route
  
  //serialization and deserialization

  


  // get all profiles
  profile.get('/profiles', function(req, res) {

  getAllprofiles().then(profile => res.json(profile)); 
});

//create profile
profile.post('/create_profile',function(req,res){
  const {description,gender,type,country,id_user} = req.body ;
 


        createprofile({description,gender,type,country,id_user})
        .then(profile => res.json({profile,msg:'has been created'}))
        .catch(e=>{
            res.status(400).json(e.fields.email+ ' '+'already exists')
        })
       
 
   
   
  

})


//update profile
profile.post('/update',async function(req,res,result){

  const {description,gender,type,country,id_user} = req.body; 
  let exist = await getprofile({id_user});
  console.log(exist)
  if (exist==null)
  {
    db.profile.create({description,gender,type,country,id_user})
    .then(result=>{res.json(result)})
    .catch(er=>{res.json(err)})
  }
else
{
  updateProfile({description,gender,type,country,id_user})
  .then(result=>{
    res.json("user already have a profile"+result[1])
  }).catch(er=>{
    res.json(er)
  })
  
}

  



})

//check_password
profile.post('/check_password',async function(req,res)
{
  
  const {email,password} = req.body; 
  let profile = await getprofile({ email }) ;
  res.json(bcrypt.compareSync(password, profile.password))



})

//get profile

//find profile

profile.post('/find_profile', async function(req,res)
{
    
  try
  {
    var {id_user} = req.body ;
    //      console.log(email);

       let profile = await getprofile({ id_user } );
       if (profile==null)
       {

         res.json("no such email");
       }
       else
       {
        res.json(profile);

       }
    
  }
  catch(err)
  {
    console.log(err)
  }
    
  
})


//find contest of this profile

profile.get('/contests', async function(req,res)
{
    const {idnumber} = req.body ;
    let profile = await getAllContests({ idnumber } );


    res.json(profile[0].contests.length);
})


profile.get('/profile/:profilename',async function(req,res)
{
  const {profilename} = req.params ;
  let profile =  await getprofile({ profilename } );
    if (profile==null)
    {
      res.status(406).json("not found")
    }
  console.log(profile)
  res.json(profile);


})

  //protection
  // protected route
  profile.get('/protected', passport.authenticate('jwt', { session: true }), function(req, res) {
    const {token} = req.body
    console.log(token)
    res.json({ msg: 'Congrats! You are seeing this because you are authorized'});
    });


 


   // app.post('/create_post',passport.authenticate('jwt',{session: false}))
        // add a basic route
        profile.get('/', function(req, res) {
 
  console.log(req.profile);
  console.log(req.isAuthenticated());

   res.json('the profile id of this session depending on the cookie is ' +req.profile);
  
});


module.exports = profile ;

