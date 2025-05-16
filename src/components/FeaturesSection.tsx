import { DataList } from '@radix-ui/themes';
import { WalletAccount } from '@wallet-standard/base';
import { getUiWalletAccountStorageKey } from '@wallet-standard/react';
import { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FeatureNotSupportedCallout } from './FeatureNotSupportedCallout';
import { FeaturePanel } from './FeaturePanel';
import { SolanaSignAndSendTransactionFeaturePanel } from './SolanaSignAndSendTransactionFeaturePanel';
import { SolanaSignMessageFeaturePanel } from './SolanaSignMessageFeaturePanel';
import { ChainContext } from '../context/ChainContext';

const skyBlue = '#38bdf8';
const mintGreen = '#6ee7b7';

type FeaturesSectionProps = {
  account: WalletAccount;
};

export function FeaturesSection({ account }: FeaturesSectionProps) {
  const { chain } = useContext(ChainContext);
  
  const errorBoundaryResetKeys = [
    chain,
    getUiWalletAccountStorageKey(account),
  ].filter(Boolean);

  return (
    <DataList.Root orientation={{ initial: 'vertical', sm: 'horizontal' }} size="3">
      <FeaturePanel label={<span style={{ color: mintGreen }}>Sign Message</span>}>
        <ErrorBoundary
          FallbackComponent={FeatureNotSupportedCallout}
          resetKeys={errorBoundaryResetKeys}
        >
          <SolanaSignMessageFeaturePanel account={account} />
        </ErrorBoundary>
      </FeaturePanel>
      <FeaturePanel label={<span style={{ color: skyBlue }}>Sign And Send Transaction</span>}>
        <ErrorBoundary
          FallbackComponent={FeatureNotSupportedCallout}
          resetKeys={errorBoundaryResetKeys}
        >
          <SolanaSignAndSendTransactionFeaturePanel account={account} />
        </ErrorBoundary>
      </FeaturePanel>
    </DataList.Root>
  );
}
