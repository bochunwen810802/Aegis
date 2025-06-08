import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: ${props => props.theme.primary};
  overflow: hidden;
`;

const NetworkSvg = styled.svg`
  width: 100%;
  height: 100%;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const LegendPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
  z-index: 100;
  min-width: 200px;
`;

const LegendTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
  font-size: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const TooltipContainer = styled.div`
  position: absolute;
  background: ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 0.75rem;
  pointer-events: none;
  z-index: 1000;
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 250px;
  
  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

const nodeColors = {
  person: '#A95565',      // 淺藍色 - 主要目標人物
  case: '#4E8677',        // 深綠色 - 法院案件  
  crime: '#B1F7FC',       // 玫瑰色 - 罪名
  family: '#8271B0',      // 紫色 - 家庭成員
  associate: '#8271B0',   // 紫色 - 關聯人物 (與家庭成員同色)
  company: '#BB870C'      // 金棕色 - 相關企業
};

const legendItems = [
  { color: nodeColors.person, label: '目標人物' },
  { color: nodeColors.case, label: '法院案件' },
  { color: nodeColors.crime, label: '罪名' },
  { color: nodeColors.family, label: '家庭成員' },
  { color: nodeColors.associate, label: '關聯人物' },
  { color: nodeColors.company, label: '相關企業' }
];

function GraphNetwork({ data }) {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!data || !data.nodes || !data.links) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 清除之前的內容
    svg.selectAll("*").remove();

    // 創建容器組
    const container = svg.append("g");

    // 設置縮放行為
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // 創建力模擬
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size + 8));

    // 創建箭頭標記
    const defs = container.append("defs");
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#546E7A");

    // 創建連線
    const links = container.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", "#546E7A")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", "url(#arrowhead)");

    // 創建連線標籤
    const linkLabels = container.append("g")
      .selectAll("text")
      .data(data.links)
      .enter().append("text")
      .attr("class", "link-label")
      .attr("font-size", "10px")
      .attr("fill", "#90A4AE")
      .attr("text-anchor", "middle")
      .attr("font-weight", "500")
      .text(d => d.relationship);

    // 創建節點
    const nodes = container.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .enter().append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.color || nodeColors[d.group] || '#78909C')
      .attr("stroke", "#263238")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))")
      .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded))
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleNodeClick);

    // 創建節點標籤
    const nodeLabels = container.append("g")
      .selectAll("text")
      .data(data.nodes)
      .enter().append("text")
      .attr("class", "node-label")
      .attr("font-size", "11px")
      .attr("fill", "#ECEFF1")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-weight", "600")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)")
      .text(d => d.id);

    // 更新位置
    simulation.on("tick", () => {
      links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      linkLabels
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      nodeLabels
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // 拖拽處理函數
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // 滑鼠懸停處理
    function handleMouseOver(event, d) {
      const tooltip = d3.select(tooltipRef.current);
      
      // 突出顯示相關節點和連線
      nodes
        .style("opacity", n => n === d || isConnected(d, n) ? 1 : 0.2)
        .style("filter", n => n === d ? "drop-shadow(0 0 8px rgba(169, 85, 101, 0.8))" : 
                           isConnected(d, n) ? "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))" : 
                           "drop-shadow(2px 2px 4px rgba(0,0,0,0.1))");
      
      links
        .style("opacity", l => l.source === d || l.target === d ? 0.9 : 0.1)
        .style("stroke", l => l.source === d || l.target === d ? "#A95565" : "#546E7A");
      
      linkLabels
        .style("opacity", l => l.source === d || l.target === d ? 1 : 0.2);
      
      // 顯示工具提示
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px")
        .style("opacity", 1)
        .html(`
          <strong>${d.id}</strong><br/>
          類型: ${getGroupLabel(d.group)}<br/>
          ${getNodeDetails(d)}
        `);
    }

    function handleMouseOut() {
      const tooltip = d3.select(tooltipRef.current);
      
      // 恢復所有節點和連線的透明度
      nodes
        .style("opacity", 1)
        .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))");
      
      links
        .style("opacity", 0.6)
        .style("stroke", "#546E7A");
        
      linkLabels
        .style("opacity", 1);
      
      // 隱藏工具提示
      tooltip.style("opacity", 0);
    }

    function handleNodeClick(event, d) {
      setSelectedNode(selectedNode === d ? null : d);
    }

    // 檢查節點是否連接
    function isConnected(a, b) {
      return data.links.some(link => 
        (link.source === a && link.target === b) || 
        (link.source === b && link.target === a)
      );
    }

    return () => {
      simulation.stop();
    };

  }, [data, selectedNode]);

  const getGroupLabel = (group) => {
    const labels = {
      person: '目標人物',
      case: '法院案件',
      crime: '罪名',
      family: '家庭成員',
      associate: '關聯人物',
      company: '相關企業'
    };
    return labels[group] || group;
  };

  const getNodeDetails = (node) => {
    switch (node.group) {
      case 'person':
        return '點擊查看詳細資訊';
      case 'case':
        return '法院判決案件';
      case 'crime':
        return '相關罪名';
      case 'family':
        return '家庭成員關係';
      case 'associate':
        return '關聯人物';
      case 'company':
        return '相關企業實體';
      default:
        return '';
    }
  };

  if (!data) {
    return (
      <GraphContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: '#999' 
        }}>
          載入圖形資料中...
        </div>
      </GraphContainer>
    );
  }

  return (
    <GraphContainer>
      <NetworkSvg ref={svgRef} />

      <LegendPanel>
        <LegendTitle>圖例</LegendTitle>
        {legendItems.map((item, index) => (
          <LegendItem key={index}>
            <LegendColor color={item.color} />
            {item.label}
          </LegendItem>
        ))}
      </LegendPanel>

      <TooltipContainer ref={tooltipRef} />
    </GraphContainer>
  );
}

export default GraphNetwork; 