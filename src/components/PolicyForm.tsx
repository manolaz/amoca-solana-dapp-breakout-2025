import { Box, Button, Flex, Separator, Text, Dialog } from '@radix-ui/themes';
import { useState, useEffect, useMemo, useContext } from 'react';
import { RiskTypeSelector } from './risk/RiskTypeSelector';
import { RiskParameters } from './risk/RiskParameters';
import { CoverageForm } from './coverage/CoverageForm';
import { QuoteDetails } from './quote/QuoteDetails';
import { ClaimSimulator } from './claim/ClaimSimulator';
import { LocationInfo, RiskType } from './risk/types';
import { baseRiskTypes } from './risk/baseRiskTypes';
import { isCoastalLocation, isMountainousRegion } from '../utils/locationUtils';
import { RpcContext } from '../context/RpcContext';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { sendTokens, getSignatureFromBytes, AMOCA_ACCOUNT } from '../utils/tokenTransfer';
import { ChainContext } from '../context/ChainContext';
import { useSWRConfig } from 'swr';
import { UiWalletAccount } from '@wallet-standard/react';

// Props to receive location information and wallet account from parent component
interface PolicyFormProps {
    locationInfo?: LocationInfo | null;
    weatherData?: any;
    walletAccount?: UiWalletAccount;
}

export function PolicyForm({ locationInfo, weatherData, walletAccount }: PolicyFormProps) {
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

    // Get RPC and chain context
    const { rpc } = useContext(RpcContext);
    const { chain: currentChain, solanaExplorerClusterName } = useContext(ChainContext);
    const { mutate } = useSWRConfig();
    
    // States for transaction
    const [isSendingTransaction, setIsSendingTransaction] = useState(false);
    const [transactionError, setTransactionError] = useState<any>(null);
    const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    
    // Get transaction signer if wallet account is available
    const transactionSendingSigner = walletAccount ? 
        useWalletAccountTransactionSendingSigner(walletAccount, currentChain) : null;

    // Handle form submit
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!transactionSendingSigner || !walletAccount) {
            alert("Please connect your wallet to purchase a policy");
            return;
        }
        
        setIsSendingTransaction(true);
        setTransactionError(null);
        
        try {
            // Send tokens to the AMOCA account
            const signature = await sendTokens(
                rpc,
                transactionSendingSigner,
                estimatedPremium
            );
            
            // Convert signature bytes to string for display
            const signatureStr = getSignatureFromBytes(signature);
            setTransactionSignature(signatureStr);
            
            // Update balances via SWR cache
            void mutate({ address: transactionSendingSigner.address, chain: currentChain });
            
            // Generate certificate
            const svg = generateCertificateSVG();
            
            // Show transaction dialog
            setIsTransactionDialogOpen(true);
            
            // No need to download immediately, user can do it from dialog
        } catch (error) {
            console.error("Transaction error:", error);
            setTransactionError(error);
        } finally {
            setIsSendingTransaction(false);
        }
    }

    // SVG certificate generator
    function generateCertificateSVG() {
        const date = new Date().toLocaleDateString();
        return `
<svg width="480" height="360" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0fdfa"/>
      <stop offset="100%" stop-color="#e0f2fe"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="24" fill="url(#bg)" stroke="#38bdf8" stroke-width="3"/>
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
    <text x="40" y="320">AMOCA Account: <tspan font-weight="bold">${AMOCA_ACCOUNT.slice(0, 12)}...</tspan></text>
  </g>
  <text x="50%" y="350" text-anchor="middle" font-size="13" fill="#64748b">
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

            {/* Transaction Success Dialog */}
            <Dialog.Root 
                open={isTransactionDialogOpen} 
                onOpenChange={open => setIsTransactionDialogOpen(open)}
            >
                <Dialog.Content>
                    <Dialog.Title>Policy Purchased Successfully!</Dialog.Title>
                    <Box my="4">
                        <Text as="p" mb="2">
                            Your policy is now active. The transaction has been sent to the Solana network.
                        </Text>
                        <Text as="p" mb="2" size="2" style={{ wordBreak: 'break-all' }}>
                            <strong>Transaction Signature:</strong> {transactionSignature}
                        </Text>
                        <Text as="p" mb="2">
                            <a 
                                href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=${solanaExplorerClusterName}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#0ea5e9', textDecoration: 'underline' }}
                            >
                                View transaction on Solana Explorer
                            </a>
                        </Text>
                    </Box>
                    <Flex gap="3" justify="end">
                        <Button 
                            onClick={() => {
                                const svg = generateCertificateSVG();
                                downloadSVG(svg);
                            }}
                        >
                            Download Certificate
                        </Button>
                        <Dialog.Close>
                            <Button variant="soft">Close</Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>

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
                    <Button 
                        type="submit" 
                        color="green" 
                        size="3"
                        disabled={!walletAccount || isSendingTransaction}
                        loading={isSendingTransaction}
                    >
                        {walletAccount ? `Buy Policy (${estimatedPremium} SOL)` : "Connect Wallet to Buy"}
                    </Button>
                </Flex>
                
                {transactionError && (
                    <Box mt="3" p="3" style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8 }}>
                        <Text as="p" size="2" style={{ color: '#b91c1c' }}>
                            Error: {transactionError.message || "Transaction failed"}
                        </Text>
                    </Box>
                )}
            </form>
        </>
    );
}
