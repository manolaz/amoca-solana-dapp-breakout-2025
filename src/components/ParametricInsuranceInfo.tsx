import { Box, Heading, Text, Flex, Card } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export function ParametricInsuranceInfo() {
    return (
        <Box mb="6" style={{ borderRadius: 16, padding: 0, overflow: 'hidden' }}>
            {/* Colorful Header Section */}
            <Box style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                padding: '24px 20px',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background elements */}
                <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '40px', 
                    fontSize: '50px',
                    opacity: 0.2
                }}>
                    🌊
                </div>
                <div style={{ 
                    position: 'absolute', 
                    bottom: '-10px', 
                    right: '120px', 
                    fontSize: '60px',
                    opacity: 0.15
                }}>
                    🌪️
                </div>
                <div style={{ 
                    position: 'absolute', 
                    bottom: '15px', 
                    left: '30px', 
                    fontSize: '40px',
                    opacity: 0.15
                }}>
                    🔥
                </div>
                
                {/* Main heading with larger emoji */}
                <Flex align="center" gap="3" style={{ position: 'relative', zIndex: 2 }}>
                    <Text size="8" style={{ color: 'white' }}>🛡️</Text>
                    <Box>
                        <Heading as="h2" size="6" mb="1" style={{ color: 'white' }}>
                            What is Parametric Insurance?
                        </Heading>
                        <Text as="p" size="3" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Smart protection for our changing climate
                        </Text>
                    </Box>
                </Flex>
            </Box>
            
            {/* Main content area with white background */}
            <Box style={{ background: 'white', padding: '24px', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <Text as="p" size="3" style={{ color: '#334155', marginBottom: 16 }}>
                    Parametric insurance is a type of insurance that pays out automatically when a specific event or parameter is triggered, such as a certain amount of rainfall, temperature, or wind speed. There is no need for manual claims or loss assessment—payouts are fast, transparent, and based on trusted data sources.
                </Text>
                
                {/* Feature cards with colorful tops */}
                <Flex gap="3" wrap="wrap" mb="4">
                    <Card style={{ flex: '1 1 250px', overflow: 'hidden', padding: 0, borderRadius: 12 }}>
                        <Box style={{ background: '#3b82f6', padding: '12px', textAlign: 'center' }}>
                            <Text size="5">⚡</Text>
                        </Box>
                        <Box p="3">
                            <Heading as="h4" size="2" mb="1">Fast Payouts</Heading>
                            <Text as="p" size="2">
                                Receive funds automatically when climate data meets the policy criteria, often within hours or days of an event.
                            </Text>
                        </Box>
                    </Card>
                    
                    <Card style={{ flex: '1 1 250px', overflow: 'hidden', padding: 0, borderRadius: 12 }}>
                        <Box style={{ background: '#8b5cf6', padding: '12px', textAlign: 'center' }}>
                            <Text size="5">📊</Text>
                        </Box>
                        <Box p="3">
                            <Heading as="h4" size="2" mb="1">Transparent</Heading>
                            <Text as="p" size="2">
                                All policy terms and triggers are on-chain and verifiable. You know exactly when and why a payout will occur.
                            </Text>
                        </Box>
                    </Card>
                    
                    <Card style={{ flex: '1 1 250px', overflow: 'hidden', padding: 0, borderRadius: 12 }}>
                        <Box style={{ background: '#ec4899', padding: '12px', textAlign: 'center' }}>
                            <Text size="5">📱</Text>
                        </Box>
                        <Box p="3">
                            <Heading as="h4" size="2" mb="1">No Paperwork</Heading>
                            <Text as="p" size="2">
                                No need to prove damages or file traditional claims. Smart contracts handle everything automatically.
                            </Text>
                        </Box>
                    </Card>
                </Flex>
                
                {/* Additional protection details */}
                <Card style={{ background: '#f8fafc', padding: '16px', borderRadius: 12, marginBottom: '16px' }}>
                    <Heading as="h4" size="3" mb="2" style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text>🌍</Text> Protection Against Climate Risks
                    </Heading>
                    <Flex gap="4" wrap="wrap">
                        <Box style={{ flex: '1 1 200px' }}>
                            <Text as="p" size="2" mb="1" weight="bold" style={{ color: '#0e7490' }}>
                                🌊 Flood Protection
                            </Text>
                            <Text as="p" size="2" style={{ color: '#64748b' }}>
                                Triggers based on rainfall amounts or river levels. Automatic payouts when thresholds are exceeded.
                            </Text>
                        </Box>
                        
                        <Box style={{ flex: '1 1 200px' }}>
                            <Text as="p" size="2" mb="1" weight="bold" style={{ color: '#0e7490' }}>
                                🔥 Wildfire Protection
                            </Text>
                            <Text as="p" size="2" style={{ color: '#64748b' }}>
                                Uses satellite data to detect fires and air quality. Payouts when your area is affected.
                            </Text>
                        </Box>
                        
                        <Box style={{ flex: '1 1 200px' }}>
                            <Text as="p" size="2" mb="1" weight="bold" style={{ color: '#0e7490' }}>
                                🌪️ Extreme Wind Events
                            </Text>
                            <Text as="p" size="2" style={{ color: '#64748b' }}>
                                Coverage for hurricanes and wind damage based on recorded wind speed in your area.
                            </Text>
                        </Box>
                        
                        <Box style={{ flex: '1 1 200px' }}>
                            <Text as="p" size="2" mb="1" weight="bold" style={{ color: '#0e7490' }}>
                                🌡️ Temperature Extremes
                            </Text>
                            <Text as="p" size="2" style={{ color: '#64748b' }}>
                                Protection against crop damage, infrastructure stress, or business interruption from heat waves or freezes.
                            </Text>
                        </Box>
                    </Flex>
                </Card>
                
                {/* How it works section */}
                <Card style={{ background: 'linear-gradient(to right, #f0fdfa, #ecfeff)', padding: '16px', borderRadius: 12 }}>
                    <Heading as="h4" size="3" mb="2" style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text>⚙️</Text> How Parametric Insurance Works
                    </Heading>
                    <ol style={{ color: '#334155', margin: 0, paddingLeft: '20px' }}>
                        <li>
                            <Text as="span" weight="bold">Select your risk:</Text>
                            <Text as="span"> Choose what climate hazard you want protection against</Text>
                        </li>
                        <li>
                            <Text as="span" weight="bold">Set parameters:</Text>
                            <Text as="span"> Define the trigger conditions (e.g., rainfall exceeding 5 inches)</Text>
                        </li>
                        <li>
                            <Text as="span" weight="bold">Choose coverage amount:</Text>
                            <Text as="span"> Select how much coverage you need</Text>
                        </li>
                        <li>
                            <Text as="span" weight="bold">Pay premium:</Text>
                            <Text as="span"> Secure your policy with SOL payment</Text>
                        </li>
                        <li>
                            <Text as="span" weight="bold">Automatic execution:</Text>
                            <Text as="span"> Receive payout directly to your wallet when conditions are met</Text>
                        </li>
                    </ol>
                </Card>
            </Box>
        </Box>
    );
}
