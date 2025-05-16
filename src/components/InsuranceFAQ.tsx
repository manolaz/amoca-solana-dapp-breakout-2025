import { Box, Heading } from '@radix-ui/themes';

export function InsuranceFAQ() {
    return (
        <Box mt="7" style={{ background: '#f0fdfa', borderRadius: 12, padding: 16 }}>
            <Heading as="h3" size="4" mb="2" style={{ color: '#0e7490' }}>
                Frequently Asked Questions
            </Heading>
            <Box as="ul" style={{ color: '#134e4a', fontSize: 15, marginLeft: 20 }}>
                <li>
                    <b>How are payouts determined?</b>
                    <br />
                    Payouts are triggered automatically when trusted climate data (e.g., from Switchboard oracles) meets the policy's predefined parameters.
                </li>
                <li style={{ marginTop: 10 }}>
                    <b>Do I need to file a claim?</b>
                    <br />
                    No. Parametric insurance means payouts are automatic—no paperwork or claims process is required.
                </li>
                <li style={{ marginTop: 10 }}>
                    <b>Can I buy multiple policies?</b>
                    <br />
                    Yes, you can purchase multiple policies for different risks or locations.
                </li>
                <li style={{ marginTop: 10 }}>
                    <b>Is my policy visible on-chain?</b>
                    <br />
                    Yes, all policies are managed on the Solana blockchain for transparency and auditability.
                </li>
            </Box>
        </Box>
    );
}
