
document.getElementById('submitIt').addEventListener('click',(event)=>{
    let mynotes = document.getElementsByTagName('textarea')[0].value

    if(mynotes != "")
    {
        document.forms[0].submit();
    }else
    {
        alert("Cannot save Blank Notes..")
    }
})
