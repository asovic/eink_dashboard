import React from 'react';
import './App.css';
import Header from './components/Header';
import BatteryStatus from './components/BatteryStatus';
import NewsTicker from './components/NewsTicker';
import WeatherCurrent from './components/WeatherCurrent';
import WeatherForecast from './components/WeatherForecast';
import { useWeather } from './hooks/useWeather';

function App() {
  const { currentWeather, forecast } = useWeather();

  return (
    <div className="dashboard-container">
      <Header />
      <BatteryStatus />

      <NewsTicker />

      <div className="weather-container">
        <div className="location-label">
          <span className="location-text">Ljubljana</span>
        </div>

        <WeatherCurrent data={currentWeather} />

        <WeatherForecast forecast={forecast} />
      </div>
    </div>
  );
}

export default App;
