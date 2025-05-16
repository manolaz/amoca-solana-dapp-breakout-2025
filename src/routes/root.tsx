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
import { FeaturesSection } from '../components/FeaturesSection';
import { WalletInfoSection } from '../components/wallet/WalletInfoSection';

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
                                        <WalletInfoSection 
                                            selectedWalletAccount={selectedWalletAccount}
                                            chain={chain}
                                        />
                                        <FeaturesSection 
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