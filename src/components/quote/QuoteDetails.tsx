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
                background: 'linear-gradient(135deg, var(--gray-1) 70%, var(--cyan-1) 100%)',
                padding: 'var(--space-5)',
                borderRadius: '18px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                border: '1.5px solid var(--gray-4)',
                maxWidth: 700,
                margin: '0 auto'
            }}
        >
            <Heading size="3" mb="4" style={{ textAlign: 'center', color: 'var(--gray-12)', letterSpacing: 1 }}>
                ✨ Insurance Quote Details ✨
            </Heading>
            
            {/* Featured coverage amount - prominently displayed */}
            <Card style={{ 
                background: 'linear-gradient(90deg, var(--green-4) 70%, var(--green-2) 100%)',
                padding: '22px',
                borderRadius: '14px',
                textAlign: 'center',
                marginBottom: '22px',
                boxShadow: '0 6px 18px rgba(0,120,0,0.10)',
                border: '1.5px solid var(--green-6)',
                transition: 'transform 0.15s',
                cursor: 'pointer'
            }}
            tabIndex={0}
            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.025)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
                <Flex direction="column" align="center" justify="center">
                    <Text size="2" weight="bold" mb="1" style={{ color: 'var(--green-11)', letterSpacing: 0.5 }}>COVERAGE AMOUNT</Text>
                    <Text size="7" weight="bold" style={{ color: 'var(--green-12)', textShadow: '0 2px 8px var(--green-4)' }}>💰 {coverage} SOL</Text>
                    <Text size="2" style={{ color: 'var(--green-11)' }}>Potential Payout</Text>
                </Flex>
            </Card>
            
            <Flex direction="row" gap="4" wrap="wrap" mb="5" justify="center">
                <Card style={{ 
                    flex: '1 1 140px', 
                    background: 'linear-gradient(120deg, var(--cyan-3) 80%, var(--cyan-1) 100%)', 
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '140px',
                    border: '1.5px solid var(--cyan-6)',
                    transition: 'box-shadow 0.15s',
                    boxShadow: '0 2px 8px var(--cyan-2)',
                }}>
                    <Text size="5" mb="1">📊</Text>
                    <Text size="2" weight="bold" style={{ letterSpacing: 0.2 }}>Risk Score</Text>
                    <Text size="4" weight="bold" style={{ 
                        color: 'var(--cyan-11)',
                        fontVariantNumeric: 'tabular-nums'
                    }}>{riskScore}<Text size="2"> / 100</Text></Text>
                </Card>
                
                <Card style={{ 
                    flex: '1 1 140px',
                    background: 'linear-gradient(120deg, var(--blue-3) 80%, var(--blue-1) 100%)', 
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '140px',
                    border: '1.5px solid var(--blue-6)',
                    transition: 'box-shadow 0.15s',
                    boxShadow: '0 2px 8px var(--blue-2)',
                }}>
                    <Text size="5" mb="1">⏱️</Text>
                    <Text size="2" weight="bold" style={{ letterSpacing: 0.2 }}>Duration</Text>
                    <Text size="4" weight="bold" style={{ 
                        color: 'var(--blue-11)',
                        fontVariantNumeric: 'tabular-nums'
                    }}>{durationMonths}<Text size="2"> mo</Text></Text>
                </Card>
                
                <Card style={{ 
                    flex: '1 1 140px',
                    background: 'linear-gradient(120deg, var(--amber-3) 80%, var(--amber-1) 100%)', 
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '140px',
                    border: '1.5px solid var(--amber-6)',
                    transition: 'box-shadow 0.15s',
                    boxShadow: '0 2px 8px var(--amber-2)',
                }}>
                    <Text size="5" mb="1">💸</Text>
                    <Text size="2" weight="bold" style={{ letterSpacing: 0.2 }}>Premium</Text>
                    <Text size="4" weight="bold" style={{ 
                        color: 'var(--amber-11)',
                        fontVariantNumeric: 'tabular-nums'
                    }}>{estimatedPremium}<Text size="2"> SOL</Text></Text>
                </Card>
            </Flex>
            
            <Card style={{ 
                background: 'linear-gradient(120deg, var(--violet-2) 80%, var(--gray-1) 100%)',
                padding: '22px',
                borderRadius: '12px',
                marginBottom: '18px',
                border: '1.5px solid var(--violet-5)',
                boxShadow: '0 2px 12px 0 var(--violet-3)'
            }}>
                <Heading size="4" mb="3" style={{ color: 'var(--violet-11)', letterSpacing: 0.5 }}>
                    🧮 Premium Breakdown
                </Heading>
                <Box
                    style={{
                        background: 'linear-gradient(90deg, #f0fdfa 60%, #e0f2fe 100%)',
                        border: '2px solid var(--cyan-7)',
                        borderRadius: 14,
                        padding: '1.5rem 1.75rem',
                        marginBottom: 18,
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
                    <span style={{ fontSize: 32, marginBottom: 8 }}>🧩</span>
                    <span style={{ fontSize: 19, fontWeight: 700, marginBottom: 6, color: 'var(--cyan-11)', letterSpacing: 0.2 }}>
                        Premium Factor Explained
                    </span>
                    <span style={{ fontSize: 15, color: 'var(--cyan-12)', marginBottom: 8 }}>
                        <b>Premium Factor = Coverage × (Risk Score / 100)</b>
                    </span>
                    <ul style={{
                        textAlign: 'left',
                        color: 'var(--cyan-12)',
                        fontSize: 15,
                        margin: 0,
                        paddingLeft: 26,
                        listStyle: 'disc',
                        maxWidth: 440,
                        lineHeight: 1.7
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
                        paddingLeft: '1.2rem',
                        color: 'var(--gray-11)',
                        fontSize: 14,
                        lineHeight: 1.6,
                    }}
                >
                    <li>
                        <b>Total Premium:</b> The final amount you pay, based on the Premium Factor and the selected duration. (Flat rate model)
                    </li>
                </Box>
                <Box
                    style={{
                        background: 'linear-gradient(90deg, #fef9c3 60%, #f0fdfa 100%)',
                        border: '2px solid var(--amber-7)',
                        borderRadius: 14,
                        padding: '1.5rem 1.75rem',
                        margin: '22px 0 0 0',
                        boxShadow: '0 2px 12px 0 var(--amber-4)',
                        color: 'var(--amber-12)',
                        fontWeight: 600,
                        fontSize: 16,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <span style={{ fontSize: 32, marginBottom: 8 }}>💸</span>
                    <span style={{ fontSize: 19, fontWeight: 700, marginBottom: 6, color: 'var(--amber-11)', letterSpacing: 0.2 }}>
                        Total Premium Explained
                    </span>
                    <span style={{ fontSize: 15, color: 'var(--amber-12)', marginBottom: 8 }}>
                        <b>Total Premium</b> is the final amount you pay for your insurance policy.
                    </span>
                    <ul style={{
                        textAlign: 'left',
                        color: 'var(--amber-12)',
                        fontSize: 15,
                        margin: 0,
                        paddingLeft: 26,
                        listStyle: 'disc',
                        maxWidth: 440,
                        lineHeight: 1.7
                    }}>
                        <li>
                            <b>Formula:</b> <b>Total Premium = Premium Factor × Duration</b>
                        </li>
                        <li>
                            <b>Premium Factor</b> is based on your coverage and risk score.
                        </li>
                        <li>
                            <b>Duration</b> is the number of months you want coverage for.
                        </li>
                        <li>
                            <b>Flat Rate Model:</b> The premium is calculated simply by multiplying the factor by the duration—no hidden fees!
                        </li>
                        <li>
                            <b>Example:</b> If your Premium Factor is <b>4</b> and you choose <b>6 months</b>, your Total Premium is <b>4 × 6 = 24 SOL</b>.
                        </li>
                    </ul>
                </Box>
            </Card>
        </Card>
    );
}
