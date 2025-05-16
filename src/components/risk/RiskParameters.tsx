import { Box, Text, Heading, Flex, Card } from '@radix-ui/themes';
import { ParamDef } from './types';

interface RiskParametersProps {
    params: ParamDef[];
    paramValues: Record<string, number>;
    onParamChange: (id: string, value: number) => void;
    riskScore: number;
}

export function RiskParameters({
    params,
    paramValues,
    onParamChange,
    riskScore
}: RiskParametersProps) {
    // Function to get appropriate emoji based on parameter ID
    const getParamEmoji = (id: string): string => {
        switch (id) {
            case 'freq': return '🔄';
            case 'coastVuln': return '🌊';
            case 'rainfall': return '🌧️';
            case 'drainage': return '🚿';
            case 'duration': return '⏱️';
            case 'severity': return '📊';
            case 'temp': return '🌡️';
            case 'slope': return '⛰️';
            default: return '🔧';
        }
    };
    
    // Function to get color based on parameter value percentage
    const getValueColor = (value: number, min: number, max: number): string => {
        const percentage = (value - min) / (max - min);
        if (percentage < 0.3) return '#10b981'; // Green for low values
        if (percentage < 0.7) return '#f59e0b'; // Yellow for medium values
        return '#ef4444'; // Red for high values
    };
    
    // Function to get risk score color
    const getRiskScoreColor = (score: number): string => {
        if (score < 30) return 'var(--green-9)';
        if (score < 70) return 'var(--amber-9)';
        return 'var(--red-9)';
    };

    return (
        <Box mb="4">
            <Heading size="4" mb="3" style={{ textAlign: 'center' }}>
                🎛️ Adjust Risk Parameters 🎛️
            </Heading>
            
            <Flex direction="column" gap="3">
                {params.map(p => (
                    <Card 
                        key={p.id} 
                        style={{ 
                            background: 'var(--gray-2)',
                            borderRadius: '10px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Flex gap="3" align="center" mb="2">
                            <Box style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%',
                                background: 'var(--accent-3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px'
                            }}>
                                {getParamEmoji(p.id)}
                            </Box>
                            <Box style={{ flex: 1 }}>
                                <Flex justify="between" align="baseline">
                                    <Text weight="bold">{p.label}</Text>
                                    <Text 
                                        size="5" 
                                        weight="bold" 
                                        style={{ 
                                            color: getValueColor(paramValues[p.id], p.min, p.max),
                                            fontVariantNumeric: 'tabular-nums'
                                        }}
                                    >
                                        {paramValues[p.id]}
                                    </Text>
                                </Flex>
                                <Text size="1" color="gray" mt="1">{p.description}</Text>
                            </Box>
                        </Flex>
                        
                        {/* Custom styled slider container */}
                        <Box style={{ position: 'relative', padding: '8px 0' }}>
                            <Box style={{ 
                                height: '8px', 
                                background: 'linear-gradient(to right, var(--green-5), var(--amber-5), var(--red-5))',
                                borderRadius: '4px'
                            }} />
                            <input
                                type="range"
                                min={p.min}
                                max={p.max}
                                step={p.step}
                                value={paramValues[p.id] || 0}
                                onChange={e => onParamChange(p.id, Number(e.target.value))}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0.5,
                                    cursor: 'pointer',
                                }}
                            />
                        </Box>
                        
                        {/* Min/Max labels */}
                        <Flex justify="between" mt="1">
                            <Text size="1">{p.min}</Text>
                            <Text size="1">{p.max}</Text>
                        </Flex>
                    </Card>
                ))}
            </Flex>
            
            {/* Risk score display */}
            <Card 
                mt="4" 
                style={{ 
                    background: 'var(--accent-2)',
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    borderLeft: `4px solid ${getRiskScoreColor(riskScore)}`
                }}
            >
                <Text weight="bold" mb="2">Overall Risk Assessment</Text>
                <Flex align="center" justify="center" gap="2">
                    <Text size="6">🎯</Text>
                    <Box>
                        <Text size="6" weight="bold" style={{ color: getRiskScoreColor(riskScore) }}>
                            {riskScore}
                            <Text size="2" style={{ opacity: 0.7 }}>/100</Text>
                        </Text>
                    </Box>
                </Flex>
                <Text size="2" style={{ opacity: 0.7 }} mt="1">
                    {riskScore < 30 ? 'Low Risk Level' : 
                     riskScore < 70 ? 'Moderate Risk Level' : 'High Risk Level'}
                </Text>
                
                {/* Risk meter visualization */}
                <Box mt="2" style={{ padding: '0 16px' }}>
                    <Box style={{ 
                        height: '8px', 
                        background: 'linear-gradient(to right, var(--green-5), var(--amber-5), var(--red-5))',
                        borderRadius: '4px',
                        position: 'relative'
                    }}>
                        <Box style={{
                            position: 'absolute',
                            left: `${riskScore}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: getRiskScoreColor(riskScore),
                            border: '2px solid white',
                            boxShadow: '0 0 4px rgba(0,0,0,0.3)'
                        }} />
                    </Box>
                    <Flex justify="between" mt="1">
                        <Text size="1">Low</Text>
                        <Text size="1">Medium</Text>
                        <Text size="1">High</Text>
                    </Flex>
                </Box>
            </Card>
        </Box>
    );
}
