import { Box, Text, Flex, Card, Heading } from '@radix-ui/themes';
import { RiskType } from './types';

interface RiskTypeSelectorProps {
    riskTypes: RiskType[];
    selectedRiskTypeId: string;
    onSelectRiskType: (id: string) => void;
    riskScore: number;
    locationInfo?: { city: string; country: string } | null;
}

export function RiskTypeSelector({
    riskTypes,
    selectedRiskTypeId,
    onSelectRiskType,
    riskScore,
    locationInfo
}: RiskTypeSelectorProps) {
    return (
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
                        onClick={() => onSelectRiskType(risk.id)}
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
    );
}
