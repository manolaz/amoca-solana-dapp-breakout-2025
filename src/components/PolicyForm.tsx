import { Box, Button, Flex, Separator, Text } from '@radix-ui/themes';
import { useState, useEffect, useMemo } from 'react';
import { RiskTypeSelector } from './risk/RiskTypeSelector';
import { RiskParameters } from './risk/RiskParameters';
import { CoverageForm } from './coverage/CoverageForm';
import { QuoteDetails } from './quote/QuoteDetails';
import { ClaimSimulator } from './claim/ClaimSimulator';
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

        const updatedRiskTypes = JSON.parse(JSON.stringify(baseRiskTypes)) as RiskType[];

        for (const risk of updatedRiskTypes) {
            switch (risk.id) {
                case 'typhoon':
                    updateTyphoonRisk(risk, locationInfo);
                    break;
                case 'flood':
                    updateFloodRisk(risk, locationInfo, weatherData);
                    break;
                case 'drought':
                    updateDroughtRisk(risk, weatherData);
                    break;
                case 'heatwave':
                    updateHeatwaveRisk(risk, weatherData);
                    break;
                case 'landslide':
                    updateLandslideRisk(risk, locationInfo);
                    break;
            }
        }

        setRiskTypes(updatedRiskTypes);
    }, [locationInfo, weatherData]);
    
    function updateTyphoonRisk(risk: RiskType, locationInfo: LocationInfo) {
        if (['Philippines', 'Vietnam', 'Japan', 'Taiwan', 'China'].includes(locationInfo.country)) {
            risk.riskLevel = 'Extreme Risk';
            risk.description = `${locationInfo.city} is in a major typhoon path. ${risk.description}`;
            risk.params.find(p => p.id === 'freq')!.defaultValue = 8;
        } else if (['United States', 'Mexico', 'Cuba'].includes(locationInfo.country)) {
            risk.riskLevel = 'High Risk';
            risk.description = `${locationInfo.city} is vulnerable to hurricanes. ${risk.description}`;
        } else {
            risk.riskLevel = 'Low Risk';
            risk.description = `${locationInfo.city} is not typically affected by tropical cyclones.`;
        }
    }

    function updateFloodRisk(risk: RiskType, locationInfo: LocationInfo, weatherData: any) {
        if (weatherData?.current_condition?.[0]?.precipMM > 5) {
            risk.riskLevel = 'High Risk';
            risk.description = `${locationInfo.city} is currently experiencing heavy precipitation, increasing flood risk.`;
            risk.params.find(p => p.id === 'rainfall')!.defaultValue = 
                Math.min(100, Math.round(parseFloat(weatherData.current_condition[0].precipMM) * 10));
        }
        if (isCoastalLocation(locationInfo.lat, locationInfo.lng)) {
            risk.riskLevel = 'High Risk';
            risk.description = `${locationInfo.city} is a coastal area with increased vulnerability to flooding.`;
            
            // Set elevation to a lower value for coastal locations (higher risk)
            const elevationParam = risk.params.find(p => p.id === 'elevation');
            if (elevationParam) {
                elevationParam.defaultValue = 3; // Lower elevation for coastal areas
                elevationParam.description = 'Elevation above sea level in meters (lower values = higher risk)';
            }
        }
        
        // Elevation is inversely related to flood risk
        // If we have actual elevation data, we could use it here
        // For now, adjust description to make the inverse relationship clear
        const elevationParam = risk.params.find(p => p.id === 'elevation');
        if (elevationParam) {
            elevationParam.description = 'Elevation above sea level in meters (lower values = higher risk)';
        }
    }
    
    function updateDroughtRisk(risk: RiskType, weatherData: any) {
        if (weatherData?.current_condition?.[0]?.humidity < 40) {
            risk.riskLevel = 'Medium Risk';
            risk.description = `${locationInfo.city} is currently experiencing dry conditions with low humidity.`;
        }
    }
    
    function updateHeatwaveRisk(risk: RiskType, weatherData: any) {
        if (weatherData?.current_condition?.[0]?.temp_C) {
            const currentTemp = parseInt(weatherData.current_condition[0].temp_C);
            if (currentTemp > 35) {
                risk.riskLevel = 'High Risk';
                risk.description = `${locationInfo.city} is currently experiencing high temperatures (${currentTemp}°C).`;
                risk.params.find(p => p.id === 'temp')!.defaultValue = currentTemp;
            }
        }
    }
    
    function updateLandslideRisk(risk: RiskType, locationInfo: LocationInfo) {
        if (isMountainousRegion(locationInfo.lat, locationInfo.lng)) {
            risk.riskLevel = 'High Risk';
            risk.description = `${locationInfo.city} is in a mountainous area with increased landslide risk.`;
        }
    }
    
    // When risk types update, reset the selected risk type if needed
    useEffect(() => {
        // If the current selection doesn't exist in the new risk types, select the first one
        if (!riskTypes.find(r => r.id === selectedRiskTypeId)) {
            setSelectedRiskTypeId(riskTypes[0]?.id);
        }
    }, [riskTypes, selectedRiskTypeId]);

    const selectedRisk = riskTypes.find(r => r.id === selectedRiskTypeId) || riskTypes[0];

    // Initialize parameters when risk types change
    useEffect(() => {
        const init: Record<string, number> = {};
        
        // Initialize parameters for ALL risk types
        riskTypes.forEach(riskType => {
            riskType.params.forEach(p => {
                if (!(p.id in init)) {
                    init[p.id] = p.defaultValue;
                }
            });
        });
        
        setParamValues(init);
    }, [riskTypes]);

    // Calculate risk score for the selected risk type
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

    // SVG certificate generator
    function generateCertificateSVG() {
        const date = new Date().toLocaleDateString();
        return `
<svg width="480" height="340" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0fdfa"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="24" fill="url(#bg)" stroke="#38bdf8" stroke-width="3"/>
  
  <!-- AMOCA Logo -->
  <image href="BLUE/bb.svg" x="20" y="20" width="60" height="60" />
  
  <text x="50%" y="56" text-anchor="middle" font-size="28" font-family="Verdana" fill="#0e7490" font-weight="bold">
    Insurance Certificate
  </text>
  <text x="50%" y="92" text-anchor="middle" font-size="16" font-family="Verdana" fill="#334155">
    Issued by AMOCA Climate Dapp
  </text>
  <g font-family="Verdana" font-size="15" fill="#0f172a">
    <text x="40" y="140">Coverage: <tspan font-weight="bold">${coverage} SOL</tspan></text>
    <text x="40" y="170">Duration: <tspan font-weight="bold">${durationMonths} month(s)</tspan></text>
    <text x="40" y="200">Risk Score: <tspan font-weight="bold">${riskScore} / 100</tspan></text>
    <text x="40" y="230">Premium: <tspan font-weight="bold">${estimatedPremium} SOL</tspan></text>
    <text x="40" y="260">Risk Type: <tspan font-weight="bold">${selectedRisk?.name}</tspan></text>
    <text x="40" y="290">Location: <tspan font-weight="bold">${locationInfo?.city || "N/A"}, ${locationInfo?.country || ""}</tspan></text>
  </g>
  <text x="50%" y="320" text-anchor="middle" font-size="13" fill="#64748b">
    Date: ${date}
  </text>
</svg>
        `.trim();
    }

    // Download SVG as file
    function downloadSVG(svgString: string, filename = "policy-certificate.svg") {
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    // Handle form submit
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const svg = generateCertificateSVG();
        downloadSVG(svg);
    }

    // Preview modal state
    const [previewSVG, setPreviewSVG] = useState<string | null>(null);

    // Handle preview
    function handlePreview() {
        const svg = generateCertificateSVG();
        setPreviewSVG(svg);
    }

    // Get all parameters from all risk types
    const allRiskParams = useMemo(() => {
        const allParams = [];
        for (const risk of riskTypes) {
            allParams.push(...risk.params.map(param => ({
                ...param,
                riskName: risk.name,
                riskId: risk.id
            })));
        }
        return allParams;
    }, [riskTypes]);

    return (
        <>
            {/* Certificate Preview Modal */}
            {previewSVG && (
                <Box
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.35)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setPreviewSVG(null)}
                >
                    <Box
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            padding: 24,
                            maxWidth: 540,
                            width: '90%',
                            position: 'relative'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <Button
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                zIndex: 10
                            }}
                            color="gray"
                            size="2"
                            onClick={() => setPreviewSVG(null)}
                        >
                            Close
                        </Button>
                        <Box style={{ textAlign: 'center', marginBottom: 12 }}>
                            <Text size="5" weight="bold" style={{ color: '#0e7490' }}>
                                Policy Certificate Preview
                            </Text>
                        </Box>
                        <Box style={{ overflow: 'auto', textAlign: 'center' }}>
                            <div
                                dangerouslySetInnerHTML={{ __html: previewSVG }}
                                style={{ width: 480, margin: '0 auto', background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #bae6fd' }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}

            <form onSubmit={handleSubmit}>
                <RiskTypeSelector
                    riskTypes={riskTypes}
                    selectedRiskTypeId={selectedRiskTypeId}
                    onSelectRiskType={setSelectedRiskTypeId}
                    riskScore={riskScore}
                    locationInfo={locationInfo}
                />

                {/* Hidden input to store the selected risk type value for form submission */}
                {selectedRiskTypeId && <input type="hidden" name="riskType" value={selectedRiskTypeId} />}

                {/* Pass all parameters instead of just the selected risk parameters */}
                <RiskParameters 
                    params={allRiskParams}
                    paramValues={paramValues}
                    onParamChange={handleParamChange}
                    riskScore={riskScore}
                    selectedRiskId={selectedRiskTypeId}
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
                
                {/* Add claim simulator section */}
                {weatherData && (
                    <>
                        <Separator size="4" my="6" />
                        <Text as="p" size="4" weight="medium" align="center" mb="4" style={{ color: '#1e40af' }}>
                            See how parametric insurance works in action
                        </Text>
                        <ClaimSimulator 
                            weatherData={weatherData}
                            locationInfo={locationInfo}
                            selectedRisk={selectedRisk}
                            paramValues={paramValues}
                            coverage={coverage}
                        />
                    </>
                )}

                <Flex mt="6" justify="center" gap="4">
                    <Button type="button" color="blue" size="3" variant="soft" onClick={handlePreview}>
                        Preview Certificate
                    </Button>
                    <Button type="submit" color="green" size="3">
                        Buy Policy
                    </Button>
                </Flex>
            </form>
        </>
    );
}
