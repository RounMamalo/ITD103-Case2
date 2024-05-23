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

function Chart() {
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
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                bodyFont: {
                    family: 'Segoe UI',
                },
                titleFont: {
                    family: 'Segoe UI',
                },
            },
        },
        scales: {
            x: {
                display: true,
                ticks: {
                    font: {
                        family: 'Segoe UI',
                    }
                }
            },
            y: {
                display: true,
                beginAtZero: true,
                ticks: {
                    font: {
                        family: 'Segoe UI',
                    }
                }
            }
        }
    };

    return (
        <ChartStyled>
            <Line options={options} data={chartData} />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: #FFFFFF;
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export default Chart;
