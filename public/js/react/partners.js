import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const Partners = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date()); // Оновлюємо час кожну секунду
    }, 1000);

    return () => clearInterval(timerId); // Очищуємо таймер при демонтажі компоненту
  }, []);

  return (
    <div className="partners-container" style={{ position: 'relative', textAlign: 'center' }}>
      <img src="/images/partner.jpg" alt="Жінка доглядає за трояндами" className="partner-image" />
      <h1 style={{
        position: 'absolute', 
        top: '80%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        color: 'white', 
        fontSize: '80px',
        fontWeight: 'bold',  // Зробити текст жирнішим
        WebkitTextStroke: '4px green'  // Зелений обідок навколо тексту
      }}>
        {currentTime.toLocaleTimeString()} {/* Відображаємо поточний час */}
      </h1>
    </div>
  );
};


export default Partners;


const container = document.getElementById('partners-root');
const root = createRoot(container);
root.render(<Partners />);
