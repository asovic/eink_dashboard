import React from 'react';

function WeatherForecast({ forecast }) {
    // We need to display 5 days (including today/Day0 if available, or next 5 days)
    // The original code handled indices 0 to 4.
    // Let's assume forecast is an array of days.

    // Helper to render a single day column
    const renderDay = (dayData, index) => {
        if (!dayData) return null;

        return (
            <div key={index} className={`forecast-day day-${index}`}>
                <div className="day-name">
                    <span className="day-label">{index === 0 ? 'Today' : dayData.day}</span>
                </div>
                <div className="day-icon-container">
                    <div className="day-icon">
                        <img
                            src={dayData.icon || "images/wi-alien.svg"}
                            alt="Weather"
                            onError={(e) => { e.target.onError = null; e.target.src = "images/wi-alien.svg" }}
                        />
                    </div>
                </div>
                <div className="temp-range">
                    <div className="high-temp">
                        <span className="temp-val">{dayData.highTemp}</span>
                    </div>
                    <div className="low-temp">
                        <span className="temp-val">{dayData.lowTemp}</span>
                    </div>
                </div>
            </div>
        );
    };

    // We reverse the array to match the original layout (Right to Left or specific order? 
    // Original HTML had v19_248 (Day4) to v19_244 (Day0) in that order in DOM, 
    // but displayed visually. 
    // Let's just render them in order 0-4.
    // Wait, the original DOM structure was:
    // Day4 (v19_248)
    // Day3 (v19_247)
    // Day2 (v19_246)
    // Day1 (v19_245)
    // Day0 (v19_244)
    // This implies they might be flex-reversed or just stacked. 
    // Let's render them 4 down to 0 to match DOM order if that matters for CSS, 
    // OR just render 0-4 and let CSS handle it.
    // Given I'm rewriting CSS, I'll render 0 to 4 and use Flexbox to order them correctly.

    const daysToRender = [0, 1, 2, 3, 4];

    return (
        <>
            {daysToRender.map(i => renderDay(forecast[i], i))}
        </>
    );
}

export default WeatherForecast;
