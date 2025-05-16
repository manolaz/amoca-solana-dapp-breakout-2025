import { Box, Heading, Text, Button } from '@radix-ui/themes';

export function InsurancePolicyPage() {
    return (
        <Box p="5">
            <Heading as="h2" size="6" mb="4" style={{ color: '#38bdf8' }}>
                Buy Insurance Policy
            </Heading>
            <Text as="p" mb="4">
                Select the type of climate risk you want protection against and purchase a parametric insurance policy.
            </Text>
            <form>
                <Box mb="3">
                    <label>
                        <Text as="span" mr="2">Risk Type:</Text>
                        <select style={{ padding: 6, borderRadius: 6 }}>
                            <option value="flood">Flood</option>
                            <option value="drought">Drought</option>
                            <option value="hurricane">Hurricane</option>
                            <option value="wildfire">Wildfire</option>
                            <option value="heatwave">Heatwave</option>
                        </select>
                    </label>
                </Box>
                <Box mb="3">
                    <label>
                        <Text as="span" mr="2">Coverage Amount (SOL):</Text>
                        <input type="number" min="1" max="1000" step="1" style={{ padding: 6, borderRadius: 6, width: 120 }} />
                    </label>
                </Box>
                <Box mb="3">
                    <label>
                        <Text as="span" mr="2">Duration (months):</Text>
                        <input type="number" min="1" max="12" step="1" style={{ padding: 6, borderRadius: 6, width: 80 }} />
                    </label>
                </Box>
                <Button type="submit" color="green" size="3">
                    Buy Policy
                </Button>
            </form>
        </Box>
    );
}
