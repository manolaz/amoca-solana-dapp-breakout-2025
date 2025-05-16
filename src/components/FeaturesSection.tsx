import { DataList } from '@radix-ui/themes';
import type { UiWalletAccount } from '@wallet-standard/react';
import { getUiWalletAccountStorageKey } from '@wallet-standard/react';
import { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FeatureNotSupportedCallout } from './FeatureNotSupportedCallout';
import { FeaturePanel } from './FeaturePanel';
import { SolanaSignAndSendTransactionFeaturePanel } from './SolanaSignAndSendTransactionFeaturePanel';
import { SolanaSignMessageFeaturePanel } from './SolanaSignMessageFeaturePanel';
import { ChainContext } from '../context/ChainContext';
import { skyBlue, mintGreen } from '../theme/colors';

type FeaturesSectionProps = {
  selectedWalletAccount: UiWalletAccount;
  errorBoundaryResetKeys?: any[];
};

export function FeaturesSection({ selectedWalletAccount, errorBoundaryResetKeys }: FeaturesSectionProps) {
  const { chain } = useContext(ChainContext);
  
  const resetKeys = errorBoundaryResetKeys || [
    chain,
    getUiWalletAccountStorageKey(selectedWalletAccount),
  ].filter(Boolean);

  return (
    <DataList.Root orientation={{ initial: 'vertical', sm: 'horizontal' }} size="3">
      <FeaturePanel label={<span style={{ color: mintGreen }}>Sign Message</span>}>
        <ErrorBoundary
          FallbackComponent={FeatureNotSupportedCallout}
          resetKeys={resetKeys}
        >
          <SolanaSignMessageFeaturePanel account={selectedWalletAccount} />
        </ErrorBoundary>
      </FeaturePanel>
      <FeaturePanel label={<span style={{ color: skyBlue }}>Sign And Send Transaction</span>}>
        <ErrorBoundary
          FallbackComponent={FeatureNotSupportedCallout}
          resetKeys={resetKeys}
        >
          <SolanaSignAndSendTransactionFeaturePanel account={selectedWalletAccount} />
        </ErrorBoundary>
      </FeaturePanel>
    </DataList.Root>
  );
}
}
