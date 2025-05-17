import {
    address,
    appendTransactionMessageInstruction,
    assertIsTransactionMessageWithSingleSendingSigner,
    createTransactionMessage,
    getBase58Decoder,
    lamports,
    pipe,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signAndSendTransactionMessageWithSigners,
} from '@solana/kit';
import { getTransferSolInstruction } from '@solana-program/system';
import type { Rpc, SolanaRpcApiMainnet } from '@solana/kit';
import type { Signer } from '@solana/kit';

// AMOCA insurance account on devnet
export const AMOCA_ACCOUNT = "BWVdK3CTK4SCH4AfZZ4KunFGSk9eCvqDcXHX8vc5UMSD";

// Backup RPC URLs to try if primary fails
const BACKUP_RPC_URLS = {
    'solana:devnet': ['https://api.devnet.solana.com', 'https://devnet.genesysgo.net'],
    'solana:testnet': ['https://api.testnet.solana.com'],
    'solana:mainnet': ['https://api.mainnet-beta.solana.com', 'https://solana-api.projectserum.com']
};

export async function sendTokens(
    rpc: Rpc<SolanaRpcApiMainnet>,
    transactionSendingSigner: Signer,
    amount: number,
): Promise<Uint8Array> {
    try {
        // Add input validation to prevent errors
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }
        
        // Convert SOL amount to lamports - handle potential overflow with safe conversion
        const solAmount = lamports(BigInt(Math.floor(amount * 1_000_000_000)));
        
        // Add retry logic for getting blockhash with increased timeout
        const getBlockhashWithRetry = async (attempts = 3): Promise<any> => {
            try {
                return await Promise.race([
                    rpc.getLatestBlockhash({ commitment: 'confirmed' }).send(),
                    new Promise<never>((_, reject) => 
                        setTimeout(() => reject(new Error("Blockhash request timed out")), 45000)
                    )
                ]);
            } catch (error) {
                if (attempts > 1) {
                    console.warn("Blockhash fetch failed, retrying...");
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return getBlockhashWithRetry(attempts - 1);
                }
                throw error;
            }
        };
        
        // Get latest blockhash for transaction with retries
        const { value: latestBlockhash } = await getBlockhashWithRetry();
        
        // Create transaction message
        const message = pipe(
            createTransactionMessage({ version: 0 }),
            m => setTransactionMessageFeePayerSigner(transactionSendingSigner, m),
            m => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
            m => appendTransactionMessageInstruction(
                getTransferSolInstruction({
                    amount: solAmount,
                    destination: address(AMOCA_ACCOUNT),
                    source: transactionSendingSigner,
                }),
                m,
            ),
        );
        
        // Verify message structure
        assertIsTransactionMessageWithSingleSendingSigner(message);
        
        // Send transaction with retry option
        const sendWithRetry = async (attempts = 2): Promise<Uint8Array> => {
            try {
                return await signAndSendTransactionMessageWithSigners(message);
            } catch (error: any) {
                if (attempts > 1 && 
                   (error.message?.includes('timed out') || error.message?.includes('network error'))) {
                    console.warn("Transaction submission failed, retrying...");
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    return sendWithRetry(attempts - 1);
                }
                throw error;
            }
        };
        
        return await sendWithRetry();
    } catch (error: any) {
        // Improve error handling with more descriptive messages
        if (error.message?.includes('insufficient funds')) {
            throw new Error("Insufficient funds to complete transaction. Please add more SOL to your wallet.");
        }
        
        if (error.message?.includes('blockhash')) {
            throw new Error("Transaction failed: Blockhash expired or invalid. Please try again.");
        }
        
        if (error.message?.includes('timed out')) {
            throw new Error("Transaction timed out. Network may be congested - please try again.");
        }
        
        if (error.message?.includes('wallet disconnected') || error.message?.includes('wallet not connected')) {
            throw new Error("Wallet connection lost. Please reconnect your wallet and try again.");
        }
        
        // Rethrow with a more descriptive message
        throw new Error(`Transaction failed: ${error.message || "Unknown error"}`);
    }
}

// For debugging or transaction validation
export function getSignatureFromBytes(signature: Uint8Array): string {
    try {
        return getBase58Decoder().decode(signature);
    } catch (error) {
        console.error("Failed to decode signature:", error);
        return "Invalid signature";
    }
}

// Add a helper function to verify if the transaction was successful
export async function verifyTransaction(
    rpc: Rpc<SolanaRpcApiMainnet>, 
    signature: string
): Promise<boolean> {
    try {
        let attempts = 5;
        while (attempts > 0) {
            const result = await rpc.getSignatureStatus(signature).send();
            const status = result.value;
            
            // Transaction was successful if status is not null and doesn't contain an error
            if (!!status) {
                if (!status.err) return true;
                // If we have an error, no need to retry
                return false;
            }
            
            // If status is null, wait and retry
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts--;
        }
        return false;
    } catch (error) {
        console.error("Failed to verify transaction:", error);
        return false;
    }
}

// Check if wallet is properly connected
export function checkWalletConnection(walletAccount: any): boolean {
    if (!walletAccount) return false;
    
    try {
        // Check if address is present and valid
        if (!walletAccount.address || typeof walletAccount.address !== 'string' || 
            walletAccount.address.length < 32) {
            return false;
        }
        
        // Check if the wallet has necessary features
        if (!walletAccount.features || !Array.isArray(walletAccount.features) || 
            walletAccount.features.length === 0) {
            return false;
        }
        
        return true;
    } catch (error) {
        console.error("Error checking wallet connection:", error);
        return false;
    }
}
