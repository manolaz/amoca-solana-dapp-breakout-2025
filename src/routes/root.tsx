import { Box, Container, Flex, Heading, Text, Code } from '@radix-ui/themes';
import { useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Sidebar } from '../components/Sidebar';
import { HomePage } from '../components/HomePage';
import { InsurancePolicyPage } from '../components/InsurancePolicyPage';
import { HomeHeader } from '../components/home/HomeHeader';
import { WalletInfoSection } from '../components/wallet/WalletInfoSection';
import { WalletFeatures } from '../components/wallet/WalletFeatures';
import { getUiWalletAccountStorageKey } from '../utils/walletUtils';
import { skyBlue } from '../theme/colors';

function Root() {
    const [currentPage, setCurrentPage] = useState<'home' | 'policy'>('home');
    const [selectedWalletAccount, setSelectedWalletAccount] = useState(null);
    const [chain, setChain] = useState(null);
    
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
                            <HomeHeader />
                            
                            <Box mt="8">
                                {selectedWalletAccount ? (
                                    <Flex gap="6" direction="column">
                                        <WalletInfoSection 
                                            selectedWalletAccount={selectedWalletAccount}
                                            chain={chain}
                                        />
                                        <WalletFeatures 
                                            selectedWalletAccount={selectedWalletAccount}
                                            errorBoundaryResetKeys={errorBoundaryResetKeys}
                                        />
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
