/**
 * Generates a unique key for storing wallet account information
 */
export function getUiWalletAccountStorageKey(account: any): string {
    return `${account.address}-${account.label || 'unlabeled'}`;
}

// Add other wallet utility functions as needed
