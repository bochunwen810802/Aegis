import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: ${props => props.theme.secondary};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  
  span {
    color: ${props => props.theme.textSecondary};
    font-weight: 400;
    font-size: 1rem;
    margin-left: 0.5rem;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavItem = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    color: ${props => props.theme.text};
    background: ${props => props.theme.accent};
  }
  
  &.active {
    color: ${props => props.theme.text};
    background: ${props => props.theme.accent};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NewQueryButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.theme.success};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

function Header({ onNewQuery }) {
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>A</LogoIcon>
        <Title>
          Aegis 風險資料庫
          <span>Risk Intelligence Platform</span>
        </Title>
      </Logo>
      
      <Navigation>
        <NavItem className="active">搜尋</NavItem>
        <NavItem>資料庫</NavItem>
        <NavItem>報告</NavItem>
        <NavItem>設定</NavItem>
      </Navigation>
      
      <ActionButtons>
        <StatusIndicator>
          <StatusDot />
          系統正常
        </StatusIndicator>
        <NewQueryButton onClick={onNewQuery}>
          新查詢
        </NewQueryButton>
      </ActionButtons>
    </HeaderContainer>
  );
}

export default Header; 