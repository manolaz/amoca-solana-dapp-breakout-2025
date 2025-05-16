import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Flex, Card, Heading } from '@radix-ui/themes';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker,
    Line
} from 'react-simple-maps';

// Weather API response types
type WeatherDesc = { value: string };
type WeatherIconUrl = { value: string };
type AreaInfo = {
    value: string;
};

type CurrentCondition = {
    temp_C: string;
    temp_F: string;
    weatherDesc: WeatherDesc[];
    humidity: string;
    cloudcover: string;
    FeelsLikeC: string;
    pressure: string;
    windspeedKmph: string;
    precipMM: string;
    uvIndex: string;
    visibility: string;
};

type WeatherData = {
    current_condition: CurrentCondition[];
    nearest_area: [{ 
        areaName: AreaInfo[];
        country: AreaInfo[];
        latitude: string;
        longitude: string;
    }];
    weather: [{
        maxtempC: string;
        mintempC: string;
        avgtempC: string;
        sunHour: string;
        date: string;
    }];
};

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

type Props = {
    userLocation: { lat: number; lng: number } | null;
    center: [number, number];
    zoom: number;
    locating: boolean;
    onShareLocation: () => void;
    onLocationDetected?: (locationInfo: { city: string; country: string; lat: number; lng: number }, weatherData: WeatherData | null) => void;
};

export function LocationMap({
    userLocation,
    center,
    zoom,
    locating,
    onShareLocation,
    onLocationDetected
}: Props) {
    // new state for reverse geocoding
    const [locationInfo, setLocationInfo] = useState<{ city: string; country: string } | null>(null);
    const [reverseLoading, setReverseLoading] = useState(false);
    // new state for climate data
    const [climateData, setClimateData] = useState<WeatherData | null>(null);
    const [climateLoading, setClimateLoading] = useState(false);

    // fetch city and country once we have coords
    useEffect(() => {
        if (userLocation) {
            setReverseLoading(true);
            fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`
            )
                .then((res) => res.json())
                .then((data) => {
                    const addr = data.address || {};
                    const city = addr.city || addr.town || addr.village || '';
                    const country = addr.country || '';
                    setLocationInfo({ city, country });
                })
                .catch(() => setLocationInfo(null))
                .finally(() => setReverseLoading(false));
        }
    }, [userLocation]);

    // Fetch climate data once we have the city
    useEffect(() => {
        if (locationInfo?.city) {
            setClimateLoading(true);
            fetch(`https://wttr.in/${encodeURIComponent(locationInfo.city)}?format=j2`)
                .then(res => res.json())
                .then((data: WeatherData) => {
                    setClimateData(data);
                    // Notify parent component of location and weather data
                    if (onLocationDetected && userLocation) {
                        onLocationDetected({
                            ...locationInfo, 
                            lat: userLocation.lat,
                            lng: userLocation.lng
                        }, data);
                    }
                })
                .catch(err => {
                    console.error("Error fetching climate data:", err);
                    setClimateData(null);
                })
                .finally(() => setClimateLoading(false));
        }
    }, [locationInfo, onLocationDetected, userLocation]);

    // Dynamic map properties
    const mapCenter = userLocation 
        ? [userLocation.lng, userLocation.lat] as [number, number]
        : center;
        
    const mapZoom = climateData ? 4 : zoom;
    
    // Color based on temperature - create a color gradient from blue (cold) to red (hot)
    const getWeatherColor = (temp: number): string => {
        if (temp < 0) return '#0ea5e9';  // Freezing - blue
        if (temp < 15) return '#22d3ee'; // Cool - cyan
        if (temp < 25) return '#10b981'; // Moderate - green
        if (temp < 32) return '#f59e0b'; // Warm - orange
        return '#ef4444';                // Hot - red
    };

    // Get temperature zones if we have climate data
    const tempZones = climateData ? getTemperatureZones() : [];
    
    // Create temperature zones based on nearby locations with similar climate
    function getTemperatureZones() {
        if (!climateData || !userLocation) return [];
        
        const temp = parseInt(climateData.current_condition[0].temp_C);
        const color = getWeatherColor(temp);
        
        // Create some approximated zones around the user location
        // These would be better if they came from actual data points
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
    }

    // Convert km to approximated lat/lng coordinates
    function convertToCartesian(center: {lat: number, lng: number}, radiusKm: number) {
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

    return (
        <Box mb="5" style={{ background: '#e0f2fe', borderRadius: 12, padding: 16 }}>
            <Flex justify="between" align="start" mb="3">
                <Box>
                    <Button
                        size="2"
                        color="blue"
                        onClick={onShareLocation}
                        disabled={locating}
                        style={{ marginBottom: 12 }}
                    >
                        {locating ? 'Locating...' : 'Share My Location'}
                    </Button>
                </Box>
                {locationInfo && climateData && (
                    <Card style={{ 
                        background: getWeatherColor(parseInt(climateData.current_condition[0].temp_C)), 
                        color: 'white', 
                        padding: '8px 12px'
                    }}>
                        <Flex gap="2" align="center">
                            <Text weight="bold" size="3">{climateData.current_condition[0].temp_C}°C</Text>
                            <Text size="2">{climateData.current_condition[0].weatherDesc[0].value}</Text>
                        </Flex>
                    </Card>
                )}
            </Flex>

            <Card style={{ 
                padding: 0, 
                overflow: 'hidden', 
                marginBottom: '16px',
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                position: 'relative'
            }}>
                {/* Dynamic labels for climate conditions */}
                {locationInfo && climateData && (
                    <Box style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 10,
                        background: 'rgba(255,255,255,0.8)',
                        padding: '8px',
                        borderRadius: '6px',
                    }}>
                        <Heading size="2">{locationInfo.city}, {locationInfo.country}</Heading>
                        <Text size="1">Weather: {climateData.current_condition[0].weatherDesc[0].value}</Text>
                    </Box>
                )}
                
                <div style={{ width: '100%', height: 400 }}>
                    <ComposableMap projection="geoMercator" width={960} height={400}>
                        <ZoomableGroup center={mapCenter} zoom={mapZoom}>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map(geo => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            style={{
                                                default: { fill: '#b6e0fe', stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' },
                                                hover: { fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' },
                                                pressed: { fill: '#0ea5e9', stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' }
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                            
                            {/* Temperature zones */}
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
                            
                            {userLocation && (
                                <Marker coordinates={[userLocation.lng, userLocation.lat]}>
                                    <g transform="translate(-12, -24)">
                                        <path 
                                            d="M12 0c-4.4 0-8 3.6-8 8 0 5.4 7.1 16 7.4 16.2.4.4 1.7.4 2.2 0 .4-.4 7.4-11 7.4-16.2 0-4.4-3.6-8-8-8zm0 11.5c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" 
                                            fill="rgba(255,0,0,0.9)"
                                            stroke="#fff"
                                            strokeWidth="1"
                                        />
                                    </g>
                                </Marker>
                            )}
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            </Card>

            {/* Location information display */}
            <Flex gap="2" wrap="wrap">
                {userLocation && reverseLoading && (
                    <Text as="p" size="2" style={{ color: '#0e7490' }}>
                        Detecting your location...
                    </Text>
                )}
                
                {userLocation && !reverseLoading && locationInfo && (
                    <Card style={{ 
                        flex: '1 1 260px', 
                        background: 'white',
                        padding: '12px'
                    }}>
                        <Text size="2" weight="bold">Location</Text>
                        <Text as="p" size="2">
                            {locationInfo.city}, {locationInfo.country}
                        </Text>
                        <Text as="p" size="1" color="gray">
                            Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                        </Text>
                    </Card>
                )}

                {/* Climate data loading indicator */}
                {climateLoading && (
                    <Text size="2" style={{ color: '#0e7490' }}>Loading climate data...</Text>
                )}
            </Flex>

            {/* Redesigned Current Conditions */}
            {!climateLoading && climateData && (
                <Box mt="3">
                    <Heading size="3" mb="2" style={{ color: '#0369a1' }}>
                        ✨ Current Conditions ✨
                    </Heading>
                    
                    <Flex gap="3" wrap="wrap">
                        {/* Temperature - Larger and more prominent */}
                        <Card style={{ 
                            background: getWeatherColor(parseInt(climateData.current_condition[0].temp_C)),
                            padding: '16px', 
                            flex: '1 1 140px',
                            minHeight: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}>
                            <Text size="2" weight="bold" style={{ color: 'white', opacity: 0.9 }}>TEMPERATURE</Text>
                            <Text size="8" weight="bold" style={{ color: 'white' }}>
                                {climateData.current_condition[0].temp_C}°C
                            </Text>
                            <Text size="1" style={{ color: 'white', opacity: 0.9 }}>
                                {climateData.current_condition[0].temp_F}°F
                            </Text>
                            <Text size="6" style={{ marginTop: '4px' }}>
                                {parseInt(climateData.current_condition[0].temp_C) > 30 ? '🔥' : 
                                 parseInt(climateData.current_condition[0].temp_C) > 20 ? '☀️' : 
                                 parseInt(climateData.current_condition[0].temp_C) > 10 ? '🌤️' : '❄️'}
                            </Text>
                        </Card>

                        {/* Weather Condition */}
                        <Card style={{ 
                            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                            padding: '16px', 
                            flex: '1 1 140px',
                            minHeight: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}>
                            <Text size="2" weight="bold" style={{ color: 'white', opacity: 0.9 }}>CONDITION</Text>
                            <Text size="6" style={{ marginBottom: '4px' }}>
                                {climateData.current_condition[0].weatherDesc[0].value.toLowerCase().includes('rain') ? '🌧️' :
                                 climateData.current_condition[0].weatherDesc[0].value.toLowerCase().includes('cloud') ? '☁️' :
                                 climateData.current_condition[0].weatherDesc[0].value.toLowerCase().includes('sun') ? '☀️' :
                                 climateData.current_condition[0].weatherDesc[0].value.toLowerCase().includes('clear') ? '🌞' :
                                 climateData.current_condition[0].weatherDesc[0].value.toLowerCase().includes('storm') ? '⛈️' :
                                 climateData.current_condition[0].weatherDesc[0].value.toLowerCase().includes('snow') ? '❄️' : '🌈'}
                            </Text>
                            <Text size="2" weight="bold" style={{ color: 'white', textAlign: 'center' }}>
                                {climateData.current_condition[0].weatherDesc[0].value}
                            </Text>
                        </Card>

                        {/* Humidity */}
                        <Card style={{ 
                            background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
                            padding: '16px', 
                            flex: '1 1 140px',
                            minHeight: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}>
                            <Text size="2" weight="bold" style={{ color: 'white', opacity: 0.9 }}>HUMIDITY</Text>
                            <Text size="6" style={{ marginBottom: '4px' }}>💧</Text>
                            <Text size="6" weight="bold" style={{ color: 'white' }}>
                                {climateData.current_condition[0].humidity}%
                            </Text>
                        </Card>

                        {/* Wind */}
                        <Card style={{ 
                            background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
                            padding: '16px', 
                            flex: '1 1 140px',
                            minHeight: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}>
                            <Text size="2" weight="bold" style={{ color: 'white', opacity: 0.9 }}>WIND SPEED</Text>
                            <Text size="6" style={{ marginBottom: '4px' }}>🌬️</Text>
                            <Text size="6" weight="bold" style={{ color: 'white' }}>
                                {climateData.current_condition[0].windspeedKmph}
                            </Text>
                            <Text size="2" style={{ color: 'white', opacity: 0.9 }}>km/h</Text>
                        </Card>

                        {/* Today's Forecast */}
                        <Card style={{ 
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            padding: '16px', 
                            flex: '2 1 300px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }}>
                            <Text size="2" weight="bold" style={{ color: 'white', opacity: 0.9 }}>TODAY'S FORECAST</Text>
                            <Flex align="center" gap="3" style={{ marginTop: '8px' }}>
                                <Box style={{ textAlign: 'center' }}>
                                    <Text size="2" style={{ color: 'white', opacity: 0.9 }}>LOW</Text>
                                    <Text size="6" weight="bold" style={{ color: 'white' }}>
                                        {climateData.weather[0].mintempC}°C
                                    </Text>
                                    <Text size="5">❄️</Text>
                                </Box>
                                
                                <Box style={{ height: '70px', width: '1px', background: 'rgba(255,255,255,0.3)' }} />
                                
                                <Box style={{ textAlign: 'center' }}>
                                    <Text size="2" style={{ color: 'white', opacity: 0.9 }}>HIGH</Text>
                                    <Text size="6" weight="bold" style={{ color: 'white' }}>
                                        {climateData.weather[0].maxtempC}°C
                                    </Text>
                                    <Text size="5">🌡️</Text>
                                </Box>
                                
                                <Box style={{ height: '70px', width: '1px', background: 'rgba(255,255,255,0.3)' }} />
                                
                                <Box style={{ textAlign: 'center' }}>
                                    <Text size="2" style={{ color: 'white', opacity: 0.9 }}>SUNLIGHT</Text>
                                    <Text size="6" weight="bold" style={{ color: 'white' }}>
                                        {climateData.weather[0].sunHour}h
                                    </Text>
                                    <Text size="5">☀️</Text>
                                </Box>
                            </Flex>
                        </Card>
                    </Flex>
                </Box>
            )}
        </Box>
    );
}