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

  // Calculate aggregate risk score from all parameters
  const aggregateRiskScore = useMemo(() => {
    // Get all parameters from all risk types
    const allParams: ExtendedParam[] = [];
    Object.values(groupedParams).forEach(group => {
      allParams.push(...group.params);
    });
    
    // Calculate normalized values for each parameter
    const normalizedValues = allParams.map(param => 
      (paramValues[param.id] - param.min) / (param.max - param.min)
    );
    
    // Return overall score as average of all normalized values
    return Math.round((normalizedValues.reduce((a, b) => a + b, 0) / normalizedValues.length) * 100);
  }, [groupedParams, paramValues]);

  // Calculate risk scores per risk type
  const riskTypeScores = useMemo(() => {
    return Object.entries(groupedParams).map(([riskId, group]) => {
      const params = group.params;
      const vals = params.map(p => (paramValues[p.id] - p.min) / (p.max - p.min));
      const score = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100);
      
      return {
        id: riskId,
        name: group.riskName,
        score
      };
    });
  }, [groupedParams, paramValues]);

  // Risk level description based on score
  const getRiskLevelDescription = (score: number): string => {
    if (score < 33) return 'Low Risk Level';
    if (score < 66) return 'Moderate Risk Level';
    return 'High Risk Level';
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
            Selected Risk: {riskScore}
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
      
      {/* Enhanced Risk score display */}
      <Card 
        mt="4" 
        style={{ 
          background: 'linear-gradient(135deg, var(--gray-1), var(--accent-1))',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <Text weight="bold" mb="3" size="5" style={{ textAlign: 'center' }}>Overall Risk Assessment</Text>
        
        {/* Main score display */}
        <Flex align="center" justify="center" gap="3" mb="4">
          <Box style={{ 
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            position: 'relative',
            background: `conic-gradient(${getScoreColor(aggregateRiskScore)} ${aggregateRiskScore}%, #e2e8f0 0)`,
            boxShadow: `0 0 0 8px ${getScoreColor(aggregateRiskScore)}22`
          }}>
            <Box style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <Text size="7" weight="bold" style={{ color: getScoreColor(aggregateRiskScore), lineHeight: 1 }}>
                {aggregateRiskScore}
              </Text>
              <Text size="1" style={{ opacity: 0.7 }}>/100</Text>
            </Box>
          </Box>
          
          <Box>
            <Text size="4" weight="bold" style={{ color: getScoreColor(aggregateRiskScore), marginBottom: '4px' }}>
              {getRiskLevelDescription(aggregateRiskScore)}
            </Text>
            <Text size="2" style={{ maxWidth: '280px' }}>
              This assessment considers all parameters across different risk types. You can adjust parameters to see how they affect your overall risk.
            </Text>
          </Box>
        </Flex>
        
        {/* Risk breakdown by type */}
        <Box style={{ 
          background: 'rgba(255,255,255,0.6)', 
          borderRadius: '10px', 
          padding: '12px',
          marginBottom: '16px'
        }}>
          <Text size="2" weight="medium" mb="2">Risk Breakdown by Type:</Text>
          
          {riskTypeScores.map(typeScore => (
            <Box key={typeScore.id} mb="2">
              <Flex justify="between" align="center" mb="1">
                <Text size="2">{typeScore.name}</Text>
                <Text size="2" weight="bold" style={{ color: getScoreColor(typeScore.score) }}>
                  {typeScore.score}
                </Text>
              </Flex>
              <Box style={{ 
                height: '6px', 
                background: '#e2e8f0', 
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <Box style={{ 
                  width: `${typeScore.score}%`,
                  height: '100%',
                  background: getScoreColor(typeScore.score),
                  transition: 'width 0.4s ease-out'
                }} />
              </Box>
            </Box>
          ))}
        </Box>
        
        {/* Risk meter visualization */}
        <Box mt="4" style={{ padding: '0 12px' }}>
          <Box style={{ 
            height: '12px', 
            background: 'linear-gradient(to right, var(--green-5), var(--green-9) 30%, var(--amber-5) 40%, var(--amber-9) 60%, var(--red-5) 70%, var(--red-9) 100%)',
            borderRadius: '8px',
            position: 'relative',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            {/* Aggregate risk score indicator */}
            <Box style={{
              position: 'absolute',
              left: `${aggregateRiskScore}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: getScoreColor(aggregateRiskScore),
              border: '3px solid white',
              boxShadow: '0 0 6px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              zIndex: 3
            }} />
            
            {/* Selected risk score indicator (smaller) */}
            <Box style={{
              position: 'absolute',
              left: `${riskScore}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#fff',
              border: `2px solid ${getScoreColor(riskScore)}`,
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              zIndex: 2
            }} />
          </Box>
          
          {/* Risk level labels */}
          <Flex justify="between" mt="2" style={{ padding: '0 2px' }}>
            <Box>
              <Text size="2" weight="bold" style={{ color: 'var(--green-9)' }}>Low</Text>
              <Text size="1" style={{ opacity: 0.7 }}>&lt; 33</Text>
            </Box>
            <Box style={{ textAlign: 'center' }}>
              <Text size="2" weight="bold" style={{ color: 'var(--amber-9)' }}>Medium</Text>
              <Text size="1" style={{ opacity: 0.7 }}>33 - 65</Text>
            </Box>
            <Box style={{ textAlign: 'right' }}>
              <Text size="2" weight="bold" style={{ color: 'var(--red-9)' }}>High</Text>
              <Text size="1" style={{ opacity: 0.7 }}>&gt; 65</Text>
            </Box>
          </Flex>
          
          {/* Legend */}
          <Flex justify="center" gap="4" mt="3">
            <Flex align="center" gap="1">
              <Box style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: '#fff',
                border: `2px solid ${getScoreColor(riskScore)}`
              }} />
              <Text size="1">Selected Risk</Text>
            </Flex>
            <Flex align="center" gap="1">
              <Box style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: getScoreColor(aggregateRiskScore)
              }} />
              <Text size="1">Overall Risk</Text>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Box>
  );
}
