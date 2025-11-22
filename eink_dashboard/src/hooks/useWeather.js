import { useState, useEffect, useCallback } from 'react';

export function useWeather() {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCurrentWeather = useCallback(async () => {
        try {
            const response = await fetch('/api/weather/current');
            if (!response.ok) throw new Error('Failed to fetch current weather');
            const data = await response.json();
            setCurrentWeather(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }, []);

    const fetchForecast = useCallback(async () => {
        try {
            const response = await fetch('/api/weather/forecast');
            if (!response.ok) throw new Error('Failed to fetch forecast');
            const data = await response.json();
            setForecast(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchCurrentWeather(), fetchForecast()]);
            setLoading(false);
        };

        fetchData();

        const currentInterval = setInterval(fetchCurrentWeather, 30 * 60 * 1000); // 30 mins
        const forecastInterval = setInterval(fetchForecast, 3 * 60 * 60 * 1000); // 3 hours

        return () => {
            clearInterval(currentInterval);
            clearInterval(forecastInterval);
        };
    }, [fetchCurrentWeather, fetchForecast]);

    return { currentWeather, forecast, loading, error };
}
