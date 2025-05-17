import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';
import { ReactNode, useContext, useMemo, useState, useEffect } from 'react';

import { ChainContext } from './ChainContext';
import { RpcContext } from './RpcContext';

type Props = Readonly<{
    children: ReactNode;
}>;

// Backup RPC endpoints in case primary endpoints fail
const BACKUP_ENDPOINTS = {
    'solana:devnet': {
        rpc: ['https://api.devnet.solana.com', 'https://devnet.genesysgo.net'],
        ws: ['wss://api.devnet.solana.com', 'wss://devnet.genesysgo.net'],
    },
    'solana:testnet': {
        rpc: ['https://api.testnet.solana.com'],
        ws: ['wss://api.testnet.solana.com'],
    },
    'solana:mainnet': {
        rpc: ['https://api.mainnet-beta.solana.com', 'https://solana-api.projectserum.com'],
        ws: ['wss://api.mainnet-beta.solana.com', 'wss://solana-api.projectserum.com'],
    },
};

export function RpcContextProvider({ children }: Props) {
    const { chain, solanaRpcSubscriptionsUrl, solanaRpcUrl } = useContext(ChainContext);
    const [rpcEndpointHealth, setRpcEndpointHealth] = useState<{ rpc: boolean; ws: boolean }>({
        rpc: true,
        ws: true,
    });

    // Check the health of the RPC endpoint
    useEffect(() => {
        const checkHealth = async () => {
            try {
                const rpc = createSolanaRpc(solanaRpcUrl);
                await rpc.getHealth().send();
                setRpcEndpointHealth((prev) => ({ ...prev, rpc: true }));
            } catch (error) {
                console.warn('RPC endpoint health check failed:', error);
                setRpcEndpointHealth((prev) => ({ ...prev, rpc: false }));
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [solanaRpcUrl]);

    // Create RPC with potential failover
    const rpcValue = useMemo(() => {
        // Select appropriate RPC URL - use primary or fallback to backup if unhealthy
        let rpcUrl = solanaRpcUrl;
        let wsUrl = solanaRpcSubscriptionsUrl;

        // If primary RPC is unhealthy and we have backups for this chain
        if (!rpcEndpointHealth.rpc && BACKUP_ENDPOINTS[chain as keyof typeof BACKUP_ENDPOINTS]) {
            const backups = BACKUP_ENDPOINTS[chain as keyof typeof BACKUP_ENDPOINTS];
            rpcUrl = backups.rpc[0]; // Use first backup
            wsUrl = backups.ws[0]; // Use first backup for WS too
            console.log(`Using backup RPC endpoint for ${chain}: ${rpcUrl}`);
        }

        return {
            rpc: createSolanaRpc(rpcUrl),
            rpcSubscriptions: createSolanaRpcSubscriptions(wsUrl),
        };
    }, [solanaRpcUrl, solanaRpcSubscriptionsUrl, chain, rpcEndpointHealth]);

    return <RpcContext.Provider value={rpcValue}>{children}</RpcContext.Provider>;
}
