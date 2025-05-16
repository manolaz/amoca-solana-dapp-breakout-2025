import { Box, Container, Flex } from '@radix-ui/themes';
import { useState } from 'react';

import { Sidebar } from '../components/Sidebar';
import { HomePage } from '../components/HomePage';
import { InsurancePolicyPage } from '../components/InsurancePolicyPage';

function Root() {
    const [currentPage, setCurrentPage] = useState<'home' | 'policy'>('home');
    
    return (
        <Flex>
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <Box flexGrow="1">
                <Container mx={{ initial: '3', xs: '6' }} style={{ background: '#f0fdfa', borderRadius: 24, paddingBottom: 32, marginLeft: 0 }}>
                    {currentPage === 'home' ? (
                        <HomePage />
                    ) : (
                        <InsurancePolicyPage />
                    )}
                </Container>
            </Box>
        </Flex>
    );
}

export default Root;
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
                            {/* AMOCA Mascot */}
                            <Box
                                as="img"
                                src="/BLUE/a2.svg"
                                alt="AMOCA Climate Guardian"
                                style={{ display: 'block', margin: '16px auto', width: 150, height: 'auto' }}
                            />
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
