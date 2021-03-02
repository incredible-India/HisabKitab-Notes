
// console.log(document.getElementsByTagName('textarea')[0].value.length);
document.getElementById('saveit').addEventListener('click',function(event){

  let noteContent = document.getElementsByTagName('textarea')[0].value;
    // console.log(document.getElementsByTagName('textarea')[0].value);

    if(noteContent.length <= 1){
      
    

        alert("Note s Content Can`t be blank")

        return ;
    }
    else
    {
      
        document.forms[0].submit();
    }


})

//now we need to fetch the api 


fetch('http://localhost:80/showNotes/for/fetching')

.then(data =>{

    return data.json()

}
.then(finaldata =>
    {
    return finaldata
  })