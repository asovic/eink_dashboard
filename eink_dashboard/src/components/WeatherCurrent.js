import React from 'react';

function WeatherCurrent({ data }) {
    return (
        <div className="current-weather">
            <div className="weather-icon-large">
                {data && <img src={data.icon} alt={data.description} />}
            </div>
            <div className="current-temp-container">
                <span className="current-temp">{data ? `${data.temperature}°` : '--'}</span>
            </div>
        </div>
    );
}

export default WeatherCurrent;
