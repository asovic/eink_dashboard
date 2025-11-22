import React, { useState, useEffect } from 'react';

function Header() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatDateTime = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}. @ ${hours}:${minutes}`;
    };

    return (
        <div className="header">
            <span className="current-time">{formatDateTime(currentDateTime)}</span>
        </div>
    );
}

export default Header;
