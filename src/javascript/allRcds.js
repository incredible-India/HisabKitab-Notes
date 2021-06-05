let DarkMode = document.getElementsByClassName('darks')[0];//for making the webpage in darkmode
let username =  document.getElementsByClassName('username')[0];



// event for the dark and the light mode  
DarkMode.onclick = function(event){
//for making the webpage in darkmode
    document.body.classList.toggle('dark');
    if(document.body.className == "dark")
    DarkMode.innerText = "Light Mode"
    else
    DarkMode.innerText = "Dark Mode"

}

/*fetching the api for getting the the data from server side */ 

// function give data from server side in the form of promise 
async function fetchingApi()
{  
      let  ApiDTA = await fetch('http://localhost:80/1bfsde1254854ssedwdffefvg5415ffef/123f5d56e871d54s5d45w/2de5656rdfefefef');

      let finalData = ApiDTA.json();

      return finalData;

}

//changing the user name 
fetchingApi().then(CDATA => {

   if(CDATA.status == true) {

       username.innerText = CDATA.data.name
   }
})

fetchingApi().catch(error => {
    console.log(error);
})



