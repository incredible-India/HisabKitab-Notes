
let date = new Date()

document.getElementsByClassName('dateinfo')[0].innerHTML =`<h3 class = "bg-light" >
${date.getDate()}\\${date.getMonth()}\\${date.getUTCFullYear()}</h3>

`


let AddoneButton = document.getElementsByClassName('addone')[0];

let i=0;

AddoneButton.addEventListener('click',(event)=>{

    //this will add the one input
   
    document.getElementsByClassName('inputxx')[0].innerHTML += `
    
    <div class="container inputbox">
    <div class="input-group mb-3 remove${i++}">
  <input type="text" class="form-control" placeholder="Title of Expenses" aria-label="Title of Expenses" id="title${i}">
  <span class="input-group-text remove${i} rmv"> - </span>
  <input type="text" class="form-control" placeholder="Ammount" aria-label="Server">
  </div>
  </div>

  `
//start from here//




//for removing the things
  Array.from(document.getElementsByClassName('rmv')).forEach(ele=>{

    ele.addEventListener('click',(event)=>{

      ele.parentElement.remove();//this will remove the element
     // ele.parentElement.remove();

    })

  })


  

})



//for the calculator in modal

let buttonOfCALC = document.getElementsByClassName('doCalulation')


buttonOfCALC[0].addEventListener('click',event=>{

        let givenData = document.getElementsByClassName('calIT'); //textarea class

        try {

          let FinalData = eval(givenData[0].value);

          givenData[0].value = FinalData;
          
        } catch (error) {
          givenData[0].value = "Incorrect Expression"
        }
})