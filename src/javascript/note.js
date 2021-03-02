
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

  let color = ["info","dark","primary","light","secondary","warning","danger"]

  let k=0;
  let p=1;

    fetch('http://localhost/showNotes/for/fetching')

    .then(function (data){

        return data.json()

    }).then(function(finalData){
  
         let mainDIV = document.getElementsByClassName('cards')[0];

         for (i in finalData.notes) {

          
         
            
                ++k;
            

                if(k>7)
                {
                    k=0;
                }
                if(k==3)
                {
                    p=1
                }
                if(k==1)
                {
                    p=3
                }
               
                
                mainDIV.innerHTML += `
                <div class="alllnotes">
                <div class="card text-${color[p]} bg-${color[k]} mb-3" style="max-width: 18rem;">
                <div class="card-header">My Notes</div>
                <div class="card-body">
                  <h5 class="card-title">${finalData.notes[i].date}</h5>
                  <p class="card-text">${finalData.notes[i].notes}.</p>
                </div>
                <div class="card-footer">
                <a class="btn btn-${color[k]}" href="/delete/thisNote/${finalData.notes[i].uniqueNumber}"> Delete It </a>
                </div>
              </div>
                </div>`

         }

        

    })