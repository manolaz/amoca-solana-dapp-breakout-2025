import { Box, Heading } from '@radix-ui/themes';

export function BuyPolicyGuide() {
    return (
        <Box mb="5" style={{ background: '#e0f2fe', borderRadius: 12, padding: 16 }}>
            <Heading as="h3" size="4" mb="2" style={{ color: '#38bdf8' }}>
                How to Buy a Policy
            </Heading>
            <ol style={{ color: '#134e4a', fontSize: 15, marginLeft: 20, marginBottom: 0 }}>
                <li>Connect your Solana wallet to the AMOCA Dapp.</li>
                <li>Share your location to personalize your policy (optional).</li>
                <li>Select the climate risk type you want to insure against.</li>
                <li>Choose your coverage amount and duration.</li>
                <li>Click <b>Buy Policy</b> and approve the transaction in your wallet.</li>
                <li>Your policy will be issued instantly and visible on-chain.</li>
            </ol>
        </Box>
    );
}
