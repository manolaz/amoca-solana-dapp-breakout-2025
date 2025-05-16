import { Box, Text, Flex, Card, Heading } from '@radix-ui/themes';

interface CoverageFormProps {
    coverage: number;
    durationMonths: number;
    onCoverageChange: (value: number) => void;
    onDurationChange: (value: number) => void;
}

export function CoverageForm({
    coverage,
    durationMonths,
    onCoverageChange,
    onDurationChange
}: CoverageFormProps) {
    return (
        <>
            <Card 
                mb="4" 
                style={{
                    background: 'linear-gradient(135deg, #3498db, #2ecc71)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
            >
                <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                        <Text as="span" weight="bold" size="5" style={{ color: 'white' }}>
                            🛡️ Coverage Protection
                        </Text>
                    </Flex>
                    
                    <Box style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                        <Text as="span" size="2" style={{ color: 'white', marginBottom: '8px', display: 'block' }}>
                            Your protection amount (SOL):
                        </Text>
                        <Flex align="center" gap="2">
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                step="1"
                                value={coverage}
                                onChange={e => onCoverageChange(Number(e.target.value))}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '6px', 
                                    width: '120px',
                                    border: 'none',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Text as="span" size="6" weight="bold" style={{ color: 'white' }}>SOL</Text>
                        </Flex>
                    </Box>
                    
                    <Box style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
                        <Text as="p" size="2" style={{ color: 'white', margin: 0 }}>
                            💪 <strong>Strong Protection:</strong> Covers against climate-related losses
                        </Text>
                        <Text as="p" size="2" style={{ color: 'white', margin: '4px 0 0 0' }}>
                            ⚡ <strong>Quick Payouts:</strong> Automated claims via smart contracts
                        </Text>
                        <Text as="p" size="2" style={{ color: 'white', margin: '4px 0 0 0' }}>
                            🔒 <strong>Secure Coverage:</strong> Backed by Solana blockchain
                        </Text>
                    </Box>
                </Flex>
            </Card>
            
            <Card 
                mb="4" 
                style={{
                    background: 'linear-gradient(135deg, #9b59b6, #3498db)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
            >
                <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                        <Text as="span" weight="bold" size="5" style={{ color: 'white' }}>
                            ⏱️ Coverage Duration
                        </Text>
                    </Flex>
                    
                    <Box style={{ background: 'rgba(255,255,255,0.2)', padding: '15px', borderRadius: '8px' }}>
                        <Text as="span" size="2" style={{ color: 'white', marginBottom: '8px', display: 'block' }}>
                            Protection period (months):
                        </Text>
                        <Flex align="center" gap="2">
                            <input
                                type="number"
                                min="1"
                                max="12"
                                step="1"
                                value={durationMonths}
                                onChange={e => onDurationChange(Number(e.target.value))}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '6px', 
                                    width: '80px',
                                    border: 'none',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Text as="span" size="6" weight="bold" style={{ color: 'white' }}>Months</Text>
                        </Flex>
                    </Box>
                    
                    <Flex gap="3" wrap="wrap">
                        <Box style={{ flex: 1, background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', minWidth: '150px' }}>
                            <Flex align="center" gap="2" mb="1">
                                <Text size="5">📅</Text>
                                <Heading size="2" style={{ color: 'white' }}>
                                    Time-Based Protection
                                </Heading>
                            </Flex>
                            <Text as="p" size="2" style={{ color: 'white', margin: '4px 0 0 0' }}>
                                Longer coverage means extended protection against seasonal climate events
                            </Text>
                        </Box>
                        
                        <Box style={{ flex: 1, background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', minWidth: '150px' }}>
                            <Flex align="center" gap="2" mb="1">
                                <Text size="5">🌊</Text>
                                <Heading size="2" style={{ color: 'white' }}>
                                    Seasonal Coverage
                                </Heading>
                            </Flex>
                            <Text as="p" size="2" style={{ color: 'white', margin: '4px 0 0 0' }}>
                                Plan ahead for monsoon, hurricane and wildfire seasons
                            </Text>
                        </Box>
                    </Flex>
                    
                    <Box style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px' }}>
                        <Text as="p" size="2" style={{ color: 'white', margin: 0 }}>
                            ⚠️ <strong>Risk Assessment:</strong> Longer periods may cover multiple climate risk seasons
                        </Text>
                        <Text as="p" size="2" style={{ color: 'white', margin: '4px 0 0 0' }}>
                            💰 <strong>Value Optimization:</strong> Longer durations provide better cost efficiency
                        </Text>
                        <Text as="p" size="2" style={{ color: 'white', margin: '4px 0 0 0' }}>
                            🔄 <strong>Auto-Renewal Options:</strong> Set once and forget with optional renewal
                        </Text>
                    </Box>
                </Flex>
            </Card>
        </>
    );
}
