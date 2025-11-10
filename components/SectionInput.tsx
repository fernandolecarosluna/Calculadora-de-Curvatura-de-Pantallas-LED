
import React from 'react';
import { Section } from '../types';

interface SectionInputProps {
  section: Section;
  index: number;
  onChange: (id: string, field: 'modules' | 'angle', value: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const SectionInput: React.FC<SectionInputProps> = ({ section, index, onChange, onRemove, canRemove }) => {
  const handleModulesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      onChange(section.id, 'modules', value);
    } else if (e.target.value === '') {
      onChange(section.id, 'modules', 1);
    }
  };

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onChange(section.id, 'angle', value);
    }
  };

  return (
    <div className="bg-gray-900/70 p-4 rounded-xl border border-gray-700 relative">
      <div className="flex justify-between items-start">
          <div>
            <span className="text-sm font-bold text-cyan-400">TRAMO {index + 1}</span>
          </div>
          {canRemove && (
            <button 
              onClick={() => onRemove(section.id)}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-800 text-gray-500 border-b-2 border-gray-900 hover:bg-gray-700 hover:text-red-400 active:bg-gray-700 active:border-b-0 active:translate-y-0.5 transform transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Eliminar Tramo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
      </div>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`modules-${section.id}`} className="block text-sm font-medium text-gray-400 mb-1">
            Módulos (50x50cm)
          </label>
          <input
            type="number"
            id={`modules-${section.id}`}
            value={section.modules}
            onChange={handleModulesChange}
            min="1"
            className="w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor={`angle-${section.id}`} className="block text-sm font-medium text-gray-400 mb-1">
            Ángulo por Módulo
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id={`angle-${section.id}`}
              value={section.angle}
              onChange={handleAngleChange}
              step="2.5"
              min="-15"
              max="15"
              className="w-20 bg-gray-700 border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
            <input
              type="range"
              min="-15"
              max="15"
              step="2.5"
              value={section.angle}
              onChange={handleAngleChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionInput;
