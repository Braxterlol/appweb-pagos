import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const wsRef = useRef(null);

  useEffect(() => {
    if (!wsRef.current) {
      const socket = new WebSocket('ws://localhost:8080');


      socket.onopen = () => {
        console.log('Conexión WebSocket abierta');
        wsRef.current = socket; 
      };


      socket.onmessage = (event) => {
        const message = event.data;
        setPaymentStatus(message);
      };

      socket.onerror = (error) => {
        console.error('Error en WebSocket:', error);

      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, []);

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/pagos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), 
      });
  
      if (response.ok) {
        console.log('Pago exitoso');
      } else {
        console.error('Error al procesar el pago:', response.statusText);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud de pago:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pagos</h1>
        <button onClick={handleButtonClick}>Realizar Pago</button>
        {paymentStatus && <p>Estado del Pago: {paymentStatus}</p>}
      </header>
    </div>
  );
};

export default App;
