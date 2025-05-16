import { Box, Flex, Heading, Text } from '@radix-ui/themes';
import { MermaidDiagram } from '@lightenna/react-mermaid-diagram';

const skyBlue = '#38bdf8';
const mintGreen = '#6ee7b7';
const golden = '#fbbf24';

export function HomeSection() {
    const workflowDiagram = String.raw`flowchart TD
        User[Policy Holder] -->|Buys Policy| AMOCA_Dapp[AMOCA Dapp]
        AMOCA_Dapp -->|Requests Data| Switchboard[Switchboard Data Feed]
        Switchboard -->|Sends Climate Data| AMOCA_Dapp
        AMOCA_Dapp -->|Triggers| Solana_Program[Solana Program]
        Solana_Program -->|Payout| User
        Solana_Program -.->|"No need to measure real asset damages"| User
    `;

    const txDiagram = String.raw`sequenceDiagram
    participant User
    participant AMOCA_UI as AMOCA UI
    participant Solana as Solana Blockchain

    User->>AMOCA_UI: Submit Policy Purchase
    AMOCA_UI->>Solana: Send Transaction
    Solana-->>AMOCA_UI: Confirm in <1s
    AMOCA_UI-->>User: Policy Issued Instantly`;

    const magicBlockDiagram = String.raw`graph LR
    A[Magic Block] --> B[AMOCA Smart Contracts]
    B --> C[Massive Parallel Processing]
    C --> D[Scalable Insurance Operations]`;

    const composabilityDiagram = String.raw`flowchart LR
    UserWallet[User Wallet] -- Connects --> AMOCA_Dapp
    AMOCA_Dapp -- Uses --> Solana_Kit[Solana Kit]
    Solana_Kit -- Integrates --> Solana_Program`;

    return (
        <Box
            my="6"
            style={{
                background: `linear-gradient(135deg, ${skyBlue} 0%, ${mintGreen} 60%, ${golden} 100%)`,
                borderRadius: 24,
                boxShadow: '0 4px 32px 0 rgba(56,189,248,0.08)',
                padding: '2.5rem 1.5rem 2rem 1.5rem',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Flex direction="column" align="center" gap="4">
                <Box
                    style={{
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: `0 2px 16px 0 ${skyBlue}33`,
                        padding: 16,
                        marginBottom: 8,
                    }}
                >
                    <img src="/amoca/amoca-logo.png" alt="AMOCA Logo" width={140} />
                </Box>
                <Heading
                    as="h1"
                    size="7"
                    align="center"
                    style={{
                        color: '#fff',
                        fontWeight: 900,
                        letterSpacing: '-1.5px',
                        marginBottom: 8,
                        textShadow: '0 2px 16px #38bdf8cc, 0 1px 0 #0002',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        fontSize: '2.8rem',
                    }}
                >
                    🌎 AMOCA: Decentralized Climate Parametric Insurance Dapp
                </Heading>
                <Text
                    as="p"
                    size="5"
                    align="center"
                    style={{
                        maxWidth: 700,
                        color: '#0e374e',
                        fontWeight: 600,
                        marginBottom: 16,
                        background: 'linear-gradient(90deg, #f0fdfa 0%, #e0f2fe 100%)',
                        borderRadius: 16,
                        padding: '0.75rem 1.25rem',
                        boxShadow: `0 2px 12px 0 ${mintGreen}33`,
                        fontSize: '1.25rem',
                        lineHeight: 1.6,
                    }}
                >
                    AMOCA is a decentralized application (dapp) built on the Solana blockchain, designed to provide
                    parametric insurance solutions for climate-related risks. Leveraging the speed and scalability of
                    Solana, AMOCA enables transparent, automated, and trustless insurance payouts based on real-world
                    climate data.
                </Text>
                <Box
                    as="ul"
                    style={{
                        textAlign: 'left',
                        maxWidth: 600,
                        background: 'linear-gradient(90deg, #f0fdfa 60%, #fef9c3 100%)',
                        borderRadius: 16,
                        padding: '1.25rem 1.75rem',
                        boxShadow: `0 2px 12px 0 ${skyBlue}22`,
                        color: '#134e4a',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        marginBottom: 8,
                        border: `2px solid ${mintGreen}`,
                    }}
                >
                    <li>
                        <b style={{ color: skyBlue }}>🌀 Parametric Insurance:</b> Automated payouts triggered by predefined climate parameters (e.g.,
                        rainfall, temperature, wind speed).
                    </li>
                    <li>
                        <b style={{ color: mintGreen }}>🔗 Decentralized & Transparent:</b> All policies and claims are managed on-chain, ensuring
                        transparency and reducing the need for intermediaries.
                    </li>
                    <li>
                        <b style={{ color: golden }}>✨ Magic Block Scaleup:</b> Utilizes Magic Block technology to enhance scalability and
                        performance, supporting large-scale adoption.
                    </li>
                    <li>
                        <b style={{ color: '#eab308' }}>🏆 Solana Breakout Hackathon 2025:</b> AMOCA is developed as part of the Solana Breakout
                        Hackathon 2025, showcasing innovation in decentralized insurance and climate resilience.
                    </li>
                </Box>
            </Flex>
            <Box mt="7">
                <Heading
                    as="h2"
                    size="5"
                    align="center"
                    mb="3"
                    style={{
                        color: golden,
                        fontWeight: 800,
                        textShadow: `0 2px 8px ${golden}55`,
                        fontSize: '2rem',
                        letterSpacing: '-0.5px',
                    }}
                >
                    🔄 Workflow Overview
                </Heading>
                <Box
                    style={{
                        background: 'linear-gradient(90deg, #e0f2fe 80%, #fef9c3 100%)',
                        padding: 20,
                        borderRadius: 16,
                        overflowX: 'auto',
                        border: `2px solid ${skyBlue}`,
                        color: '#0e374e',
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: `0 2px 12px 0 ${golden}22`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 220,
                        maxWidth: '100%',
                        margin: '0 auto',
                    }}
                >
                    <div style={{
                        minWidth: 320,
                        maxWidth: '100%',
                        overflowX: 'auto',
                        padding: 4,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <MermaidDiagram>
                            {workflowDiagram}
                        </MermaidDiagram>
                    </div>
                </Box>
            </Box>
            <Box mt="7">
                <Heading
                    as="h2"
                    size="5"
                    align="center"
                    mb="3"
                    style={{
                        color: mintGreen,
                        fontWeight: 800,
                        textShadow: `0 2px 8px ${mintGreen}55`,
                        fontSize: '2rem',
                        letterSpacing: '-0.5px',
                    }}
                >
                    🛠️ Unique Solana Features in AMOCA
                </Heading>
                <Text as="p" align="center" mb="2" style={{
                    color: '#0e374e',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: '#f0fdfa',
                    borderRadius: 10,
                    padding: '0.5rem 1rem',
                    marginBottom: 10,
                }}>
                    AMOCA utilizes several advanced Solana features to deliver a scalable, secure, and user-friendly
                    parametric insurance platform:
                </Text>
                <Box as="ul" style={{
                    textAlign: 'left',
                    maxWidth: 700,
                    margin: '0 auto',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                }}>
                    <li>
                        <b style={{ color: skyBlue }}>⚡ High-Throughput, Low-Latency Transactions</b>
                        <Box
                            style={{
                                background: 'linear-gradient(90deg, #e0f2fe 80%, #f0fdfa 100%)',
                                padding: 12,
                                borderRadius: 12,
                                marginTop: 6,
                                border: `2px solid ${skyBlue}`,
                                color: '#0e374e',
                                fontWeight: 600,
                                fontSize: 15,
                                boxShadow: `0 2px 8px 0 ${skyBlue}22`,
                            }}
                        >
                            <MermaidDiagram>
                                {txDiagram}
                            </MermaidDiagram>
                        </Box>
                    </li>
                    <li style={{ marginTop: 18 }}>
                        <b style={{ color: golden }}>🪄 Magic Block Scaleup</b>
                        <Box
                            style={{
                                background: 'linear-gradient(90deg, #fef9c3 80%, #f0fdfa 100%)',
                                padding: 12,
                                borderRadius: 12,
                                marginTop: 6,
                                border: `2px solid ${golden}`,
                                color: '#92400e',
                                fontWeight: 600,
                                fontSize: 15,
                                boxShadow: `0 2px 8px 0 ${golden}22`,
                            }}
                        >
                            <MermaidDiagram>
                                {magicBlockDiagram}
                            </MermaidDiagram>
                        </Box>
                    </li>
                    <li style={{ marginTop: 18 }}>
                        <b style={{ color: mintGreen }}>🧩 Composability & Wallet Integration</b>
                        <Box
                            style={{
                                background: 'linear-gradient(90deg, #e0f2fe 80%, #f0fdfa 100%)',
                                padding: 12,
                                borderRadius: 12,
                                marginTop: 6,
                                border: `2px solid ${skyBlue}`,
                                color: '#0e374e',
                                fontWeight: 600,
                                fontSize: 15,
                                boxShadow: `0 2px 8px 0 ${mintGreen}22`,
                            }}
                        >
                            <MermaidDiagram>
                                {composabilityDiagram}
                            </MermaidDiagram>
                        </Box>
                    </li>
                </Box>
            </Box>
            <Box mt="7">
                <Heading as="h2" size="5" align="center" mb="3">
                    🏛️ AMOCA: Decentralized Climate Insurance Platform
                </Heading>
                <Text
                    as="p"
                    size="5"
                    align="center"
                    style={{
                        maxWidth: 700,
                        color: '#0e374e',
                        fontWeight: 600,
                        marginBottom: 16,
                        background: 'linear-gradient(90deg, #f0fdfa 0%, #e0f2fe 100%)',
                        borderRadius: 16,
                        padding: '0.75rem 1.25rem',
                        boxShadow: `0 2px 12px 0 ${mintGreen}33`,
                        fontSize: '1.25rem',
                        lineHeight: 1.6,
                    }}
                >
                    AMOCA is building a decentralized climate insurance platform that provides affordable protection against
                    climate-related risks. By leveraging Solana and Sui blockchains, AMOCA triggers instant, automated payouts
                    based on verified weather data, creating a reliable safety net against climate change impacts.
                </Text>
            </Box>
            <Box mt="6">
                <Heading as="h3" size="3" style={{fontWeight: 700, color: skyBlue, fontSize: '1.5rem'}}>🌟 Key Features</Heading>
                <ul style={{
                    background: 'linear-gradient(90deg, #f0fdfa 60%, #e0f2fe 100%)',
                    borderRadius: 14,
                    padding: '1rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    boxShadow: `0 1px 8px 0 ${skyBlue}22`,
                    marginBottom: 8,
                }}>
                    <li><Text><strong>🤝 Decentralized Insurance:</strong> Truly peer-to-peer protection against climate risks</Text></li>
                    <li><Text><strong>⛓️ Blockchain-Powered:</strong> Built on Solana and Sui for speed, reliability, transparency</Text></li>
                    <li><Text><strong>⚡ Instant Payouts:</strong> Automated claim processing triggered by verified weather data</Text></li>
                    <li><Text><strong>💸 Affordable Protection:</strong> Lower costs through smart contract efficiency</Text></li>
                    <li><Text><strong>📡 Real-time Data Integration:</strong> Utilizes MagicBlock's high-performance engine</Text></li>
                </ul>
            </Box>
            <Box mt="6">
                <Heading as="h3" size="3" style={{fontWeight: 700, color: mintGreen, fontSize: '1.5rem'}}>🧑‍💻 Technology Stack</Heading>
                <ul style={{
                    background: 'linear-gradient(90deg, #e0f2fe 60%, #f0fdfa 100%)',
                    borderRadius: 14,
                    padding: '1rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    boxShadow: `0 1px 8px 0 ${mintGreen}22`,
                    marginBottom: 8,
                }}>
                    <li><Text><strong>⚡ Solana & Sui Blockchain:</strong> Fast txs, low fees, transparency, immutable records</Text></li>
                    <li><Text><strong>🔮 Switchboard Oracle:</strong> Decentralized feeds, cross-chain, on-demand updates, randomness</Text></li>
                    <li><Text><strong>🪄 MagicBlock Engine:</strong> Ephemeral rollup on SVM for 10 ms state transitions, gasless txs</Text></li>
                </ul>
            </Box>
            <Box mt="6">
                <Heading as="h3" size="3" style={{fontWeight: 700, color: golden, fontSize: '1.5rem'}}>🛡️ How AMOCA Works</Heading>
                <ul style={{
                    background: 'linear-gradient(90deg, #fef9c3 60%, #f0fdfa 100%)',
                    borderRadius: 14,
                    padding: '1rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    boxShadow: `0 1px 8px 0 ${golden}22`,
                    marginBottom: 8,
                }}>
                    <li><Text>📊 <strong>Data Collection:</strong> Verified real-time climate/weather data via oracle networks</Text></li>
                    <li><Text>📜 <strong>Smart Contracts:</strong> Policies encoded on Solana/Sui</Text></li>
                    <li><Text>🧠 <strong>Risk Assessment:</strong> AI-driven risk models set premiums based on location data</Text></li>
                    <li><Text>⏱️ <strong>Automated Triggers:</strong> Predefined events auto-execute contracts</Text></li>
                    <li><Text>💰 <strong>Instant Payout:</strong> Claims settled immediately without manual processing</Text></li>
                </ul>
            </Box>
            <Box mt="6">
                <Heading as="h3" size="3" style={{fontWeight: 700, color: '#0e374e', fontSize: '1.5rem'}}>🎁 Benefits for Users</Heading>
                <ul style={{
                    background: 'linear-gradient(90deg, #e0f2fe 60%, #f0fdfa 100%)',
                    borderRadius: 14,
                    padding: '1rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    boxShadow: `0 1px 8px 0 ${skyBlue}22`,
                    marginBottom: 8,
                }}>
                    <li><Text>📝 No paperwork or lengthy claims</Text></li>
                    <li><Text>🔍 Transparent terms</Text></li>
                    <li><Text>💲 Lower premiums via reduced ops costs</Text></li>
                    <li><Text>💧 Immediate liquidity when disaster strikes</Text></li>
                    <li><Text>🌱 Coverage for previously uninsurable risks</Text></li>
                </ul>
            </Box>
        </Box>
    );
}
