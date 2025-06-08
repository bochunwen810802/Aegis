import React, { useState } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background: ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 200;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  ${props => props.isMinimized && `
    height: 60px;
  `}
`;

const PanelHeader = styled.div`
  background: ${props => props.theme.accent};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
`;

const PanelTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const PanelControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  font-size: 1.2rem;
  
  &:hover {
    background: ${props => props.theme.primary};
    color: ${props => props.theme.text};
  }
`;

const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: ${props => props.isMinimized ? 'none' : 'block'};
`;

const QuerySection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${props => props.theme.primary};
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const QueryText = styled.p`
  color: ${props => props.theme.text};
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
`;

const QueryLabel = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.5rem;
`;

const ResultSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
`;

const Summary = styled.div`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.primary};
  border-radius: 8px;
`;

const FindingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FindingItem = styled.div`
  background: ${props => props.theme.primary};
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'found': return props.theme.warning;
      case 'clear': return props.theme.success;
      default: return props.theme.border;
    }
  }};
`;

const FindingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const FindingSource = styled.span`
  color: ${props => props.theme.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const FindingStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'found': return props.theme.warning;
      case 'clear': return props.theme.success;
      default: return props.theme.border;
    }
  }};
  color: white;
`;

const FindingContent = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const RiskAssessment = styled.div`
  background: ${props => {
    switch (props.level) {
      case 'high': return 'rgba(244, 67, 54, 0.1)';
      case 'medium': return 'rgba(255, 152, 0, 0.1)';
      case 'low': return 'rgba(76, 175, 80, 0.1)';
      default: return props.theme.primary;
    }
  }};
  border: 1px solid ${props => {
    switch (props.level) {
      case 'high': return props.theme.error;
      case 'medium': return props.theme.warning;
      case 'low': return props.theme.success;
      default: return props.theme.border;
    }
  }};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const RiskLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const RiskIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.level) {
      case 'high': return props.theme.error;
      case 'medium': return props.theme.warning;
      case 'low': return props.theme.success;
      default: return props.theme.border;
    }
  }};
`;

const RiskLevelText = styled.span`
  color: ${props => props.theme.text};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
`;

const Recommendation = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }
  
  &.secondary {
    background: ${props => props.theme.primary};
    color: ${props => props.theme.textSecondary};
    border: 1px solid ${props => props.theme.border};
    
    &:hover {
      color: ${props => props.theme.text};
      border-color: #667eea;
    }
  }
`;

function FloatingQueryPanel({ query, result, onNewQuery }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const getRiskLevelLabel = (level) => {
    const labels = {
      high: '高風險',
      medium: '中等風險',
      low: '低風險'
    };
    return labels[level] || level;
  };

  const getStatusLabel = (status) => {
    const labels = {
      found: '發現',
      clear: '無紀錄'
    };
    return labels[status] || status;
  };

  return (
    <PanelContainer isMinimized={isMinimized}>
      <PanelHeader 
        clickable={true} 
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <PanelTitle>風險分析報告</PanelTitle>
        <PanelControls>
          <ControlButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? '▲' : '▼'}
          </ControlButton>
          <ControlButton onClick={onNewQuery}>
            ✕
          </ControlButton>
        </PanelControls>
      </PanelHeader>

      <PanelContent isMinimized={isMinimized}>
        <QuerySection>
          <QueryLabel>查詢問題：</QueryLabel>
          <QueryText>{query}</QueryText>
        </QuerySection>

        <ResultSection>
          <SectionTitle>分析結果</SectionTitle>
          <Summary>{result.summary}</Summary>

          <FindingsList>
            {result.findings.map((finding, index) => (
              <FindingItem key={index} status={finding.status}>
                <FindingHeader>
                  <FindingSource>{finding.source}</FindingSource>
                  <FindingStatus status={finding.status}>
                    {getStatusLabel(finding.status)}
                  </FindingStatus>
                </FindingHeader>
                <FindingContent>{finding.content}</FindingContent>
              </FindingItem>
            ))}
          </FindingsList>

          <RiskAssessment level={result.riskLevel}>
            <RiskLevel>
              <RiskIndicator level={result.riskLevel} />
              <RiskLevelText>
                風險等級：{getRiskLevelLabel(result.riskLevel)}
              </RiskLevelText>
            </RiskLevel>
            <Recommendation>{result.recommendation}</Recommendation>
          </RiskAssessment>
        </ResultSection>

        <ActionButtons>
          <ActionButton className="primary" onClick={onNewQuery}>
            新查詢
          </ActionButton>
          <ActionButton className="secondary">
            匯出報告
          </ActionButton>
        </ActionButtons>
      </PanelContent>
    </PanelContainer>
  );
}

export default FloatingQueryPanel; 