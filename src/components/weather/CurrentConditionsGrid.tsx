import React from 'react';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { WeatherData, getWeatherColor } from './types';

type CurrentConditionsGridProps = {
    climateData: WeatherData;
};

export function CurrentConditionsGrid({ climateData }: CurrentConditionsGridProps) {
    return (
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
            </Flex>
        </Box>
    );
}
