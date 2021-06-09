let title =  document.getElementsByClassName('titles');
let ammounts = document.getElementsByClassName('ammounts');
let ArrayOfTitle = new Array();
let labels = new Array();
let ArrayOfAmmount = new Array();


Array.from(ammounts).forEach(e=>{
   
 ArrayOfAmmount =   ArrayOfAmmount.concat(e.innerText);
})

Array.from(title).forEach(e=>{
   ArrayOfTitle = ArrayOfTitle.concat(e.innerText);
})



chartData("bar",ArrayOfAmmount,ArrayOfTitle);

function chartData(chartType,data,labels)
{
    let   ctx = document.getElementById('myChart').getContext('2d');

  myChart = new Chart(ctx, {
    type: chartType,
    data: {
        labels: labels,
        datasets: [{
            label: '# items',
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {

        responsive: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}
////////////////////////////////////////////////////

let chartType = document.getElementsByTagName('select')[0];

chartType.onchange = ()=>{

   
 Array.from(document.getElementsByTagName('canvas')).forEach(element=>{

     element.remove();
 })


    document.getElementsByClassName('cft')[0].innerHTML =

    `
    <canvas id="myChart" width="400" height="350"></canvas>
    
    `

    chartData(chartType.value,ArrayOfAmmount,ArrayOfTitle);


}