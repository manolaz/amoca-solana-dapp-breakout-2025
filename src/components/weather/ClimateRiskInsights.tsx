import React from 'react';
import { Box, Card, Flex, Heading, Text, Button } from '@radix-ui/themes';
import { WeatherData, LocationInfo } from './types';

interface ClimateRiskInsightsProps {
    climateData: WeatherData;
    locationInfo: LocationInfo;
    showDetails: boolean;
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
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

export function ClimateRiskInsights({ climateData, locationInfo, showDetails, setShowDetails }: ClimateRiskInsightsProps) {
    const tempC = parseInt(climateData.current_condition[0].temp_C);
    
    return (
        <Card mt="3" style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid rgba(255,255,255,0.2)'
        }}>
            <Flex align="center" gap="2" mb="1">
                <Text size="3" weight="bold" style={{ color: '#0f172a' }}>
                    🔍 Climate Risk Insights
                </Text>
                <Box style={{ 
                    background: getWeatherColor(tempC), 
                    borderRadius: '4px',
                    padding: '2px 8px',
                }}>
                    <Text size="1" weight="bold" style={{ color: 'white' }}>
                        {tempC > 35 ? 'EXTREME' :
                         tempC > 30 ? 'HIGH' : 
                         tempC < 5 ? 'COLD RISK' : 'MODERATE'}
                    </Text>
                </Box>
            </Flex>
            <Text as="p" size="2" style={{ color: '#0f172a', margin: '4px 0' }}>
                Today's conditions indicate {tempC > 30 ? 'increased heat-related risks' :
                tempC < 5 ? 'potential cold exposure concerns' :
                parseFloat(climateData.current_condition[0].precipMM) > 10 ? 'elevated flooding potential' :
                'standard climate conditions'} for this region. Our insurance packages offer protection against weather-related damages and health impacts.
            </Text>
            <Text size="1" style={{ color: '#64748b', opacity: 0.7, marginTop: '4px' }}>
                Based on historical data and current trends in {locationInfo?.city || 'your region'}
            </Text>
            
            {/* Policy details toggle button */}
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
                <Box mt="3" style={{ background: 'rgba(14, 116, 144, 0.1)', padding: '12px', borderRadius: '8px' }}>
                    <Heading size="2" style={{ color: '#0f172a', marginBottom: '8px' }}>
                        Climate Risk Details
                    </Heading>
                    <Flex direction="column" gap="2">
                        <Flex justify="between">
                            <Text size="2" style={{ color: '#0f172a' }}>
                                Temperature Risk Level:
                            </Text>
                            <Text size="2" weight="bold" style={{ color: '#0f172a' }}>
                                {tempC > 35 ? 'Severe' :
                                 tempC > 30 ? 'High' : 
                                 tempC < 5 ? 'Cold Risk' : 'Moderate'}
                            </Text>
                        </Flex>
                        <Flex justify="between">
                            <Text size="2" style={{ color: '#0f172a' }}>
                                Precipitation Risk:
                            </Text>
                            <Text size="2" weight="bold" style={{ color: '#0f172a' }}>
                                {parseFloat(climateData.current_condition[0].precipMM) > 10 ? 'High' :
                                 parseFloat(climateData.current_condition[0].precipMM) > 5 ? 'Moderate' : 'Low'}
                            </Text>
                        </Flex>
                        <Flex justify="between">
                            <Text size="2" style={{ color: '#0f172a' }}>
                                Wind Risk:
                            </Text>
                            <Text size="2" weight="bold" style={{ color: '#0f172a' }}>
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
