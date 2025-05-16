import { Box, Button } from '@radix-ui/themes';
import { useState, useEffect, useMemo } from 'react';
import { RiskTypeSelector } from './risk/RiskTypeSelector';
import { RiskParameters } from './risk/RiskParameters';
import { CoverageForm } from './coverage/CoverageForm';
import { QuoteDetails } from './quote/QuoteDetails';
import { LocationInfo, RiskType } from './risk/types';
import { baseRiskTypes } from './risk/baseRiskTypes';
import { isCoastalLocation, isMountainousRegion } from '../utils/locationUtils';

// Props to receive location information from parent component
interface PolicyFormProps {
    locationInfo?: LocationInfo | null;
    weatherData?: any;
}

export function PolicyForm({ locationInfo, weatherData }: PolicyFormProps) {
    // Location-aware risk types
    const [riskTypes, setRiskTypes] = useState<RiskType[]>(baseRiskTypes);
    
    const [selectedRiskTypeId, setSelectedRiskTypeId] = useState<string>(baseRiskTypes[0].id);
    const [paramValues, setParamValues] = useState<Record<string, number>>({});
    
    // Update risks based on location data
    useEffect(() => {
        if (!locationInfo) return;
        
        // Deep clone the base risk types
        const updatedRiskTypes = JSON.parse(JSON.stringify(baseRiskTypes)) as RiskType[];
        
        // Adjust risk types based on location
        for (const risk of updatedRiskTypes) {
            switch (risk.id) {
                case 'typhoon':
                    // Increase typhoon risk for Southeast Asian countries
                    if (['Philippines', 'Vietnam', 'Japan', 'Taiwan', 'China'].includes(locationInfo.country)) {
                        risk.riskLevel = 'Extreme Risk';
                        risk.description = `${locationInfo.city} is in a major typhoon path. ${risk.description}`;
                        // Update default parameter values
                        risk.params.find(p => p.id === 'freq')!.defaultValue = 8;
                    } else if (['United States', 'Mexico', 'Cuba'].includes(locationInfo.country)) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is vulnerable to hurricanes. ${risk.description}`;
                    } else {
                        risk.riskLevel = 'Low Risk';
                        risk.description = `${locationInfo.city} is not typically affected by tropical cyclones.`;
                    }
                    break;
                    
                case 'flood':
                    // Use weather data to determine flood risk if available
                    if (weatherData?.current_condition?.[0]?.precipMM > 5) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is currently experiencing heavy precipitation, increasing flood risk.`;
                        risk.params.find(p => p.id === 'rainfall')!.defaultValue = 
                            Math.min(100, Math.round(parseFloat(weatherData.current_condition[0].precipMM) * 10));
                    }
                    
                    // Coastal cities have higher flood risk
                    if (isCoastalLocation(locationInfo.lat, locationInfo.lng)) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is a coastal area with increased vulnerability to flooding.`;
                    }
                    break;
                    
                case 'drought':
                    // Adjust drought risk based on climate data
                    if (weatherData?.current_condition?.[0]?.humidity < 40) {
                        risk.riskLevel = 'Medium Risk';
                        risk.description = `${locationInfo.city} is currently experiencing dry conditions with low humidity.`;
                    }
                    break;
                    
                case 'heatwave':
                    // Use actual temperature data if available
                    if (weatherData?.current_condition?.[0]?.temp_C) {
                        const currentTemp = parseInt(weatherData.current_condition[0].temp_C);
                        if (currentTemp > 35) {
                            risk.riskLevel = 'High Risk';
                            risk.description = `${locationInfo.city} is currently experiencing high temperatures (${currentTemp}°C).`;
                            risk.params.find(p => p.id === 'temp')!.defaultValue = currentTemp;
                        }
                    }
                    break;
                    
                case 'landslide':
                    // Mountainous regions have higher landslide risk
                    if (isMountainousRegion(locationInfo.lat, locationInfo.lng)) {
                        risk.riskLevel = 'High Risk';
                        risk.description = `${locationInfo.city} is in a mountainous area with increased landslide risk.`;
                    }
                    break;
            }
        }
        
        setRiskTypes(updatedRiskTypes);
    }, [locationInfo, weatherData]);
    
    // When risk types update, reset the selected risk type if needed
    useEffect(() => {
        // If the current selection doesn't exist in the new risk types, select the first one
        if (!riskTypes.find(r => r.id === selectedRiskTypeId)) {
            setSelectedRiskTypeId(riskTypes[0]?.id);
        }
    }, [riskTypes, selectedRiskTypeId]);

    const selectedRisk = riskTypes.find(r => r.id === selectedRiskTypeId) || riskTypes[0];

    // Initialize parameters when risk type changes
    useEffect(() => {
        if (!selectedRisk) return;
        
        const init: Record<string, number> = {};
        selectedRisk.params.forEach(p => init[p.id] = p.defaultValue);
        setParamValues(init);
    }, [selectedRiskTypeId, selectedRisk]);

    // Calculate risk score
    const riskScore = useMemo(() => {
        if (!selectedRisk) return 50;
        
        const vals = selectedRisk.params.map(p =>
            (paramValues[p.id] - p.min) / (p.max - p.min)
        );
        return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
    }, [selectedRisk, paramValues]);

    // Coverage & duration state
    const [coverage, setCoverage] = useState<number>(1);
    const [durationMonths, setDurationMonths] = useState<number>(1);

    // Calculate premium based on risk score and coverage
    const estimatedPremium = useMemo(
        () => Number((coverage * riskScore / 100).toFixed(2)),
        [coverage, riskScore],
    );
    
    // Handle parameter change
    const handleParamChange = (id: string, value: number) => {
        setParamValues(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <form>
            <RiskTypeSelector
                riskTypes={riskTypes}
                selectedRiskTypeId={selectedRiskTypeId}
                onSelectRiskType={setSelectedRiskTypeId}
                riskScore={riskScore}
                locationInfo={locationInfo}
            />

            {/* Hidden input to store the selected risk type value for form submission */}
            {selectedRiskTypeId && <input type="hidden" name="riskType" value={selectedRiskTypeId} />}

            <RiskParameters 
                params={selectedRisk.params}
                paramValues={paramValues}
                onParamChange={handleParamChange}
                riskScore={riskScore}
            />

            <CoverageForm
                coverage={coverage}
                durationMonths={durationMonths}
                onCoverageChange={setCoverage}
                onDurationChange={setDurationMonths}
            />

            <QuoteDetails
                coverage={coverage}
                durationMonths={durationMonths}
                riskScore={riskScore}
                estimatedPremium={estimatedPremium}
            />

            <Button type="submit" color="green" size="3">
                Buy Policy
            </Button>
        </form>
    );
}
