import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const GraphVisualization = ({ graphData, roommatePairs, onNodeClick, selectedStudent }) => {
  const fgRef = useRef();

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-300);
      fgRef.current.d3Force('link').distance(link => 150 / (link.weight || 1));
    }
  }, [graphData]);

  const getNodeColor = (node) => {
    // Selected student
    if (selectedStudent && node.id === selectedStudent.name) {
      return '#f39c12'; // orange
    }
    // Check if node is part of a roommate pair
    const isRoommate = roommatePairs.some(
      pair => pair[0] === node.id || pair[1] === node.id
    );
    return isRoommate ? '#4ecdc4' : '#667eea'; // roommate / regular node
  };

  const getLinkColor = (link) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    const isRoommatePair = roommatePairs.some(
      pair =>
        (pair[0] === sourceId || pair[0] === targetId) &&
        (pair[1] === sourceId || pair[1] === targetId)
    );
    // 🔵 regular, 🔴 roommate — match the legend
    return isRoommatePair ? '#ff6b6b' : '#95a5a6';
  };

  return (
    <div className="graph-container" style={{ position: 'relative' }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeId="id"
        backgroundColor="#f3f4ff"
        nodeRelSize={6}
        linkColor={getLinkColor}
        linkWidth={link => Math.sqrt(link.weight || link.value || 1) * 2}
        // 🔍 Hover over EDGES to see this tooltip:
        linkLabel={link => `Connection Strength: ${link.weight || link.value}`}
        // (Optional) hover over NODES:
        nodeLabel={node => node.name}
        onNodeClick={node => onNodeClick && onNodeClick(node)}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const radius = 10;
          const color = getNodeColor(node);

          // 1) Draw the circle (bubble)
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();

          ctx.lineWidth = 1 / globalScale;
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.5)';
          ctx.stroke();

          // 2) Draw the label below the bubble
          const label = node.name || node.id;
          const fontSize = 10 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#111827';
          ctx.fillText(label, node.x, node.y + radius + 2);
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          const radius = 12;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();
        }}
      />
      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '0.9em',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 10
      }}>
        <div style={{ color: '#95a5a6', marginBottom: '5px' }}>🔵 Regular Connection Node</div>
        <div style={{ color: '#ff6b6b', marginBottom: '5px' }}>🥢 Roommate Connection (edge)</div>
        <div style={{ color: '#4ecdc4', marginBottom: '5px' }}>🟢 Roommate Node</div>
        <div style={{ color: '#f39c12' }}>🟠 Selected Node</div>
      </div>
    </div>
  );
};

export default GraphVisualization;
