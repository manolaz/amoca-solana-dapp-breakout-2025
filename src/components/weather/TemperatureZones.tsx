import React from 'react';
import { Line } from 'react-simple-maps';
import { WeatherData, getWeatherColor, convertToCartesian } from './types';

type TemperatureZonesProps = {
    userLocation: { lat: number; lng: number } | null;
    climateData: WeatherData | null;
};

export function TemperatureZones({ userLocation, climateData }: TemperatureZonesProps) {
    const tempZones = React.useMemo(() => {
        if (!climateData || !userLocation) return [];
        
        const temp = parseInt(climateData.current_condition[0].temp_C);
        const color = getWeatherColor(temp);
        
        // Create some approximated zones around the user location
        return [
            {
                radius: 100, // km
                color: color,
                opacity: 0.2,
                coords: convertToCartesian(userLocation, 100)
            },
            {
                radius: 50, // km
                color: color, 
                opacity: 0.3,
                coords: convertToCartesian(userLocation, 50)
            },
            {
                radius: 25, // km
                color: color,
                opacity: 0.4, 
                coords: convertToCartesian(userLocation, 25)
            }
        ];
    }, [climateData, userLocation]);

    if (!tempZones.length) return null;

    return (
        <>
            {tempZones.map((zone, i) => (
                <Line 
                    key={i}
                    coordinates={zone.coords}
                    stroke={zone.color}
                    strokeWidth={4}
                    strokeLinecap="round"
                    fill={zone.color}
                    fillOpacity={zone.opacity}
                />
            ))}
        </>
    );
}
