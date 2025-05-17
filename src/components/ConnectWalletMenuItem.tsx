import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { DropdownMenu, ThickChevronRightIcon } from '@radix-ui/themes';
import type { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { uiWalletAccountsAreSame, useConnect, useDisconnect } from '@wallet-standard/react';
import { useCallback, useContext, useState } from 'react';

import { SelectedWalletAccountContext } from '../context/SelectedWalletAccountContext';
import { WalletMenuItemContent } from './WalletMenuItemContent';

type Props = Readonly<{
    onAccountSelect(account: UiWalletAccount | undefined): void;
    onDisconnect(wallet: UiWallet): void;
    onError(err: unknown): void;
    wallet: UiWallet;
}>;

export function ConnectWalletMenuItem({ onAccountSelect, onDisconnect, onError, wallet }: Props) {
    const [isConnecting, connect] = useConnect(wallet);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);
    const [connectAttempts, setConnectAttempts] = useState(0);
    const isPending = isConnecting || isDisconnecting;
    const isConnected = wallet.accounts.length > 0;
    const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
    const handleConnectClick = useCallback(async () => {
        try {
            // Track connection attempts to prevent infinite retries
            setConnectAttempts(prev => prev + 1);

            // Add timeout to prevent hanging connection attempts
            const connectWithTimeout = async () => {
                const timeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('Wallet connection timeout. Please try again.')), 30000);
                });

                try {
                    return await Promise.race([connect(), timeoutPromise]);
                } catch (error: any) {
                    // Specific handling for known errors
                    if (error.message?.includes('User rejected')) {
                        throw new Error('Connection rejected by user');
                    } else if (error.message?.includes('timeout')) {
                        throw new Error('Connection timed out. Please try again.');
                    }
                    throw error;
                }
            };

            const existingAccounts = [...wallet.accounts];
            const nextAccounts = await connectWithTimeout();

            // Try to choose the first never-before-seen account.
            for (const nextAccount of nextAccounts) {
                if (!existingAccounts.some(existingAccount => uiWalletAccountsAreSame(nextAccount, existingAccount))) {
                    onAccountSelect(nextAccount);
                    // Reset connection attempts on success
                    setConnectAttempts(0);
                    return;
                }
            }

            // Failing that, choose the first account in the list.
            if (nextAccounts[0]) {
                onAccountSelect(nextAccounts[0]);
                setConnectAttempts(0);
            } else {
                throw new Error('No accounts found in the wallet');
            }
        } catch (e: any) {
            // If we've tried too many times, log a warning and pass the error
            if (connectAttempts >= 3) {
                console.warn('Multiple wallet connection failures:', e);
                onError(new Error('Multiple connection attempts failed. Please check your wallet installation or try a different wallet.'));
            } else {
                onError(e);
            }
        }
    }, [connect, onAccountSelect, onError, wallet.accounts, connectAttempts]);
    return (
        <DropdownMenu.Sub open={!isConnected ? false : undefined}>
            <DropdownMenuPrimitive.SubTrigger
                asChild={false}
                className={[
                    'rt-BaseMenuItem',
                    'rt-BaseMenuSubTrigger',
                    'rt-DropdownMenuItem',
                    'rt-DropdownMenuSubTrigger',
                ].join(' ')}
                disabled={isPending}
                onClick={!isConnected ? handleConnectClick : undefined}
            >
                <WalletMenuItemContent loading={isPending} wallet={wallet} />
                {isConnected ? (
                    <div className="rt-BaseMenuShortcut rt-DropdownMenuShortcut">
                        <ThickChevronRightIcon className="rt-BaseMenuSubTriggerIcon rt-DropdownMenuSubtriggerIcon" />
                    </div>
                ) : null}
            </DropdownMenuPrimitive.SubTrigger>
            <DropdownMenu.SubContent>
                <DropdownMenu.Label>Accounts</DropdownMenu.Label>
                <DropdownMenu.RadioGroup value={selectedWalletAccount?.address}>
                    {wallet.accounts.map(account => (
                        <DropdownMenu.RadioItem
                            key={account.address}
                            value={account.address}
                            onSelect={() => {
                                onAccountSelect(account);
                            }}
                        >
                            {account.address.slice(0, 8)}&hellip;
                        </DropdownMenu.RadioItem>
                    ))}
                </DropdownMenu.RadioGroup>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                    onSelect={async e => {
                        e.preventDefault();
                        await handleConnectClick();
                    }}
                >
                    Connect More
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    color="red"
                    onSelect={async e => {
                        e.preventDefault();
                        try {
                            await disconnect();
                            onDisconnect(wallet);
                        } catch (e) {
                            onError(e);
                        }
                    }}
                >
                    Disconnect
                </DropdownMenu.Item>
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
    );
}
