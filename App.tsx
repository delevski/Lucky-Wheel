
import React, { useState, useRef, useEffect } from 'react';
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
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the wheel when an outcome is selected on mobile/tablet view
    if (selectedOutcome && window.innerWidth < 1024) { // Tailwind's lg breakpoint
      wheelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedOutcome]);

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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          גלגל המזל של רמי השועל
        </h1>
        <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
          סובב את הגלגל כדי לזכות בפרס, או קבע את התוצאה מראש בעזרת הפקדים.
        </p>
      </header>

      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-around gap-12 lg:gap-16">
        
        {/* On mobile, wheel is second (order-2). On desktop, it's first (lg:order-1). For RTL desktop, this will be on the right. */}
        <div ref={wheelRef} className="flex flex-col items-center gap-6 order-2 lg:order-1">
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
               <span className="text-sm text-white/80">התוצאה האחרונה:</span>
               <p className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>{lastResult.name}</p>
             </div>
          )}
        </div>
        
        {/* On mobile, selector is first (order-1). On desktop, it's second (lg:order-2). For RTL desktop, this will be on the left. */}
        <div className="w-full max-w-md lg:max-w-none order-1 lg:order-2">
          <PrizeSelector
            prizes={prizes}
            selectedPrize={selectedOutcome}
            onSelectPrize={handleSelectPrize}
            isSpinning={isSpinning}
          />
        </div>

      </div>

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
