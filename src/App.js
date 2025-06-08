import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import QueryInterface from './components/QueryInterface';
import GraphNetwork from './components/GraphNetwork';
import FloatingQueryPanel from './components/FloatingQueryPanel';
import './App.css';

// 深色主題配置
const darkTheme = {
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#0f3460',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  border: '#333333',
  gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
};

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.gradient};
  color: ${props => props.theme.text};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

function App() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [showQueryInterface, setShowQueryInterface] = useState(true);

  // 模擬查詢處理
  const handleQuery = async (query) => {
    setCurrentQuery(query);
    setShowQueryInterface(false);
    
    // 模擬API調用延遲
    setTimeout(() => {
      // 生成模擬的查詢結果和圖形資料
      const mockResult = generateMockQueryResult(query);
      const mockGraphData = generateMockGraphData(query);
      
      setQueryResult(mockResult);
      setGraphData(mockGraphData);
    }, 1500);
  };

  const handleNewQuery = () => {
    setShowQueryInterface(true);
    setCurrentQuery('');
    setQueryResult(null);
    setGraphData(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppContainer>
        <MainContent>
          <Header onNewQuery={handleNewQuery} />
          <ContentArea>
            {showQueryInterface ? (
              <QueryInterface onQuery={handleQuery} />
            ) : (
              <>
                <GraphNetwork data={graphData} />
                {queryResult && (
                  <FloatingQueryPanel 
                    query={currentQuery}
                    result={queryResult}
                    onNewQuery={handleNewQuery}
                  />
                )}
              </>
            )}
          </ContentArea>
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

// 生成模擬查詢結果
function generateMockQueryResult(query) {
  const personName = extractPersonName(query);
  
  return {
    summary: `根據我們的資料庫搜尋，${personName}的風險評估如下：`,
    findings: [
      {
        source: '法院判決書系統',
        status: 'found',
        content: `發現2件相關案件，包括詐欺罪判決1件，違反銀行法1件`
      },
      {
        source: '金融監理機關',
        status: 'found',
        content: `列入金融詐欺警示名單，有效期至2024年12月`
      },
      {
        source: '企業登記資料',
        status: 'found',
        content: `曾任3家公司負責人，其中2家已解散`
      },
      {
        source: '國際制裁名單',
        status: 'clear',
        content: '未發現相關紀錄'
      },
      {
        source: '新聞媒體報導',
        status: 'found',
        content: `發現5筆相關新聞報導，主要涉及投資詐騙案`
      }
    ],
    riskLevel: 'high',
    recommendation: '建議謹慎評估，該個人具有較高的金融詐欺風險。'
  };
}

// 生成模擬圖形資料
function generateMockGraphData(query) {
  const personName = extractPersonName(query);
  
  const nodes = [
    // 中心人物
    { id: personName, group: 'person', size: 20, color: '#ff6b6b' },
    
    // 法院案件
    { id: '詐欺案件_2023', group: 'case', size: 15, color: '#ff9999' },
    { id: '違反銀行法_2022', group: 'case', size: 15, color: '#ff9999' },
    
    // 罪名
    { id: '詐欺罪', group: 'crime', size: 12, color: '#ffcc99' },
    { id: '違反銀行法', group: 'crime', size: 12, color: '#ffcc99' },
    
    // 關聯人物
    { id: `${personName.substring(0,1)}父親`, group: 'family', size: 14, color: '#99ccff' },
    { id: `${personName.substring(0,1)}配偶`, group: 'family', size: 14, color: '#99ccff' },
    { id: '共同被告王小明', group: 'associate', size: 13, color: '#cc99ff' },
    
    // 公司
    { id: 'ABC投資公司', group: 'company', size: 16, color: '#99ff99' },
    { id: 'XYZ科技公司', group: 'company', size: 16, color: '#99ff99' }
  ];

  const links = [
    // 中心人物到案件
    { source: personName, target: '詐欺案件_2023', relationship: '涉嫌' },
    { source: personName, target: '違反銀行法_2022', relationship: '涉嫌' },
    
    // 案件到罪名
    { source: '詐欺案件_2023', target: '詐欺罪', relationship: '判決' },
    { source: '違反銀行法_2022', target: '違反銀行法', relationship: '判決' },
    
    // 人物關係
    { source: personName, target: `${personName.substring(0,1)}父親`, relationship: '親屬' },
    { source: personName, target: `${personName.substring(0,1)}配偶`, relationship: '配偶' },
    { source: personName, target: '共同被告王小明', relationship: '共犯' },
    
    // 公司關係
    { source: personName, target: 'ABC投資公司', relationship: '負責人' },
    { source: personName, target: 'XYZ科技公司', relationship: '前負責人' },
    
    // 案件與公司
    { source: '詐欺案件_2023', target: 'ABC投資公司', relationship: '涉及' }
  ];

  return { nodes, links };
}

// 從查詢中提取人名
function extractPersonName(query) {
  // 簡單的正則表達式來提取可能的人名
  const matches = query.match(/網紅(\w+)|([A-Za-z\u4e00-\u9fa5]{2,4})/);
  return matches ? (matches[1] || matches[2] || '張小華') : '張小華';
}

export default App;
