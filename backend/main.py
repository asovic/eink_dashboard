from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import xmltodict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "eInkDashboard Backend is running"}

@app.get("/api/rss-feed")
async def get_rss_feed():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get('https://img.rtvslo.si/feeds/01.xml')
            response.raise_for_status()
            
            rss_data = xmltodict.parse(response.content)
            
            # Navigate RSS structure: rss -> channel -> item
            items = rss_data.get('rss', {}).get('channel', {}).get('item', [])
            
            news_items = []
            for item in items:
                news_items.append({
                    "title": item.get('title'),
                    "description": item.get('description')
                })
                
            return news_items
    except Exception as e:
        logger.error(f"Error fetching RSS feed: {e}")
        raise HTTPException(status_code=500, detail="Error fetching RSS feed")

@app.get("/api/weather/current")
async def get_current_weather():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get('https://meteo.arso.gov.si/uploads/probase/www/observ/surface/text/sl/observation_LJUBL-ANA_BEZIGRAD_latest.xml')
            response.raise_for_status()
            
            data = xmltodict.parse(response.content)
            
            # Navigate the XML structure based on ARSO format
            # The structure usually is data -> metData
            met_data = data.get('data', {}).get('metData', {})
            
            weather_data = {
                "temperature": met_data.get('t'),
                "humidity": met_data.get('rh'),
                "windSpeed": met_data.get('ff_val'),
                "windDirection": met_data.get('dd_shortText'),
                "pressure": met_data.get('msl'),
                "description": met_data.get('nn_shortText-wwsyn_longText'),
                "icon": get_weather_icon(met_data.get('nn_icon-wwsyn_icon'))
            }
            return weather_data
    except Exception as e:
        logger.error(f"Error fetching current weather: {e}")
        raise HTTPException(status_code=500, detail="Error fetching weather data")

@app.get("/api/weather/forecast")
async def get_weather_forecast():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get('https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/forecast_SI_OSREDNJESLOVENSKA_latest.xml')
            response.raise_for_status()
            
            data = xmltodict.parse(response.content)
            
            # ARSO forecast XML structure
            met_data_list = data.get('data', {}).get('metData', [])
            if not isinstance(met_data_list, list):
                met_data_list = [met_data_list]
                
            forecast = []
            for item in met_data_list:
                day = item.get('valid_day', '').replace(' CEST', '').replace(' CET', '')
                forecast.append({
                    "day": day,
                    "lowTemp": item.get('tnsyn'),
                    "highTemp": item.get('txsyn'),
                    "icon": get_weather_icon(item.get('nn_icon-wwsyn_icon'))
                })
            
            return forecast
    except Exception as e:
        logger.error(f"Error fetching forecast: {e}")
        raise HTTPException(status_code=500, detail="Error fetching forecast data")

def get_weather_icon(arso_icon_text):
    if not arso_icon_text:
        return None
    base_url = 'https://meteo.arso.gov.si/uploads/meteo/style/img/weather/'
    return f"{base_url}{arso_icon_text}.png"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8801)
