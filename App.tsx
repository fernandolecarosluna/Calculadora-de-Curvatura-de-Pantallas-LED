
import React, { useState, useMemo } from 'react';
import { Section, CalculationResult } from './types';
import { calculateScreenDimensions } from './services/calculationService';
import SectionInput from './components/SectionInput';
import ScreenVisualizer from './components/ScreenVisualizer';

const App: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    { id: crypto.randomUUID(), modules: 5, angle: 5 },
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleSectionChange = (id: string, field: 'modules' | 'angle', value: number) => {
    setSections(prevSections =>
      prevSections.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
    setResult(null); 
  };

  const addSection = () => {
    setSections([...sections, { id: crypto.randomUUID(), modules: 1, angle: 0 }]);
    setResult(null);
  };

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== id));
      setResult(null);
    }
  };

  const handleCalculate = () => {
    const calculation = calculateScreenDimensions(sections);
    setResult(calculation);
  };
  
  const handleReset = () => {
    setSections([{ id: crypto.randomUUID(), modules: 5, angle: 5 }]);
    setResult(null);
  };

  const totalModules = useMemo(() => sections.reduce((sum, s) => sum + s.modules, 0), [sections]);
  const totalArcLength = useMemo(() => totalModules * 50, [totalModules]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 tracking-tight">
            Calculadora de Curvatura de Pantallas LED
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Diseñe su pantalla LED curva. Defina cada tramo, ajuste los ángulos y visualice las dimensiones finales al instante.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                <span className="bg-cyan-500/20 text-cyan-300 rounded-lg p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
              Configuración de Tramos
            </h2>
            <div className="space-y-6">
              {sections.map((section, index) => (
                <SectionInput
                  key={section.id}
                  section={section}
                  index={index}
                  onChange={handleSectionChange}
                  onRemove={removeSection}
                  canRemove={sections.length > 1}
                />
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={addSection}
                className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Añadir Tramo
              </button>
              <button
                onClick={handleCalculate}
                className="w-full sm:w-auto flex-grow flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>
                Calcular y Visualizar
              </button>
            </div>
             <div className="mt-4">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-800/50 hover:bg-red-800/80 text-red-200 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 010-2h5a1 1 0 011 1v5a1 1 0 01-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                Reiniciar
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                <span className="bg-cyan-500/20 text-cyan-300 rounded-lg p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </span>
                Resultados y Visualización
            </h2>
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-cyan-400">ANCHO TOTAL</h3>
                        <p className="text-2xl font-bold text-white">{result.width.toFixed(2)} cm</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-cyan-400">PROFUNDIDAD (CURVA)</h3>
                        <p className="text-2xl font-bold text-white">{result.depth.toFixed(2)} cm</p>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-cyan-400">LONGITUD DE ARCO</h3>
                        <p className="text-2xl font-bold text-white">{totalArcLength.toFixed(2)} cm</p>
                    </div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg aspect-w-16 aspect-h-9">
                  <ScreenVisualizer result={result} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-900/50 rounded-lg p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-300">Esperando cálculo</h3>
                <p className="text-gray-500 mt-2">
                  Ajuste los parámetros de los tramos y presione "Calcular y Visualizar" para ver el resultado.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
