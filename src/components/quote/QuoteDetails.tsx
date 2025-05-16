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
                    style={{
                        background: 'linear-gradient(90deg, #f0fdfa 60%, #e0f2fe 100%)',
                        border: '2px solid var(--cyan-7)',
                        borderRadius: 12,
                        padding: '1.25rem 1.5rem',
                        marginBottom: 14,
                        boxShadow: '0 2px 12px 0 var(--cyan-4)',
                        color: 'var(--cyan-12)',
                        fontWeight: 600,
                        fontSize: 16,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <span style={{ fontSize: 28, marginBottom: 6 }}>🧩</span>
                    <span style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: 'var(--cyan-11)' }}>
                        Premium Factor Explained
                    </span>
                    <span style={{ fontSize: 15, color: 'var(--cyan-12)', marginBottom: 6 }}>
                        <b>Premium Factor = Coverage × (Risk Score / 100)</b>
                    </span>
                    <ul style={{
                        textAlign: 'left',
                        color: 'var(--cyan-12)',
                        fontSize: 14,
                        margin: 0,
                        paddingLeft: 22,
                        listStyle: 'disc',
                        maxWidth: 420
                    }}>
                        <li>
                            <b>Coverage</b> (<span style={{ color: 'var(--green-11)' }}>💰</span>): The amount you want to insure, in SOL.
                        </li>
                        <li>
                            <b>Risk Score</b> (<span style={{ color: 'var(--amber-11)' }}>📊</span>): A value from 1–100, representing the likelihood of a claim (higher means more risk).
                        </li>
                        <li>
                            <b>How it works:</b> The higher your coverage or risk score, the higher your premium factor will be.
                        </li>
                        <li>
                            <b>Example:</b> If you insure <b>10 SOL</b> with a risk score of <b>40</b>, your Premium Factor is <b>10 × (40/100) = 4</b>.
                        </li>
                    </ul>
                </Box>
                <Box
                    as="ul"
                    style={{
                        margin: 0,
                        paddingLeft: '1rem',
                        color: 'var(--gray-11)',
                        fontSize: 13,
                    }}
                >
                    <li>
                        <b>Total Premium:</b> The final amount you pay, based on the Premium Factor and the selected duration. (Flat rate model)
                    </li>
                </Box>
                <Box
                    style={{
                        background: 'linear-gradient(90deg, #e0f2fe 60%, #fef9c3 100%)',
                        border: '2px solid var(--blue-7)',
                        borderRadius: 12,
                        padding: '1.25rem 1.5rem',
                        margin: '18px 0 14px 0',
                        boxShadow: '0 2px 12px 0 var(--blue-4)',
                        color: 'var(--blue-12)',
                        fontWeight: 600,
                        fontSize: 16,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <span style={{ fontSize: 28, marginBottom: 6 }}>⏱️</span>
                    <span style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: 'var(--blue-11)' }}>
                        Duration Explained
                    </span>
                    <span style={{ fontSize: 15, color: 'var(--blue-12)', marginBottom: 6 }}>
                        <b>Duration</b> is the length of time (in months) your insurance policy will be active.
                    </span>
                    <ul style={{
                        textAlign: 'left',
                        color: 'var(--blue-12)',
                        fontSize: 14,
                        margin: 0,
                        paddingLeft: 22,
                        listStyle: 'disc',
                        maxWidth: 420
                    }}>
                        <li>
                            <b>Flexible Terms:</b> Choose the number of months that best fits your needs.
                        </li>
                        <li>
                            <b>Longer Duration = More Protection:</b> The longer your policy, the longer you are covered against risks.
                        </li>
                        <li>
                            <b>Example:</b> If you select <b>6 months</b>, your coverage and premium apply for half a year.
                        </li>
                        <li>
                            <b>Tip:</b> Adjust duration to balance between cost and coverage period.
                        </li>
                    </ul>
                </Box>
            </Card>
        </Card>
    );
}
