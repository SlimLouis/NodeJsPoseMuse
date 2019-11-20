

//DATABASE opTIONS
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'posemuse'
  };



  const Sequelize = require('sequelize');
// initialize an instance of Sequelize
// const sequelize = new Sequelize({
//   host: 'remotemysql.com',
//   port:3306,
//   database: 'w1yLRuhdZi',
//   username: 'w1yLRuhdZi' ,
//   password: 'dOyDIS05iR',
//   dialect: 'mysql',
// });
// initialize an instance of Sequelize
const sequelize = new Sequelize({
  host: '127.0.0.1',
  port:3306,
  database: 'posemuse',
  username: 'root' ,
  password: '',
  dialect: 'mysql',
});





  // check the databse connection
  sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));


  //all models

  
  // create user model
  // sequelize drop and sync database
  // sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  // .then(function(){
  //     return sequelize.sync({ force: true });
  // })
  // .then(function(){
  //     return sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  // })
  // .then(function(){
  //     console.log('Database synchronised.');
  // }, function(err){
  //     console.log(err);
  // });



  const User = sequelize.define('musers',{


    email:{
        type: Sequelize.STRING , unique:true
    },
    password:{
        type: Sequelize.STRING
    },
    username:{
      type: Sequelize.STRING
    },
    first_name:{
      type : Sequelize.STRING
    } ,
    last_name:{
      type: Sequelize.STRING
    },
    profile_pic:
    {
      type: Sequelize.STRING
    },
   
    

  });
  ////

    //create Gig model
    const Gig = sequelize.define('gig',{
      id_p:{
        type : Sequelize.STRING
      },

      name:{
        type: Sequelize.STRING
      },
      type_use:{
        type: Sequelize.STRING
      },

      gender:{
        type: Sequelize.STRING
      },
       style:{
        type: Sequelize.STRING
      },
      price:{
        type: Sequelize.INTEGER
      },
       endedAt:{
        type: Sequelize.DATE
      },
       description:{
        type: Sequelize.STRING
      },
       audio:{
        type: Sequelize.STRING
      }
      , 
      muserId :
      {
        type: Sequelize.INTEGER,
        references:{
          model : User,
          key:'id'
        }
      }



    });


    //create Contest model
    const Contest = sequelize.define('contest',{
      
      id_p:{
        type : Sequelize.STRING
      },
      name:{
        type: Sequelize.STRING
      },
      type_use:{
        type: Sequelize.STRING
      },

      gender:{
        type: Sequelize.STRING
      },
       style:{
        type: Sequelize.STRING
      },
      price:{
        type: Sequelize.INTEGER
      },
       endedAt:{
        type: Sequelize.DATE
      },
      status:{
        type: Sequelize.STRING
      },
       description:{
        type: Sequelize.STRING(512)

      },
       audio:{
        type: Sequelize.STRING
      },
      muserId :
      {
        type: Sequelize.INTEGER,
        references:{
          model : User,
          key:'id'
        }

      }





    });


      //create Contest model
    const join_gig = sequelize.define('join_gig',{

       
         demo:{
          type: Sequelize.STRING
        },
        id_host :
        {
          type : Sequelize.INTEGER,
          references:
          {
            model: User,
            key:'id'

          }
        },
      
      
  
  
  
  
      });

   
       //create Contest model
       const join_contest = sequelize.define('join_contest',{

       
        demo:{
         type: Sequelize.STRING
       },
       bid:{
         type: Sequelize.INTEGER
       },
       id_host :
       {
         type : Sequelize.INTEGER,
         references:
         {
           model: User,
           key:'id'

         }
       },
     
     
 
 
 
 
     });

     //profile

     const profile = sequelize.define('profile',{

       
      description:{
       type: Sequelize.STRING
     },
     gender:{
      type: Sequelize.STRING
    },
    type:{
      type: Sequelize.STRING
    },
    country:{
      type: Sequelize.STRING
    },
    id_user:
    {      type: Sequelize.INTEGER


    }
   
    });
    //audition
    const audition = sequelize.define('audition',{

       
      demo_file:{
       type: Sequelize.STRING
      }
    ,
     id_user :
     {
       type : Sequelize.INTEGER,
       references:
       {
         model: User,
         key:'id'

       }
      }
    }); 


      //create Contest model
      const contract = sequelize.define('contract',{

       
        id_join :
        {
          type : Sequelize.INTEGER,
          references:
          {
            model: User,
            key:'id'
 
          }
        },
       id_host :
       {
         type : Sequelize.INTEGER,
         references:
         {
           model: User,
           key:'id'

         }
       },
       id_contest :
       {
         type : Sequelize.INTEGER,
         references:
         {
           model: Contest,
           key:'id'

         }
       },
       status :
       {
         type : Sequelize.STRING,
      
       },
       price:
       {
         type : Sequelize.INTEGER
       }
     
 
     });

     //feeds contract
     const feed = sequelize.define('feed',{

       
      feed_file:{
       type: Sequelize.STRING
      }
    ,
     id_user :
     {
       type : Sequelize.INTEGER,
       references:
       {
         model: User,
         key:'id'

       }
      }
      ,
      id_contract :
      {
        type : Sequelize.INTEGER,
        references:
        {
          model: contract,
          key:'id'
 
        }
       }
    }); 

    const transaction = sequelize.define('transaction',{

      amount :{
        type: Sequelize.INTEGER
      } ,
      id_user:{
        type: Sequelize.INTEGER,
        references :{
          model : User,
          key: 'id'
        }
      }

    });

    const notification = sequelize.define('notification',{

      description :{
        type: Sequelize.STRING
      } ,
      status:{  
        type: Sequelize.STRING

      },
      user_notified:{
        type: Sequelize.INTEGER,
        references :{
          model : User,
          key: 'id'
        }
      }

    });
    //  models.User.hasMany(models.AudioConfig, {
    //   as: 'createdByUser',
    //   foreignKey: {
    //     name: 'createdBy',
    //     allowNull: false
    //   }
    // });
    User.hasMany(Gig,{foreignkey: "muserId"});
    User.hasMany(Contest,{foreignkey: "muserId"});
    //User.hasMany(audition,{foreignkey:"id_user"})
     User.hasMany(contract,{as:'id_host',foreignKey:"id_host"})
     User.hasMany(contract,{as:'id_join',foreignKey:"id_join"})
     contract.belongsTo(User, {as:'host',foreignKey: 'id_host' }); // Adds id_user to profile
     contract.belongsTo(User, {as:'join',foreignKey: 'id_join'}); // Adds id_user to profile
    //  Contest.hasMany(contract,{as:'id_contest',foreignkey:"id_contest"}); 

    //  contract.belongsTo(Contest, {as:'contest',foreignKey: 'id_contest'}); // Adds id_user to profile


    // User.belongsToMany(contract, { through: 'id_host'});
    // User.belongsToMany(contract, { through: 'id_join'});
     
    Gig.hasOne(join_gig);
    Contest.hasOne(join_contest);

    Gig.hasMany(join_gig,{foreignkey:"muserId"});
    Contest.hasMany(join_contest,{foreignkey:"muserId"}); 
   
    
    profile.belongsTo(User, {foreignKey: 'id_user', targetKey: 'id'}); // Adds id_user to profile
    User.hasOne(profile,{foreignKey :'id_user'})
    Contest.belongsTo(User, {foreignKey: 'muserId',targetKey: 'id'}); // Adds id_user to profile
    join_contest.belongsTo(User, {foreignKey: 'id_host',targetKey: 'id'}); // Adds id_user to profile
    //  Contest.hasMany(contract,{as:'id_contest',foreignKey:'id_contest'});
     contract.belongsTo(Contest,{as:'contest',foreignKey:'id_contest'});
    //  contract.hasMany(join_contest,{as:'join_contest',foreignKey:'id_join'})
    // contract.hasMany(feed,{as:'feed',foreignKey:'id_contract'})
    // Adds id_user to profile
    Contest.belongsTo(User, {foreignKey: 'muserId',targetKey: 'id'}); // Adds id_user to profile

    // transaction.belongsTo(User, {foreignKey: 'id_user',targetKey: 'id'});

    User.hasMany(transaction,{foreignKey:'id_user'});

    User.hasMany(notification,{foreignKey:'user_notified'})

    // notification.sync({force:true})
    // .then()
    // .catch(err=>console.log(err))

    // transaction.sync()
    // .then()
    // .catch(err=>console.log(err));
    // contract.sync()
    // .then()
    // .catch(err=>console.log(err))

  //  feed.sync({force:true})
  // .then()
  // .catch(err=>console.log(err))
  
  // User.sync()
  // .then()
  // .catch(err=>console.log(err))

  // audition.sync()
  //   .then()
  //   .catch(er=>{console.log(er)});
 
  
  // profile.sync({force:true})
  // .then()
  // .catch(err=>console.log(err))
   
  

  // Contest.sync({force:true})
  // .then()
  // .catch(err=>console.log(err));

  // Gig.sync({})
  // .then()
  // .catch(err=>console.log(err))

  

  // join_gig.sync()
  // .then()
  // .catch(err=>console.log(err))
  
  // join_contest.sync({force:true})
  // .then()
  // .catch(err=>console.log(err))






module.exports = {User,Gig,Contest,join_gig,join_contest,profile,audition,contract,feed,transaction,notification};