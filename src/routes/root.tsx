import { Box, Code, Container, DataList, Flex, Heading, Spinner, Text, Button } from '@radix-ui/themes';
import { getUiWalletAccountStorageKey } from '@wallet-standard/react';
import { Suspense, useContext, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Balance } from '../components/Balance';
import { FeatureNotSupportedCallout } from '../components/FeatureNotSupportedCallout';
import { FeaturePanel } from '../components/FeaturePanel';
import { SolanaSignAndSendTransactionFeaturePanel } from '../components/SolanaSignAndSendTransactionFeaturePanel';
import { SolanaSignMessageFeaturePanel } from '../components/SolanaSignMessageFeaturePanel';
import { WalletAccountIcon } from '../components/WalletAccountIcon';
import { ChainContext } from '../context/ChainContext';
import { SelectedWalletAccountContext } from '../context/SelectedWalletAccountContext';
import { HomeSection } from '../components/HomeSection';
import { InsurancePolicyPage } from '../components/InsurancePolicyPage';
import { Sidebar } from '../components/Sidebar';

const skyBlue = '#38bdf8';
const mintGreen = '#6ee7b7';
const golden = '#fbbf24';

const SIDEBAR_WIDTH = 220;

function Root() {
    const { chain } = useContext(ChainContext);
    const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
    const [currentPage, setCurrentPage] = useState<'home' | 'policy'>('home');
    const errorBoundaryResetKeys = [
        chain,
        selectedWalletAccount && getUiWalletAccountStorageKey(selectedWalletAccount),
    ].filter(Boolean);
    return (
        <Flex>
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <Box flexGrow="1">
                <Container mx={{ initial: '3', xs: '6' }} style={{ background: '#f0fdfa', borderRadius: 24, paddingBottom: 32, marginLeft: 0 }}>
                    {currentPage === 'home' ? (
                        <>
                            <HomeSection />
                            <Box mt="8">
                                {selectedWalletAccount ? (
                                    <Flex gap="6" direction="column">
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
                                        <DataList.Root orientation={{ initial: 'vertical', sm: 'horizontal' }} size="3">
                                            <FeaturePanel label={<span style={{ color: mintGreen }}>Sign Message</span>}>
                                                <ErrorBoundary
                                                    FallbackComponent={FeatureNotSupportedCallout}
                                                    resetKeys={errorBoundaryResetKeys}
                                                >
                                                    <SolanaSignMessageFeaturePanel account={selectedWalletAccount} />
                                                </ErrorBoundary>
                                            </FeaturePanel>
                                            <FeaturePanel label={<span style={{ color: skyBlue }}>Sign And Send Transaction</span>}>
                                                <ErrorBoundary
                                                    FallbackComponent={FeatureNotSupportedCallout}
                                                    resetKeys={errorBoundaryResetKeys}
                                                >
                                                    <SolanaSignAndSendTransactionFeaturePanel account={selectedWalletAccount} />
                                                </ErrorBoundary>
                                            </FeaturePanel>
                                        </DataList.Root>
                                    </Flex>
                                ) : (
                                    <Text as="p" align="center" mt="6" style={{ color: skyBlue, fontWeight: 600 }}>
                                        Click &ldquo;Connect Wallet&rdquo; to get started.
                                    </Text>
                                )}
                            </Box>
                        </>
                    ) : (
                        <InsurancePolicyPage />
                    )}
                </Container>
            </Box>
        </Flex>
    );
}

export default Root;
