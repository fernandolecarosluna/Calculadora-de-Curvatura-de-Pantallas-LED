import { Section, CalculationResult, Point } from '../types';

const MODULE_WIDTH = 50; // cm

export const calculateScreenDimensions = (sections: Section[]): CalculationResult => {
  const points: Point[] = [{ x: 0, y: 0 }];
  let currentBearing = 0; // Angle in radians

  sections.forEach(section => {
    const anglePerModuleRad = (section.angle * Math.PI) / 180;
    
    for (let i = 0; i < section.modules; i++) {
      const lastPoint = points[points.length - 1];
      
      // The angle of the segment is the average of the bearing before and after
      const nextBearing = currentBearing + anglePerModuleRad / 2;
      
      const newX = lastPoint.x + MODULE_WIDTH * Math.cos(nextBearing);
      const newY = lastPoint.y + MODULE_WIDTH * Math.sin(nextBearing);
      
      points.push({ x: newX, y: newY });
      // Update the bearing for the next module
      currentBearing += anglePerModuleRad;
    }
  });

  const arcLength = sections.reduce((sum, s) => sum + s.modules, 0) * MODULE_WIDTH;
  
  if (points.length < 2) {
    return { points, width: arcLength, depth: 0, arcLength };
  }

  // Rotate points so that the first and last points are horizontally aligned
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  const deltaX = lastPoint.x - firstPoint.x;
  const deltaY = lastPoint.y - firstPoint.y;
  const rotationAngle = Math.atan2(deltaY, deltaX);

  const rotatedPoints = points.map(p => {
    // Rotate around the first point (which is the origin 0,0)
    const x = p.x;
    const y = p.y;
    const newX = x * Math.cos(-rotationAngle) - y * Math.sin(-rotationAngle);
    const newY = x * Math.sin(-rotationAngle) + y * Math.cos(-rotationAngle);
    return { x: newX, y: newY };
  });

  // Calculate bounds from the rotated points
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  rotatedPoints.forEach(p => {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });
  
  const width = maxX - minX;
  const depth = maxY - minY;
  
  // Center points horizontally and normalize y-coordinate to start from 0
  const centerX = minX + width / 2;
  const normalizedPoints = rotatedPoints.map(p => ({
      x: p.x - centerX,
      y: p.y - minY // This ensures y values range from 0 to `depth`
  }));

  return { points: normalizedPoints, width, depth, arcLength };
};