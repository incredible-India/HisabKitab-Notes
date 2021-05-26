//this page is jut for the connection of database

require('dotenv').config();//fot the dotenv file
const mongoose = require('mongoose');//mongoDb database mondule
// const chalk = require('')

mongoose.connect(process.env.DBS_URL,{

    useCreateIndex:true,
  useNewUrlParser:true,
  useUnifiedTopology:false,
  useUnifiedTopology:true
  ,useFindAndModify:false,

})
.then(data =>{
    console.log("Database is connected successfully");
})
.catch(error =>{
    console.log("Failed to connect Database");
})