import React from 'react';
import { useNews } from '../hooks/useNews';

function NewsTicker() {
    const { currentNewsItem, loading } = useNews();

    if (loading || !currentNewsItem) {
        return (
            <>
                <div className="news-title-container">
                    <span className="news-title">Loading news...</span>
                </div>
                <div className="news-description-container">
                    <span className="news-description">...</span>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="news-title-container">
                <span className="news-title">{currentNewsItem.title}</span>
            </div>
            <div className="news-description-container">
                <span className="news-description">{currentNewsItem.description}</span>
            </div>
        </>
    );
}

export default NewsTicker;
