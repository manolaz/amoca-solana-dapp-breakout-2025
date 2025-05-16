import { Box, Text, Card, Heading, Flex } from '@radix-ui/themes';

interface QuoteDetailsProps {
    coverage: number;
    durationMonths: number;
    riskScore: number;
    estimatedPremium: number;
}

export function QuoteDetails({
    coverage,
    durationMonths, 
    riskScore,
    estimatedPremium
}: QuoteDetailsProps) {
    return (
        <Card
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
    );
}
