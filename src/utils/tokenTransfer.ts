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
        
        // Get latest blockhash for transaction with timeout handling
        const { value: latestBlockhash } = await Promise.race([
            rpc.getLatestBlockhash({ commitment: 'confirmed' }).send(),
            new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error("Blockhash request timed out")), 30000)
            )
        ]);
        
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
        
        // Send transaction and return signature
        return await signAndSendTransactionMessageWithSigners(message);
    } catch (error: any) {
        // Improve error handling with more descriptive messages
        if (error.message?.includes('insufficient funds')) {
            throw new Error("Insufficient funds to complete transaction");
        }
        
        if (error.message?.includes('blockhash')) {
            throw new Error("Transaction failed: Blockhash expired or invalid");
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
        const result = await rpc.getSignatureStatus(signature).send();
        const status = result.value;
        
        // Transaction was successful if status is not null and doesn't contain an error
        return !!status && !status.err;
    } catch (error) {
        console.error("Failed to verify transaction:", error);
        return false;
    }
}
