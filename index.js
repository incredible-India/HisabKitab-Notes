/*This project is for the calculations of Expens and making Notes 
Himanshu Kumar Sharma B.E 3rd Sem 
DOM : 27/02/2021 */

//requiring the important modules 
require('dotenv').config(); //dot env for reading the data from it
const express = require('express'); //for the creating router
const chalk = require('chalk'); //beautify the console window of terminal
const path = require('path'); // for the path files or folders
const morgan = require('morgan'); //for the debugging 
require('./database/dbsCon'); //for the conncetion of database
const bodyParser = require('body-parser'); //for the parsing data from the url
const {
    check,
    validationResult
} = require('express-validator'); //it will check the form validation on server
const UserDBS = require('./model/user'); //user database 
const cookieParser = require('cookie-parser'); //for the cookies
const pug = require('pug'); //templates engine..
const userauth = require('./authentication/auth'); //user authentication 
const user = require('./model/user');
const {
    findOne
} = require('./model/user');
// const { info } = require('console');


//creating server
const app = express();


//giving the port number

const _port = process.env.PORT || 80; //this is the port number

//setting the pug templates engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "./views/"))

//using the middleware
app.use(express.static(path.join('./src'))) //tells about the satics files
app.use(morgan('dev')); //for the debugging
app.use(bodyParser.json()); //for parsing data in json formate
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser()); //cookies middleware


//routing  for the home page


app.get('/', userauth, async (req, res) => {

    let infoUser = await req.isAurthised;

    if (infoUser) {
        return res.status(200).render('index', {

            allinfo: infoUser
        })


    } else {
        return res.status(200).sendFile(path.join(__dirname, "./src/html/index.html"))
    }

})


app.get('/signin', (req, res) => {

    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, "./src/html/sign.html")); //this will send an html of sign form

})


app.get('/newuser', (req, res) => {

    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, "./src/html/newUser.html")); //this will send an html of sign form

})



//for the new User

app.post('/savedatain', [
    //checking the form on server side..

    check('name').not().isEmpty().trim(),
    check('pass').not().isEmpty().trim(),
    check('cnfpass').not().isEmpty().trim(),


], async (req, res) => {

    const errorInform = validationResult(req);

    if (!errorInform.isEmpty()) {
        return res.json({
            message: "form validation error on server",
            error: errorInform
        })
    }

    let savedata = UserDBS({
        name: req.body.name,
        password: req.body.pass,
        email: req.body.email
    })

    const token = savedata.generateTheToken(); //it will generate the token when user will registration itself
    if (token) {
        res.cookie('notes', token, {
            expires: new Date(Date.now() + (24 * 60 * 60 * 1000))
        });

        return res.status(200).redirect('/')
    } else {
        res.json("password must be unique")
    }


})


//for the log out 
app.get('/logout', userauth, async (req, res) => {

    let UserAuth = await req.isAurthised; //it will return either document of user or null

    if (UserAuth) {

        // console.log(UserAuth);
        UserAuth.tokenSchema = []; //this logout from all devices and make token emapty in dbs
        res.clearCookie('notes'); //clear the cookies
        UserAuth.save(); //save changes the data in dbs
        return res.redirect('/'); //redirect the home page

    } else {
        res.clearCookie('notes');
        return res.redirect('/');

    }
})

//after  the sign form 
app.post('/showhomepage', async (req, res) => {


    let isAuth = await user.findOne({
        email: req.body.email
    })

    let CheckData = req.body; //userinformation from the sign in form

    // console.log(CheckData);

    if (isAuth != null) {
        if (CheckData.email == isAuth.email) {
            if (CheckData.password == isAuth.password) {

                const tokenlogin = isAuth.generateTheToken();

                res.cookie("notes", tokenlogin, {
                    expires: new Date(Date.now() + (24 * 60 * 60 * 1000))
                }); //we set the expairy date for 24 hrs


                return res.status(200).redirect('/');

            } else {
                return res.json({
                    message: "incorrect username or password.."
                })
            }
        } else {
            return res.json({
                message: "incorrect username or password.."
            })
        }
    } else {
        return res.json({
            message: "Error in sign in try latar"
        })
    }
})



//for the mynotes 

app.get('/mynotes', userauth, async (req, res) => {

    let isUser = await req.isAurthised; //if user is Aurthorised is return his document otherwise it will return null

    if (isUser) {
        return res.status(200).render('note', {
            allinfo: isUser //this is the user infomrations,
                ,
            notes: isUser.notes
        })

    } else {
        return res.status(200).redirect('/signin'); //is user is not aurthorised
    }


})

// for the saving the notes in database 
app.post('/savemynotes', userauth, async (req, res) => {

    let isUser = await req.isAurthised; //if user is Aurthorised is return his document otherwise it will return null
    let date = new Date();

    if (isUser) {
        isUser.notes = isUser.notes.concat({
            notes: req.body.mynotes.trim(),
            date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} `,
            uniqueNumber: Date.now()
        });
        isUser.save()

        res.redirect('/mynotes')

    } else {
        return res.status(200).redirect('/signin'); //is user is not aurthorised
    }



})

app.get('/showNotes/for/fetching', userauth, async (req, res) => {


    let isAuth = await req.isAurthised;
    // console.log(isAuth.notes);
    if (isAuth) {
        return res.json({

            notes: isAuth.notes
        })
    } else {
        return null
    }


})

//for deleting the notes from the list

app.get('/delete/thisNote/:uniNumber', userauth, async (req, res) => {

    let isAuthenticate = await req.isAurthised; //this will check the user aurthority
    let NumUrl = req.params.uniNumber //this is the number from url


    if (isAuthenticate) {
        try {

            let value = NumUrl;

            // isAuthenticate.notes = isAuthenticate.notes

            isAuthenticate.notes = isAuthenticate.notes.filter(item => item.uniqueNumber != value) //it will remove the element from the array

            isAuthenticate.save();

            // console.log(arr)

            return res.redirect('/mynotes')

        } catch (error) {

            return res.json({

                message: "we are facing the server issue... "
            })
        }
    } else {
        return res.status(200).redirect('/signin'); //is user is not aurthorised
    }



})

//for the deleting the all notes from the database also
app.get('/delete/All', userauth, async (req, res) => {

    let _user = await req.isAurthised;

    if(_user)
    {
            _user.notes = []
            _user.save();
            
            return res.redirect('/mynotes');

    }else
    {
        return res.status(200).redirect('/signin'); //is user is not aurthorised
    }

})


//for the expenses management....

//simple router

app.get('/myexpanses',userauth,async (req,res)=>{

    let user  = await req.isAurthised;

    if(user)
    {
        return res.render('expenses',{
            allinfo : user
        })

    }else
    {
        return res.status(200).redirect('/signin'); //is user is not aurthorised
    }


})

app.listen(_port, () => {

    console.log(chalk.bgCyanBright.redBright(process.env.SUCCESS_MESSAGE));
})