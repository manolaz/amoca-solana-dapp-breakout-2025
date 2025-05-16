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
                    <img src="public/amoca/amoca-logo.png" alt="AMOCA Logo" width={140} />
                </Box>
                <Heading
                    as="h1"
                    size="7"
                    align="center"
                    style={{
                        background: `linear-gradient(90deg, ${skyBlue} 0%, ${mintGreen} 60%, ${golden} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        marginBottom: 8,
                    }}
                >
                    AMOCA: Decentralized Climate Parametric Insurance Dapp
                </Heading>
                <Text
                    as="p"
                    size="4"
                    align="center"
                    style={{
                        maxWidth: 700,
                        color: '#0e374e',
                        fontWeight: 500,
                        marginBottom: 12,
                        background: '#ffffffcc',
                        borderRadius: 12,
                        padding: '0.5rem 1rem',
                        boxShadow: `0 1px 8px 0 ${mintGreen}22`,
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
                        background: '#f0fdfa',
                        borderRadius: 12,
                        padding: '1rem 1.5rem',
                        boxShadow: `0 1px 8px 0 ${skyBlue}22`,
                        color: '#134e4a',
                        fontWeight: 500,
                    }}
                >
                    <li>
                        <b style={{ color: skyBlue }}>Parametric Insurance:</b> Automated payouts triggered by predefined climate parameters (e.g.,
                        rainfall, temperature, wind speed).
                    </li>
                    <li>
                        <b style={{ color: mintGreen }}>Decentralized & Transparent:</b> All policies and claims are managed on-chain, ensuring
                        transparency and reducing the need for intermediaries.
                    </li>
                    <li>
                        <b style={{ color: golden }}>Magic Block Scaleup:</b> Utilizes Magic Block technology to enhance scalability and
                        performance, supporting large-scale adoption.
                    </li>
                    <li>
                        <b style={{ color: '#eab308' }}>Solana Breakout Hackathon 2025:</b> AMOCA is developed as part of the Solana Breakout
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
                        fontWeight: 700,
                        textShadow: `0 2px 8px ${golden}33`,
                    }}
                >
                    Workflow Overview
                </Heading>
                <Box
                    style={{
                        background: '#e0f2fe',
                        padding: 16,
                        borderRadius: 12,
                        overflowX: 'auto',
                        border: `1.5px solid ${skyBlue}`,
                        color: '#0e374e',
                        fontWeight: 500,
                        fontSize: 15,
                    }}
                >
                    <MermaidDiagram>
                        {workflowDiagram}
                    </MermaidDiagram>
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
                        fontWeight: 700,
                        textShadow: `0 2px 8px ${mintGreen}33`,
                    }}
                >
                    Unique Solana Features in AMOCA
                </Heading>
                <Text as="p" align="center" mb="2" style={{ color: '#0e374e', fontWeight: 500 }}>
                    AMOCA utilizes several advanced Solana features to deliver a scalable, secure, and user-friendly
                    parametric insurance platform:
                </Text>
                <Box as="ul" style={{ textAlign: 'left', maxWidth: 700, margin: '0 auto' }}>
                    <li>
                        <b style={{ color: skyBlue }}>High-Throughput, Low-Latency Transactions</b>
                        <Box
                            style={{
                                background: '#f0fdfa',
                                padding: 8,
                                borderRadius: 8,
                                marginTop: 4,
                                border: `1.5px solid ${mintGreen}`,
                                color: '#134e4a',
                                fontWeight: 500,
                                fontSize: 14,
                            }}
                        >
                            <MermaidDiagram>
                                {txDiagram}
                            </MermaidDiagram>
                        </Box>
                    </li>
                    <li style={{ marginTop: 16 }}>
                        <b style={{ color: golden }}>Magic Block Scaleup</b>
                        <Box
                            style={{
                                background: '#fef9c3',
                                padding: 8,
                                borderRadius: 8,
                                marginTop: 4,
                                border: `1.5px solid ${golden}`,
                                color: '#92400e',
                                fontWeight: 500,
                                fontSize: 14,
                            }}
                        >
                            <MermaidDiagram>
                                {magicBlockDiagram}
                            </MermaidDiagram>
                        </Box>
                    </li>
                    <li style={{ marginTop: 16 }}>
                        <b style={{ color: mintGreen }}>Composability & Wallet Integration</b>
                        <Box
                            style={{
                                background: '#e0f2fe',
                                padding: 8,
                                borderRadius: 8,
                                marginTop: 4,
                                border: `1.5px solid ${skyBlue}`,
                                color: '#0e374e',
                                fontWeight: 500,
                                fontSize: 14,
                            }}
                        >
                            <MermaidDiagram>
                                {composabilityDiagram}
                            </MermaidDiagram>
                        </Box>
                    </li>
                </Box>
            </Box>
        </Box>
    );
}
