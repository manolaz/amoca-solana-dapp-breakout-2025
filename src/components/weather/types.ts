// Weather API response types
export type WeatherDesc = { value: string };
export type WeatherIconUrl = { value: string };
export type AreaInfo = {
    value: string;
};

export type CurrentCondition = {
    temp_C: string;
    temp_F: string;
    weatherDesc: WeatherDesc[];
    humidity: string;
    windspeedKmph: string;
    precipMM: string;
    uvIndex: string;
};

export type WeatherData = {
    current_condition: Array<{
        temp_C: string;
        temp_F: string;
        weatherDesc: Array<{
            value: string;
        }>;
        humidity: string;
        windspeedKmph: string;
        precipMM: string;
        uvIndex: string;
    }>;
    weather: Array<{
        mintempC: string;
        maxtempC: string;
        avgtempC: string;
        sunHour: string;
    }>;
};

export interface LocationInfo {
    city: string;
    country: string;
    lat: number;
    lng: number;
}

// Helper functions for weather data
export const getWeatherColor = (temp: number): string => {
    if (temp < 0) return '#0ea5e9';  // Freezing - blue
    if (temp < 15) return '#22d3ee'; // Cool - cyan
    if (temp < 25) return '#10b981'; // Moderate - green
    if (temp < 32) return '#f59e0b'; // Warm - orange
    return '#ef4444';                // Hot - red
};

// Convert km to approximated lat/lng coordinates
export function convertToCartesian(center: {lat: number, lng: number}, radiusKm: number) {
    const points = [];
    const R = 6371; // Earth's radius in km
    const angleStep = 36; // 10 degree steps
    
    for (let i = 0; i < 360; i += angleStep) {
        const angle = i * Math.PI / 180;
        // Simple approximation of lat/lng from distance
        const lat = center.lat + (radiusKm / R) * (180 / Math.PI) * Math.sin(angle);
        const lng = center.lng + (radiusKm / R) * (180 / Math.PI) * Math.cos(angle) / Math.cos(center.lat * Math.PI / 180);
        points.push([lng, lat]);
    }
    // Close the loop
    points.push(points[0]);
    return points;
}
}
