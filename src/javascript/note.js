
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

