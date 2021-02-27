//this is the page where we define the schema of the user for the saving the informtion
const mongoose = require('mongoose') ;//for the mongoDb database

let schema =mongoose.Schema ; 

 let  users = new schema({
    name : {
        type : String,
        required :true
        
    },password :{
        type :String,
        required :true
    },
    domId :{
        type : Date,
        default : Date.now()
    }

    ,notes : []
})


module.exports =mongoose.model('users',users);
 