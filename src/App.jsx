import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Chart from 'react-apexcharts'
const App = () => {
  const [chartData,setChartdata] = useState({})
  async function fetchData() {
    try{
      const result = await axios.get("https://checkinn.co/api/v1/int/requests")
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
     setChartdata({
      options: {
        chart: {
          id: 'apexchart-example'
        },
        xaxis: {
          categories: Object.keys(reqhotelcnt)
        },   
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
    </div>
  )
}

export default App