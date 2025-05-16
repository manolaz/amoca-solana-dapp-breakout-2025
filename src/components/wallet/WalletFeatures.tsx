import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DataList } from '@radix-ui/themes';
import { FeaturePanel } from './FeaturePanel';
import { FeatureNotSupportedCallout } from './FeatureNotSupportedCallout';
import { SolanaSignMessageFeaturePanel } from './SolanaSignMessageFeaturePanel';
import { SolanaSignAndSendTransactionFeaturePanel } from './SolanaSignAndSendTransactionFeaturePanel';
import { mintGreen, skyBlue } from '../../theme/colors';

type WalletFeaturesProps = {
    selectedWalletAccount: any;
    errorBoundaryResetKeys: any[];
};

export function WalletFeatures({ selectedWalletAccount, errorBoundaryResetKeys }: WalletFeaturesProps) {
    return (
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
    );
}
