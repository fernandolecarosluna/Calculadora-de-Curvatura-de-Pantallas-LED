
export interface Section {
  id: string;
  modules: number;
  angle: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface CalculationResult {
  points: Point[];
  width: number;
  depth: number;
  arcLength: number;
}
