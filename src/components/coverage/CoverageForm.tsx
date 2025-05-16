import { Box, Text } from '@radix-ui/themes';

interface CoverageFormProps {
    coverage: number;
    durationMonths: number;
    onCoverageChange: (value: number) => void;
    onDurationChange: (value: number) => void;
}

export function CoverageForm({
    coverage,
    durationMonths,
    onCoverageChange,
    onDurationChange
}: CoverageFormProps) {
    return (
        <>
            <Box mb="3">
                <label>
                    <Text as="span" mr="2">Coverage Amount (SOL):</Text>
                    <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={coverage}
                        onChange={e => onCoverageChange(Number(e.target.value))}
                        style={{ padding: 6, borderRadius: 6, width: 120 }}
                    />
                </label>
            </Box>
            <Box mb="3">
                <label>
                    <Text as="span" mr="2">Duration (months):</Text>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        step="1"
                        value={durationMonths}
                        onChange={e => onDurationChange(Number(e.target.value))}
                        style={{ padding: 6, borderRadius: 6, width: 80 }}
                    />
                </label>
            </Box>
        </>
    );
}
