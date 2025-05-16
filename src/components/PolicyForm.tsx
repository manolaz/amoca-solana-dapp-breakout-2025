import { Box, Button, Text, Flex, Card, Heading } from '@radix-ui/themes';
import { useState, useEffect, useMemo } from 'react';

// Location-related type definitions
type LocationInfo = {
    city: string;
    country: string;
    lat: number;
    lng: number;
};

interface ParamDef {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    description: string;
}

interface RiskType {
    id: string;
    name: string;
    emoji: string;
    riskLevel: string;
    trend: string;
    description: string;
    color: string;
    params: ParamDef[];
}

// Base risk types that will be adjusted based on location
const baseRiskTypes: RiskType[] = [
    {
        id: 'typhoon',
        name: 'Typhoon Risk',
        emoji: '🌀',
        riskLevel: 'High Risk',
        trend: 'Increasing',
        description: "Manila is in a major typhoon path with an average of 5-7 typhoons making landfall annually in the Philippines. The city's coastal location increases vulnerability to storm surges.",
        color: 'var(--blue-3)',
        params: [
            { id: 'freq', label: 'Annual Frequency', min: 1, max: 10, step: 1, defaultValue: 6,
              description: 'Average typhoons per year' },
            { id: 'coastVuln', label: 'Coastal Vulnerability', min: 0, max: 10, step: 1, defaultValue: 7,
              description: 'Storm surge exposure' },
        ],
    },
    {
        id: 'flood',
        name: 'Flood Risk',
        emoji: '🌊',
        riskLevel: 'Extreme Risk',
        trend: 'Increasing',
        description: 'Manila experiences severe urban flooding due to its low-lying geography, inadequate drainage systems, and intense monsoon rains. Climate change is increasing the frequency of extreme rainfall events.',
        color: 'var(--cyan-3)',
        params: [
            { id: 'rainfall', label: 'Heavy Rainfall Intensity', min: 10, max: 100, step: 5, defaultValue: 50,
              description: 'mm of rainfall in a day' },
            { id: 'drainage', label: 'Drainage Capacity', min: 0, max: 10, step: 1, defaultValue: 3,
              description: '1-10 scale of drainage effectiveness' },
        ],
    },
    {
        id: 'drought',
        name: 'Drought Risk',
        emoji: '🏜️',
        riskLevel: 'Low Risk',
        trend: 'Stable',
        description: 'Manila experiences occasional water shortages during El Niño years, but severe droughts are relatively rare in this region.',
        color: 'var(--orange-3)',
        params: [
            { id: 'duration', label: 'Drought Duration', min: 1, max: 12, step: 1, defaultValue: 3,
              description: 'Months of potential drought' },
            { id: 'severity', label: 'Drought Severity', min: 1, max: 10, step: 1, defaultValue: 2,
              description: '1-10 scale of drought severity' },
        ],
    },
    {
        id: 'heatwave',
        name: 'Heatwave Risk',
        emoji: '🔥',
        riskLevel: 'Medium Risk',
        trend: 'Increasing',
        description: "Manila's urban heat island effect amplifies already high tropical temperatures. Heat index regularly exceeds dangerous levels during summer months.",
        color: 'var(--red-3)',
        params: [
            { id: 'temp', label: 'Max Temperature', min: 30, max: 50, step: 1, defaultValue: 38,
              description: '°C' },
            { id: 'duration', label: 'Heatwave Duration', min: 1, max: 7, step: 1, defaultValue: 3,
              description: 'Days of extreme heat' },
        ],
    },
    {
        id: 'landslide',
        name: 'Landslide Risk',
        emoji: '🏞️',
        riskLevel: 'Medium Risk',
        trend: 'Stable',
        description: 'While central Manila is relatively flat, surrounding areas in Metro Manila have landslide risks, particularly during heavy rainfall events.',
        color: 'var(--brown-3)',
        params: [
            { id: 'slope', label: 'Slope Steepness', min: 0, max: 100, step: 1, defaultValue: 15,
              description: 'Degrees' },
            { id: 'rainfall', label: 'Rainfall Before Landslide', min: 50, max: 300, step: 10, defaultValue: 100,
              description: 'mm of rainfall' },
        ],
    },
];

// Props to receive location information from parent component
interface PolicyFormProps {
    locationInfo?: LocationInfo | null;
    weatherData?: any;
}

export function PolicyForm({ locationInfo, weatherData }: PolicyFormProps) {
    // Location-aware risk types
    const [riskTypes, setRiskTypes] = useState<RiskType[]>(baseRiskTypes);
    
    const [selectedRiskTypeId, setSelectedRiskTypeId] = useState<string>(baseRiskTypes[0].id);
    const [paramValues, setParamValues] = useState<Record<string, number>>({});
    
    // Update risks based on location data
    useEffect(() => {
        if (!locationInfo) return;
        
        // Deep clone the base risk types
        const updatedRiskTypes = JSON.parse(JSON.stringify(baseRiskTypes)) as RiskType[];
        
        // Adjust risk types based on location
        for (const risk of updatedRiskTypes) {
            switch (risk.id) {
                case 'typhoon':
                    // Increase typhoon risk for Southeast Asian countries
                    if (['Philippines', 'Vietnam', 'Japan', 'Taiwan', 'China'].includes(locationInfo.country)) {
                        risk.riskLevel = 'Extreme Risk';
                        risk.description = `${locationInfo.city} is in a major typhoon path. ${risk.description}`;
                        // Update default parameter values
                        risk.params.find(p => p.id === 'freq')!.defaultValue = 8;
                    } else if (['United States', 'Mexico', 'Cuba'].includes(locationInfo.country)) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is vulnerable to hurricanes. ${risk.description}`;
                    } else {
                        risk.riskLevel = 'Low Risk';
                        risk.description = `${locationInfo.city} is not typically affected by tropical cyclones.`;
                    }
                    break;
                    
                case 'flood':
                    // Use weather data to determine flood risk if available
                    if (weatherData?.current_condition?.[0]?.precipMM > 5) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is currently experiencing heavy precipitation, increasing flood risk.`;
                        risk.params.find(p => p.id === 'rainfall')!.defaultValue = 
                            Math.min(100, Math.round(parseFloat(weatherData.current_condition[0].precipMM) * 10));
                    }
                    
                    // Coastal cities have higher flood risk
                    if (isCoastalLocation(locationInfo.lat, locationInfo.lng)) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is a coastal area with increased vulnerability to flooding.`;
                    }
                    break;
                    
                case 'drought':
                    // Adjust drought risk based on climate data
                    if (weatherData?.current_condition?.[0]?.humidity < 40) {
                        risk.riskLevel = 'Medium Risk';
                        risk.description = `${locationInfo.city} is currently experiencing dry conditions with low humidity.`;
                    }
                    break;
                    
                case 'heatwave':
                    // Use actual temperature data if available
                    if (weatherData?.current_condition?.[0]?.temp_C) {
                        const currentTemp = parseInt(weatherData.current_condition[0].temp_C);
                        if (currentTemp > 35) {
                            risk.riskLevel = 'High Risk';
                            risk.description = `${locationInfo.city} is currently experiencing high temperatures (${currentTemp}°C).`;
                            risk.params.find(p => p.id === 'temp')!.defaultValue = currentTemp;
                        }
                    }
                    break;
                    
                case 'landslide':
                    // Mountainous regions have higher landslide risk
                    if (isMountainousRegion(locationInfo.lat, locationInfo.lng)) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is in a mountainous area with increased landslide risk.`;
                    }
                    break;
            }
        }
        
        setRiskTypes(updatedRiskTypes);
    }, [locationInfo, weatherData]);
    
    // When risk types update, reset the selected risk type if needed
    useEffect(() => {
        // If the current selection doesn't exist in the new risk types, select the first one
        if (!riskTypes.find(r => r.id === selectedRiskTypeId)) {
            setSelectedRiskTypeId(riskTypes[0]?.id);
        }
    }, [riskTypes, selectedRiskTypeId]);

    const selectedRisk = riskTypes.find(r => r.id === selectedRiskTypeId) || riskTypes[0];

    // Initialize parameters when risk type changes
    useEffect(() => {
        if (!selectedRisk) return;
        
        const init: Record<string, number> = {};
        selectedRisk.params.forEach(p => init[p.id] = p.defaultValue);
        setParamValues(init);
    }, [selectedRiskTypeId, selectedRisk]);

    // Calculate risk score
    const riskScore = useMemo(() => {
        if (!selectedRisk) return 50;
        
        const vals = selectedRisk.params.map(p =>
            (paramValues[p.id] - p.min) / (p.max - p.min)
        );
        return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
    }, [selectedRisk, paramValues]);

    // Coverage & duration state
    const [coverage, setCoverage] = useState<number>(1);
    const [durationMonths, setDurationMonths] = useState<number>(1);

    // Calculate premium based on risk score and coverage
    const estimatedPremium = useMemo(
        () => Number((coverage * riskScore / 100).toFixed(2)),
        [coverage, riskScore],
    );
    
    // Potential payout equals the coverage amount
    const potentialPayout = coverage;

    return (
        <form>
            <Box mb="4">
                {locationInfo && (
                    <Text size="2" mb="2" style={{ color: 'var(--blue-11)' }}>
                        Risk assessment for {locationInfo.city}, {locationInfo.country}
                    </Text>
                )}
                <Heading size="4" mb="2">Select Risk Type:</Heading>
                <Flex direction="column" gap="3">
                    {riskTypes.map((risk) => (
                        <Card
                            key={risk.id}
                            onClick={() => setSelectedRiskTypeId(risk.id)}
                            style={{
                                cursor: 'pointer',
                                border: selectedRiskTypeId === risk.id ? '2px solid var(--accent-9)' : '2px solid transparent',
                                backgroundColor: risk.color,
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-3)',
                            }}
                        >
                            <Flex gap="3" align="center">
                                <Text size="6">{risk.emoji}</Text>
                                <Box flexGrow="1">
                                    <Heading size="3" mb="1">{risk.name}</Heading>
                                    <Text as="p" size="2" color="gray" mb="1">
                                        {risk.riskLevel} ({risk.trend}) - Score: {riskScore}/100
                                    </Text>
                                    <Text as="p" size="2">{risk.description}</Text>
                                </Box>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </Box>

            {/* Hidden input to store the selected risk type value for form submission */}
            {selectedRiskTypeId && <input type="hidden" name="riskType" value={selectedRiskTypeId} />}

            <Box mb="4">
                <Heading size="4" mb="2">Adjust Parameters:</Heading>
                {selectedRisk.params.map(p => (
                    <Box key={p.id} mb="3">
                        <Text mb="1">{p.label}: {paramValues[p.id]}</Text>
                        <input
                            type="range"
                            min={p.min}
                            max={p.max}
                            step={p.step}
                            value={paramValues[p.id] || 0}
                            onChange={e => setParamValues(prev => ({
                                ...prev,
                                [p.id]: Number(e.target.value)
                            }))}
                        />
                        <Text size="2" color="gray">{p.description}</Text>
                    </Box>
                ))}
                <Text size="3" mb="3">Calculated Risk Score: {riskScore}/100</Text>
            </Box>

            <Box mb="3">
                <label>
                    <Text as="span" mr="2">Coverage Amount (SOL):</Text>
                    <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={coverage}
                        onChange={e => setCoverage(Number(e.target.value))}
                        style={{ padding: 6, borderRadius: 6, width: 120 }}
                    />
                </label>
            </Box>
            <Box mb="3">
                <label>
                    <Text as="span" mr="2">Duration (months):</Text>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        step="1"
                        value={durationMonths}
                        onChange={e => setDurationMonths(Number(e.target.value))}
                        style={{ padding: 6, borderRadius: 6, width: 80 }}
                    />
                </label>
            </Box>

            {/* simulation output */}
            <Card
                mt="4"
                mb="4"
                style={{
                    backgroundColor: 'var(--gray-1)',
                    padding: 'var(--space-4)',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                }}
            >
                <Heading size="3" mb="3" style={{ textAlign: 'center', color: 'var(--gray-12)' }}>
                    ✨ Insurance Quote Details ✨
                </Heading>
                
                {/* Featured coverage amount - prominently displayed */}
                <Card style={{ 
                    backgroundColor: 'var(--green-4)',
                    padding: '18px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,120,0,0.1)'
                }}>
                    <Flex direction="column" align="center" justify="center">
                        <Text size="2" weight="bold" mb="1" style={{ color: 'var(--green-11)' }}>COVERAGE AMOUNT</Text>
                        <Text size="7" weight="bold" style={{ color: 'var(--green-12)' }}>💰 {coverage} SOL</Text>
                        <Text size="2" style={{ color: 'var(--green-11)' }}>Potential Payout</Text>
                    </Flex>
                </Card>
                
                <Flex direction="row" gap="3" wrap="wrap" mb="4">
                    <Card style={{ 
                        flex: '1 1 120px', 
                        backgroundColor: 'var(--cyan-3)', 
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '120px'
                    }}>
                        <Text size="5" mb="1">📊</Text>
                        <Text size="2" weight="bold">Risk Score</Text>
                        <Text size="4" weight="bold" style={{ 
                            color: 'var(--cyan-11)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>{riskScore}<Text size="2"> / 100</Text></Text>
                    </Card>
                    
                    <Card style={{ 
                        flex: '1 1 120px',
                        backgroundColor: 'var(--blue-3)', 
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '120px'
                    }}>
                        <Text size="5" mb="1">⏱️</Text>
                        <Text size="2" weight="bold">Duration</Text>
                        <Text size="4" weight="bold" style={{ 
                            color: 'var(--blue-11)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>{durationMonths}<Text size="2"> mo</Text></Text>
                    </Card>
                    
                    <Card style={{ 
                        flex: '1 1 120px',
                        backgroundColor: 'var(--amber-3)', 
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '120px'
                    }}>
                        <Text size="5" mb="1">💸</Text>
                        <Text size="2" weight="bold">Premium</Text>
                        <Text size="4" weight="bold" style={{ 
                            color: 'var(--amber-11)',
                            fontVariantNumeric: 'tabular-nums'
                        }}>{estimatedPremium}<Text size="2"> SOL</Text></Text>
                    </Card>
                </Flex>
                
                <Card style={{ 
                    backgroundColor: 'var(--violet-2)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    <Heading size="4" mb="2" style={{ color: 'var(--violet-11)' }}>
                        🧮 Premium Breakdown
                    </Heading>
                    <Box
                        as="ul"
                        style={{
                            margin: 0,
                            paddingLeft: '1rem',
                            color: 'var(--gray-11)',
                            fontSize: 13,
                        }}
                    >
                        <li>Premium Factor = Coverage × (Risk Score / 100)</li>
                        <li>Duration = Length of coverage period in months</li>
                        <li>Total Premium = Premium Factor (flat rate model)</li>
                    </Box>
                </Card>
            </Card>

            <Button type="submit" color="green" size="3">
                Buy Policy
            </Button>
        </form>
    );
}

// Helper function to determine if a location is coastal
function isCoastalLocation(lat: number, lng: number): boolean {
    // Simple proximity check - this would be more sophisticated in a real app
    // Returns true if the location is within ~50km of a coastline
    const coastalPoints = [
        // Major coastal point coordinates around the world
        // Format: [lat, lng]
        [14.5995, 120.9842], // Manila
        [13.0827, 80.2707],  // Chennai
        [25.0330, 121.5654], // Taipei
        [22.3193, 114.1694], // Hong Kong
        [1.3521, 103.8198],  // Singapore
        [31.2304, 121.4737], // Shanghai
        [35.6762, 139.6503], // Tokyo
        [19.0760, 72.8777],  // Mumbai
        [41.0082, 28.9784],  // Istanbul
        // Add more key coastal points as needed
    ];
    
    // Check if within ~50km of any coastal point (rough approximation)
    return coastalPoints.some(point => {
        const distance = Math.sqrt(
            Math.pow(lat - point[0], 2) + 
            Math.pow(lng - point[1], 2)
        );
        return distance < 0.5; // ~50km at equator
    });
}

// Helper function to determine if a location is mountainous
function isMountainousRegion(lat: number, lng: number): boolean {
    // Simple check for known mountainous regions
    const mountainRegions = [
        // Format: [lat, lng, radius]
        [27.9881, 86.9250, 3],  // Himalayas
        [45.8326, 6.8652, 1],   // Alps
        [39.1911, -106.8175, 1], // Rocky Mountains
        [36.5785, -118.2923, 1], // Sierra Nevada
        [33.9249, 75.7898, 1],  // Karakoram
        [-8.4095, -74.3976, 2],  // Andes
        // Add more mountain ranges as needed
    ];
    
    return mountainRegions.some(region => {
        const distance = Math.sqrt(
            Math.pow(lat - region[0], 2) + 
            Math.pow(lng - region[1], 2)
        );
        return distance < region[2];
    });
}
