//this is the page where we define the schema of the user for the saving the informtion
const mongoose = require('mongoose') ;//for the mongoDb database
const jwt = require('jsonwebtoken');//generate the cookies

let schema =mongoose.Schema ; 

 let  users = new schema({
    name : {
        type : String,
        required :true
        
    },
    email :{
        type : String,
        required :true,
        unique : true
    }
    
    ,password :{
        type :String,
        required :true,
    
    },
    domId :{
        type : Date,
        default : Date.now()
    }

    ,notes : []
    
    ,  tokenSchema : [{tokendbs:{
        type:String,
        required:true
    }}],

    expanses :{
        type : Object

    }
,
    allrecords:[]
})


users.methods.generateTheToken = function()
{
    try {
        const tokenGenrate = jwt.sign({_id : this._id}, process.env.SECRET_KEY);//this will generate a token

        //now save in database this token 
     
        this.tokenSchema = this.tokenSchema.concat( {tokendbs : tokenGenrate} );
     
     
        this.save();
        
        return tokenGenrate;
     
    } catch (error) {
        return null
    }
 
//    


}




module.exports =mongoose.model('users',users);
 