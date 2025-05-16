import React from 'react';
import { Card, Flex, Text } from '@radix-ui/themes';
import { WeatherData, getWeatherColor } from './types';

type WeatherStatusCardProps = {
    climateData: WeatherData;
};

export function WeatherStatusCard({ climateData }: WeatherStatusCardProps) {
    return (
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
    );
}
