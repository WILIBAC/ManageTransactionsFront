import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const RealTimeComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7132/signalrhub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => console.log('Connected to SignalR Hub'))
      .catch(err => console.error('Error while establishing connection: ', err));

    connection.on('ReceiveTransaction', (description, amount) => {
      console.log('Received transaction:', description, amount); // Depuración
      const newMessage = { description, amount };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div>
      <h1>Real-Time Transactions</h1>
      <ul>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li key={index}>
              {message.description}: ${message.amount}
            </li>
          ))
        ) : (
          <li>No transactions yet.</li>
        )}
      </ul>
    </div>
  );
};

export default RealTimeComponent;
