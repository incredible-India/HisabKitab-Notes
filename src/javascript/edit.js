let addOne = document.getElementById('addone');
let insidethis = document.getElementsByClassName('addmore')[0];
let temp =0;
let applyBTN = document.getElementById('apply');
let dateval =  document.getElementsByClassName('dt')[0];

addOne.addEventListener('click', (event=>{

    let newDiv = document.createElement('div')
    newDiv.setAttribute('class', 'container inputgrps');


    newDiv.innerHTML += `<div class='jk rmv${++temp}'>
   <input   type="text" class='form-control tit ed ct' style="margin:10px; background : wheat;">
   <input type="number" class='form-control amm ct' style="margin:10px; background : wheat;"> <span class='cut' id = 'rmv${temp}'>&times</span>
    </div>`

    
    insidethis.appendChild(newDiv)

    //for removing the creted box
    Array.from(document.getElementsByClassName('cut')).forEach(e=>{

        e.onclick = (event)=>{
            
            document.getElementsByClassName(e.id)[0].remove();
        }

    })
    
}))


let theForm = document.forms[0];


applyBTN.addEventListener('click',(event)=>{

    event.preventDefault();

    let titleO = document.getElementsByClassName('tit');
    let ammountO = document.getElementsByClassName('amm');

     //first filtering the data 

     if(titleO.length == ammountO.length)

     {  for (let val = 0; val < titleO.length ; val++) 
        {
            if(!(titleO[val].value == "" && ammountO[val].value == ""))
            {
        
              if(ammountO[val].value == "")
              {
               ammountO[val].value = 0;
              }
              if(titleO[val].value == "")
              {
                titleO[val].value = "Unknown"
              } 
            }
        
        }


     }else
     {
         alert("something went wrong try after sometime")
     }
  
    
 
   //noe storing the data 

   let editedData = new Object();


     editedData.date = dateval.value; //edited date this is

    //  editedData.totalItem = titleO.length; //totle itme this is

     let temparr = dateval.value.split("/");

     
     editedData.dd = parseInt(temparr[0]); //this is the date
     editedData.mm = parseInt(temparr[1]);// this is the month
     editedData.yy = parseInt(temparr[2]); // this is the year
     
     temparr = null;


     let ANtempArr = new Array();
     let items = 0;
     let totalAmmount = 0;

     for(i=0 ; i< ammountO.length ;i++)
     {
            if(titleO[i].value == "" && ammountO[i].value == ""){
               
                continue;
            }
            ++items;
        let tempOBJ = new Object();
        tempOBJ.title = titleO[i].value;
        tempOBJ.ammount = ammountO[i].value;
        totalAmmount += parseInt(ammountO[i].value);
      
       ANtempArr[i] = tempOBJ;

       tempOBJ = null;

     }
     editedData.totalItem = items;//this is the total items
     editedData.totalAmmount = totalAmmount; //this is the total ammount 
     editedData.data = ANtempArr;

     ANtempArr = null; // free it

     let Confirmation = confirm(`Total Ammount = ${editedData.totalAmmount} \n Total Item is ${editedData.totalItem} \n Date : ${editedData.date}\n Do you want save your Data ?` )
     //return true false

     if(Confirmation)
     {

        document.getElementsByClassName('mkover')[0].innerHTML = `

        <textarea name="editedData" class='form-control' cols="30" rows="1" id='mks'></textarea>
        
        `
        
        document.getElementById('mks').value= JSON.stringify(editedData);
        editedData = null;
        document.forms[0].submit();
     }
})