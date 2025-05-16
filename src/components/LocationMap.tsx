import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Flex, Card } from '@radix-ui/themes';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
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

const geoUrl =
    'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

type Props = {
    userLocation: { lat: number; lng: number } | null;
    center: [number, number];
    zoom: number;
    locating: boolean;
    onShareLocation: () => void;
};

export function LocationMap({
    userLocation,
    center,
    zoom,
    locating,
    onShareLocation
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
                })
                .catch(err => {
                    console.error("Error fetching climate data:", err);
                    setClimateData(null);
                })
                .finally(() => setClimateLoading(false));
        }
    }, [locationInfo]);

    // Calculate a broader center for the climate map - show more of the region around the city
    const broaderMapCenter = userLocation 
        ? [userLocation.lng, userLocation.lat] as [number, number]
        : center;

    return (
        <Box mb="5" style={{ background: '#e0f2fe', borderRadius: 12, padding: 16 }}>
            <Button
                size="2"
                color="blue"
                onClick={onShareLocation}
                disabled={locating}
                style={{ marginBottom: 12 }}
            >
                {locating ? 'Locating...' : 'Share My Location'}
            </Button>
            <div style={{ width: '100%', maxWidth: 480, height: 260 }}>
                <ComposableMap projection="geoMercator" width={480} height={260}>
                    <ZoomableGroup center={center} zoom={zoom}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map(geo => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        style={{
                                            default: { fill: '#b6e0fe', outline: 'none' },
                                            hover: { fill: '#38bdf8', outline: 'none' },
                                            pressed: { fill: '#0ea5e9', outline: 'none' }
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                        {userLocation && (
                            <Marker coordinates={[userLocation.lng, userLocation.lat]}>
                                <circle r={6} fill="#FF5533" stroke="#fff" strokeWidth={2} />
                            </Marker>
                        )}
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* show city when ready */}
            {userLocation && reverseLoading && (
                <Text as="p" size="2" mt="2" style={{ color: '#0e7490' }}>
                    Detecting your city…
                </Text>
            )}
            {userLocation && !reverseLoading && locationInfo && (
                <Text as="p" size="2" mt="2" style={{ color: '#0e7490' }}>
                    Your city is {locationInfo.city}, {locationInfo.country}
                </Text>
            )}

            {/* existing coords display */}
            {userLocation && (
                <Text as="p" size="2" mt="2" style={{ color: '#0e7490' }}>
                    Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </Text>
            )}

            {/* Climate data section */}
            {locationInfo && locationInfo.city && (
                <Box mt="4">
                    <Text size="3" weight="bold" style={{ color: '#0369a1', marginBottom: '12px' }}>
                        Climate Data for {locationInfo.city}
                    </Text>
                    
                    {climateLoading && (
                        <Text size="2" style={{ color: '#0e7490' }}>Loading climate data...</Text>
                    )}
                    
                    {!climateLoading && climateData && (
                        <>
                            {/* Broader area map view */}
                            <div style={{ width: '100%', maxWidth: 480, height: 200, marginBottom: '16px' }}>
                                <ComposableMap projection="geoMercator" width={480} height={200}>
                                    <ZoomableGroup center={broaderMapCenter} zoom={5}>
                                        <Geographies geography={geoUrl}>
                                            {({ geographies }) =>
                                                geographies.map(geo => (
                                                    <Geography
                                                        key={geo.rsmKey}
                                                        geography={geo}
                                                        style={{
                                                            default: { fill: '#94a3b8', outline: 'none' },
                                                            hover: { fill: '#64748b', outline: 'none' },
                                                            pressed: { fill: '#475569', outline: 'none' }
                                                        }}
                                                    />
                                                ))
                                            }
                                        </Geographies>
                                        {userLocation && (
                                            <Marker coordinates={[userLocation.lng, userLocation.lat]}>
                                                <circle r={4} fill="#ef4444" stroke="#fff" strokeWidth={2} />
                                            </Marker>
                                        )}
                                    </ZoomableGroup>
                                </ComposableMap>
                            </div>

                            {/* Climate data display */}
                            <Flex gap="3" wrap="wrap">
                                <Card style={{ background: '#dbeafe', padding: '12px', flex: '1 1 280px' }}>
                                    <Text size="3" weight="bold" mb="1">Current Conditions</Text>
                                    <Text as="p" size="2">
                                        Temperature: {climateData.current_condition[0].temp_C}°C / {climateData.current_condition[0].temp_F}°F
                                    </Text>
                                    <Text as="p" size="2">
                                        Feels like: {climateData.current_condition[0].FeelsLikeC}°C
                                    </Text>
                                    <Text as="p" size="2">
                                        Condition: {climateData.current_condition[0].weatherDesc[0].value}
                                    </Text>
                                    <Text as="p" size="2">
                                        Humidity: {climateData.current_condition[0].humidity}%
                                    </Text>
                                    <Text as="p" size="2">
                                        Wind: {climateData.current_condition[0].windspeedKmph} km/h
                                    </Text>
                                </Card>
                                
                                <Card style={{ background: '#dbeafe', padding: '12px', flex: '1 1 280px' }}>
                                    <Text size="3" weight="bold" mb="1">Today's Forecast</Text>
                                    <Text as="p" size="2">
                                        Date: {climateData.weather[0].date}
                                    </Text>
                                    <Text as="p" size="2">
                                        High: {climateData.weather[0].maxtempC}°C
                                    </Text>
                                    <Text as="p" size="2">
                                        Low: {climateData.weather[0].mintempC}°C
                                    </Text>
                                    <Text as="p" size="2">
                                        Average: {climateData.weather[0].avgtempC}°C
                                    </Text>
                                    <Text as="p" size="2">
                                        Sunlight: {climateData.weather[0].sunHour} hours
                                    </Text>
                                </Card>
                            </Flex>
                        </>
                    )}
                </Box>
            )}
        </Box>
    );
}
