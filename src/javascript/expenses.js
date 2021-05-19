let date = new Date()

document.getElementsByClassName('dateinfo')[0].innerHTML = `<h3 style="text-align: right;">
${date.getDate()}\\${date.getMonth()}\\<span class="n">${date.getUTCFullYear()}</span></h3>

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
<input type="text" class="form-control" placeholder="Title of Expenses" aria-label="Title of Expenses" id="title${i}" >
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


  let Expnasese = new Object;

  for (let val = 0; val < document.getElementsByClassName('ctpp').length; val++) {

    console.log( document.getElementsByClassName('ctpp')[val].value);


  }




})