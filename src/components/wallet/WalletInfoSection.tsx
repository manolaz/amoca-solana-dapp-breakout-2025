import React, { Suspense } from 'react';
import { Box, Flex, Heading, Code, Text } from '@radix-ui/themes';
import { ErrorBoundary } from 'react-error-boundary';
// Importing from correct paths
import type { UiWalletAccount } from '@wallet-standard/react'; 
import { WalletAccountIcon } from '../WalletAccountIcon'; // Fixed import path
import { Balance } from '../Balance'; // Fixed import path to ensure correct component
import { Spinner } from '../common/Spinner';
import { skyBlue, golden } from '../../theme/colors';
import { WalletConnectionStatus } from './WalletConnectionStatus'; // Import the new component

type WalletInfoSectionProps = {
    selectedWalletAccount: UiWalletAccount; // Changed from any
    chain: string; // Changed from any
};

export function WalletInfoSection({ selectedWalletAccount, chain }: WalletInfoSectionProps) {
    return (
        <Box>
            {/* Add connection status banner */}
            <Box mb="3">
                <WalletConnectionStatus showExtended />
            </Box>
            
            <Flex gap="2">
                <Flex align="center" gap="3" flexGrow="1">
                    <WalletAccountIcon account={selectedWalletAccount} height="48" width="48" />
                    <Box>
                        <Heading as="h4" size="3" style={{ color: skyBlue }}>
                            {selectedWalletAccount.label ?? 'Unlabeled Account'}
                        </Heading>
                        <Code variant="outline" truncate size={{ initial: '1', xs: '2' }}>
                            {selectedWalletAccount.address}
                        </Code>
                    </Box>
                </Flex>
                <Flex direction="column" align="end">
                    <Heading as="h4" size="3" style={{ color: golden }}>
                        Balance
                    </Heading>
                    <ErrorBoundary
                        fallback={<Text>&ndash;</Text>}
                        key={`${selectedWalletAccount.address}:${chain}`}
                    >
                        <Suspense fallback={<Spinner loading my="1" />}>
                            <Balance account={selectedWalletAccount} />
                        </Suspense>
                    </ErrorBoundary>
                </Flex>
            </Flex>
        </Box>
    );
}
