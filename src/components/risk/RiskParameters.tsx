import { Box, Text, Heading } from '@radix-ui/themes';
import { ParamDef } from './types';

interface RiskParametersProps {
    params: ParamDef[];
    paramValues: Record<string, number>;
    onParamChange: (id: string, value: number) => void;
    riskScore: number;
}

export function RiskParameters({
    params,
    paramValues,
    onParamChange,
    riskScore
}: RiskParametersProps) {
    return (
        <Box mb="4">
            <Heading size="4" mb="2">Adjust Parameters:</Heading>
            {params.map(p => (
                <Box key={p.id} mb="3">
                    <Text mb="1">{p.label}: {paramValues[p.id]}</Text>
                    <input
                        type="range"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={paramValues[p.id] || 0}
                        onChange={e => onParamChange(p.id, Number(e.target.value))}
                    />
                    <Text size="2" color="gray">{p.description}</Text>
                </Box>
            ))}
            <Text size="3" mb="3">Calculated Risk Score: {riskScore}/100</Text>
        </Box>
    );
}
