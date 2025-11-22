import React, { useState, useEffect } from 'react';

function BatteryStatus() {
    const [batteryLevel, setBatteryLevel] = useState('N/A');

    const updateBatteryLevel = () => {
        if (typeof window !== 'undefined' && window.okular && typeof window.okular.BatteryLevel === 'number') {
            setBatteryLevel(`${window.okular.BatteryLevel}%`);
        } else {
            setBatteryLevel('N/A');
        }
    };

    useEffect(() => {
        updateBatteryLevel();
        const interval = setInterval(updateBatteryLevel, 3 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="battery-container">
            <div className="battery-icon"></div>
            <span className="battery-level">{batteryLevel}</span>
        </div>
    );
}

export default BatteryStatus;
