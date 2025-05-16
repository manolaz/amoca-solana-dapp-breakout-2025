import { Badge, Box, DropdownMenu, Flex, Heading } from '@radix-ui/themes';
import { useContext } from 'react';

import { ChainContext } from '../context/ChainContext';
import { ConnectWalletMenu } from './ConnectWalletMenu';
import { SignInMenu } from './SignInMenu';

export function Nav() {
    const { displayName: currentChainName, chain, setChain } = useContext(ChainContext);
    const currentChainBadge = (
        <Badge color="gray" style={{ verticalAlign: 'middle' }}>
            {currentChainName}
        </Badge>
    );
    return (
        <Box
            style={{
                backgroundColor: 'var(--gray-1)',
                borderBottom: '1px solid var(--gray-a6)',
                zIndex: 1,
            }}
            position="sticky"
            p="3"
            top="0"
        >
            <Flex gap="4" justify="between" align="center">
                <Box flexGrow="1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Box
                        style={{
                            width: 40,
                            height: 40,
                            fontSize: 24,
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 2px 8px #38bdf833',
                        }}
                        aria-label="Sunflower Logo"
                        role="img"
                    >
                        🌻
                    </Box>
                    <Heading as="h1" size={{ initial: '4', xs: '6' }} truncate>
                        AMOCA Dapp{' '}
                        {setChain ? (
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>{currentChainBadge}</DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.RadioGroup
                                        onValueChange={value => {
                                            setChain(value as 'solana:${string}');
                                        }}
                                        value={chain}
                                    >
                                        {process.env.REACT_EXAMPLE_APP_ENABLE_MAINNET === 'true' ? (
                                            <DropdownMenu.RadioItem value="solana:mainnet">
                                                Mainnet Beta
                                            </DropdownMenu.RadioItem>
                                        ) : null}
                                        <DropdownMenu.RadioItem value="solana:devnet">Devnet</DropdownMenu.RadioItem>
                                        <DropdownMenu.RadioItem value="solana:testnet">Testnet</DropdownMenu.RadioItem>
                                    </DropdownMenu.RadioGroup>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        ) : (
                            currentChainBadge
                        )}
                    </Heading>
                </Box>
                <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
                <SignInMenu>Sign In</SignInMenu>
            </Flex>
        </Box>
    );
}