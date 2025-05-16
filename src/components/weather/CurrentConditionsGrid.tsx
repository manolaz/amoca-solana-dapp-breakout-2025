import React from 'react';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { WeatherData } from './types';

interface CurrentConditionsGridProps {
    climateData: WeatherData;
}

// Helper function to determine weather color
const getWeatherColor = (tempC: number): string => {
    if (tempC >= 35) return '#ef4444'; // Hot (red)
    if (tempC >= 28) return '#f97316'; // Warm (orange) 
    if (tempC >= 20) return '#facc15'; // Mild (yellow)
    if (tempC >= 10) return '#22c55e'; // Cool (green)
    if (tempC >= 0) return '#38bdf8';  // Cold (blue)
    return '#6366f1'; // Very cold (indigo)
};

export function CurrentConditionsGrid({ climateData }: CurrentConditionsGridProps) {
    const currentCondition = climateData.current_condition[0];
    const tempC = parseInt(currentCondition.temp_C);
    
    // Weather emoji based on conditions
    const getWeatherEmoji = (desc: string): string => {
        const lowercaseDesc = desc.toLowerCase();
        if (lowercaseDesc.includes('rain')) return '🌧️';
        if (lowercaseDesc.includes('cloud')) return '☁️';
        if (lowercaseDesc.includes('sun') || lowercaseDesc.includes('clear')) return '☀️';
        if (lowercaseDesc.includes('storm')) return '⛈️';
        if (lowercaseDesc.includes('snow')) return '❄️';
        return '🌈';
    };
    
    return (
        <Box mt="3">
            <Heading size="3" mb="2" style={{ color: '#0369a1' }}>
                ✨ Current Conditions ✨
            </Heading>
            
            <Flex gap="3" wrap="wrap">
                {/* Temperature */}
                <Card style={{ 
                    background: getWeatherColor(tempC),
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
                        {currentCondition.temp_C}°C
                    </Text>
                    <Text size="1" style={{ color: 'white', opacity: 0.9 }}>
                        {currentCondition.temp_F}°F
                    </Text>
                    <Text size="6" style={{ marginTop: '4px' }}>
                        {tempC > 30 ? '🔥' : 
                         tempC > 20 ? '☀️' : 
                         tempC > 10 ? '🌤️' : '❄️'}
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
                        {getWeatherEmoji(currentCondition.weatherDesc[0].value)}
                    </Text>
                    <Text size="2" weight="bold" style={{ color: 'white', textAlign: 'center' }}>
                        {currentCondition.weatherDesc[0].value}
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
                        {currentCondition.humidity}%
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
                        {currentCondition.windspeedKmph}
                    </Text>
                    <Text size="2" style={{ color: 'white', opacity: 0.9 }}>km/h</Text>
                </Card>
            </Flex>
        </Box>
    );
}
