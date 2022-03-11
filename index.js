/*This project is for the calculations of Expenses and making Notes 
Himanshu Kumar Sharma B.E 3rd Sem 
DOM : 27/02/2021 */

//requiring the important modules 
require('dotenv').config(); //dot env for reading the data from it
const express = require('express'); //for the creating router
const app = express();
const chalk = require('chalk'); //beautify the console window of terminal
const path = require('path'); // for the path files or folders
const morgan = require('morgan'); //for the debugging 
require('./database/dbsCon'); //for the conncetion of database
// const bodyParser = require('body-parser'); //for the parsing data from the url
const {
    check,
    validationResult
} = require('express-validator'); //it will check the form validation on server
const UserDBS = require('./model/user'); //user database 
const cookieParser = require('cookie-parser'); //for the cookies
const pug = require('pug'); //templates engine..
const userauth = require('./authentication/auth'); //user authentication 
const user = require('./model/user');
const { db } = require('./model/user');
const http = require('http').createServer(app); //creating http conncetion
const io = require('socket.io')(http, {
    cors: { //to avoiding the cors error
        "origin": "*"
    }
}); //web socket module



hostname = '0.0.0.0' //incase of error reomve this and last line in listen port
//giving the port number

const _port = process.env.PORT || 80; //this is the port number

//setting the pug templates engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "./views/"))

//using the middleware
app.use(express.static(path.join('./src'))) //tells about the satics files
app.use(morgan('dev')); //for the debugging
app.use(express.json()); //for parsing data in json formate
app.use(express.urlencoded({
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


app.get('/parctice', (req, res)=>{

    let a  = [ {data : "ram",   name : 1},{data : "ram",   name : 2},{data : "ram",   name : 3},{data : "ram",   name :4}]
    
    let c= 1;
    for(c in a )
    {  
        console.log(c in a);
        a[c] = 4;
        console.log(a);
    }

    res.send("To be continued");
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

    if (_user) {
        _user.notes = []
        _user.save();

        return res.redirect('/mynotes');

    } else {
        return res.status(200).redirect('/signin'); //is user is not aurthorised
    }

})


//for the expenses management....

//simple router

app.get('/myexpanses', userauth, async (req, res) => {

    let user = await req.isAurthised;




    if (user) {

        io.on('connection', socket => { //first we connect to our client
            console.log(chalk.redBright(("we are connectes to from webSocket")));

            socket.on('data', ClientData => { //client will send the info of expanses


                if (JSON.parse(ClientData).status) //we will parse that data
                {
                    // try {
                        user.expanses = JSON.parse(ClientData).expens; //saving the data in DBS
                        user.save();

                        let indexNumber =  user.allrecords.findIndex(e => (e.dd == user.expanses.dd && e.mm == user.expanses.mm && e.yy == user.expanses.yy)) 

                        if(indexNumber == -1){
                       
                           user.allrecords= user.allrecords.concat(user.expanses);
                           
                       
                        }else
                        {
                            let AnArray = user.allrecords;

                            AnArray[indexNumber] = user.expanses;

                        
                       
                            UserDBS.updateOne({_id : user._id},{allrecords : AnArray},(error,data) =>{
                                
                                if(error)
                                {
                                    console.log(error);

                                }else

                                {
                                    console.log(data);
                                }
                            });

                            AnArray =null;
                       
                       
                            
                        }      
                    
                
                   
                        
                     
            
                        

                           console.log(chalk.cyanBright("saved Info in DBS"));
                        socket.emit('closeit', true)

              

                } else {
                    throw new Error;
                }


            })
            
            ;

         
       
        })


       
        return res.render('expenses', {
            allinfo: user
        })



    } else {
        return res.status(200).redirect('/signin'); //if user is not aurthorised
    }


})





app.get('/myexpanses/saverecords/:__ApiKey', userauth, async (req, res) => {

    let rightUser = await req.isAurthised;

    let _APIKEY = process.env.API;

    let apiFromURL = req.params.__ApiKey;
  
    if (rightUser) {  //uaerAUTH                

        if (_APIKEY == apiFromURL) {//this will check apikey

            if (Object.keys(rightUser.expanses).length == 0) { //if user deleted the records or does not save it..
                return res.status(200).json({
                    status: 'false',
                    message: "no records found"
                })

            } else {

                return res.send(rightUser.expanses);

            }
        } else { //if apikey does not matched

            return res.status(404).json({
                status: "false",
                message: "incorrect apikey"
            });



        }


    } else {
        return res.status(200).redirect('/signin'); //if user is not aurthorised
    }

})


app.get('/myexpanses/RecordToday/', userauth, async (req, res) => {

    let userAuth = await req.isAurthised;

    if(userAuth)
    {

        return res.status(200).render('today',{
            allinfo: userAuth
        })


    }else
    {
        return res.status(200).redirect('/signin');
    }

})




//for the showing all the records routing

app.get('/allrecords',userauth, async (req, res) => {

 let isAurthised = await req.isAurthised;

 if(isAurthised)
{


    //this is the type of the content
    res.setHeader('Content-Type', 'text/html');
    res.status(200);
    res.sendFile(path.join(__dirname,"./src/html/",'allRcds.html'));


}else
{
    return res.status(200).redirect('/signin');

}


})
//this will send  user Allinfo

app.get('/check/1bfsde1254854ssedwdffefvg5415ffef/:key/2de5656rdfefefef',userauth, async (req, res) =>{


    let dataUser =  await req.isAurthised;//this user auth

    let apiKey =  req.params.key; //api key from the client

    console.log(apiKey);
    let OriginalKey = process.env.UserApiKey; //original api key from env file
    console.log(OriginalKey);

    if(dataUser) //check user auth 
    {
        if(apiKey == OriginalKey) //for matching the the main api keys to the client side api keys
        {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({status : true , data : dataUser});

        }else

        {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({status : false});
        }
        
    }else
    {
        return res.status(200).redirect('/signin');
    }


   


})




// for the crud operation 
app.get('/myexpanses/read/:dd/:mm/:yy',userauth,async (req, res)=>{

    let userAuth = await req.isAurthised;

    if(userAuth)
    {
        let RcdsD = req.params.dd;
        let RcdsM = req.params.mm;
        let RcdsY = req.params.yy;

        try {
            let thisRcds =  userAuth.allrecords.filter(e => (e.dd == RcdsD && e.mm == RcdsM && e.yy == RcdsY) )

            if(thisRcds.length == 0)
            {

                return res.send('<h1> No records found on this day ...</h1>');

            }
            else{
    
                return res.render('read',{
                    allinfo : thisRcds,
                    name : userAuth
                })
            }

        } catch (error) {
            
            return res.json({status: false,name : userAuth.name,message :null})

        }
  

    }else
    {

        return res.status(200).redirect('/signin');
    }






})



app.get('/myexpanses/delete/:dd/:mm/:yy',userauth,async(req,res) => {

    let useroth = await req.isAurthised;

    if(useroth)
    {
        let varyfied = useroth.allrecords.filter(e=>(e.dd == req.params.dd && e.mm == req.params.mm && e.yy == req.params.yy));

        if(varyfied.length == 0)
        {
            return res.status(200).send('<h1> no record found on this day.</h1>')
        }else
        {
            return res.status(200).render('dpass',{
                allinfo : useroth.name,
                dd : req.params.dd,//yehabhi
                mm : req.params.mm, //yeha pe sudhr
                yy: req.params.yy
                ,textmessage :  "Deleted",
                linkdata  :"/varify/deleting/"

            })
        }
         

    }else
    {
        
        return res.status(200).redirect('/signin');
    }
})


app.post('/varify/deleting/',userauth,[

    check('password').not().isEmpty().trim(),

    check('date').not().isEmpty().trim()

],async(req,res) =>{
    
   let useroth = await req.isAurthised; 

   if(useroth){


    const errorinPass = validationResult(req);

    if(!errorinPass.isEmpty()){ 

        return res.json(errorinPass);
    }


    let passwordURL = req.body.password;

    if(passwordURL == useroth.password)
    {

        let varifyOnce = useroth.allrecords.filter(e=> (e.date != String(req.body.date)));
   
        if(varifyOnce.length == 0 && useroth.allrecords.length != 1)
        {
            return res.status(200).send('<h1>No record found on this day ! &#x1f604</h1>')

        }else
        {
            try {
                UserDBS.findOneAndUpdate({_id : useroth._id},{allrecords : varifyOnce},(err,data)=>{

                    if(err){
                        return res.status(200).json(err);
                    }else
                    {
                        
                        return res.redirect('/allrecords')
                    }
                })

            } catch (error) {
                
                return res.status(200).send(error)
            }
             
         }

        
    }else
    {
        return res.status(200).send('<h1>incorrect password ! &#x1f604</h1>')
    }
  
}else
{
    return res.status(200).redirect('/signin');
}


})



//delete all records and the confirmation

app.get('/delete/allrecords', userauth, async (req, res)=>{

    let userdata = await req.isAurthised;

    if(userdata)
    {
        if(userdata.allrecords.length == 0)
        {
            res.status(200);
            res.setHeader('Content-Type', 'text/html');
            return res.send('<h1> Your Records Already Has Been Empty</h1>')
        }else
        {
            res.status(200);
            res.setHeader('Content-Type', 'text/html');
            res.render('cnfDel',{
            name : userdata.name1
            })
        }
     
        
    }else
    {
        return res.status(200).redirect('/signin');

    }


})


// after typing password delete all records 

app.post('/cnf/cnfdata/delete/all',userauth,[

    check('password').not().isEmpty().trim(),

],async(req, res)=>{

    dataof =  await req.isAurthised;

    const errorinPass = validationResult(req);

    if(!errorinPass.isEmpty()){ 

        return res.json(errorinPass);
    }

    if(dataof)
    {

        if(dataof.password == req.body.password){

            if(dataof.allrecords.length == 0)
        {
            res.status(200);
            res.setHeader('Content-Type', 'text/html');
            return res.send('<h1> Your Records Already Has Been Empty</h1>')
        }else

        {
             UserDBS.findOneAndUpdate({_id : dataof._id},{allrecords : []},(err,data)=>{
                 if(err)
                 {
                     return res.send(err)
                 }
                 console.log(data);
                 return res.redirect('/allrecords')
             })
        }


        }else
        {

            return res.status(200).send('<h1> Incorrect Password..</h1>')
        }



    }else
    {
        return res.status(200).redirect('/signin');
    }

})

//code done for the all records deletion
//for editing the data 

app.get('/myexpanses/edit/:dd/:mm/:yy',userauth,async (req,res)=>{

    let useroth = await req.isAurthised;

    if(useroth)
    {
        let varyfied = useroth.allrecords.filter(e=>(e.dd == req.params.dd && e.mm == req.params.mm && e.yy == req.params.yy));

        if(varyfied.length == 0)
        {
            return res.status(200).send('<h1> no record found on this day.</h1>')
        }else
        {
            return res.status(200).render('dpass',{
                allinfo : useroth.name,
                dd : req.params.dd,//yehabhi
                mm : req.params.mm, //yeha pe sudhr
                yy: req.params.yy,
                textmessage : "Edit",
                linkdata : "/varify/editing/"

            })
        }
         

    }else
    {
        
        return res.status(200).redirect('/signin');
    }
})



///varifying the password for the editing the data

app.post('/varify/editing/' , [

    check('password').not().isEmpty().trim(),

],
userauth,async (req,res)=>{

    let useroth = await req.isAurthised; 

    if(useroth){
 
 
     const errorinPass = validationResult(req);
 
     if(!errorinPass.isEmpty()){ 
 
         return res.json(errorinPass);
     }
 
 
     let passwordURL = req.body.password;
 
     if(passwordURL == useroth.password)
     {
 
         let varifyOnce = useroth.allrecords.filter(e=> (e.date == String(req.body.date)));
    
        

         if(varifyOnce.length == 0)
         {
             return res.status(200).send('<h1>No record found on this day ! &#x1f604</h1>')
 
         }else
         {
             try {
                
                return res.render('editdata',{
                    allinfo : useroth.name,
                    date : req.body.date,
                    today : new Date().toLocaleDateString(),
                    listdata : varifyOnce

                }) //start work from here
 
             } catch (error) {
                 
                 return res.status(200).send(error)
             }
              
          } 
 
         
     }else
     {
         return res.status(200).send('<h1>incorrect password ! &#x1f604</h1>')
     }
   
 }else
 {
     return res.status(200).redirect('/signin');
 }
 

})

//after editing the data final result and saving in dbs process will be done here 



app.post('/edited/redirecting/savinginDBS',[

    check('editedData').not().isEmpty().trim(),

],userauth,async (req, res)=>{


    let dataofuser  = await req.isAurthised;

    if(dataofuser)
    {
        const errorinPass = validationResult(req);
 
        if(!errorinPass.isEmpty()){ 
    
            return res.json(errorinPass);
        }


      let theDataFromClient = JSON.parse(req.body.editedData);

      if(theDataFromClient.dd)
      {
          
        if(dataofuser.allrecords.length != 0){

            let indexNumber  =  dataofuser.allrecords.findIndex(e => (e.dd== theDataFromClient.dd && e.mm == theDataFromClient.mm && e.yy == theDataFromClient.yy))

            if(indexNumber == -1){

                dataofuser.allrecords = dataofuser.allrecords.concat(theDataFromClient);  
                
            }else
            {
                dataofuser.allrecords[indexNumber] = theDataFromClient; 
            }



           UserDBS.findOneAndUpdate({_id : dataofuser._id},{allrecords : dataofuser.allrecords},(err,data)=>{

                if(err)
                {
                    return res.status(200).send(err)
                }

                res.setHeader('Content-Type','text/html');
                return res.status(200).redirect('/allrecords');

           })

        }else
        {
            return res.send('<h1> Empty Your Data  </h1>')

        }

      }else
      {
          return res.send('<h1> Sorry !!! Something went wrong </h1>')
      }

    }




})

/************************************************* */

// about page 

app.get('/about',(req,res)=>{

    res.status(200);
    res.setHeader('Content-Type','text/html');

    res.sendFile(path.join(__dirname,'./src/html/about.html'))

})



http.listen(_port,hostname, () => {

    console.log(chalk.bgCyanBright.redBright(process.env.SUCCESS_MESSAGE));
})


/*************************The End*****************************/