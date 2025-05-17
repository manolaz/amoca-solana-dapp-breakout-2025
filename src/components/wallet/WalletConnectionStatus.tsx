import React, { useContext, useEffect, useState } from 'react';
import { Box, Callout, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon, CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { ChainContext } from '../../context/ChainContext';
import { SelectedWalletAccountContext } from '../../context/SelectedWalletAccountContext';
import { RpcContext } from '../../context/RpcContext';
import { checkWalletConnection } from '../../utils/tokenTransfer';

type ConnectionStatusProps = {
  showExtended?: boolean;
};

export function WalletConnectionStatus({ showExtended = false }: ConnectionStatusProps) {
  const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
  const { chain } = useContext(ChainContext);
  const { rpc } = useContext(RpcContext);
  const [connectionStatus, setConnectionStatus] = useState<'connected'|'disconnected'|'error'|'network_error'>('disconnected');
  const [networkLatency, setNetworkLatency] = useState<number | null>(null);

  useEffect(() => {
    // Check basic wallet connection
    if (!selectedWalletAccount) {
      setConnectionStatus('disconnected');
      return;
    }
    
    // Check if wallet supports the current chain
    const isChainSupported = selectedWalletAccount.chains.includes(chain);
    if (!isChainSupported) {
      setConnectionStatus('error');
      return;
    }
    
    // Further validate wallet connection
    const isConnected = checkWalletConnection(selectedWalletAccount);
    setConnectionStatus(isConnected ? 'connected' : 'error');
    
    // Check network connectivity and latency if extended info is requested
    if (showExtended) {
      const checkNetwork = async () => {
        try {
          const startTime = Date.now();
          await rpc.getHealth().send();
          const endTime = Date.now();
          setNetworkLatency(endTime - startTime);
        } catch (error) {
          console.warn("Network error:", error);
          setConnectionStatus('network_error');
          setNetworkLatency(null);
        }
      };
      
      checkNetwork();
      const interval = setInterval(checkNetwork, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [selectedWalletAccount, chain, rpc, showExtended]);

  if (!showExtended) {
    // Simple indicator version
    return (
      <Box display="flex" alignItems="center" gap="2">
        {connectionStatus === 'connected' ? (
          <CheckCircledIcon color="green" width={16} height={16} />
        ) : connectionStatus === 'error' ? (
          <ExclamationTriangleIcon color="orange" width={16} height={16} />
        ) : connectionStatus === 'network_error' ? (
          <CrossCircledIcon color="red" width={16} height={16} />
        ) : (
          <Box width="16px" height="16px" style={{ borderRadius: '50%', backgroundColor: '#aaa' }} />
        )}
      </Box>
    );
  }

  // Extended version with more details
  return (
    <Box>
      {connectionStatus === 'connected' ? (
        <Callout.Root color="green" size="1">
          <Callout.Icon>
            <CheckCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Wallet connected to {chain.replace('solana:', '')}
            {networkLatency !== null && (
              <Text size="1" color="gray"> (Network latency: {networkLatency}ms)</Text>
            )}
          </Callout.Text>
        </Callout.Root>
      ) : connectionStatus === 'error' ? (
        <Callout.Root color="orange" size="1">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>
            Wallet connection issue. Chain {chain.replace('solana:', '')} may not be supported by your wallet.
          </Callout.Text>
        </Callout.Root>
      ) : connectionStatus === 'network_error' ? (
        <Callout.Root color="red" size="1">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Network connectivity issue. Unable to connect to Solana {chain.replace('solana:', '')}.
          </Callout.Text>
        </Callout.Root>
      ) : (
        <Callout.Root color="gray" size="1">
          <Callout.Text>
            No wallet connected. Please connect your wallet to continue.
          </Callout.Text>
        </Callout.Root>
      )}
    </Box>
  );
}
