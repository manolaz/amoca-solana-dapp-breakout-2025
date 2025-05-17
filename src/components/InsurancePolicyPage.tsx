import { Box, Heading, Text } from '@radix-ui/themes';
import React, { useState } from 'react';

import { ParametricInsuranceInfo } from './ParametricInsuranceInfo';
import { BuyPolicyGuide } from './BuyPolicyGuide';
import { LocationMap } from './LocationMap';
import { PolicyForm } from './PolicyForm';
import { InsuranceFAQ } from './InsuranceFAQ';
import { LocationInfo } from './risk/types';

export function InsurancePolicyPage() {
    // State for user location and map zoom/center
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [center, setCenter] = useState<[number, number]>([0, 0]);
    const [locating, setLocating] = useState(false);
    
    // Add state for location info and weather data
    const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
    const [weatherData, setWeatherData] = useState<any | null>(null);

    // Handler for location sharing
    const handleShareLocation = () => {
        setLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const { latitude, longitude } = pos.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setCenter([longitude, latitude]);
                    setZoom(4); // Zoom in to country/city level
                    setLocating(false);
                },
                err => {
                    setLocating(false);
                    alert(`Getting your location. Error: ${err.message}`);
                }
            );
        } else {
            setLocating(false);
            alert('Allocating your location.');
        }
    };
    
    // Handler for location detection with weather data
    const handleLocationDetected = (info: LocationInfo, weather: any) => {
        setLocationInfo(info);
        setWeatherData(weather);
    };

    return (
        <Box p="5">
            <Heading as="h2" size="6" mb="4" style={{ color: '#38bdf8' }}>
                Buy Insurance Policy
            </Heading>
            <Text as="p" mb="4">
                Select the type of climate risk you want protection against and purchase a parametric insurance policy.
            </Text>
            <ParametricInsuranceInfo />
            <BuyPolicyGuide />
            <LocationMap
                userLocation={userLocation}
                center={center}
                zoom={zoom}
                locating={locating}
                onShareLocation={handleShareLocation}
                onLocationDetected={handleLocationDetected}
            />
            
            {/* AMOCA Green Pool Image */}
            <Box 
                as="div" 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '2rem 0'
                }}
            >
                <img 
                    src="amoca/green-pool.svg" 
                    alt="AMOCA Green Pool" 
                    style={{ 
                        maxWidth: '240px', 
                        height: 'auto' 
                    }} 
                />
            </Box>
            
            <PolicyForm 
                locationInfo={locationInfo}
                weatherData={weatherData}
            />
            <InsuranceFAQ />
        </Box>
    );
}
