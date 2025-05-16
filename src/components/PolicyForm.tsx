import { Box, Button, Text } from '@radix-ui/themes';

export function PolicyForm() {
    // You can add state/handlers for form fields if needed
    return (
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
    );
}
