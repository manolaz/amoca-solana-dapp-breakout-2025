import { Box, Flex, Text } from '@radix-ui/themes';
import { useContext } from 'react';

import { HomeSection } from './HomeSection';
import { WalletAccountDisplay } from './WalletAccountDisplay';
import { FeaturesSection } from './FeaturesSection';
import { SelectedWalletAccountContext } from '../context/SelectedWalletAccountContext';

const skyBlue = '#38bdf8';

export function HomePage() {
  const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
  
  return (
    <>
      {/* AMOCA Mascot */}
      <Box
        as="img"
        src="public/BLUE/a2.svg"
        alt="AMOCA Climate Guardian"
        style={{ display: 'block', margin: '16px auto', width: 150, height: 'auto' }}
      />
      <HomeSection />
      <Box mt="8">
        {selectedWalletAccount ? (
          <Flex gap="6" direction="column">
            <WalletAccountDisplay account={selectedWalletAccount} />
            <FeaturesSection account={selectedWalletAccount} />
          </Flex>
        ) : (
          <Text as="p" align="center" mt="6" style={{ color: skyBlue, fontWeight: 600 }}>
            Click &ldquo;Connect Wallet&rdquo; to get started.
          </Text>
        )}
      </Box>
    </>
  );
}
