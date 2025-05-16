import { RiskType } from './types';

// Base risk types that will be adjusted based on location
export const baseRiskTypes: RiskType[] = [
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
    // ...existing code for other risk types...
];
