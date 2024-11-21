import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState('N/A');
  const [newsItems, setNewsItems] = useState([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  async function fetchCurrentWeather() {
    try {
      const response = await fetch(`/api/weather/current`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
    }
  }

  async function fetchWeatherForecast() {
    try {
      const response = await fetch(`/api/weather/forecast`);
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
    }
  }

  const fetchRssFeed = () => {
    fetch(`/api/rss-feed`)
      .then(response => response.text())
      .then(str => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, "text/xml");
        const items = xmlDoc.getElementsByTagName('item');
        const newsData = Array.from(items).map(item => ({
          title: item.getElementsByTagName('title')[0].textContent,
          description: item.getElementsByTagName('description')[0].textContent
        }));
        setNewsItems(newsData);
      })
      .catch(error => console.error('Error fetching RSS feed:', error));
  };

  useEffect(() => {
    updateDateTime();
    updateBatteryLevel();
    fetchRssFeed();
    fetchCurrentWeather();
    fetchWeatherForecast();
  }, []);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 30000); // Change news every 30 seconds

    return () => clearInterval(newsInterval);
  }, [newsItems]);

  useEffect(() => {
    fetchCurrentWeather();
    const weatherInterval = setInterval(fetchCurrentWeather, 30 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, []);

  useEffect(() => {
    fetchWeatherForecast();
    updateBatteryLevel();
    
    const forecastInterval = setInterval(fetchWeatherForecast, 3 * 60 * 60 * 1000);
    const batteryInterval = setInterval(updateBatteryLevel, 3 * 60 * 60 * 1000);
    return () => {
      clearInterval(forecastInterval);
      clearInterval(batteryInterval);
    };
  }, []);

  useEffect(() => {
    updateDateTime();
    const dateTimeInterval = setInterval(updateDateTime, 60 * 1000);

    return () => {
      clearInterval(dateTimeInterval);
    };
  }, []);

  const updateDateTime = () => {
    setCurrentDateTime(new Date());
  };

  const updateBatteryLevel = () => {
    if (typeof window !== 'undefined' && window.okular && typeof window.okular.BatteryLevel === 'number') {
      setBatteryLevel(`${window.okular.BatteryLevel}%`);
    } else {
      setBatteryLevel('N/A');
    }
  };

  const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}. @ ${hours}:${minutes}`;
  };

  return (
    <div className="v5_14">
      <div className="v5_15">
        <span className="v5_16">{formatDateTime(currentDateTime)}</span>
      </div>
      <div className="v5_17">
        <img src="v5_19.png" alt="Battery Icon" width="73" height="42" className="v5_19" />
        <span className="v5_18">{batteryLevel}</span>
      </div>
      <div className="v5_20">
        <span className="v5_21">{newsItems[currentNewsIndex]?.title || 'Loading...'}</span>
      </div>
      <div className="v5_22">
        <span className="v5_23">{newsItems[currentNewsIndex]?.description || 'Loading...'}</span>
      </div>
      <div className="v5_24">
      <div className="v19_243">
          <div className="v22_279">
            {weatherData && (
              <img src={weatherData.icon} alt={weatherData.description} />
            )}
          </div>
          <div className="v22_281">
            <span className="v22_282">{weatherData ? `${weatherData.temperature}°` : 'Loading...'}</span>
          </div>
        </div>
        <div className="v19_242">
          <span className="v19_278">Ljubljana</span>
        </div>
        <div className="v19_248">
          <div className="v19_253">
            <span className="v22_299">{forecastData[4]?.day || 'Day4'}</span>
          </div>
          <div className="v19_263">
            <div className="v22_295">
              <img src={forecastData[4]?.icon || "images/wi-alien.svg"} alt="Weather" onError={(e) => {e.target.onError = null; e.target.src = "images/wi-alien.svg"}}/>
            </div>
          </div>
          <div className="v19_275">
            <div className="v19_276">
              <span className="v23_314">{forecastData[4]?.highTemp || '55'}</span>
            </div>
            <div className="v19_277">
              <span className="v23_317">{forecastData[4]?.lowTemp || '5'}</span>
            </div>
          </div>
        </div>
        <div className="v19_247">
          <div className="v19_252">
            <span className="v22_298">{forecastData[3]?.day || 'Day3'}</span>
          </div>
          <div className="v19_262">
            <div className="v22_293">
              <img src={forecastData[3]?.icon || "images/wi-alien.svg"} alt="Weather" onError={(e) => {e.target.onError = null; e.target.src = "images/wi-alien.svg"}}/>
            </div>
          </div>
          <div className="v19_272">
            <div className="v19_273">
              <span className="v23_313">{forecastData[3]?.highTemp || '44'}</span>
            </div>
            <div className="v19_274">
              <span className="v23_316">{forecastData[3]?.lowTemp || '4'}</span>
            </div>
          </div>
        </div>
        <div className="v19_246">
          <div className="v19_251">
            <span className="v22_297">{forecastData[2]?.day || 'Day2'}</span>
          </div>
          <div className="v19_261">
            <div className="v22_291">
              <img src={forecastData[2]?.icon || "images/wi-alien.svg"} alt="Weather" onError={(e) => {e.target.onError = null; e.target.src = "images/wi-alien.svg"}}/>
            </div>
          </div>
          <div className="v19_269">
            <div className="v19_270">
              <span className="v23_312">{forecastData[2]?.highTemp || '33'}</span>
            </div>
            <div className="v19_271">
              <span className="v23_315">{forecastData[2]?.lowTemp || '3'}</span>
            </div>
          </div>
        </div>
        <div className="v19_245">
          <div className="v19_250">
            <span className="v22_288">{forecastData[1]?.day || 'Day1'}</span>
          </div>
          <div className="v19_259">
            <div className="v22_289">
              <img src={forecastData[1]?.icon || "images/wi-alien.svg"} alt="Weather" onError={(e) => {e.target.onError = null; e.target.src = "images/wi-alien.svg"}}/>
            </div>
          </div>
          <div className="v19_266">
            <div className="v19_267">
              <span className="v23_311">{forecastData[1]?.highTemp || '22'}</span>
            </div>
            <div className="v19_268">
              <span className="v23_309">{forecastData[1]?.lowTemp || '2'}</span>
            </div>
          </div>
        </div>
        <div className="v19_244">
          <div className="v19_254">
            <div className="v19_264">
              <span className="v22_287">{forecastData[0]?.highTemp || '11'}</span>
            </div>
            <div className="v19_265">
              <span className="v22_286">{forecastData[0]?.lowTemp || '1'}</span>
            </div>
          </div>
          <div className="v19_249">
            <span className="v22_283">{forecastData[0]?.day || 'Day0'}</span>
          </div>
          <div className="v19_260">
            <div className="v22_284">
              <img src={forecastData[0]?.icon || "images/wi-alien.svg"} alt="Weather" onError={(e) => {e.target.onError = null; e.target.src = "images/wi-alien.svg"}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
