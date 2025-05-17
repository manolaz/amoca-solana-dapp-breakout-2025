import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Button, Callout, DropdownMenu, Tooltip } from '@radix-ui/themes';
import { StandardConnect, StandardDisconnect } from '@wallet-standard/core';
import type { UiWallet } from '@wallet-standard/react';
import { uiWalletAccountBelongsToUiWallet, useWallets } from '@wallet-standard/react';
import { useContext, useRef, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SelectedWalletAccountContext } from '../context/SelectedWalletAccountContext';
import { ChainContext } from '../context/ChainContext';
import { ConnectWalletMenuItem } from './ConnectWalletMenuItem';
import { ErrorDialog } from './ErrorDialog';
import { UnconnectableWalletMenuItem } from './UnconnectableWalletMenuItem';
import { WalletAccountIcon } from './WalletAccountIcon';

type Props = Readonly<{
    children: React.ReactNode;
}>;

export function ConnectWalletMenu({ children }: Props) {
    const { current: NO_ERROR } = useRef(Symbol());
    const wallets = useWallets();
    const [selectedWalletAccount, setSelectedWalletAccount] = useContext(SelectedWalletAccountContext);
    const [error, setError] = useState(NO_ERROR);
    const [forceClose, setForceClose] = useState(false);
    const { chain } = useContext(ChainContext);
    const [connectionStatus, setConnectionStatus] = useState<'connected'|'disconnected'|'error'>('disconnected');

    // Check wallet connection status
    useEffect(() => {
        if (selectedWalletAccount) {
            // Check if wallet supports the current chain
            const isChainSupported = selectedWalletAccount.chains.includes(chain);
            setConnectionStatus(isChainSupported ? 'connected' : 'error');
        } else {
            setConnectionStatus('disconnected');
        }
    }, [selectedWalletAccount, chain]);

    function renderItem(wallet: UiWallet) {
        return (
            <ErrorBoundary
                fallbackRender={({ error }) => <UnconnectableWalletMenuItem error={error} wallet={wallet} />}
                key={`wallet:${wallet.name}`}
            >
                <ConnectWalletMenuItem
                    onAccountSelect={account => {
                        setSelectedWalletAccount(account);
                        setForceClose(true);
                    }}
                    onDisconnect={wallet => {
                        if (selectedWalletAccount && uiWalletAccountBelongsToUiWallet(selectedWalletAccount, wallet)) {
                            setSelectedWalletAccount(undefined);
                            setConnectionStatus('disconnected');
                        }
                    }}
                    onError={err => {
                        setError(err);
                        setConnectionStatus('error');
                    }}
                    wallet={wallet}
                />
            </ErrorBoundary>
        );
    }
    
    const walletsThatSupportStandardConnect = [];
    const unconnectableWallets = [];
    for (const wallet of wallets) {
        if (wallet.features.includes(StandardConnect) && wallet.features.includes(StandardDisconnect)) {
            walletsThatSupportStandardConnect.push(wallet);
        } else {
            unconnectableWallets.push(wallet);
        }
    }
    
    // Get the button color based on connection status
    const getButtonColor = () => {
        switch(connectionStatus) {
            case 'connected': return 'green';
            case 'error': return 'red';
            default: return undefined; // default button color
        }
    };
    
    return (
        <>
            <DropdownMenu.Root open={forceClose ? false : undefined} onOpenChange={setForceClose.bind(null, false)}>
                <DropdownMenu.Trigger>
                    <Tooltip 
                        content={
                            connectionStatus === 'error' ? 
                            "Wallet connection has an error. Click to reconnect." : 
                            connectionStatus === 'connected' ? 
                            "Wallet connected successfully" : 
                            "Connect your wallet to continue"
                        }
                    >
                        <Button color={getButtonColor()}>
                            {selectedWalletAccount ? (
                                <>
                                    <WalletAccountIcon account={selectedWalletAccount} width="18" height="18" />
                                    {selectedWalletAccount.address.slice(0, 8)}
                                </>
                            ) : (
                                children
                            )}
                            {connectionStatus === 'error' ? 
                                <ExclamationTriangleIcon style={{marginLeft: 4}} /> : 
                                <DropdownMenu.TriggerIcon />
                            }
                        </Button>
                    </Tooltip>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {connectionStatus === 'error' && (
                        <Callout.Root color="orange" size="1" mb="2">
                            <Callout.Icon>
                                <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                There may be an issue with your wallet connection. Please try reconnecting.
                            </Callout.Text>
                        </Callout.Root>
                    )}
                    
                    {wallets.length === 0 ? (
                        <Callout.Root color="orange" highContrast>
                            <Callout.Icon>
                                <ExclamationTriangleIcon />
                            </Callout.Icon>
                            <Callout.Text>
                                No wallet detected. Please install a Solana-compatible wallet extension.
                            </Callout.Text>
                        </Callout.Root>
                    ) : (
                        <>
                            {walletsThatSupportStandardConnect.map(renderItem)}
                            {unconnectableWallets.length ? (
                                <>
                                    <DropdownMenu.Separator />
                                    {unconnectableWallets.map(renderItem)}
                                </>
                            ) : null}
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            {error !== NO_ERROR ? (
                <ErrorDialog 
                    error={error} 
                    onClose={() => {
                        setError(NO_ERROR);
                        // If we have a selected wallet, don't change connection status
                        if (!selectedWalletAccount) {
                            setConnectionStatus('disconnected');
                        }
                    }} 
                />
            ) : null}
        </>
    );
}
