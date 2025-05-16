import { Box, Container, Flex, Heading, Text } from '@radix-ui/themes';
import React, { useState, useEffect, useContext } from 'react';

import { ParametricInsuranceInfo } from './ParametricInsuranceInfo';
import { BuyPolicyGuide } from './BuyPolicyGuide';
import { LocationMap } from './LocationMap';
import { PolicyForm } from './PolicyForm';
import { InsuranceFAQ } from './InsuranceFAQ';
import { SelectedWalletAccountContext } from '../context/SelectedWalletAccountContext';

// Location interface
interface LocationInfo {
    lat: number;
    lng: number;
    city: string;
    country: string;
}

export function InsurancePolicyPage() {
    // Get selected wallet account from context
    const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
    
    // State for user location and map zoom/center
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [center, setCenter] = useState<[number, number]>([0, 0]);
    const [locating, setLocating] = useState(false);
    
    // Add state for location info and weather data
    const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
    const [weatherData, setWeatherData] = useState<any | null>(null);
    const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

    useEffect(() => {
        // Check if geolocation is available in the browser
        if (!navigator.geolocation) {
            console.log("Geolocation is not supported by this browser.");
            return;
        }

        // Function to get user's location
        const getLocation = () => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // Location obtained successfully
                    setLocationPermission('granted');
                    
                    // Get city and country from coordinates using reverse geocoding
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                        );
                        const data = await response.json();
                        
                        // Create location info object
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            city: data.address.city || data.address.town || data.address.village || 'Unknown',
                            country: data.address.country || 'Unknown'
                        };
                        
                        setLocationInfo(location);
                        
                        // Fetch weather data for this location
                        fetchWeatherData(position.coords.latitude, position.coords.longitude);
                    } catch (error) {
                        console.error("Error getting location details:", error);
                    }
                },
                (error) => {
                    console.log("Unable to retrieve your location:", error);
                    setLocationPermission('denied');
                }
            );
        };

        // Check for permission status and handle accordingly
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setLocationPermission(result.state as any);
                
                if (result.state === 'granted') {
                    getLocation();
                }
                
                // Listen for permission changes
                result.onchange = function() {
                    setLocationPermission(this.state as any);
                    if (this.state === 'granted') {
                        getLocation();
                    }
                };
            });
        } else {
            // Older browsers - just try to get location
            getLocation();
        }
    }, []);

    // Function to fetch weather data
    async function fetchWeatherData(lat: number, lng: number) {
        try {
            // This is a sample API - in a real app, you'd use a proper weather API with your key
            const response = await fetch(
                `https://wttr.in/${lat},${lng}?format=j1`
            );
            const data = await response.json();
            setWeatherData(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    // Request location permission
    function requestLocation() {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setLocationPermission('granted');
                
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                    );
                    const data = await response.json();
                    
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        city: data.address.city || data.address.town || data.address.village || 'Unknown',
                        country: data.address.country || 'Unknown'
                    };
                    
                    setLocationInfo(location);
                    
                    // Fetch weather data for this location
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                } catch (error) {
                    console.error("Error getting location details:", error);
                }
            },
            (error) => {
                console.log("Unable to retrieve your location:", error);
                setLocationPermission('denied');
            }
        );
    }

    return (
        <Box style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
            <Heading size="8" align="center" style={{ color: '#0e7490', marginBottom: 8 }}>
                Parametric Climate Insurance
            </Heading>

            <Text as="p" size="4" align="center" style={{ color: '#1e40af', marginBottom: 24 }}>
                Instant protection against climate events with automated payouts
            </Text>

            {locationPermission !== 'granted' && (
                <Flex 
                    justify="center" 
                    my="4" 
                    style={{ 
                        background: '#e0f2fe', 
                        padding: 16, 
                        borderRadius: 12 
                    }}
                >
                    <Text as="p" mr="3">
                        Share your location for personalized protection:
                    </Text>
                    <button
                        onClick={requestLocation}
                        style={{
                            background: '#0ea5e9',
                            color: 'white',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        Enable Location
                    </button>
                </Flex>
            )}

            {locationInfo && (
                <Box mb="4" style={{ background: '#f0fdfa', padding: 12, borderRadius: 8 }}>
                    <Text align="center">
                        Location: <strong>{locationInfo.city}, {locationInfo.country}</strong>
                    </Text>
                </Box>
            )}

            <Box mb="6">
                <BuyPolicyGuide />
            </Box>

            <Flex direction="column" gap="6">
                <Box style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Heading as="h2" size="5" style={{ color: '#0e7490', marginBottom: 16 }}>
                        Customize Your Policy
                    </Heading>
                    
                    <PolicyForm 
                        locationInfo={locationInfo} 
                        weatherData={weatherData}
                        walletAccount={selectedWalletAccount}
                    />
                </Box>
                
                <InsuranceFAQ />
            </Flex>
        </Box>
    );
}
