
import React from 'react';
import type { Prize } from '../types';

interface PrizeSelectorProps {
  prizes: Prize[];
  selectedPrize: Prize | null;
  onSelectPrize: (prize: Prize | null) => void;
  isSpinning: boolean;
}

export const PrizeSelector: React.FC<PrizeSelectorProps> = ({ prizes, selectedPrize, onSelectPrize, isSpinning }) => {
  return (
    <div className="w-full md:w-64 lg:w-72 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-400" dir="rtl">בחר תוצאה מראש</h2>
      <p className="text-sm text-gray-400 mb-6 text-center" dir="rtl">בחר פרס כדי לקבוע את התוצאה הבאה, או בחר "אקראי" לסיבוב הוגן.</p>
      <div className="space-y-3">
        <button
            onClick={() => onSelectPrize(null)}
            disabled={isSpinning}
            className={`w-full text-lg font-semibold py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
              ${!selectedPrize 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
              ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
            אקראי
          </button>
        {prizes.map((prize) => {
          const isSelected = selectedPrize?.name === prize.name;
          return (
            <button
              key={prize.name}
              onClick={() => onSelectPrize(prize)}
              disabled={isSpinning}
              className={`w-full text-lg font-semibold py-3 px-4 rounded-lg transition-all duration-200 border-2
                ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}
                ${isSelected 
                  ? 'shadow-md' 
                  : 'bg-opacity-20 hover:bg-opacity-40'
                }`}
              style={{
                backgroundColor: isSelected ? prize.color : 'transparent',
                borderColor: prize.color,
                color: isSelected ? 'white' : prize.color,
                textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              {prize.name}
            </button>
          )
        })}
      </div>
    </div>
  );
};
