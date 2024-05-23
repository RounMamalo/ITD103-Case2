import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function ViewData() {
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

    return (
        <ViewDataStyled>
            <h2>Temperature and Humidity Data</h2>
            <div className="table-responsive">
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
        </ViewDataStyled>
    );
}

const ViewDataStyled = styled.div`
    background-color: #ffffff; 
    padding: 20px;
    border-radius: 8px;
    font-family: 'Segoe UI', sans-serif;

    h2 {
        margin-top: 1rem;
        margin-left: 1rem;
        color: #222260;
        margin-bottom: 16px;
        font-size: 1.5rem;
    }

    .table-responsive {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;

        th, td {
            padding: 12px 16px;
            text-align: left;
            font-family: 'Segoe UI', sans-serif;
            border: none; 
        }

        thead th {
            color: #222260;
            font-weight: bold;
            padding: 10px;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .amount {
            font-weight: bold;
            &.positive {
                color: green;
            }
            &.negative {
                color: red;
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

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        tr:hover {
            background-color: #f1f1f1;
        }
    }
`;

export default ViewData;
