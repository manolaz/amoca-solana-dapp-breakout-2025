import React from 'react';
import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { WeatherData } from './types';

interface ForecastCardProps {
    climateData: WeatherData;
}

export function ForecastCard({ climateData }: ForecastCardProps) {
    const forecast = climateData.weather[0];
    
    return (
        <Card style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            padding: '20px', 
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative elements */}
            <div style={{ 
                position: 'absolute', 
                top: '-20px', 
                right: '-20px', 
                fontSize: '80px',
                opacity: 0.15
            }}>
                ☀️
            </div>
            <div style={{ 
                position: 'absolute', 
                bottom: '-15px', 
                left: '10%', 
                fontSize: '60px',
                opacity: 0.1
            }}>
                🌦️
            </div>
            
            {/* Header */}
            <Flex align="center" justify="center" gap="2" mb="4">
                <Text size="4" weight="bold" style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    🌈 Today's Forecast 🌈
                </Text>
            </Flex>
            
            {/* Main content area */}
            <Flex direction={{ initial: 'column', sm: 'row' }} gap="4" style={{ position: 'relative', zIndex: 1 }}>
                {/* Temperature section */}
                <Card style={{ 
                    flex: 1, 
                    background: 'rgba(255,255,255,0.15)', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <Heading size="3" style={{ color: 'white', textAlign: 'center', marginBottom: '12px' }}>
                        Temperature Range
                    </Heading>
                    
                    <Flex gap="3" justify="between">
                        <Box style={{ textAlign: 'center' }}>
                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>LOW TEMP</Text>
                            <Text size="7" weight="bold" style={{ color: 'white' }}>
                                {forecast.mintempC}°
                            </Text>
                            <Text size="5">❄️</Text>
                            <Text size="1" style={{ color: 'white', opacity: 0.7 }}>Stay warm!</Text>
                        </Box>
                        
                        <Box style={{ textAlign: 'center' }}>
                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>HIGH TEMP</Text>
                            <Text size="7" weight="bold" style={{ color: 'white' }}>
                                {forecast.maxtempC}°
                            </Text>
                            <Text size="5">🌡️</Text>
                            <Text size="1" style={{ color: 'white', opacity: 0.7 }}>Stay cool!</Text>
                        </Box>
                        
                        <Box style={{ textAlign: 'center' }}>
                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>AVG TEMP</Text>
                            <Text size="7" weight="bold" style={{ color: 'white' }}>
                                {forecast.avgtempC}°
                            </Text>
                            <Text size="5">🌤️</Text>
                            <Text size="1" style={{ color: 'white', opacity: 0.7 }}>Day average</Text>
                        </Box>
                    </Flex>
                </Card>
                
                {/* Sun & Protection section */}
                <Card style={{ 
                    flex: 1, 
                    background: 'rgba(255,255,255,0.15)', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <Heading size="3" style={{ color: 'white', textAlign: 'center', marginBottom: '12px' }}>
                        Sun & Protection
                    </Heading>
                    
                    <Flex gap="3" mb="3">
                        <Box style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>SUNLIGHT</Text>
                            <Text size="6" weight="bold" style={{ color: 'white' }}>
                                {forecast.sunHour}h
                            </Text>
                            <Text size="5">☀️</Text>
                        </Box>
                        
                        <Box style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                            <Text size="2" style={{ color: 'white', opacity: 0.8 }}>UV INDEX</Text>
                            <Text size="6" weight="bold" style={{ color: 'white' }}>
                                {climateData.current_condition[0].uvIndex || "N/A"}
                            </Text>
                            <Text size="5">🕶️</Text>
                        </Box>
                    </Flex>
                    
                    <Card style={{ background: 'rgba(255, 236, 179, 0.3)', padding: '10px', borderRadius: '8px' }}>
                        <Heading size="1" style={{ color: 'white', marginBottom: '4px' }}>
                            🛡️ Weather Protection Tips:
                        </Heading>
                        <Box>
                            <Text as="p" size="1" style={{ color: 'white', margin: '2px 0' }}>
                                • {parseInt(forecast.maxtempC) > 30 ? '🥵 Heat protection: Stay hydrated, seek shade' : 
                                  parseInt(forecast.mintempC) < 10 ? '🧣 Cold protection: Layer clothing, limit exposure' :
                                  '👕 Moderate temperature: Comfortable conditions'}
                            </Text>
                            <Text as="p" size="1" style={{ color: 'white', margin: '2px 0' }}>
                                • {parseInt(climateData.current_condition[0].uvIndex) > 7 ? '🧴 High UV: Apply SPF50+ sunscreen regularly' :
                                  parseInt(climateData.current_condition[0].uvIndex) > 3 ? '🧢 Moderate UV: Wear hat and sunglasses' :
                                  '✅ Low UV: Basic sun protection advised'}
                            </Text>
                            <Text as="p" size="1" style={{ color: 'white', margin: '2px 0' }}>
                                • {parseFloat(climateData.current_condition[0].precipMM) > 5 ? '☂️ Rain expected: Bring waterproof gear' :
                                  '🌂 Low precipitation: Minimal rain protection needed'}
                            </Text>
                        </Box>
                    </Card>
                </Card>
            </Flex>
        </Card>
    );
}
