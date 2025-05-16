import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Flex, Card, Heading } from '@radix-ui/themes';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from 'react-simple-maps';

// Import new components and types
import { WeatherData, LocationInfo } from './weather/types';
import { TemperatureZones } from './weather/TemperatureZones';
import { WeatherStatusCard } from './weather/WeatherStatusCard';
import { CurrentConditionsGrid } from './weather/CurrentConditionsGrid';
import { ForecastCard } from './weather/ForecastCard';
import { ClimateRiskInsights } from './weather/ClimateRiskInsights';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

// Helper function to determine weather color based on temperature
const getWeatherColor = (tempC: number): string => {
    if (tempC >= 35) return '#ef4444'; // Hot (red)
    if (tempC >= 28) return '#f97316'; // Warm (orange) 
    if (tempC >= 20) return '#facc15'; // Mild (yellow)
    if (tempC >= 10) return '#22c55e'; // Cool (green)
    if (tempC >= 0) return '#38bdf8';  // Cold (blue)
    return '#6366f1'; // Very cold (indigo)
};

type Props = {
    userLocation: { lat: number; lng: number } | null;
    center: [number, number];
    zoom: number;
    locating: boolean;
    onShareLocation: () => void;
    onLocationDetected?: (locationInfo: LocationInfo, weatherData: WeatherData | null) => void;
};

export function LocationMap({
    userLocation,
    center,
    zoom,
    locating,
    onShareLocation,
    onLocationDetected
}: Props) {
    // State for reverse geocoding
    const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
    const [reverseLoading, setReverseLoading] = useState(false);
    // State for climate data
    const [climateData, setClimateData] = useState<WeatherData | null>(null);
    const [climateLoading, setClimateLoading] = useState(false);
    // State for details toggle
    const [showDetails, setShowDetails] = useState(false);

    // Fetch city and country once we have coords
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
                    const locationData = { 
                        city, 
                        country, 
                        lat: userLocation.lat, 
                        lng: userLocation.lng 
                    };
                    setLocationInfo(locationData);
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
                    if (onLocationDetected) {
                        onLocationDetected(locationInfo, data);
                    }
                })
                .catch(err => {
                    console.error("Error fetching climate data:", err);
                    setClimateData(null);
                })
                .finally(() => setClimateLoading(false));
        }
    }, [locationInfo, onLocationDetected]);

    // Dynamic map properties
    const mapCenter = userLocation 
        ? [userLocation.lng, userLocation.lat] as [number, number]
        : center;
        
    const mapZoom = climateData ? 4 : zoom;
    
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
                {locationInfo && climateData && <WeatherStatusCard climateData={climateData} />}
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
                            {userLocation && climateData && (
                                <TemperatureZones userLocation={userLocation} climateData={climateData} />
                            )}
                            
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

            {/* Weather components */}
            {!climateLoading && climateData && locationInfo && (
                <>
                    <CurrentConditionsGrid climateData={climateData} />
                    
                    <Box mt="3">
                        <ForecastCard climateData={climateData} />
                    </Box>
                    
                    <ClimateRiskInsights 
                        climateData={climateData} 
                        locationInfo={locationInfo} 
                        showDetails={showDetails}
                        setShowDetails={setShowDetails}
                    />
                </>
            )}
        </Box>
    );
}
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

                        {/* Today's Forecast - Redesigned */}
                        <Card style={{ 
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                            padding: '20px', 
                            flex: '1 1 100%',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative elements */}
                            <div style={{ 
                                position: 'absolute', 
                                top: '-20px', 
                                right: '-20px', 
                                fontSize: '80px',
                                opacity: 0.15
                            }}>
                                ☀️
                            </div>
                            <div style={{ 
                                position: 'absolute', 
                                bottom: '-15px', 
                                left: '10%', 
                                fontSize: '60px',
                                opacity: 0.1
                            }}>
                                🌦️
                            </div>
                            
                            {/* Header */}
                            <Flex align="center" justify="center" gap="2" mb="4">
                                <Text size="4" weight="bold" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    🌈 Today's Forecast 🌈
                                </Text>
                            </Flex>
                            
                            {/* Main content area */}
                            <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" style={{ position: 'relative', zIndex: 1 }}>
                                {/* Temperature section */}
                                <Card style={{ 
                                    flex: 1, 
                                    background: 'rgba(255,255,255,0.15)', 
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                    padding: '16px',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Heading size="3" style={{ color: 'white', textAlign: 'center', marginBottom: '12px' }}>
                                        Temperature Range
                                    </Heading>
                                    
                                    <Flex gap="3" justify="between">
                                        <Box style={{ textAlign: 'center' }}>
                                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>LOW TEMP</Text>
                                            <Text size="7" weight="bold" style={{ color: 'white' }}>
                                                {climateData.weather[0].mintempC}°
                                            </Text>
                                            <Text size="5">❄️</Text>
                                            <Text size="1" style={{ color: 'white', opacity: 0.7 }}>Stay warm!</Text>
                                        </Box>
                                        
                                        <Box style={{ textAlign: 'center' }}>
                                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>HIGH TEMP</Text>
                                            <Text size="7" weight="bold" style={{ color: 'white' }}>
                                                {climateData.weather[0].maxtempC}°
                                            </Text>
                                            <Text size="5">🌡️</Text>
                                            <Text size="1" style={{ color: 'white', opacity: 0.7 }}>Stay cool!</Text>
                                        </Box>
                                        
                                        <Box style={{ textAlign: 'center' }}>
                                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>AVG TEMP</Text>
                                            <Text size="7" weight="bold" style={{ color: 'white' }}>
                                                {climateData.weather[0].avgtempC}°
                                            </Text>
                                            <Text size="5">🌤️</Text>
                                            <Text size="1" style={{ color: 'white', opacity: 0.7 }}>Day average</Text>
                                        </Box>
                                    </Flex>
                                </Card>
                                
                                {/* Sun & Protection section */}
                                <Card style={{ 
                                    flex: 1, 
                                    background: 'rgba(255,255,255,0.15)', 
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)',
                                    padding: '16px',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Heading size="3" style={{ color: 'white', textAlign: 'center', marginBottom: '12px' }}>
                                        Sun & Protection
                                    </Heading>
                                    
                                    <Flex gap="3" mb="3">
                                        <Box style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>SUNLIGHT</Text>
                                            <Text size="6" weight="bold" style={{ color: 'white' }}>
                                                {climateData.weather[0].sunHour}h
                                            </Text>
                                            <Text size="5">☀️</Text>
                                        </Box>
                                        
                                        <Box style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>UV INDEX</Text>
                                            <Text size="6" weight="bold" style={{ color: 'white' }}>
                                                {climateData.current_condition[0].uvIndex || "N/A"}
                                            </Text>
                                            <Text size="5">🕶️</Text>
                                        </Box>
                                    </Flex>
                                    
                                    <Card style={{ background: 'rgba(255, 236, 179, 0.3)', padding: '10px', borderRadius: '8px' }}>
                                        <Heading size="1" style={{ color: 'white', marginBottom: '4px' }}>
                                            🛡️ Weather Protection Tips:
                                        </Heading>
                                        <Box>
                                            <Text as="p" size="1" style={{ color: 'white', margin: '2px 0' }}>
                                                • {parseInt(climateData.weather[0].maxtempC) > 30 ? '🥵 Heat protection: Stay hydrated, seek shade' : 
                                                  parseInt(climateData.weather[0].mintempC) < 10 ? '🧣 Cold protection: Layer clothing, limit exposure' :
                                                  '👕 Moderate temperature: Comfortable conditions'}
                                            </Text>
                                            <Text as="p" size="1" style={{ color: 'white', margin: '2px 0' }}>
                                                • {parseInt(climateData.current_condition[0].uvIndex) > 7 ? '🧴 High UV: Apply SPF50+ sunscreen regularly' :
                                                  parseInt(climateData.current_condition[0].uvIndex) > 3 ? '🧢 Moderate UV: Wear hat and sunglasses' :
                                                  '✅ Low UV: Basic sun protection advised'}
                                            </Text>
                                            <Text as="p" size="1" style={{ color: 'white', margin: '2px 0' }}>
                                                • {parseInt(climateData.current_condition[0].precipMM) > 5 ? '☂️ Rain expected: Bring waterproof gear' :
                                                  '🌂 Low precipitation: Minimal rain protection needed'}
                                            </Text>
                                        </Box>
                                    </Card>
                                </Card>
                            </Flex>
                            
                            {/* Climate Risk Insight */}
                            <Card mt="3" style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                padding: '12px',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <Flex align="center" gap="2" mb="1">
                                    <Text size="3" weight="bold" style={{ color: 'white' }}>
                                        🔍 Climate Risk Insights
                                    </Text>
                                    <Box style={{ 
                                        background: getWeatherColor(parseInt(climateData.current_condition[0].temp_C)), 
                                        borderRadius: '4px',
                                        padding: '2px 8px',
                                    }}>
                                        <Text size="1" weight="bold" style={{ color: 'white' }}>
                                            {parseInt(climateData.current_condition[0].temp_C) > 35 ? 'EXTREME' :
                                             parseInt(climateData.current_condition[0].temp_C) > 30 ? 'HIGH' : 
                                             parseInt(climateData.current_condition[0].temp_C) < 5 ? 'COLD RISK' : 'MODERATE'}
                                        </Text>
                                    </Box>
                                </Flex>
                                <Text as="p" size="2" style={{ color: 'white', margin: '4px 0' }}>
                                    Today's conditions indicate {parseInt(climateData.current_condition[0].temp_C) > 30 ? 'increased heat-related risks' :
                                    parseInt(climateData.current_condition[0].temp_C) < 5 ? 'potential cold exposure concerns' :
                                    parseInt(climateData.current_condition[0].precipMM) > 10 ? 'elevated flooding potential' :
                                    'standard climate conditions'} for this region. Our insurance packages offer protection against weather-related damages and health impacts.
                                </Text>
                                <Text size="1" style={{ color: 'white', opacity: 0.7, marginTop: '4px' }}>
                                    Based on historical data and current trends in {locationInfo?.city || 'your region'}
                                </Text>
                                
                                {/* Add policy details toggle button */}
                                <Button 
                                    mt="3" 
                                    color="indigo" 
                                    variant="soft" 
                                    onClick={() => setShowDetails(!showDetails)}
                                    style={{ width: '100%' }}
                                >
                                    {showDetails ? 'Hide Risk Details' : 'Show Risk Details'}
                                </Button>
                                
                                {/* Conditional details section */}
                                {showDetails && (
                                    <Box mt="3" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
                                        <Heading size="2" style={{ color: 'white', marginBottom: '8px' }}>
                                            Climate Risk Details
                                        </Heading>
                                        <Flex direction="column" gap="2">
                                            <Flex justify="between">
                                                <Text size="2" style={{ color: 'white' }}>
                                                    Temperature Risk Level:
                                                </Text>
                                                <Text size="2" weight="bold" style={{ color: 'white' }}>
                                                    {parseInt(climateData.current_condition[0].temp_C) > 35 ? 'Severe' :
                                                     parseInt(climateData.current_condition[0].temp_C) > 30 ? 'High' : 
                                                     parseInt(climateData.current_condition[0].temp_C) < 5 ? 'Cold Risk' : 'Moderate'}
                                                </Text>
                                            </Flex>
                                            <Flex justify="between">
                                                <Text size="2" style={{ color: 'white' }}>
                                                    Precipitation Risk:
                                                </Text>
                                                <Text size="2" weight="bold" style={{ color: 'white' }}>
                                                    {parseFloat(climateData.current_condition[0].precipMM) > 10 ? 'High' :
                                                     parseFloat(climateData.current_condition[0].precipMM) > 5 ? 'Moderate' : 'Low'}
                                                </Text>
                                            </Flex>
                                            <Flex justify="between">
                                                <Text size="2" style={{ color: 'white' }}>
                                                    Wind Risk:
                                                </Text>
                                                <Text size="2" weight="bold" style={{ color: 'white' }}>
                                                    {parseInt(climateData.current_condition[0].windspeedKmph) > 40 ? 'High' :
                                                     parseInt(climateData.current_condition[0].windspeedKmph) > 20 ? 'Moderate' : 'Low'}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                )}
                            </Card>
                        </Card>
                    </Flex>
                </Box>
            )}
        </Box>
    );
}
