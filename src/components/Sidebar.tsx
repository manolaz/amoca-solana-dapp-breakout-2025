import { Box, Flex, Heading, Button } from '@radix-ui/themes';

const SIDEBAR_WIDTH = 220;

export function Sidebar({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (p: string) => void }) {
    return (
        <Box
            style={{
                width: SIDEBAR_WIDTH,
                minHeight: '100vh',
                background: '#e0f2fe',
                borderRight: '1.5px solid #bae6fd',
                padding: '2rem 1rem 1rem 1rem',
                position: 'sticky',
                top: 0,
            }}
        >
            <Flex direction="column" gap="5" align="center" py="4">
                <img src="/solanaLogoMark.svg" alt="Solana Logo" width={48} height={48} />
                
                <Button
                    variant={currentPage === 'home' ? 'solid' : 'outline'}
                    color="blue"
                    size="3"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => setCurrentPage('home')}
                >
                    Home
                </Button>
                <Button
                    variant={currentPage === 'policy' ? 'solid' : 'outline'}
                    color="green"
                    size="3"
                    style={{ justifyContent: 'flex-start' }}
                    onClick={() => setCurrentPage('policy')}
                >
                    Insurance Policy
                </Button>
            </Flex>
        </Box>
    );
}
