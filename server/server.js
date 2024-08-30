const express = require('express');
const router = express.Router();
const { DOMParser } = require('xmldom');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001; // Make sure this doesn't conflict with your frontend port

// Enable CORS for all routes
app.use(cors({
    origin: 'http://89.212.26.36:3000'
  }));

app.use(express.json());

router.get('/api/rss-feed', async (req, res) => {
  try {
    const response = await axios.get('https://img.rtvslo.si/feeds/01.xml');
    res.set('Content-Type', 'application/xml');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).send('Error fetching RSS feed');
  }
});

router.get('/api/weather/current', async (req, res) => {
    try {
      const response = await axios.get('https://meteo.arso.gov.si/uploads/probase/www/observ/surface/text/sl/observation_LJUBL-ANA_BEZIGRAD_latest.xml');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');
  
      const getElementValue = (tagName) => {
        const element = xmlDoc.getElementsByTagName(tagName)[0];
        return element ? element.textContent : null;
      };
  
      const weatherIconMap = {
        'jasno': 'wi-day-sunny',
        'pretežno jasno': 'wi-day-sunny-overcast',
        'delno oblačno': 'wi-day-cloudy',
        'zmerno oblačno': 'wi-cloud',
        'pretežno oblačno': 'wi-cloudy',
        'oblačno': 'wi-cloudy',
        'megla': 'wi-fog',
        'dež': 'wi-rain',
        'ploha': 'wi-showers',
        'nevihta': 'wi-thunderstorm',
        'sneg': 'wi-snow',
        'dež s snegom': 'wi-sleet'
      };
  
      const getWeatherIcon = (nnIcon, wwsynIcon) => {
        if (wwsynIcon) {
          const phenomenon = wwsynIcon.split('_')[0].toLowerCase();
          for (const [key, value] of Object.entries(weatherIconMap)) {
            if (phenomenon.includes(key)) {
              return value;
            }
          }
        }
        return weatherIconMap[nnIcon] || 'wi-day-sunny';
      };
  
      const weatherData = {
        temperature: getElementValue('t'),
        humidity: getElementValue('rh'),
        windSpeed: getElementValue('ff_val'),
        windDirection: getElementValue('dd_shortText'),
        pressure: getElementValue('msl'),
        description: getElementValue('nn_shortText-wwsyn_longText'),
        icon: `/images/${getWeatherIcon(getElementValue('nn_shortText'), getElementValue('wwsyn_icon'))}.svg`
      };
  
      res.json(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Error fetching weather data' });
    }
  });

async function fetchForecast() {
  try {
    const response = await axios.get('https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/forecast_SI_OSREDNJESLOVENSKA_latest.xml');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');

    const metDataElements = xmlDoc.getElementsByTagName('metData');
    const forecast = [];

    for (let i = 0; i < metDataElements.length; i++) {
      const metData = metDataElements[i];
      const getElementValue = (tagName) => {
        const element = metData.getElementsByTagName(tagName)[0];
        return element ? element.textContent : null;
      };

      const day = getElementValue('valid_day').replace(' CEST', '');
      const lowTemp = getElementValue('tnsyn');
      const highTemp = getElementValue('txsyn');
      const icon = getWeatherIcon(getElementValue('nn_icon'), getElementValue('wwsyn_icon'));

      forecast.push({
        day,
        lowTemp,
        highTemp,
        icon: `/images/${icon}.svg`
      });
    }

    return forecast;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return [];
  }
}

function getWeatherIcon(nnIcon, wwsynIcon) {
  const weatherIconMap = {
    'clear': 'wi-day-sunny',
    'mostClear': 'wi-day-sunny-overcast',
    'partCloudy': 'wi-day-cloudy',
    'modCloudy': 'wi-cloud',
    'prevCloudy': 'wi-cloudy',
    'overcast': 'wi-cloudy',
    'fog': 'wi-fog',
    'rain': 'wi-rain',
    'showers': 'wi-showers',
    'tstorm': 'wi-thunderstorm',
    'snow': 'wi-snow',
    'sleet': 'wi-sleet'
  };

  if (wwsynIcon) {
    const phenomenon = wwsynIcon.split('_')[0].toLowerCase();
    for (const [key, value] of Object.entries(weatherIconMap)) {
      if (phenomenon.includes(key)) {
        return value;
      }
    }
  }
  return weatherIconMap[nnIcon] || 'wi-day-sunny';
}

router.get('/api/weather/forecast', async (req, res) => {
  try {
    const forecast = await fetchForecast();
    res.json(forecast);
  } catch (error) {
    console.error('Error in forecast API:', error);
    res.status(500).json({ error: 'Error fetching forecast data' });
  }
});

module.exports = router;