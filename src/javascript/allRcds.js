

let DarkMode = document.getElementsByClassName('darks')[0]; //for making the webpage in darkmode
let username = document.getElementsByClassName('username')[0]; //user name in navigation bar
let errorAlert = document.getElementsByClassName('alert')[0]; //this is the alert box default it is hide
let tableDTA = document.getElementById('mainTable'); //table in the web page
let firstTable = document.getElementsByClassName('first_T_HEAD')[0]; //inseide the above table
let tableBODY = document.getElementsByClassName('first_T_Body')[0]; //inside the table body
let showTable = document.getElementsByClassName('show')[0]; //table + heading last one week
let NoRcds = document.getElementsByClassName('show_hide')[0]; //for no records
// event for the dark and the light mode  
DarkMode.onclick = function (event) {
  //for making the webpage in darkmode
  document.body.classList.toggle('dark');
  tableDTA.classList.toggle('table-dark');
  if (document.body.className == "dark")
    DarkMode.innerText = "Light Mode"
  else
    DarkMode.innerText = "Dark Mode"

}

/*fetching the api for getting the the data from server side */

// function give data from server side in the form of promise 
async function fetchingApi() {
  let ApiDTA = await fetch('http://localhost:80/1bfsde1254854ssedwdffefvg5415ffef/123f5d56e871d54s5d45w/2de5656rdfefefef');

  let finalData = ApiDTA.json();

  return finalData;

}

//changing the user name 
fetchingApi().then(CDATA => {

  if (CDATA.status == true) {

  
    //showing the username form the database 
    username.innerText = CDATA.data.name;

    let lengthOfTotalRecords = CDATA.data.allrecords.length;
    //showing the data in the table 

    if (lengthOfTotalRecords == 0) {

      showTable.style.display = "none";//hiding the table
      NoRcds.style.display = "block";//showing the image
      firstTable.innerHTML = `
            
        <tr>

        <th scope="col" colspan="3><span class="c">N</span>o Records found yet !</th>
      
    </thead>   
        
        `


    } else if (lengthOfTotalRecords > 8) {


     Countit(CDATA,lengthOfTotalRecords);
     

      
      showTable.style.display = "block";//hiding the table
      NoRcds.style.display = "none";//showing the image
    
      for (let i = 1; i < 8; i++) {

        //inserting the data in the table
        firstTable.innerHTML = `
            
            <tr>
    
            <th scope="col"><span class="c">D</span>ate</th>
            <th scope="col"><span class="c">T</span>otal <span class="c">E</span>xpanses</th>
            <th scope="col"><span class="c">I</span>tems</th>
            <th scope="col"><span class="c">O</span>ptions</th>
          </tr>
        </thead>   
            
            `

        tableBODY.innerHTML += `
            
            <tr>
     
            <th>${CDATA.data.allrecords[(lengthOfTotalRecords)-i].date}</th>
            <th>${CDATA.data.allrecords[(lengthOfTotalRecords)-i].totalAmmount}</th>
            <th>${CDATA.data.allrecords[(lengthOfTotalRecords)-i].totalItem}</th>
            <th><a href="/myexpanses/read/${CDATA.data.allrecords[i].date}">View</a> / <a href="myexpanses/edit/${CDATA.data.allrecords[i].date}">Edit</a> / <a href="myexpanses/delete/${CDATA.data.allrecords[i].date}">Delete</a></th>
          </tr>
            
            `
        


      }
  

   

    } else {

      Countit(CDATA,lengthOfTotalRecords);
    
      showTable.style.display = "block";//hiding the table
      NoRcds.style.display = "none";//showing the image
      for (let i = (lengthOfTotalRecords - 1); i >= 0; i--) {



        //inserting the data in the table
        firstTable.innerHTML = `
            
            <tr>
    
            <th scope="col"><span class="c">D</span>ate</th>
            <th scope="col"><span class="c">T</span>otal <span class="c">E</span>xpanses</th>
            <th scope="col"><span class="c">I</span>tems</th>
            <th scope="col"><span class="c">O</span>ptions</th>
          </tr>
        </thead>   
            
            `

        tableBODY.innerHTML += `
            
            <tr>
     
            <th>${CDATA.data.allrecords[i].date}</th>
            <th>${CDATA.data.allrecords[i].totalAmmount}</th>
            <th>${CDATA.data.allrecords[i].totalItem}</th>
            <th><a href="myexpanses/read/${CDATA.data.allrecords[i].date}">View</a> / <a href="myexpanses/edit/${CDATA.data.allrecords[i].date}">Edit</a> / <a href="myexpanses/delete/${CDATA.data.allrecords[i].date}">Delete</a> </th>
          </tr>
            
            `


      }
    }

  } else {
    alert('error in loading please try again...');
  }
})

//if any error get we will  show the error to the client
fetchingApi().catch(error => {
  console.log(error);
  //in alert box we will show the error
  errorAlert.innerText = `Sorry try again latar ${error}`;
  errorAlert.style.display = "block";

  setTimeout(() => {
    errorAlert.style.display = "none";
  }, 6000);

})

//this is the graph for showing the last weeak data

function showGRAPH(dataArray,DD) {{
  
google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {

    width: 400, height: 220,
    max : 2000,min : 0,
    greenFrom : 150, greenTo : 950,
    redFrom: 950, redTo: 1500,
    yellowFrom:1500, yellowTo: 2000,
    minorTicks: 5
   
  };


  var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

  // chart.draw(data, options);


    data.setValue(0, 1, DD);
    chart.draw(data, options);

}
}}

//for the weekly chart
function showGRAPHWW(dataArray,WW) {{
  
  google.charts.load('current', {'packages':['gauge']});
  google.charts.setOnLoadCallback(drawChart);
  
  function drawChart() {
  
    var data = google.visualization.arrayToDataTable(dataArray);
  
    var options = {
      
      width: 400, height: 220,
      max : 8000,min : 0,
      greenFrom : 1500, greenTo : 3500,
      redFrom: 3500, redTo: 5500,
      yellowFrom:5500, yellowTo: 8000,
      minorTicks: 5
    };
  
  
    var chart = new google.visualization.Gauge(document.getElementById('chart_div_WW'));
  
    // chart.draw(data, options);
  
  
      data.setValue(0, 1, WW);
      chart.draw(data, options);
  
  }
  }}


  //for the monthly

function showGRAPHMM(dataArray,MM ){{
  
  google.charts.load('current', {'packages':['gauge']});
  google.charts.setOnLoadCallback(drawChart);
  
  function drawChart() {
  
    var data = google.visualization.arrayToDataTable(dataArray);
  
    var options = {
      
      width: 400, height: 220,
      max : 30000,min : 0,
      greenFrom : 2000, greenTo : 8000,
      redFrom: 8000, redTo: 15000,
      yellowFrom:15000, yellowTo: 30000,
      minorTicks: 5
    };
  
  
    var chart = new google.visualization.Gauge(document.getElementById('chart_div_MM'));
  
    // chart.draw(data, options);
  
  
      data.setValue(0, 1, MM);
      chart.draw(data, options);
  
  }
  }}
//for the yearly chart
function showGRAPHYY(dataArray,YY ){{
  
  google.charts.load('current', {'packages':['gauge']});
  google.charts.setOnLoadCallback(drawChart);
  
  function drawChart() {
  
    var data = google.visualization.arrayToDataTable(dataArray);
  
    var options = {
      
      width: 400, height: 220,
      max : 200000,min : 0,
      greenFrom : 50000, greenTo : 100000,
      redFrom: 100000, redTo: 150000,
      yellowFrom:150000, yellowTo: 200000,
      minorTicks: 5
    };
  
  
    var chart = new google.visualization.Gauge(document.getElementById('chart_div_YY'));
  
    // chart.draw(data, options);
  
  
      data.setValue(0, 1, YY);
      chart.draw(data, options);
  
  }
  }}



//*******************************************************/
//function for calculating the total Expanses

function Countit(userDATA,lengthOfDAT){
 let date =  new Date();
 let countMM = 0 ;  // monthly records
 let countYY = 0 ; // yearly records
 let countDD = 0 ;// date records
 let countWW = 0 ; // weeak records

 
for(let i=1; i<=lengthOfDAT ; i++)
{

  if(i <= 7)
  {
    countWW = countWW + userDATA.data.allrecords[lengthOfDAT - i].totalAmmount;
  }

  if(i <= 30)
  {
    countMM =countMM + userDATA.data.allrecords[lengthOfDAT - i].totalAmmount;
  }
  if(i <= 365)
  {
    countYY = countYY + userDATA.data.allrecords[lengthOfDAT - i].totalAmmount;
  }

  if(date.getDate() == userDATA.data.expanses.dd && date.getMonth() == userDATA.data.expanses.mm && date.getFullYear() == userDATA.data.expanses.yy)
  {

    countDD = userDATA.data.expanses.totalAmmount;

  }else
  {
    countDD = 0;
  }


}

showGRAPH([['Label', 'Value'],
['Today', countDD]
])

showGRAPHWW([['Label', 'Value'],
['Weekly', countWW]
])

showGRAPHMM([['Label', 'Value'],
['Monthly', countMM]
])

showGRAPHYY([['Label', 'Value'],
['Yearly', countYY]
])

return [countDD,countWW,countMM,countYY];


}


