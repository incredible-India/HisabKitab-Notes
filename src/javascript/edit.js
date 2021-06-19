let addOne = document.getElementById('addone');
let insidethis = document.getElementsByClassName('addmore')[0];
let temp =0;
let applyBTN = document.getElementById('apply');


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
  
    
 
   



})