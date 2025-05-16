import React from 'react';
import { Circle } from 'react-simple-maps';
import { WeatherData } from './types';

interface TemperatureZonesProps {
    userLocation: { lat: number; lng: number };
    climateData: WeatherData;
}

export function TemperatureZones({ userLocation, climateData }: TemperatureZonesProps) {
    // Generate temperature zone visualization
    const tempC = parseInt(climateData.current_condition[0].temp_C);
    
    // Generate color based on temperature
    const getZoneColor = (temp: number): string => {
        if (temp >= 35) return 'rgba(239, 68, 68, 0.15)'; // Hot
        if (temp >= 28) return 'rgba(249, 115, 22, 0.15)'; // Warm
        if (temp >= 20) return 'rgba(250, 204, 21, 0.15)'; // Mild
        if (temp >= 10) return 'rgba(34, 197, 94, 0.15)'; // Cool
        if (temp >= 0) return 'rgba(56, 189, 248, 0.15)'; // Cold
        return 'rgba(99, 102, 241, 0.15)'; // Very cold
    };
    
    const zoneColor = getZoneColor(tempC);
    
    return (
        <>
            <Circle
                center={[userLocation.lng, userLocation.lat]}
                radius={50}
                fill={zoneColor}
                stroke={zoneColor.replace('0.15', '0.3')}
                strokeWidth={2}
            />
            <Circle
                center={[userLocation.lng, userLocation.lat]}
                radius={100}
                fill={zoneColor.replace('0.15', '0.1')}
                stroke={zoneColor.replace('0.15', '0.2')}
                strokeWidth={1}
            />
        </>
    );
}
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
