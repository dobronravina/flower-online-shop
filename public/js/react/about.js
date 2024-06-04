import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const About = () => {
  const [count, setCount] = useState(77345);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('London');
   const apiKey = '857fe79d1e7456e944b5a1d84ed4b422'; // Замініть на ваш реальний API ключ

  const yourOwnCitySign =  'Ваше місто';
  const [ownCity, setOwnCity] = useState('London');
  const cities = [yourOwnCitySign, 'London', 'Kyiv', 'Bonn'];
  const [style, setStyle] = useState({});

/*
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
      // Анімація: зміна розміру, повороту, кольору
      setStyle({
        transform: `rotate(${Math.random() * 20}deg) scale(${Math.random() * 0.5 + 0.75})`,
        color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);*/

  useEffect(() => {
    const fetchWeather = async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ua`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Не вдалося отримати дані погоди", error);
      }
    };

    fetchWeather();
  }, [city, apiKey]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
          .then(res => res.json())
          .then(result => {
              setOwnCity(result.name);
			  console.log("Geolocation is ", ownCity);
          });
      }, () => {
        console.log("Geolocation is not supported by this browser.");
      });
    }
  }, [apiKey, cities, city]);

  const handleCityChange = (event) => {
		if(event.target.value != yourOwnCitySign) {
			setCity(event.target.value);
		} else {
			setCity(event.target.value);
			setCity(ownCity);
		}
  };

  if (!weather) {
    return <p>Завантаження даних про погоду...</p>;
  }

  return (
    <div className="about-container">
      <h2>Про нас</h2>
 		<p>Ми є провідним магазином квітів, який обслуговує клієнтів з 2015 року. Ми пропонуємо широкий асортимент квітів та квіткових композицій для будь-яких подій.</p>
		<p>Наші клієнти цінують нашу якість та сервіс. Ми завжди раді новим замовленням та готові допомогти вам з вибором квітів.</p>
    <br></br>
<p>Обслуговано клієнтів з 2015 року:</p>
	<div className="counter" style={style}>
         {count}
      </div>
	  <br></br>
      <div>
        <h3>Погода у {city}</h3>
        <p>Температура: {weather.main.temp}°C</p>
        <p>Стан: {weather.weather[0].description}</p>
      </div>
      <select onChange={handleCityChange} value={city}>
        {cities.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
  	</select>
    </div>
  );
};

const container = document.getElementById('about-root');
const root = createRoot(container);
root.render(<About />);
