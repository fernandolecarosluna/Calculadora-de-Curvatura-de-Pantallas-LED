import React from 'react';
import { CalculationResult } from '../types';

interface ScreenVisualizerProps {
  result: CalculationResult;
}

const ScreenVisualizer: React.FC<ScreenVisualizerProps> = ({ result }) => {
  const { points, width, depth } = result;

  if (points.length < 2 || width <= 1e-6) return null;
  
  const padding = 20;
  const labelGutter = 40; // Space for dimension labels
  const dataHasDepth = depth > 1e-6;

  // ViewBox calculation to include space for labels on the right and bottom
  const viewBoxWidth = width + padding * 2 + (dataHasDepth ? labelGutter : 0);
  const viewBoxHeight = (dataHasDepth ? depth : 20) + padding * 2 + labelGutter;
  
  // Define the drawing area for the screen shape itself
  const shapeArea = {
    top: padding,
    bottom: viewBoxHeight - padding - labelGutter,
    left: padding,
    right: viewBoxWidth - padding - (dataHasDepth ? labelGutter : 0),
  };
  const shapeAreaHeight = shapeArea.bottom - shapeArea.top;
  const shapeAreaWidth = shapeArea.right - shapeArea.left;


  const mapPointToSvg = (p: {x: number, y: number}) => {
    // Map X from [-width/2, width/2] to [shapeArea.left, shapeArea.right]
    const x = ((p.x + width / 2) / width) * shapeAreaWidth + shapeArea.left;
    
    // Map Y from [0, depth] to [shapeArea.bottom, shapeArea.top] (inverted for SVG y-axis)
    // This centers the shape vertically within its allocated area
    const y = shapeArea.bottom - ((dataHasDepth ? (p.y / depth) : 0.5) * shapeAreaHeight);

    return { x, y };
  };

  const pathData = points.map(mapPointToSvg).map((p, i) => (
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
  )).join(' ');

  // Calculate positions for dimension lines
  const widthLineY = shapeArea.bottom + labelGutter / 2;
  const depthLineX = shapeArea.right + labelGutter / 2;
  
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      aria-label="Visualización de la curvatura y dimensiones de la pantalla LED"
    >
      {/* Base line connecting endpoints, representing the straight width */}
      <line 
        x1={shapeArea.left} y1={shapeArea.bottom} 
        x2={shapeArea.right} y2={shapeArea.bottom}
        stroke="#4b5563" strokeWidth="1.5"
      />

      {/* Screen curve path */}
      <path d={pathData} stroke="#a855f7" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Dimension Lines & Text */}
      <g className="text-cyan-400" fontSize="12px" fontFamily="sans-serif" stroke="currentColor" strokeWidth="1">
        {/* Width Dimension */}
        <g aria-label={`Ancho total: ${width.toFixed(2)} cm`}>
          <line x1={shapeArea.left} y1={widthLineY} x2={shapeArea.right} y2={widthLineY} />
          <line x1={shapeArea.left} y1={widthLineY - 4} x2={shapeArea.left} y2={widthLineY + 4} />
          <line x1={shapeArea.right} y1={widthLineY - 4} x2={shapeArea.right} y2={widthLineY + 4} />
          <text x={shapeArea.left + shapeAreaWidth / 2} y={widthLineY + 15} textAnchor="middle" fill="currentColor" stroke="none">
            Ancho: {width.toFixed(2)} cm
          </text>
        </g>

        {/* Depth Dimension */}
        {dataHasDepth && (
          <g aria-label={`Profundidad: ${depth.toFixed(2)} cm`}>
            <line x1={depthLineX} y1={shapeArea.top} x2={depthLineX} y2={shapeArea.bottom} />
            <line x1={depthLineX - 4} y1={shapeArea.top} x2={depthLineX + 4} y2={shapeArea.top} />
            <line x1={depthLineX - 4} y1={shapeArea.bottom} x2={depthLineX + 4} y2={shapeArea.bottom} />
            <text 
              x={depthLineX + 15}
              y={shapeArea.top + shapeAreaHeight / 2}
              dominantBaseline="middle"
              textAnchor="middle" 
              fill="currentColor"
              stroke="none"
              transform={`rotate(-90, ${depthLineX + 15}, ${shapeArea.top + shapeAreaHeight / 2})`}
            >
              Profundidad: {depth.toFixed(2)} cm
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};

export default ScreenVisualizer;