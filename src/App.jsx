import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Chart from 'react-apexcharts'
const App = () => {
  const [data,setData] = useState(null)
  const [chartData,setChartdata] = useState({})
  async function fetchData() {
    try{
      const result = await axios.get("https://checkinn.co/api/v1/int/requests")
      setData(result.data)
      console.log(result)
      const reqhotelcnt = {};
      result.data.requests.forEach(req => {
      const hotelName = req.hotel.name
      if(reqhotelcnt[hotelName])
      {
        reqhotelcnt[hotelName]++;
      }
      else{
        reqhotelcnt[hotelName] = 1;
      }
     })
     let dataMax = Math.max(...Object.values(reqhotelcnt));
     if(dataMax%2!==0)
        dataMax+=1;
     setChartdata({
      options: {
        chart: {
          id: 'apexchart-example'
        },
        xaxis: {
          categories: Object.keys(reqhotelcnt)
        },
        yaxis: {
          min: 0,
          max: dataMax,
          tickAmount:4, 
          labels: {
            formatter: function (val) {
              return Math.floor(val);
            }
          }
        }
      },
      series: [{
        name: 'requests',
        data: Object.keys(reqhotelcnt).map(hotelName => reqhotelcnt[hotelName])
      }]
    })
      
    }
    catch(error){
      console.error("error fetching the data->",error)
    
    }
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <div className='chart_container'>
      <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <h4>Requests per Hotel</h4>
      </div>
      {chartData && chartData.series && (
        <Chart
        options={chartData.options}
        series={chartData.series}
        type='line'
      />
      )}
      <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
        <h4>Total requests:{data && data.requests.length}</h4>
      </div>
      <span>
        List of <p style={{fontStyle:'italic',display:'inline'}}>unique</p> department names across all Hotels: 
        {data && Array.from(new Set(data.requests.map((e) => e.desk.name))).map((name, index) => (
          <span key={index}>{name} </span>
        ))}
      </span>

    </div>
  )
}

export default App