import { Box, Text, Flex, Card } from '@radix-ui/themes';

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
            
            <Box mb="3">
                <label>
                    <Text as="span" mr="2">Duration (months):</Text>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        step="1"
                        value={durationMonths}
                        onChange={e => onDurationChange(Number(e.target.value))}
                        style={{ padding: 6, borderRadius: 6, width: 80 }}
                    />
                </label>
            </Box>
        </>
    );
}
