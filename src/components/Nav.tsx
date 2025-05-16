import { Badge, Box, DropdownMenu, Flex, Heading } from '@radix-ui/themes';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

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

    const navLinks = [
        { name: 'Home', to: '/' },
        { name: 'Policies', to: '/policies' },
        { name: 'Dashboard', to: '/dashboard' },
        { name: 'About', to: '/about' },
    ];

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
                {/* logo + title */}
                <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: '#fff',
                            boxShadow: '0 2px 8px #38bdf833',
                            fontSize: 24,
                        }}
                    >
                        <span role="img" aria-label="Sunflower">
                            🌻
                        </span>
                    </Link>
                    <Heading as="h1" size={{ initial: '4', xs: '6' }} truncate>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            AMOCA Dapp
                        </Link>
                    </Heading>
                </Box>

                {/* main navigation */}
                <Flex as="nav" gap="3">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                color: 'var(--gray-12)',
                                fontWeight: 500,
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </Flex>

                {/* right controls: chain selector, wallet & sign-in */}
                <Flex gap="2" align="center">
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
                    <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
                    <SignInMenu>Sign In</SignInMenu>
                </Flex>
            </Flex>
        </Box>
    );
}
