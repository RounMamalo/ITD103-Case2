import React, { useState, useEffect } from 'react';
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

function Report() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://192.168.1.23:3000/get-data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
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

    const chartData = {
        labels: data.map(item => formatDate(item.time)),
        datasets: [
            {
                label: 'Temperature',
                data: data.map(item => item.temperature),
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                tension: 0.2,
                fill: true,
            },
            {
                label: 'Humidity',
                data: data.map(item => item.humidity),
                borderColor: 'green',
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                tension: 0.2,
                fill: true,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: 'Segoe UI',
                        color: '#222260'
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                bodyFont: {
                    family: 'Segoe UI',
                    color: '#222260'
                },
                titleFont: {
                    family: 'Segoe UI',
                    color: '#222260'
                },
            },
        },
        scales: {
            x: {
                display: true,
                ticks: {
                    font: {
                        family: 'Segoe UI',
                        color: '#222260'
                    }
                }
            },
            y: {
                display: true,
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Segoe UI',
                        color: '#222260'
                    }
                }
            }
        }
    };

    return (
        <ReportStyled>
            <div className="header">
                <h2>Analytics</h2>
                <small>Track your temperature and humidity over time.</small>
            </div>
            <Line options={options} data={chartData} />
        </ReportStyled>
    );
}

const ReportStyled = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #222260; 

    .header {
        text-align: left; /* Aligns the text to the left */
        margin-bottom: 1rem;

        h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: bold;
            color: #222260;
        }

        small {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #222260;
        }
    }
`;

export default Report;
