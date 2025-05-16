export type LocationInfo = {
    city: string;
    country: string;
    lat: number;
    lng: number;
};

export interface ParamDef {
    id: string;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    description: string;
}

export interface RiskType {
    id: string;
    name: string;
    emoji: string;
    riskLevel: string;
    trend: string;
    description: string;
    color: string;
    params: ParamDef[];
}

export interface WeatherData {
    current_condition: Array<{
        temp_C: string;
        humidity: string;
        precipMM: string;
        // Add other properties as needed
    }>;
    // Add other properties as needed
}
