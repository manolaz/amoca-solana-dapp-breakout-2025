import './index.css';
import '@radix-ui/themes/styles.css';

import { Flex, Section, Theme } from '@radix-ui/themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Nav } from './components/Nav.tsx';
import { ChainContextProvider } from './context/ChainContextProvider.tsx';
import { RpcContextProvider } from './context/RpcContextProvider.tsx';
import { SelectedWalletAccountContextProvider } from './context/SelectedWalletAccountContextProvider.tsx';
import Root from './routes/root.tsx';

const rootNode = document.getElementById('root')!;

// --- AMOCA Branding Metadata ---
if (typeof document !== 'undefined') {
    document.title = 'AMOCA: Decentralized Climate Parametric Insurance Dapp';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute(
            'content',
            'AMOCA is a decentralized Solana dapp for parametric climate insurance. Transparent, automated, and scalable payouts for climate risks.'
        );
    } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content =
            'AMOCA is a decentralized Solana dapp for parametric climate insurance. Transparent, automated, and scalable payouts for climate risks.';
        document.head.appendChild(meta);
    }
    // Optional: set favicon to AMOCA logo if desired
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        document.head.appendChild(favicon);
    }
    favicon.setAttribute('href', 'public/amoca/amoca-logo.png');
}

const root = createRoot(rootNode);
root.render(
    <StrictMode>
        <Theme>
            <ChainContextProvider>
                <SelectedWalletAccountContextProvider>
                    <RpcContextProvider>
                        <Flex direction="column">
                            <Nav />
                            <Section>
                                <Root />
                            </Section>
                        </Flex>
                    </RpcContextProvider>
                </SelectedWalletAccountContextProvider>
            </ChainContextProvider>
        </Theme>
    </StrictMode>,
);
