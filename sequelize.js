



// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

  //create user model




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
    

  });
  ////

    //create Gig model
    const Gig = sequelize.define('gig',{

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




    });


    //create Contest model
    const Contest = sequelize.define('contest',{
      
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
    
    User.hasMany(Gig);
    User.hasMany(Contest);
    //Gig.hasOne(join_gig);
    Gig.hasMany(join_gig);
    Contest.hasMany(join_contest)

    



Gig.sync({force :true})
.then()
.catch(err=>console.log(err))

  User.sync({force:true})
  .then()
  .catch(err=>console.log(err))

  Contest.sync({force: true})
  .then()
  .catch(err=>console.log(err));

  

join_gig.sync({force :true})
.then()
.catch(err=>console.log(err))
  //
  join_contest.sync({force :true})
.then()
.catch(err=>console.log(err))


