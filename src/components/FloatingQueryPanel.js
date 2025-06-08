import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  position: absolute;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x}px;
  width: 450px;
  max-height: 85vh;
  background: ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 200;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: ${props => props.isDragging ? 'grabbing' : 'default'};
  
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
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
`;

const PanelTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  pointer-events: none;
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
  padding: 1.5rem;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-radius: 10px;
  border: 2px solid #2980b9;
`;

const QueryText = styled.p`
  color: #ffffff;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
  font-size: 1.05rem;
`;

const ResultSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
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
  border: 2px solid ${props => {
    switch (props.level) {
      case 'high': return props.theme.error;
      case 'medium': return props.theme.warning;
      case 'low': return props.theme.success;
      default: return props.theme.border;
    }
  }};
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const RiskLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const RiskIndicator = styled.div`
  width: 16px;
  height: 16px;
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
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
`;

const RiskDetails = styled.div`
  margin-top: 1rem;
`;

const DetailSection = styled.div`
  margin-bottom: 1rem;
`;

const DetailTitle = styled.h5`
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 600;
`;

const DetailList = styled.ul`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  padding-left: 1.2rem;
  line-height: 1.5;
  
  li {
    margin-bottom: 0.3rem;
    font-size: 0.9rem;
  }
`;

const Recommendation = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 1rem 0 0 0;
  line-height: 1.6;
  font-size: 0.95rem;
  font-style: italic;
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 1rem;
`;

const DataSourceSection = styled.div`
  margin-bottom: 2rem;
`;

const SourceSectionTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid ${props => props.theme.border};
  padding-bottom: 0.5rem;
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
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    }
  }
  
  &.secondary {
    background: ${props => props.theme.primary};
    color: ${props => props.theme.textSecondary};
    border: 1px solid ${props => props.theme.border};
    
    &:hover {
      color: ${props => props.theme.text};
      border-color: #3498db;
    }
  }
`;

function FloatingQueryPanel({ query, result, onNewQuery }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 490, y: 20 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // 處理拖拽開始
  const handleMouseDown = (e) => {
    if (e.target.closest('.panel-controls')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // 處理拖拽移動
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const maxX = window.innerWidth - 450;
    const maxY = window.innerHeight - 100;

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: boundedX, y: boundedY });
  };

  // 處理拖拽結束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 添加全局事件監聽器
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // 響應視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      const maxX = window.innerWidth - 450;
      const maxY = window.innerHeight - 100;
      
      setPosition(prev => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY)
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // 生成風險詳細信息
  const generateRiskDetails = (result) => {
    const cases = [];
    const persons = [];
    
    // 從findings中提取案件和人物信息
    result.findings.forEach(finding => {
      if (finding.status === 'found' && finding.source === '法院判決書系統') {
        if (finding.content.includes('詐欺')) cases.push('詐欺相關案件');
        if (finding.content.includes('背信')) cases.push('背信案件');
        if (finding.content.includes('洗錢')) cases.push('洗錢案件');
        if (finding.content.includes('銀行法')) cases.push('違反銀行法');
        if (finding.content.includes('公司法')) cases.push('違反公司法');
        if (finding.content.includes('合夥')) cases.push('合夥糾紛');
      }
    });

    // 基於查詢內容推斷關聯人物
    if (query.includes('張小華')) {
      persons.push('沈志豪（親屬）', '林麗雯（配偶）', '謝美麗（共犯）');
    } else if (query.includes('陳世凱')) {
      persons.push('陳美玲（配偶）', '劉志明（商業夥伴）', '王大同（共同投資人）');
    } else if (query.includes('王小明') && query.includes('李大華')) {
      persons.push('張雅芳（證人）', '林建國（證人）', '王小明與李大華（商業夥伴）');
    } else if (query.includes('陳曉偉')) {
      persons.push('陳麗華（配偶）', '黃志成（共犯）', 'Nguyen Van A（當地共犯）');
    }

    return { cases, persons };
  };

  const riskDetails = generateRiskDetails(result);

  return (
    <PanelContainer 
      ref={panelRef}
      isMinimized={isMinimized}
      isDragging={isDragging}
      position={position}
    >
      <PanelHeader onMouseDown={handleMouseDown}>
        <PanelTitle>風險分析報告</PanelTitle>
        <PanelControls className="panel-controls">
          <ControlButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? '▲' : '▼'}
          </ControlButton>
          <ControlButton onClick={onNewQuery}>
            ✕
          </ControlButton>
        </PanelControls>
      </PanelHeader>

      <PanelContent isMinimized={isMinimized}>
        <SectionTitle>查詢問題</SectionTitle>
        <QuerySection>
          <QueryText>{query}</QueryText>
        </QuerySection>

        <ResultSection>
          <SectionTitle>分析結果</SectionTitle>
          
          <RiskAssessment level={result.riskLevel}>
            <RiskLevel>
              <RiskIndicator level={result.riskLevel} />
              <RiskLevelText>
                風險等級：{getRiskLevelLabel(result.riskLevel)}
              </RiskLevelText>
            </RiskLevel>
            
            <RiskDetails>
              {riskDetails.cases.length > 0 && (
                <DetailSection>
                  <DetailTitle>涉及案件摘要</DetailTitle>
                  <DetailList>
                    {riskDetails.cases.map((caseItem, index) => (
                      <li key={index}>{caseItem}</li>
                    ))}
                  </DetailList>
                </DetailSection>
              )}
              
              {riskDetails.persons.length > 0 && (
                <DetailSection>
                  <DetailTitle>關聯人物</DetailTitle>
                  <DetailList>
                    {riskDetails.persons.map((person, index) => (
                      <li key={index}>{person}</li>
                    ))}
                  </DetailList>
                </DetailSection>
              )}
            </RiskDetails>
            
            <Recommendation>{result.recommendation}</Recommendation>
          </RiskAssessment>
        </ResultSection>

        <DataSourceSection>
          <SourceSectionTitle>各資料源查詢結果</SourceSectionTitle>
          <FindingsList>
            {result.findings
              .sort((a, b) => {
                // 'found' 排在前面, 'clear' 排在後面
                if (a.status === 'found' && b.status === 'clear') return -1;
                if (a.status === 'clear' && b.status === 'found') return 1;
                return 0;
              })
              .map((finding, index) => (
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
        </DataSourceSection>

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