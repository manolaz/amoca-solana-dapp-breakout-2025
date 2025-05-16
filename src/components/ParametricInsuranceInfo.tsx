import { Box, Heading, Text } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export function ParametricInsuranceInfo() {
    return (
        <Box mb="5" style={{ background: '#f0fdfa', borderRadius: 12, padding: 16 }}>
            <Heading as="h3" size="4" mb="2" style={{ color: '#0e7490', display: 'flex', alignItems: 'center', gap: 8 }}>
                <InfoCircledIcon /> What is Parametric Insurance?
            </Heading>
            <Text as="p" size="3" style={{ color: '#134e4a', marginBottom: 8 }}>
                Parametric insurance is a type of insurance that pays out automatically when a specific event or parameter is triggered, such as a certain amount of rainfall, temperature, or wind speed. There is no need for manual claims or loss assessment—payouts are fast, transparent, and based on trusted data sources.
            </Text>
            <ul style={{ color: '#0e374e', fontSize: 15, marginLeft: 20, marginBottom: 0 }}>
                <li>
                    <b>Fast Payouts:</b> Receive funds automatically when climate data meets the policy criteria.
                </li>
                <li>
                    <b>Transparent:</b> All policy terms and triggers are on-chain and verifiable.
                </li>
                <li>
                    <b>No Paperwork:</b> No need to prove damages or file traditional claims.
                </li>
            </ul>
        </Box>
    );
}
