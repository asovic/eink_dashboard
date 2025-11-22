import { useState, useEffect, useCallback } from 'react';

export function useNews() {
    const [newsItems, setNewsItems] = useState([]);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNews = useCallback(async () => {
        try {
            const response = await fetch('/api/rss-feed');
            if (!response.ok) throw new Error('Failed to fetch RSS feed');
            const newsData = await response.json();
            setNewsItems(newsData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
        // Refresh news every hour? Or just on mount? Original code didn't have auto-refresh for fetch, only for rotation.
        // Let's add a refresh interval of 1 hour.
        const interval = setInterval(fetchNews, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchNews]);

    useEffect(() => {
        if (newsItems.length === 0) return;

        const rotationInterval = setInterval(() => {
            setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
        }, 30000); // 30 seconds

        return () => clearInterval(rotationInterval);
    }, [newsItems]);

    return {
        currentNewsItem: newsItems[currentNewsIndex],
        loading,
        error
    };
}
