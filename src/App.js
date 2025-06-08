import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import QueryInterface from './components/QueryInterface';
import GraphNetwork from './components/GraphNetwork';
import FloatingQueryPanel from './components/FloatingQueryPanel';
import './App.css';

// 深色主題配置 - 調整為更深的藍色系，添加漸層效果
const darkTheme = {
  primary: 'linear-gradient(135deg, #0a0e1a 0%, #1a2332 50%, #0f1419 100%)',
  secondary: 'linear-gradient(135deg, #1a2332 0%, #2c3e50 100%)',
  accent: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  text: '#ffffff',
  textSecondary: '#b0b8c4',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  border: '#34495e',
  gradient: 'linear-gradient(135deg, #0a0e1a 0%, #1a2332 50%, #0f1419 100%)'
};

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${props => props.theme.gradient};
  color: ${props => props.theme.text};
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const ContentArea = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  
  ${props => props.allowScroll && `
    overflow: auto;
  `}
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
          <ContentArea allowScroll={showQueryInterface}>
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
  // 根據具體問題返回相應的查詢結果
  if (query.includes('張小華')) {
    return generateZhangXiaoHuaResult();
  } else if (query.includes('ABC投資公司')) {
    return generateABCCompanyResult();
  } else if (query.includes('王小明') && query.includes('李大華')) {
    return generateWangLiRelationshipResult();
  } else if (query.includes('陳曉偉')) {
    return generateChenXiaoWeiResult();
  } else {
    // 默認結果
    return generateDefaultResult(extractPersonName(query));
  }
}

// 張小華結果
function generateZhangXiaoHuaResult() {
  return {
    summary: `根據我們的資料庫搜尋，網紅張小華的金融詐欺風險評估如下：`,
    findings: [
      {
        source: '法院判決書系統',
        status: 'found',
        content: `發現2件相關案件：詐欺罪判決1件（2023年），違反銀行法1件（2022年）`
      },
      {
        source: '金融監理機關',
        status: 'found',
        content: `列入金融詐欺警示名單，有效期至2024年12月`
      },
      {
        source: '企業登記資料',
        status: 'found',
        content: `與星光娛樂公司簽約，並擔任XYZ科技公司代言人`
      },
      {
        source: '國際制裁名單',
        status: 'clear',
        content: '未發現相關紀錄'
      },
      {
        source: '新聞媒體報導',
        status: 'found',
        content: `發現5筆相關新聞報導，主要涉及網紅投資詐騙案`
      }
    ],
    riskLevel: 'high',
    recommendation: '建議謹慎評估，該網紅具有較高的金融詐欺風險，不建議投資相關商品。'
  };
}

// ABC投資公司結果
function generateABCCompanyResult() {
  return {
    summary: `根據我們的資料庫搜尋，ABC投資公司負責人陳世凱的法律紀錄如下：`,
    findings: [
      {
        source: '法院判決書系統',
        status: 'found',
        content: `發現2件相關案件：背信罪案件1件（2023年），違反公司法1件（2022年）`
      },
      {
        source: '金融監理機關',
        status: 'found',
        content: `陳世凱列入投信業禁止往來名單`
      },
      {
        source: '企業登記資料',
        status: 'found',
        content: `擔任ABC投資公司負責人，並為DEF建設公司股東`
      },
      {
        source: '國際制裁名單',
        status: 'clear',
        content: '未發現相關紀錄'
      },
      {
        source: '新聞媒體報導',
        status: 'found',
        content: `發現3筆相關新聞報導，主要涉及公司治理問題`
      }
    ],
    riskLevel: 'high',
    recommendation: '建議謹慎評估，該公司負責人具有公司治理風險，投資前應詳細了解。'
  };
}

// 王小明與李大華關係結果
function generateWangLiRelationshipResult() {
  return {
    summary: `根據我們的資料庫搜尋，王小明和李大華之間的商業往來分析如下：`,
    findings: [
      {
        source: '法院判決書系統',
        status: 'found',
        content: `發現商業糾紛案件：合夥糾紛1件（2023年），投資糾紛1件（2022年）`
      },
      {
        source: '金融監理機關',
        status: 'clear',
        content: '未發現金融違規紀錄'
      },
      {
        source: '企業登記資料',
        status: 'found',
        content: `兩人為明華投資公司共同創辦人，另有其他企業投資關係`
      },
      {
        source: '國際制裁名單',
        status: 'clear',
        content: '未發現相關紀錄'
      },
      {
        source: '新聞媒體報導',
        status: 'found',
        content: `發現2筆相關新聞報導，主要涉及合夥糾紛`
      }
    ],
    riskLevel: 'medium',
    recommendation: '兩人確實有商業往來關係，但存在合夥糾紛，建議了解糾紛詳情後再決定是否合作。'
  };
}

// 陳曉偉結果
function generateChenXiaoWeiResult() {
  return {
    summary: `根據我們的資料庫搜尋，陳曉偉先生在越南的詐欺相關紀錄如下：`,
    findings: [
      {
        source: '法院判決書系統',
        status: 'found',
        content: `發現跨國案件：越南詐欺案1件（2023年），跨國洗錢案1件（2022年）`
      },
      {
        source: '金融監理機關',
        status: 'found',
        content: `列入跨境金融犯罪警示名單`
      },
      {
        source: '企業登記資料',
        status: 'found',
        content: `擔任越南分公司負責人，並為國際貿易公司股東`
      },
      {
        source: '國際制裁名單',
        status: 'found',
        content: `列入越南當地金融犯罪監控名單`
      },
      {
        source: '新聞媒體報導',
        status: 'found',
        content: `發現4筆相關新聞報導，主要涉及跨國詐欺案`
      }
    ],
    riskLevel: 'high',
    recommendation: '陳曉偉先生確實在越南犯下詐欺相關罪行，具有極高風險，強烈建議避免任何商業往來。'
  };
}

// 默認結果
function generateDefaultResult(personName) {
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
  // 根據具體問題返回相應的圖形資料
  if (query.includes('張小華')) {
    return generateZhangXiaoHuaData();
  } else if (query.includes('ABC投資公司')) {
    return generateABCCompanyData();
  } else if (query.includes('王小明') && query.includes('李大華')) {
    return generateWangLiRelationshipData();
  } else if (query.includes('陳曉偉')) {
    return generateChenXiaoWeiData();
  } else {
    // 默認案例
    return generateDefaultData(extractPersonName(query));
  }
}

// 張小華案例
function generateZhangXiaoHuaData() {
  const nodes = [
    // 中心人物
    { id: '張小華', group: 'person', size: 20, color: '#A95565' },
    
    // 法院案件
    { id: '詐欺案件_2023', group: 'case', size: 15, color: '#4E8677' },
    { id: '違反銀行法_2022', group: 'case', size: 15, color: '#4E8677' },
    
    // 罪名
    { id: '詐欺罪', group: 'crime', size: 12, color: '#B1F7FC' },
    { id: '違反銀行法', group: 'crime', size: 12, color: '#B1F7FC' },
    
    // 關聯人物
    { id: '沈志豪', group: 'family', size: 14, color: '#8271B0' },
    { id: '林麗雯', group: 'family', size: 14, color: '#8271B0' },
    { id: '謝美麗', group: 'associate', size: 13, color: '#8271B0' },
    
    // 公司
    { id: '星光娛樂公司', group: 'company', size: 16, color: '#BB870C' },
    { id: 'XYZ科技公司', group: 'company', size: 16, color: '#BB870C' }
  ];

  const links = [
    { source: '張小華', target: '詐欺案件_2023', relationship: '涉嫌' },
    { source: '張小華', target: '違反銀行法_2022', relationship: '涉嫌' },
    { source: '詐欺案件_2023', target: '詐欺罪', relationship: '判決' },
    { source: '違反銀行法_2022', target: '違反銀行法', relationship: '判決' },
    { source: '張小華', target: '沈志豪', relationship: '親屬' },
    { source: '張小華', target: '林麗雯', relationship: '配偶' },
    { source: '張小華', target: '謝美麗', relationship: '共犯' },
    { source: '張小華', target: '星光娛樂公司', relationship: '簽約網紅' },
    { source: '張小華', target: 'XYZ科技公司', relationship: '代言人' },
    { source: '詐欺案件_2023', target: '星光娛樂公司', relationship: '涉及' }
  ];

  return { nodes, links };
}

// ABC投資公司案例
function generateABCCompanyData() {
  const nodes = [
    // 中心人物
    { id: '陳世凱', group: 'person', size: 20, color: '#A95565' },
    
    // 法院案件
    { id: '背信案件_2023', group: 'case', size: 15, color: '#4E8677' },
    { id: '公司法違反_2022', group: 'case', size: 15, color: '#4E8677' },
    
    // 罪名
    { id: '背信罪', group: 'crime', size: 12, color: '#B1F7FC' },
    { id: '違反公司法', group: 'crime', size: 12, color: '#B1F7FC' },
    
    // 關聯人物
    { id: '陳美玲', group: 'family', size: 14, color: '#8271B0' },
    { id: '劉志明', group: 'associate', size: 13, color: '#8271B0' },
    { id: '王大同', group: 'associate', size: 13, color: '#8271B0' },
    
    // 公司
    { id: 'ABC投資公司', group: 'company', size: 18, color: '#BB870C' },
    { id: 'DEF建設公司', group: 'company', size: 16, color: '#BB870C' }
  ];

  const links = [
    { source: '陳世凱', target: '背信案件_2023', relationship: '涉嫌' },
    { source: '陳世凱', target: '公司法違反_2022', relationship: '涉嫌' },
    { source: '背信案件_2023', target: '背信罪', relationship: '判決' },
    { source: '公司法違反_2022', target: '違反公司法', relationship: '判決' },
    { source: '陳世凱', target: '陳美玲', relationship: '配偶' },
    { source: '陳世凱', target: '劉志明', relationship: '商業夥伴' },
    { source: '陳世凱', target: '王大同', relationship: '共同投資人' },
    { source: '陳世凱', target: 'ABC投資公司', relationship: '負責人' },
    { source: '陳世凱', target: 'DEF建設公司', relationship: '股東' },
    { source: 'ABC投資公司', target: '背信案件_2023', relationship: '涉及' }
  ];

  return { nodes, links };
}

// 王小明與李大華關係案例
function generateWangLiRelationshipData() {
  const nodes = [
    // 兩個中心人物
    { id: '王小明', group: 'person', size: 20, color: '#A95565' },
    { id: '李大華', group: 'person', size: 20, color: '#A95565' },
    
    // 法院案件
    { id: '合夥糾紛_2023', group: 'case', size: 15, color: '#4E8677' },
    { id: '投資糾紛_2022', group: 'case', size: 15, color: '#4E8677' },
    
    // 罪名
    { id: '合約糾紛', group: 'crime', size: 12, color: '#B1F7FC' },
    { id: '投資詐欺', group: 'crime', size: 12, color: '#B1F7FC' },
    
    // 關聯人物
    { id: '張雅芳', group: 'associate', size: 13, color: '#8271B0' },
    { id: '林建國', group: 'associate', size: 13, color: '#8271B0' },
    
    // 公司
    { id: '明華投資公司', group: 'company', size: 18, color: '#BB870C' },
    { id: '大明科技公司', group: 'company', size: 16, color: '#BB870C' },
    { id: '華昇貿易公司', group: 'company', size: 16, color: '#BB870C' }
  ];

  const links = [
    { source: '王小明', target: '李大華', relationship: '商業夥伴' },
    { source: '王小明', target: '合夥糾紛_2023', relationship: '涉嫌' },
    { source: '李大華', target: '投資糾紛_2022', relationship: '涉嫌' },
    { source: '合夥糾紛_2023', target: '合約糾紛', relationship: '案由' },
    { source: '投資糾紛_2022', target: '投資詐欺', relationship: '案由' },
    { source: '王小明', target: '張雅芳', relationship: '證人' },
    { source: '李大華', target: '林建國', relationship: '證人' },
    { source: '王小明', target: '明華投資公司', relationship: '共同創辦人' },
    { source: '李大華', target: '明華投資公司', relationship: '共同創辦人' },
    { source: '王小明', target: '大明科技公司', relationship: '董事' },
    { source: '李大華', target: '華昇貿易公司', relationship: '股東' },
    { source: '明華投資公司', target: '合夥糾紛_2023', relationship: '涉及' }
  ];

  return { nodes, links };
}

// 陳曉偉案例
function generateChenXiaoWeiData() {
  const nodes = [
    // 中心人物
    { id: '陳曉偉', group: 'person', size: 20, color: '#A95565' },
    
    // 法院案件
    { id: '越南詐欺案_2023', group: 'case', size: 15, color: '#4E8677' },
    { id: '跨國洗錢案_2022', group: 'case', size: 15, color: '#4E8677' },
    
    // 罪名
    { id: '詐欺罪', group: 'crime', size: 12, color: '#B1F7FC' },
    { id: '洗錢罪', group: 'crime', size: 12, color: '#B1F7FC' },
    
    // 關聯人物
    { id: '陳麗華', group: 'family', size: 14, color: '#8271B0' },
    { id: '黃志成', group: 'associate', size: 13, color: '#8271B0' },
    { id: 'Nguyen Van A', group: 'associate', size: 13, color: '#8271B0' },
    
    // 公司
    { id: '越南分公司', group: 'company', size: 16, color: '#BB870C' },
    { id: '國際貿易公司', group: 'company', size: 16, color: '#BB870C' }
  ];

  const links = [
    { source: '陳曉偉', target: '越南詐欺案_2023', relationship: '涉嫌' },
    { source: '陳曉偉', target: '跨國洗錢案_2022', relationship: '涉嫌' },
    { source: '越南詐欺案_2023', target: '詐欺罪', relationship: '判決' },
    { source: '跨國洗錢案_2022', target: '洗錢罪', relationship: '判決' },
    { source: '陳曉偉', target: '陳麗華', relationship: '配偶' },
    { source: '陳曉偉', target: '黃志成', relationship: '共犯' },
    { source: '陳曉偉', target: 'Nguyen Van A', relationship: '當地共犯' },
    { source: '陳曉偉', target: '越南分公司', relationship: '負責人' },
    { source: '陳曉偉', target: '國際貿易公司', relationship: '股東' },
    { source: '越南詐欺案_2023', target: '越南分公司', relationship: '涉及' }
  ];

  return { nodes, links };
}

// 默認案例（原來的邏輯）
function generateDefaultData(personName) {
  const nodes = [
    { id: personName, group: 'person', size: 20, color: '#A95565' },
    { id: '詐欺案件_2023', group: 'case', size: 15, color: '#4E8677' },
    { id: '違反銀行法_2022', group: 'case', size: 15, color: '#4E8677' },
    { id: '詐欺罪', group: 'crime', size: 12, color: '#B1F7FC' },
    { id: '違反銀行法', group: 'crime', size: 12, color: '#B1F7FC' },
    { id: '沈志豪', group: 'family', size: 14, color: '#8271B0' },
    { id: '林麗雯', group: 'family', size: 14, color: '#8271B0' },
    { id: '謝美麗', group: 'associate', size: 13, color: '#8271B0' },
    { id: 'ABC投資公司', group: 'company', size: 16, color: '#BB870C' },
    { id: 'XYZ科技公司', group: 'company', size: 16, color: '#BB870C' }
  ];

  const links = [
    { source: personName, target: '詐欺案件_2023', relationship: '涉嫌' },
    { source: personName, target: '違反銀行法_2022', relationship: '涉嫌' },
    { source: '詐欺案件_2023', target: '詐欺罪', relationship: '判決' },
    { source: '違反銀行法_2022', target: '違反銀行法', relationship: '判決' },
    { source: personName, target: '沈志豪', relationship: '親屬' },
    { source: personName, target: '林麗雯', relationship: '配偶' },
    { source: personName, target: '謝美麗', relationship: '共犯' },
    { source: personName, target: 'ABC投資公司', relationship: '負責人' },
    { source: personName, target: 'XYZ科技公司', relationship: '前負責人' },
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
