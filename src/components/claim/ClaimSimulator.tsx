import { Box, Heading, Text, Button, Flex, Card, Separator } from '@radix-ui/themes';
import React, { useState, useEffect } from 'react';
import { CheckCircledIcon, CrossCircledIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { LocationInfo, RiskType, WeatherData } from '../risk/types';

interface ClaimSimulatorProps {
    weatherData: WeatherData | null;
    locationInfo: LocationInfo | null;
    selectedRisk: RiskType;
    paramValues: Record<string, number>;
    coverage: number;
}

export function ClaimSimulator({ weatherData, locationInfo, selectedRisk, paramValues, coverage }: ClaimSimulatorProps) {
    const [claimStatus, setClaimStatus] = useState<'idle' | 'checking' | 'approved' | 'denied'>('idle');
    const [claimReason, setClaimReason] = useState<string>('');
    const [payout, setPayout] = useState<number>(0);
    const [showDetails, setShowDetails] = useState<boolean>(false);

    // Function to check if current weather conditions trigger a claim
    const checkClaimEligibility = () => {
        if (!weatherData) return false;
        
        setClaimStatus('checking');
        
        // Simulate processing time
        setTimeout(() => {
            let isEligible = false;
            let reason = '';
            let payoutAmount = 0;
            
            // Different checks based on risk type
            switch (selectedRisk.id) {
                case 'flood':
                    const precipThreshold = paramValues['rainfall'] || 5;
                    const currentPrecip = parseFloat(weatherData.current_condition[0].precipMM);
                    
                    if (currentPrecip > precipThreshold) {
                        isEligible = true;
                        reason = `Rainfall (${currentPrecip}mm) exceeds threshold (${precipThreshold}mm)`;
                        payoutAmount = calculatePayout(coverage, currentPrecip / precipThreshold);
                    } else {
                        reason = `Current rainfall (${currentPrecip}mm) below threshold (${precipThreshold}mm)`;
                    }
                    break;
                
                case 'heatwave':
                    const tempThreshold = paramValues['temp'] || 35;
                    const currentTemp = parseInt(weatherData.current_condition[0].temp_C);
                    
                    if (currentTemp > tempThreshold) {
                        isEligible = true;
                        reason = `Temperature (${currentTemp}°C) exceeds threshold (${tempThreshold}°C)`;
                        payoutAmount = calculatePayout(coverage, currentTemp / tempThreshold);
                    } else {
                        reason = `Current temperature (${currentTemp}°C) below threshold (${tempThreshold}°C)`;
                    }
                    break;
                
                case 'typhoon':
                    const windThreshold = paramValues['freq'] ? paramValues['freq'] * 10 : 60;
                    const currentWind = parseInt(weatherData.current_condition[0].windspeedKmph);
                    
                    if (currentWind > windThreshold) {
                        isEligible = true;
                        reason = `Wind speed (${currentWind} km/h) exceeds threshold (${windThreshold} km/h)`;
                        payoutAmount = calculatePayout(coverage, currentWind / windThreshold);
                    } else {
                        reason = `Current wind speed (${currentWind} km/h) below threshold (${windThreshold} km/h)`;
                    }
                    break;
                
                case 'drought':
                    const humidityThreshold = 40; // Example threshold
                    const currentHumidity = parseInt(weatherData.current_condition[0].humidity);
                    
                    if (currentHumidity < humidityThreshold) {
                        isEligible = true;
                        reason = `Humidity (${currentHumidity}%) below drought threshold (${humidityThreshold}%)`;
                        payoutAmount = calculatePayout(coverage, 1 - (currentHumidity / humidityThreshold));
                    } else {
                        reason = `Current humidity (${currentHumidity}%) above drought threshold (${humidityThreshold}%)`;
                    }
                    break;
                
                default:
                    reason = "Unable to determine eligibility for this risk type";
            }
            
            setClaimStatus(isEligible ? 'approved' : 'denied');
            setClaimReason(reason);
            setPayout(payoutAmount);
            
        }, 1500); // Simulate a brief delay for processing
    };
    
    // Calculate payout based on coverage and severity multiplier
    const calculatePayout = (coverageAmount: number, severityMultiplier: number): number => {
        // Cap the multiplier to prevent excessive payouts
        const cappedMultiplier = Math.min(severityMultiplier, 2.0);
        return parseFloat((coverageAmount * cappedMultiplier).toFixed(2));
    };
    
    // Reset the simulation
    const resetClaimCheck = () => {
        setClaimStatus('idle');
        setClaimReason('');
        setPayout(0);
    };

    return (
        <Card mb="4" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <Flex align="center" gap="2" mb="3">
                <Text as="span" size="6" style={{ color: 'white' }}>🔄</Text>
                <Heading size="4" style={{ color: 'white' }}>
                    Smart Contract Claim Simulator
                </Heading>
            </Flex>
            
            <Text as="p" size="2" style={{ color: 'white', marginBottom: '16px', opacity: 0.9 }}>
                Parametric insurance automatically triggers payouts when predefined conditions are met, with no manual claims process. 
                See if current weather conditions would trigger a payout for your policy.
            </Text>
            
            {!weatherData || !locationInfo ? (
                <Box style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px' }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        Please share your location to simulate claims based on current weather conditions.
                    </Text>
                </Box>
            ) : (
                <>
                    <Card style={{ background: 'rgba(255,255,255,0.15)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                        <Flex justify="between" wrap="wrap" gap="3">
                            <Box>
                                <Text size="2" style={{ color: 'white', opacity: 0.8 }}>LOCATION</Text>
                                <Text size="3" style={{ color: 'white' }}>
                                    {locationInfo.city}, {locationInfo.country}
                                </Text>
                            </Box>
                            
                            <Box>
                                <Text size="2" style={{ color: 'white', opacity: 0.8 }}>RISK TYPE</Text>
                                <Text size="3" style={{ color: 'white' }}>
                                    {selectedRisk.emoji} {selectedRisk.name}
                                </Text>
                            </Box>
                            
                            <Box>
                                <Text size="2" style={{ color: 'white', opacity: 0.8 }}>COVERAGE</Text>
                                <Text size="3" style={{ color: 'white' }}>
                                    {coverage} SOL
                                </Text>
                            </Box>
                        </Flex>
                        
                        <Button 
                            mt="3" 
                            color="indigo" 
                            variant="soft" 
                            onClick={() => setShowDetails(!showDetails)}
                            style={{ width: '100%' }}
                        >
                            {showDetails ? 'Hide Details' : 'Show Policy Parameters'}
                        </Button>
                        
                        {showDetails && (
                            <Box mt="3" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px' }}>
                                <Heading size="2" style={{ color: 'white', marginBottom: '8px' }}>
                                    Policy Parameters
                                </Heading>
                                <Flex direction="column" gap="2">
                                    {selectedRisk.params.map(param => (
                                        <Flex key={param.id} justify="between">
                                            <Text size="2" style={{ color: 'white' }}>
                                                {param.label}:
                                            </Text>
                                            <Text size="2" weight="bold" style={{ color: 'white' }}>
                                                {paramValues[param.id] || param.defaultValue}
                                            </Text>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Box>
                        )}
                    </Card>
                    
                    {claimStatus === 'idle' && (
                        <Button 
                            onClick={checkClaimEligibility} 
                            color="cyan" 
                            size="3"
                            style={{ width: '100%' }}
                        >
                            Check Claim Eligibility
                        </Button>
                    )}
                    
                    {claimStatus === 'checking' && (
                        <Card style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                            <Text size="2" style={{ color: 'white', marginBottom: '12px' }}>
                                Checking current weather conditions against policy parameters...
                            </Text>
                            <Box style={{ display: 'flex', justifyContent: 'center', gap: '16px', color: 'white' }}>
                                <div className="pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white', opacity: 0.7 }}></div>
                                <div className="pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white', opacity: 0.8 }}></div>
                                <div className="pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white', opacity: 0.9 }}></div>
                            </Box>
                        </Card>
                    )}
                    
                    {claimStatus === 'approved' && (
                        <Card style={{ 
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            padding: '16px', 
                            borderRadius: '8px'
                        }}>
                            <Flex align="center" gap="2">
                                <CheckCircledIcon width={24} height={24} style={{ color: 'white' }} />
                                <Heading size="3" style={{ color: 'white' }}>
                                    Claim Condition Met!
                                </Heading>
                            </Flex>
                            
                            <Text as="p" size="2" style={{ color: 'white', marginTop: '8px' }}>
                                {claimReason}
                            </Text>
                            
                            <Separator size="4" my="3" style={{ background: 'rgba(255,255,255,0.2)' }} />
                            
                            <Box style={{ textAlign: 'center' }}>
                                <Text size="2" style={{ color: 'white', opacity: 0.9 }}>AUTOMATIC PAYOUT AMOUNT</Text>
                                <Text size="7" weight="bold" style={{ color: 'white' }}>
                                    {payout} SOL
                                </Text>
                                
                                <Flex gap="3" mt="3">
                                    <Card style={{ flex: 1, background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '8px' }}>
                                        <Text size="2" style={{ color: 'white', textAlign: 'center' }}>
                                            <ArrowRightIcon /> Payout would be sent automatically to your wallet
                                        </Text>
                                    </Card>
                                </Flex>
                            </Box>
                            
                            <Button onClick={resetClaimCheck} color="gray" variant="soft" style={{ width: '100%', marginTop: '16px' }}>
                                Reset Simulation
                            </Button>
                        </Card>
                    )}
                    
                    {claimStatus === 'denied' && (
                        <Card style={{ 
                            background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                            padding: '16px', 
                            borderRadius: '8px'
                        }}>
                            <Flex align="center" gap="2">
                                <CrossCircledIcon width={24} height={24} style={{ color: 'white' }} />
                                <Heading size="3" style={{ color: 'white' }}>
                                    No Claim Triggered
                                </Heading>
                            </Flex>
                            
                            <Text as="p" size="2" style={{ color: 'white', marginTop: '8px' }}>
                                {claimReason}
                            </Text>
                            
                            <Box style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
                                <Text size="2" style={{ color: 'white' }}>
                                    Your policy remains active and will automatically trigger a payout if conditions meet your policy parameters in the future.
                                </Text>
                            </Box>
                            
                            <Button onClick={resetClaimCheck} color="gray" variant="soft" style={{ width: '100%', marginTop: '16px' }}>
                                Reset Simulation
                            </Button>
                        </Card>
                    )}
                </>
            )}
        </Card>
    );
}
