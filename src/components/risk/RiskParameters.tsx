import { Box, Card, Flex, Separator, Slider, Text } from '@radix-ui/themes';
import { useMemo } from 'react';
import { RiskParam } from './types';

// Extended param type including the risk it belongs to
interface ExtendedParam extends RiskParam {
  riskName: string;
  riskId: string;
}

interface RiskParametersProps {
  params: ExtendedParam[];
  paramValues: Record<string, number>;
  onParamChange: (id: string, value: number) => void;
  riskScore: number;
  selectedRiskId: string;
}

export function RiskParameters({
  params,
  paramValues,
  onParamChange,
  riskScore,
  selectedRiskId,
}: RiskParametersProps) {
  // Group parameters by risk type
  const groupedParams = useMemo(() => {
    const groups: Record<string, { riskName: string; params: ExtendedParam[] }> = {};
    
    params.forEach(param => {
      if (!groups[param.riskId]) {
        groups[param.riskId] = {
          riskName: param.riskName,
          params: []
        };
      }
      groups[param.riskId].params.push(param);
    });
    
    return groups;
  }, [params]);

  // Get risk score color based on score value
  const getScoreColor = (score: number) => {
    if (score < 33) return 'var(--green-9)';
    if (score < 66) return 'var(--orange-9)';
    return 'var(--red-9)';
  };

  return (
    <Box my="4">
      <Flex justify="between" align="center" mb="2">
        <Text size="5" weight="bold">Risk Parameters</Text>
        <Box>
          <Text 
            size="5" 
            weight="bold" 
            style={{ color: getScoreColor(riskScore) }}
          >
            Risk Score: {riskScore}
          </Text>
        </Box>
      </Flex>
      
      {/* Display all parameters, grouped by risk type */}
      {Object.entries(groupedParams).map(([riskId, group]) => (
        <Card 
          key={riskId} 
          mb="3" 
          style={{
            boxShadow: selectedRiskId === riskId ? '0 0 0 2px var(--accent-9)' : undefined,
            opacity: selectedRiskId === riskId ? 1 : 0.8,
            transition: 'all 0.2s ease',
          }}
        >
          <Text 
            as="h3" 
            size="4" 
            weight="bold" 
            mb="2"
            style={{ 
              color: selectedRiskId === riskId ? 'var(--accent-9)' : undefined 
            }}
          >
            {group.riskName} Parameters
            {selectedRiskId === riskId && (
              <Text as="span" size="2" ml="2" style={{ color: 'var(--accent-9)' }}>
                (Selected)
              </Text>
            )}
          </Text>
          
          <Separator size="4" mb="3" />
          
          <Box>
            {group.params.map((param) => (
              <Box key={param.id} mb="4">
                <Flex justify="between" mb="1">
                  <Text weight="medium">{param.label}</Text>
                  <Text>{paramValues[param.id]}</Text>
                </Flex>
                <Slider 
                  value={[paramValues[param.id]]}
                  onValueChange={(values) => onParamChange(param.id, values[0])}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                />
                <Text size="1" color="gray" style={{ marginTop: 4 }}>
                  {param.description}
                </Text>
                {/* Min/Max labels */}
                <Flex justify="between" mt="1">
                  <Text size="1">{param.min}</Text>
                  <Text size="1">{param.max}</Text>
                </Flex>
              </Box>
            ))}
          </Box>
        </Card>
      ))}
      
      {/* Risk score display */}
      <Card 
        mt="4" 
        style={{ 
          background: 'var(--accent-2)',
          padding: '16px',
          borderRadius: '10px',
          textAlign: 'center',
          borderLeft: `4px solid ${getScoreColor(riskScore)}`
        }}
      >
        <Text weight="bold" mb="2">Overall Risk Assessment</Text>
        <Flex align="center" justify="center" gap="2">
          <Text size="6">🎯</Text>
          <Box>
            <Text size="6" weight="bold" style={{ color: getScoreColor(riskScore) }}>
              {riskScore}
              <Text size="2" style={{ opacity: 0.7 }}>/100</Text>
            </Text>
          </Box>
        </Flex>
        <Text size="2" style={{ opacity: 0.7 }} mt="1">
          {riskScore < 30 ? 'Low Risk Level' : 
           riskScore < 70 ? 'Moderate Risk Level' : 'High Risk Level'}
        </Text>
        
        {/* Risk meter visualization */}
        <Box mt="2" style={{ padding: '0 16px' }}>
          <Box style={{ 
            height: '8px', 
            background: 'linear-gradient(to right, var(--green-5), var(--amber-5), var(--red-5))',
            borderRadius: '4px',
            position: 'relative'
          }}>
            <Box style={{
              position: 'absolute',
              left: `${riskScore}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: getScoreColor(riskScore),
              border: '2px solid white',
              boxShadow: '0 0 4px rgba(0,0,0,0.3)'
            }} />
          </Box>
          <Flex justify="between" mt="1">
            <Text size="1">Low</Text>
            <Text size="1">Medium</Text>
            <Text size="1">High</Text>
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}
