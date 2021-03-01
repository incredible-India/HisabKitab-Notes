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
const { check, validationResult } = require('express-validator');//it will check the form validation on server
const UserDBS = require('./model/user');//user database 
const cookieParser = require('cookie-parser');//for the cookies
const pug = require('pug');//templates engine..
const userauth = require('./authentication/auth');//user authentication 
// const { info } = require('console');


//creating server
const app =express();


//giving the port number

const _port  = process.env.PORT || 80 ; //this is the port number

//setting the pug templates engine
app.set('view engine','pug');
app.set('views',path.join(__dirname,"./views/"))

//using the middleware
app.use(express.static(path.join('./src')))//tells about the satics files
app.use(morgan('dev'));//for the debugging
app.use(bodyParser.json());//for parsing data in json formate
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());//cookies middleware


//routing  for the home page


app.get('/', userauth ,async (req,res)=>{

    let infoUser = await req.isAurthised;

    if(infoUser)
    {
        return  res.status(200).render('index',{

            allinfo :  infoUser
        })
    
  
    }else
    {
        return res.status(200).sendFile(path.join(__dirname,"./src/html/index.html"))
    }
  
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

app.post('/savedatain',[
    //checking the form on server side..
    
    check('name').not().isEmpty().trim(),
    check('pass').not().isEmpty().trim(),
    check('cnfpass').not().isEmpty().trim(),


],async (req,res)=>{
 
    const errorInform = validationResult(req);

    if(!errorInform.isEmpty())
    {
        return res.json({
            message : "form validation error on server"
            ,error : errorInform
        })
    }

    let savedata = UserDBS ({
        name : req.body.name,
        password : req.body.pass
    })

    const token = savedata.generateTheToken();  //it will generate the token when user will registration itself
    if(token)
    {
        res.cookie('notes', token, { expires: new Date(Date.now() + (24 * 60 * 60 * 1000)) });

        return res.status(200).redirect('/')
    }else
    {
        res.json("password must be unique")
    }
    

})

app.listen(_port,()=>{

    console.log(chalk.bgCyanBright.redBright(process.env.SUCCESS_MESSAGE));
})
