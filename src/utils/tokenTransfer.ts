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
    // Convert SOL amount to lamports
    const solAmount = lamports(BigInt(Math.round(amount * 1_000_000_000)));
    
    // Get latest blockhash for transaction
    const { value: latestBlockhash } = await rpc
        .getLatestBlockhash({ commitment: 'confirmed' })
        .send();
    
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
}

// For debugging or transaction validation
export function getSignatureFromBytes(signature: Uint8Array): string {
    return getBase58Decoder().decode(signature);
}
