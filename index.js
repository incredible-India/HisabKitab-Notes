/*This project is for the calculations of Expens and making Notes 
Himanshu Kumar Sharma B.E 3rd Sem 
DOM : 27/02/2021 */

//requiring the important modules 
require('dotenv').config();//dot env for reading the data from it
const express  =require('express');//for the creating router
const chalk =require('chalk');//beautify the console window of terminal
const path = require('path');// for the path files or folders
const morgan = require('morgan');//for the debugging 
require('./database/dbsCon');//for the conncetion of database
const bodyParser = require('body-parser');//for the parsing data from the url



//creating server
const app =express();


//giving the port number

const _port  = process.env.PORT || 80 ; //this is the port number


//using the middleware
app.use(express.static(path.join('./src')))//tells about the satics files
app.use(morgan('dev'));//for the debugging
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :true})); //using the middle ware

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"./src/html/index.html"))
})

app.get('/signin',(req,res)=>{

    res.status(200);
    res.setHeader('Content-Type','text/html');
    res.sendFile(path.join(__dirname , "./src/html/sign.html"));//this will send an html of sign form

})


app.get('/newuser',(req,res)=>{

    res.status(200);
    res.setHeader('Content-Type','text/html');
    res.sendFile(path.join(__dirname , "./src/html/newUser.html"));//this will send an html of sign form

})



//for the new User

app.post('/savedatain',async (req,res)=>{
 
    


})

app.listen(_port,()=>{

    console.log(chalk.bgCyanBright.redBright(process.env.SUCCESS_MESSAGE));
})
