

let item = document.getElementsByClassName('item')[0];
let ammount = document.getElementsByClassName('ammount')[0];
let tableData = document.getElementsByClassName('inside')[0];
var dataAmmout = [];

var title =[];


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


fetch('http://localhost:80/myexpanses/saverecords/9bf1sath4bar14a')
.then(data => data.json())
.then(final => {

    tableData.innerHTML=""

   



    item.innerText = `->${final.totalItem}`;

    ammount.innerText = `->${final.totalAmmount}`

    let j=0;
    
    for(i in final.data) {

        dataAmmout[i] = final.data[i].ammount;

        title[i] = final.data[i].title;

      

        tableData.innerHTML += `

        <tr>
        <th scope="row">${++j}</th>
        <th>${final.data[i].title}</th>
        <th>${final.data[i].ammount}</th>
     
      </tr>
        `
    }

    chartData("bar",dataAmmout,title);

})

let chartType = document.getElementsByTagName('select')[0];

chartType.onchange = ()=>{

   
 Array.from(document.getElementsByTagName('canvas')).forEach(element=>{

     element.remove();
 })


    document.getElementsByClassName('cft')[0].innerHTML =

    `
    <canvas id="myChart" width="400" height="350"></canvas>
    
    `

    chartData(chartType.value,dataAmmout,title);


}