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
            // Clear previous location and climate data while fetching new
            setLocationInfo(null);
            setClimateData(null);
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

    // Invoke onLocationDetected when locationInfo or climateData changes
    useEffect(() => {
        if (locationInfo && climateData && onLocationDetected) {
            onLocationDetected(locationInfo, climateData);
        }
    }, [locationInfo, climateData, onLocationDetected]);

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
                {userLocation ? (
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
                                {climateData && (
                                    <TemperatureZones userLocation={userLocation} climateData={climateData} />
                                )}
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
                            </ZoomableGroup>
                        </ComposableMap>
                    </div>
                ) : (
                    <Text as="p" size="2" style={{ color: '#0e7490', textAlign: 'center', padding: '16px' }}>
                        Please share your location to view the map.
                    </Text>
                )}
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