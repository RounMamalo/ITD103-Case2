import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import Chart from '../Chart/Chart';
import GaugeChart from 'react-gauge-chart';

const socket = io('http://localhost:3000');

function Dashboard() {
  const [data, setData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    fetch('http://192.168.1.23:3000/get-data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    socket.on('new-data', (newData) => {
      setData((prevData) => [...prevData, newData]);
    });

    return () => {
      socket.off('new-data');
    };
  }, []);

  const formatDate = (dateString) => {
    const options = {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const latestTemperature = data.length > 0 ? data[data.length - 1].temperature : 0;
  const latestHumidity = data.length > 0 ? data[data.length - 1].humidity : 0;

  const tempGaugeValue = latestTemperature / 50; // Assuming max temperature is 50 degrees Celsius
  const humidityGaugeValue = latestHumidity / 100; // Humidity is a percentage

  const maxTemperature = Math.max(...data.map(d => d.temperature), 0);
  const maxHumidity = Math.max(...data.map(d => d.humidity), 0);

  const maxTempGaugeValue = maxTemperature / 50; // Assuming max temperature is 50 degrees Celsius
  const maxHumidityGaugeValue = maxHumidity / 100;

  return (
    <DashboardStyled>
      <InnerLayout>
        <h2>Dashboard</h2>
        <p>{currentDate}</p>
        <div className="stats-con">
          <div>
            <h2>Temperature</h2>
            <GaugeChart id="latest-temp-gauge" nrOfLevels={30} colors={["#FF5F6D", "#FFC371"]} arcWidth={0.3} percent={tempGaugeValue} style={{ width: '60%', height: '60%' }} />
            <p>{latestTemperature}&deg;C</p>
          </div>
          <div>
            <h2>Humidity</h2>
            <GaugeChart id="latest-humidity-gauge" nrOfLevels={30} colors={["#5BC0EB", "#FDE74C"]} arcWidth={0.3} percent={humidityGaugeValue} style={{ width: '60%', height: '60%' }} />
            <p>{latestHumidity}%</p>
          </div>
        </div>
        <div className="gauge-con">
          <h2>Extremes</h2>
          <div className="gauge-row">
            <div className="gauge">
              <h3>Max Temperature</h3>
              <GaugeChart id="max-temp-gauge" nrOfLevels={30} colors={["#FF5F6D", "#FFC371"]} arcWidth={0.3} percent={maxTempGaugeValue} />
              <p>{maxTemperature}&deg;C</p>
            </div>
            <div className="gauge">
              <h3>Max Humidity</h3>
              <GaugeChart id="max-humidity-gauge" nrOfLevels={30} colors={["#5BC0EB", "#FDE74C"]} arcWidth={0.3} percent={maxHumidityGaugeValue} />
              <p>{maxHumidity}%</p>
            </div>
          </div>
        </div>
        <div className="chart-con">
          <h2>Analytics</h2>
          <small>Track your temperature and humidity over time.</small>
          <Chart data={data} />
        </div>
        <div className="history-con">
          <h2>Temperature and Humidity Data</h2>
          <table>
            <thead>
              <tr>
                <th>Temperature (&deg;C)</th>
                <th>Humidity (%)</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={index}>
                  <td>{record.temperature}</td>
                  <td>{record.humidity}</td>
                  <td>{formatDate(record.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background-color: #ffffff;
  padding: 20px;
  color: #222260; 

  .stats-con {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    margin-bottom: 1rem;

    > div {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin: 1rem 0;

      h2 {
        font-size: 1.2rem;
        color: #222260;
        margin-bottom: 0.5rem;
      }
      p {
        font-size: 2.4rem;
        font-weight: bold;
        margin: 0;
        color: #222260; 
      }
      small {
        font-size: 1rem;
        color: #222260; 
      }
    }
  }

  .chart-con {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    padding: 20px;
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #222260; 
    }

    small {
      font-size: 1rem;
      color: #222260;
    }
  }

  .gauge-con {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    padding: 20px;
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #222260; 
    }

    .gauge-row {
      display: flex;
      justify-content: space-around;
    }

    .gauge {
      display: flex;
      flex-direction: column;
      align-items: center;

      h3 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        color: #222260;
      }

      p {
        font-size: 1.5rem;
        font-weight: bold;
        margin-top: 1rem;
        color: #222260;
      }
    }
  }

  .history-con {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    padding: 20px;
    width: 100%;
    margin-top: 2rem;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #222260; 
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;

      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        color: #222260; 
      }

      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }

      tr:hover {
        background-color: #f1f1f1;
      }
    }
  }
`;

const InnerLayout = styled.div`
  padding: 0.2rem;
  color: #222260;
`;

export default Dashboard;
