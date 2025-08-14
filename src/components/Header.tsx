import React from 'react';
import { Sun, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Sun className="h-16 w-16 text-white animate-pulse" />
            <Zap className="h-8 w-8 text-yellow-200 absolute -bottom-1 -right-1" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Pagluz
        </h1>
        <p className="text-xl md:text-2xl font-light mb-2 text-yellow-100">
          Contrato de Energia Solar
        </p>
        <p className="text-lg text-yellow-100 max-w-2xl mx-auto leading-relaxed">
          Geração de contratos de aluguel de capacidade e transferência de créditos de energia
        </p>
        <div className="mt-8 flex items-center justify-center space-x-8 text-yellow-100">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Sistema Online</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-sm">Seguro & Confiável</span>
          </div>
        </div>
      </div>
    </div>
  );
};