
let date = new Date()

document.getElementsByClassName('dateinfo')[0].innerHTML =`<h3 class = "bg-light" >
${date.getDate()}\\${date.getMonth()}\\${date.getUTCFullYear()}</h3>

`


let AddoneButton = document.getElementsByClassName('addone')[0];

let i=0;

AddoneButton.addEventListener('click',(event)=>{

    //this will add the one input

    document.getElementsByClassName('inputbox')[0].innerHTML += `
    
    
    <div class="input-group mb-3 ${i++}">
  <input type="text" class="form-control" placeholder="Username" aria-label="Title of Expenses">
  <span class="input-group-text removeIt"> - </span>
  <input type="text" class="form-control" placeholder="Ammount" aria-label="Server">
  </div>

  `


})


