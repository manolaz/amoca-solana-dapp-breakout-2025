import React, { useState } from 'react';
import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { WeatherData, getWeatherColor, LocationInfo } from './types';

type ClimateRiskInsightsProps = {
    climateData: WeatherData;
    locationInfo: LocationInfo;
};

export function ClimateRiskInsights({ climateData, locationInfo }: ClimateRiskInsightsProps) {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
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
            
            <Button 
                mt="3" 
                color="indigo" 
                variant="soft" 
                onClick={() => setShowDetails(!showDetails)}
                style={{ width: '100%' }}
            >
                {showDetails ? 'Hide Risk Details' : 'Show Risk Details'}
            </Button>
            
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
    );
}
