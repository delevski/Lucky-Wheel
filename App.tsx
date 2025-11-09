import React, { useState } from 'react';
import SpinningWheel from './components/SpinningWheel';
import { PrizeSelector } from './components/PrizeSelector';
import type { Prize } from './types';

const INITIAL_PRIZES: Prize[] = [
  { name: 'סוף שבוע עם ניסים בדובאי', color: '#8b5cf6' }, // Violet
  { name: 'זכית באימוץ סבתא', color: '#3b82f6' }, // Blue
  { name: 'זכית בשערות מסולסלאים', color: '#10b981' }, // Emerald
  { name: 'ואיי ואיי יש דולרים?', color: '#f59e0b' }, // Amber
  { name: 'משהו אחר', color: '#ef4444' }, // Red
  { name: 'זכית בקוסקו ומפרום', color: '#ec4899' }, // Pink
  { name: 'זכית בפקס של יעקב', color: '#6366f1' }, // Indigo
  { name: 'סיבוב ברכב של שביט', color: '#14b8a6' }, // Teal
];

const App: React.FC = () => {
  const [prizes] = useState<Prize[]>(INITIAL_PRIZES);
  const [selectedOutcome, setSelectedOutcome] = useState<Prize | null>(null);
  const [lastResult, setLastResult] = useState<Prize | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpinStart = () => {
    setIsSpinning(true);
    setLastResult(null); // Clear previous result on new spin
  };

  const handleSpinEnd = (prize: Prize) => {
    setLastResult(prize);
    setIsSpinning(false);
  };

  const handleSelectPrize = (prize: Prize | null) => {
    setSelectedOutcome(prize);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <header className="text-center mb-6 md:mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600" dir="rtl">
          גלגל המזל של רמי השועל
        </h1>
        <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto" dir="rtl">
          סובב את הגלגל כדי לזכות בפרס, או קבע את התוצאה מראש בעזרת הפקדים בצד.
        </p>
      </header>

      <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-around gap-8 md:gap-16">
        <div className="order-2 md:order-1">
          <PrizeSelector
            prizes={prizes}
            selectedPrize={selectedOutcome}
            onSelectPrize={handleSelectPrize}
            isSpinning={isSpinning}
          />
        </div>

        <div className="order-1 md:order-2 flex flex-col items-center gap-6">
          <SpinningWheel
            prizes={prizes}
            onSpinStart={handleSpinStart}
            onSpinEnd={handleSpinEnd}
            targetPrize={selectedOutcome}
            isSpinning={isSpinning}
          />
          {lastResult && (
             <div 
              className="mt-4 p-4 rounded-xl text-center transition-all duration-300 animate-fade-in-up"
              style={{ backgroundColor: lastResult.color, boxShadow: `0 0 20px ${lastResult.color}` }}
             >
               <span className="text-sm text-white/80" dir="rtl">התוצאה האחרונה:</span>
               <p className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{lastResult.name}</p>
             </div>
          )}
        </div>
      </div>

      {/* FIX: The `jsx` prop is not a valid attribute for the standard <style> element in React. 
          This syntax is for `styled-jsx`, which is not being used here. Removing it corrects the error. */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
