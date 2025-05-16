import { Box, Code, Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import { Suspense, useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { WalletAccount } from '@wallet-standard/base';

import { WalletAccountIcon } from './WalletAccountIcon';
import { Balance } from './Balance';
import { ChainContext } from '../context/ChainContext';

const skyBlue = '#38bdf8';
const golden = '#fbbf24';

type WalletAccountDisplayProps = {
  account: WalletAccount;
};

export function WalletAccountDisplay({ account }: WalletAccountDisplayProps) {
  const { chain } = useContext(ChainContext);
  
  return (
    <Flex gap="2">
      <Flex align="center" gap="3" flexGrow="1">
        <WalletAccountIcon account={account} height="48" width="48" />
        <Box>
          <Heading as="h4" size="3" style={{ color: skyBlue }}>
            {account.label ?? 'Unlabeled Account'}
          </Heading>
          <Code variant="outline" truncate size={{ initial: '1', xs: '2' }}>
            {account.address}
          </Code>
        </Box>
      </Flex>
      <Flex direction="column" align="end">
        <Heading as="h4" size="3" style={{ color: golden }}>
          Balance
        </Heading>
        <ErrorBoundary
          fallback={<Text>&ndash;</Text>}
          key={`${account.address}:${chain}`}
        >
          <Suspense fallback={<Spinner loading my="1" />}>
            <Balance account={account} />
          </Suspense>
        </ErrorBoundary>
      </Flex>
    </Flex>
  );
}
