import React, { useState } from 'react';
import styled from 'styled-components';

const QueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100%;
  padding: 2rem;
  background: ${props => props.theme.primary};
  overflow-y: auto;
  
  @media (max-height: 800px) {
    justify-content: flex-start;
    padding: 1rem;
  }
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
  
  @media (max-height: 800px) {
    margin-bottom: 2rem;
  }
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background:linear-gradient(170deg, #cbd0d7 0%, #3e9bd9 100% 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const SearchSection = styled.div`
  width: 100%;
  max-width: 700px;
  margin-bottom: 3rem;
  
  @media (max-height: 800px) {
    margin-bottom: 2rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  background: ${props => props.theme.secondary};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  padding: 0.5rem;
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ExamplesSection = styled.div`
  width: 100%;
  max-width: 800px;
  flex-shrink: 0;
`;

const ExamplesTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ExamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ExampleCard = styled.div`
  background: ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3498db;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  }
`;

const ExampleTitle = styled.h4`
  color: ${props => props.theme.text};
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const ExampleQuery = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
  font-style: italic;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.theme.border};
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const exampleQueries = [
  {
    title: "個人風險查詢",
    query: "請幫我確認網紅張小華是否有犯過金融詐欺相關案件？"
  },
  {
    title: "企業背景調查",
    query: "ABC投資公司的負責人是否有相關的法律紀錄？"
  },
  {
    title: "關聯性分析",
    query: "王小明和李大華之間是否有商業往來或共同投資關係？"
  },
  {
    title: "國際制裁查詢",
    query: "陳曉偉先生是否曾在越南犯下詐欺相關罪行？"
  }
];

function QueryInterface({ onQuery }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    await onQuery(query);
    setIsLoading(false);
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
  };

  return (
    <QueryContainer>
      <WelcomeSection>
        <MainTitle>Aegis 風險資料庫</MainTitle>
        <Subtitle>
          透過整合多個開放資料集，提供全面的風險評估和背景調查服務。
          輸入您的查詢問題，我們將為您提供詳細的風險分析報告。
        </Subtitle>
      </WelcomeSection>

      <SearchSection>
        <form onSubmit={handleSubmit}>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="請輸入您的查詢問題，例如：某人是否有詐欺前科？"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            <SearchButton type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? '搜尋中...' : '搜尋'}
            </SearchButton>
          </SearchContainer>
        </form>
        
        {isLoading && (
          <LoadingIndicator>
            <Spinner />
            正在搜尋相關資料，請稍候...
          </LoadingIndicator>
        )}
      </SearchSection>

      <ExamplesSection>
        <ExamplesTitle>範例查詢</ExamplesTitle>
        <ExamplesGrid>
          {exampleQueries.map((example, index) => (
            <ExampleCard 
              key={index} 
              onClick={() => handleExampleClick(example.query)}
            >
              <ExampleTitle>{example.title}</ExampleTitle>
              <ExampleQuery>"{example.query}"</ExampleQuery>
            </ExampleCard>
          ))}
        </ExamplesGrid>
      </ExamplesSection>
    </QueryContainer>
  );
}

export default QueryInterface; 