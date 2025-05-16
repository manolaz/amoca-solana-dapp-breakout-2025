import React from 'react';
import { Card, Flex, Text } from '@radix-ui/themes';
import { WeatherData } from './types';

interface WeatherStatusCardProps {
    climateData: WeatherData;
}

export function WeatherStatusCard({ climateData }: WeatherStatusCardProps) {
    const currentWeather = climateData.current_condition[0];
    
    return (
        <Card style={{ 
            background: 'rgba(14, 165, 233, 0.1)', 
            padding: '8px 16px',
            borderRadius: '12px'
        }}>
            <Flex align="center" gap="2">
                <Text size="2" weight="bold">Current:</Text>
                <Text size="2">
                    {currentWeather.temp_C}°C / {currentWeather.weatherDesc[0].value}
                </Text>
            </Flex>
        </Card>
    );
}
