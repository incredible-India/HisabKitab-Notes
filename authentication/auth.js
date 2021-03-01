require('dotenv').config();
const userDBS = require('./../model/user');//user database
const jwt = require('jsonwebtoken');//generate the cookies




    function  authUser(req,res,next) {
//   console.log(r);
        try{
   
    
           const token =   req.cookies.notes ; //cookies
          
           if(token === undefined)
           {
               req.isAurthised = null ;
         
               next();
               return; //agar ye return na likhe to next k baad bhi code excute hota
           }

           const varifyUser =  jwt.verify(token, process.env.SECRET_KEY); //varify the cookies
       
           const isAurthised = userDBS.findOne({_id : varifyUser._id})//it will check the user that exist in our database or not
         
           req.isAurthised = isAurthised; //it will return null if user is not in database otherwise it return document
   
           next()
       }catch (error){
          
        
          return res.json({message : "auth file error",
       error :error});
   
   
       }
      
   
   
   
   
   }


module.exports = authUser;