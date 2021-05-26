

var ctx = document.getElementById('myChart').getContext('2d');
let item = document.getElementsByClassName('item')[0];
let ammount = document.getElementsByClassName('ammount')[0];
let tableData = document.getElementsByClassName('inside')[0];



function chartData(chartType,data,labels,colordata)
{
    
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

    let dataAmmout = [];

    let title =[];



    item.innerText = `->${final.totalItme}`;

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