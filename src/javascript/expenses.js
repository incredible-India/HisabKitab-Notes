
let TodayDate = new Date()
var Expnasese = new Object;
Expnasese.data = new Array;




document.getElementsByClassName('dateinfo')[0].innerHTML = `<h3 style="text-align: right;">
${TodayDate.getDate()}\\${TodayDate.getMonth() + 1}\\<span class="n">${TodayDate.getUTCFullYear()}</span></h3>

<h3 title = "total expanses" style="text-align: left;"> <span class = "n">T</span>otal : <span class="numberCount">1</span></h3> </h3>

`


let AddoneButton = document.getElementsByClassName('addone')[0];
let claculateData = document.getElementsByClassName('calData')[0];
let i = 0;

AddoneButton.addEventListener('click', (event) => {

  //this will add the one input

  //   document.getElementsByClassName('inputgrps')[0].innerHTML += `

  //   <div class="container inputbox">
  //   <div class="input-group mb-3 remove${i++}">
  // <input type="text" class="form-control" placeholder="Title of Expenses" aria-label="Title of Expenses" id="title${i}" autofocus>
  // <span class="input-group-text remove${i} rmv"> - </span>
  // <input type="text" class="form-control" placeholder="Ammount" aria-label="Server">
  // </div>
  // </div>

  // `
  //start from here//
  let newDiv = document.createElement('div')
  newDiv.setAttribute('class', 'container inputgrps');

  newDiv.innerHTML += `<div class="container inputbox">
<div class="input-group mb-3 remove${i++}">
<input type="text" class="form-control title" placeholder="Title of Expenses" aria-label="Title of Expenses" id="title${i}" >
<span class="input-group-text remove${i} rmv"> - </span>
<input type="number" class="form-control ctpp" placeholder="Ammount" aria-label="Server">
</div>
</div>`

  document.getElementsByClassName('allboxes')[0].appendChild(newDiv);
  document.getElementsByClassName('numberCount')[0].innerText = document.getElementsByClassName('ctpp').length; //it will increase the value of number of expanses
  //////////////////////////////////////////////////////////

  //for removing the things
  Array.from(document.getElementsByClassName('rmv')).forEach(ele => {

    ele.addEventListener('click', (event) => {


      ele.parentElement.remove(); //this will remove the element
      document.getElementsByClassName('numberCount')[0].innerText = document.getElementsByClassName('ctpp').length;



    })

  })




})



//for the calculator in modal

let buttonOfCALC = document.getElementsByClassName('doCalulation')


buttonOfCALC[0].addEventListener('click', event => {

  let givenData = document.getElementsByClassName('calIT'); //textarea class

  try {

    let FinalData = eval(givenData[0].value);

    givenData[0].value = FinalData;

  } catch (error) {
    givenData[0].value = "Incorrect Expression"
  }
})


//for the clulating the the all expanses....

claculateData.addEventListener('click', event => {



  let AmmountOfExpanse = document.getElementsByClassName('ctpp');
  let TitleOfExpanses = document.getElementsByClassName('title');
  let TotalSum =0;
  let countIt =0; //in the table it is the serial number


  document.getElementsByClassName('insideThis')[0].innerHTML = ""
  for (let val = 0; val < document.getElementsByClassName('ctpp').length; val++) {

   
    if(!(AmmountOfExpanse[val].value == "" && TitleOfExpanses[val].value == ""))
    {

      if(AmmountOfExpanse[val].value == "")
      {
        AmmountOfExpanse[val].value = 0;
      }
      if(TitleOfExpanses[val].value == "")
      {
        TitleOfExpanses[val].value = "Unknown"
      } 
     
        //now we will make the table And fill the data

        document.getElementsByClassName('insideThis')[0].innerHTML +=`
             <tr>
          <th>${++countIt}</th>
          <td scope="row">${TitleOfExpanses[val].value}</td>
           <td scope="row">${AmmountOfExpanse[val].value}</td>
     
            </tr>

        
        `
      TotalSum += parseFloat(AmmountOfExpanse[val].value);

      //saving all the data in the object  and this will send to the database
      
    
    
     //adding the data in the array
      Expnasese.data[val]= {  title : TitleOfExpanses[val].value , ammount :parseFloat(AmmountOfExpanse[val].value)}


      }

 


  }
    
  

  Expnasese.date =  TodayDate.getDate()+ '/'+(TodayDate.getMonth() + 1)+'/'+TodayDate.getUTCFullYear()
  Expnasese.totalItem = countIt;
  Expnasese.totalAmmount = TotalSum;
  Expnasese.dd = TodayDate.getDate();
  Expnasese.mm =(TodayDate.getMonth() + 1);
  Expnasese.yy =TodayDate.getUTCFullYear();


  document.getElementsByClassName('insideThis')[0].innerHTML += `
  <tr>
  <th scope="row"><span class="n" style="font-family:new;"> Total Item </span>: ${countIt}</th>
 
   <th colspan="2"><span class="n" style="font-family : new;">Total Ammount</span> : ${TotalSum}</th>

    </tr>
  `

           
    if(TotalSum != 0)
    {
      document.getElementsByClassName('saveDBS')[0].style.display = "flex"
    }

    ///now we will send the data to our server


  

})


document.getElementsByClassName('sendData')[0].addEventListener('click',(event)=>{


try {

  if("WebSocket" in window)
  {

    let ws = io('http://localhost:80'); //first we connect to the server 
    try {
      ws.emit('data',JSON.stringify({'expens':Expnasese,status :true}));//sending the data to the server
     
    } catch (error) {
      alert('We could not send the data')
    }
   
    ws.on('disconnect',()=>{
      alert('Server Crashed with unexpected error');
      location.reload();
    })

    ws.on('closeit',type=>{ //after receiving the data from client side ,server will send the response
      if(type)
      {
        location.href='/myexpanses/RecordToday/';
      }else
      {
        alert('Server responded with 403')
      }
    })


    
  }

  
  
} catch (error) {

  alert(error)


}

  

  


})