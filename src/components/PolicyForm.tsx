import { Box, Button, Text, Flex, Card, Heading } from '@radix-ui/themes';
import { useState, useEffect, useMemo } from 'react';

interface ParamDef {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    description: string;
}

interface RiskType {
    id: string;
    name: string;
    emoji: string;
    riskLevel: string;
    trend: string;
    description: string;
    color: string;
    params: ParamDef[];
}

const riskTypes: RiskType[] = [
    {
        id: 'typhoon',
        name: 'Typhoon Risk',
        emoji: '🌀',
        riskLevel: 'High Risk',
        trend: 'Increasing',
        description: "Manila is in a major typhoon path with an average of 5-7 typhoons making landfall annually in the Philippines. The city's coastal location increases vulnerability to storm surges.",
        color: 'var(--blue-3)',
        params: [
            { id: 'freq', label: 'Annual Frequency', min: 1, max: 10, step: 1, defaultValue: 6,
              description: 'Average typhoons per year' },
            { id: 'coastVuln', label: 'Coastal Vulnerability', min: 0, max: 10, step: 1, defaultValue: 7,
              description: 'Storm surge exposure' },
        ],
    },
    {
        id: 'flood',
        name: 'Flood Risk',
        emoji: '🌊',
        riskLevel: 'Extreme Risk',
        trend: 'Increasing',
        description: 'Manila experiences severe urban flooding due to its low-lying geography, inadequate drainage systems, and intense monsoon rains. Climate change is increasing the frequency of extreme rainfall events.',
        color: 'var(--cyan-3)',
        params: [
            { id: 'rainfall', label: 'Heavy Rainfall Intensity', min: 10, max: 100, step: 5, defaultValue: 50,
              description: 'mm of rainfall in a day' },
            { id: 'drainage', label: 'Drainage Capacity', min: 0, max: 10, step: 1, defaultValue: 3,
              description: '1-10 scale of drainage effectiveness' },
        ],
    },
    {
        id: 'drought',
        name: 'Drought Risk',
        emoji: '🏜️',
        riskLevel: 'Low Risk',
        trend: 'Stable',
        description: 'Manila experiences occasional water shortages during El Niño years, but severe droughts are relatively rare in this region.',
        color: 'var(--orange-3)',
        params: [
            { id: 'duration', label: 'Drought Duration', min: 1, max: 12, step: 1, defaultValue: 3,
              description: 'Months of potential drought' },
            { id: 'severity', label: 'Drought Severity', min: 1, max: 10, step: 1, defaultValue: 2,
              description: '1-10 scale of drought severity' },
        ],
    },
    {
        id: 'heatwave',
        name: 'Heatwave Risk',
        emoji: '🔥',
        riskLevel: 'Medium Risk',
        trend: 'Increasing',
        description: "Manila's urban heat island effect amplifies already high tropical temperatures. Heat index regularly exceeds dangerous levels during summer months.",
        color: 'var(--red-3)',
        params: [
            { id: 'temp', label: 'Max Temperature', min: 30, max: 50, step: 1, defaultValue: 38,
              description: '°C' },
            { id: 'duration', label: 'Heatwave Duration', min: 1, max: 7, step: 1, defaultValue: 3,
              description: 'Days of extreme heat' },
        ],
    },
    {
        id: 'landslide',
        name: 'Landslide Risk',
        emoji: '🏞️',
        riskLevel: 'Medium Risk',
        trend: 'Stable',
        description: 'While central Manila is relatively flat, surrounding areas in Metro Manila have landslide risks, particularly during heavy rainfall events.',
        color: 'var(--brown-3)',
        params: [
            { id: 'slope', label: 'Slope Steepness', min: 0, max: 100, step: 1, defaultValue: 15,
              description: 'Degrees' },
            { id: 'rainfall', label: 'Rainfall Before Landslide', min: 50, max: 300, step: 10, defaultValue: 100,
              description: 'mm of rainfall' },
        ],
    },
];

export function PolicyForm() {
    const [selectedRiskTypeId, setSelectedRiskTypeId] = useState<string>(riskTypes[0].id);
    const selectedRisk = riskTypes.find(r => r.id === selectedRiskTypeId)!;

    const [paramValues, setParamValues] = useState<Record<string, number>>({});

    useEffect(() => {
        // initialize params on risk change
        const init: Record<string, number> = {};
        selectedRisk.params.forEach(p => init[p.id] = p.defaultValue);
        setParamValues(init);
    }, [selectedRiskTypeId]);

    const riskScore = useMemo(() => {
        const vals = selectedRisk.params.map(p =>
            (paramValues[p.id] - p.min) / (p.max - p.min)
        );
        return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
    }, [selectedRisk, paramValues]);

    // add coverage & duration state
    const [coverage, setCoverage] = useState<number>(1);
    const [durationMonths, setDurationMonths] = useState<number>(1);

    // calculate premium based on riskScore and coverage
    const estimatedPremium = useMemo(
        () => Number((coverage * riskScore / 100).toFixed(2)),
        [coverage, riskScore],
    );
    // potential payout equals the coverage amount
    const potentialPayout = coverage;

    return (
        <form>
            <Box mb="4">
                <Heading size="4" mb="2">Select Risk Type:</Heading>
                <Flex direction="column" gap="3">
                    {riskTypes.map((risk) => (
                        <Card
                            key={risk.id}
                            onClick={() => setSelectedRiskTypeId(risk.id)}
                            style={{
                                cursor: 'pointer',
                                border: selectedRiskTypeId === risk.id ? '2px solid var(--accent-9)' : '2px solid transparent',
                                backgroundColor: risk.color,
                                padding: 'var(--space-4)',
                                borderRadius: 'var(--radius-3)',
                            }}
                        >
                            <Flex gap="3" align="center">
                                <Text size="6">{risk.emoji}</Text>
                                <Box flexGrow="1">
                                    <Heading size="3" mb="1">{risk.name}</Heading>
                                    <Text as="p" size="2" color="gray" mb="1">
                                        {risk.riskLevel} ({risk.trend}) - Score: {riskScore}/100
                                    </Text>
                                    <Text as="p" size="2">{risk.description}</Text>
                                </Box>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </Box>

            {/* Hidden input to store the selected risk type value for form submission */}
            {selectedRiskTypeId && <input type="hidden" name="riskType" value={selectedRiskTypeId} />}

            <Box mb="4">
                <Heading size="4" mb="2">Adjust Parameters:</Heading>
                {selectedRisk.params.map(p => (
                    <Box key={p.id} mb="3">
                        <Text mb="1">{p.label}: {paramValues[p.id]}</Text>
                        <input
                            type="range"
                            min={p.min}
                            max={p.max}
                            step={p.step}
                            value={paramValues[p.id] || 0}
                            onChange={e => setParamValues(prev => ({
                                ...prev,
                                [p.id]: Number(e.target.value)
                            }))}
                        />
                        <Text size="2" color="gray">{p.description}</Text>
                    </Box>
                ))}
                <Text size="3" mb="3">Calculated Risk Score: {riskScore}/100</Text>
            </Box>

            <Box mb="3">
                <label>
                    <Text as="span" mr="2">Coverage Amount (SOL):</Text>
                    <input
                        type="number"
                        min="1"
                        max="1000"
                        step="1"
                        value={coverage}
                        onChange={e => setCoverage(Number(e.target.value))}
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
                        onChange={e => setDurationMonths(Number(e.target.value))}
                        style={{ padding: 6, borderRadius: 6, width: 80 }}
                    />
                </label>
            </Box>

            {/* simulation output */}
            <Card
                mt="4"
                mb="4"
                style={{
                    backgroundColor: 'var(--green-2)',
                    padding: 'var(--space-4)',
                }}
            >
                <Heading size="3" mb="3" style={{ color: 'var(--green-11)' }}>
                    Insurance Quote Details
                </Heading>
                <Flex justify="between" mb="3">
                    <Box>
                        <Text size="2" weight="bold">Risk Score</Text>
                        <Text size="2">{riskScore} / 100</Text>
                    </Box>
                    <Box>
                        <Text size="2" weight="bold">Coverage</Text>
                        <Text size="2">{coverage} SOL</Text>
                    </Box>
                    <Box>
                        <Text size="2" weight="bold">Duration</Text>
                        <Text size="2">{durationMonths} mo</Text>
                    </Box>
                    <Box>
                        <Text size="2" weight="bold">Total Premium</Text>
                        <Text size="2">{estimatedPremium} SOL</Text>
                    </Box>
                </Flex>
                <Heading size="4" mb="1" style={{ color: 'var(--green-11)' }}>
                    Premium Breakdown
                </Heading>
                <Box
                    as="ul"
                    style={{
                        margin: 0,
                        paddingLeft: '1rem',
                        color: 'var(--gray-11)',
                        fontSize: 13,
                    }}
                >
                    <li>Premium Factor = Coverage × (Risk Score / 100)</li>
                    <li>Duration = Length of coverage period in months</li>
                    <li>Total Premium = Premium Factor (flat rate model)</li>
                </Box>
                <Text size="1" color="gray" mt="2">
                    Note: Payout of {potentialPayout} SOL occurs if the selected risk trigger is met within the policy term.
                </Text>
            </Card>

            <Button type="submit" color="green" size="3">
                Buy Policy
            </Button>
        </form>
    );
}
