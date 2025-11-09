import React, { useState, useRef } from 'react';
import type { Prize } from '../types';
import { playTick } from '../services/audioService';

interface SpinningWheelProps {
  prizes: Prize[];
  onSpinStart: () => void;
  onSpinEnd: (prize: Prize) => void;
  targetPrize: Prize | null;
  isSpinning: boolean;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ prizes, onSpinStart, onSpinEnd, targetPrize, isSpinning }) => {
  const [rotation, setRotation] = useState<number>(0);
  const [leverActive, setLeverActive] = useState(false);
  const tickIntervalRef = useRef<number | null>(null);

  const segmentDegrees = 360 / prizes.length;

  const handleSpin = () => {
    // This is the core logic, separated from the trigger
    onSpinStart();
    
    const targetIndex = targetPrize
      ? prizes.findIndex(p => p.name === targetPrize.name)
      : Math.floor(Math.random() * prizes.length);

    if (targetIndex === -1 && targetPrize) {
      console.error("Target prize not found!");
      return;
    }

    const spinDuration = 4500;
    const fullSpins = Math.floor(Math.random() * 4) + 5;
    const segmentCenterAngle = (targetIndex * segmentDegrees) + (segmentDegrees / 2);
    const randomOffset = (Math.random() - 0.5) * (segmentDegrees * 0.8);
    const destinationAngle = (360 - segmentCenterAngle - randomOffset);
    
    const currentAngle = rotation % 360;
    let rotationChange = destinationAngle - currentAngle;
    if (rotationChange < 0) {
        rotationChange += 360;
    }
    
    const totalRotation = rotation + (fullSpins * 360) + rotationChange;
    setRotation(totalRotation);
    
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    tickIntervalRef.current = window.setInterval(playTick, 100);

    setTimeout(() => {
      onSpinEnd(prizes[targetIndex]);
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }, spinDuration);
  };

  const triggerSpin = () => {
    if (isSpinning) return;

    setLeverActive(true);
    setTimeout(() => {
        setLeverActive(false);
    }, 400);

    handleSpin();
  }

  const wheelVars = {
    '--num-segments': prizes.length,
    '--segment-degrees': `${segmentDegrees}deg`,
    '--spin-duration': '4.5s',
  } as React.CSSProperties;

  const conicGradient = prizes.map(p => p.color).join(', ');

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8">
      <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] flex items-center justify-center">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[25px] z-20"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}>
          <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 60L38 25C41.3137 17.0264 35.0264 8 26 8H14C4.9736 8 -1.31371 17.0264 2 25L20 60Z" fill="#f59e0b"/>
              <path d="M20 57L5 26C2.68629 19.7015 7.29849 13 14 13H26C32.7015 13 37.3137 19.7015 35 26L20 57Z" fill="#fcd34d"/>
              <circle cx="20" cy="18" r="8" fill="#f59e0b" stroke="#fef3c7" strokeWidth="3"/>
          </svg>
        </div>

        <div
          className="relative w-full h-full rounded-full border-8 border-gray-700 shadow-2xl transition-transform ease-out"
          style={{ 
            ...wheelVars,
            transform: `rotate(${rotation}deg)`,
            transitionDuration: 'var(--spin-duration)',
            background: `conic-gradient(from 270deg at 50% 50%, ${conicGradient})`,
          }}
        >
          {prizes.map((prize, index) => {
            const angle = index * segmentDegrees;
            return (
              <div
                key={prize.name}
                className="absolute top-0 left-0 w-full h-full"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gray-600 opacity-50"
                  style={{ transformOrigin: 'bottom center' }}
                ></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 flex items-center justify-center"
                  style={{ transformOrigin: 'bottom left' }}
                >
                  <span 
                    className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl transform -rotate-90 translate-x-1/4"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                  >
                    {prize.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spin Button */}
        <button
          onClick={triggerSpin}
          disabled={isSpinning}
          className="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-800 rounded-full border-4 border-gray-600 shadow-lg
                    flex items-center justify-center text-2xl sm:text-3xl font-bold text-white
                    transform transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-500
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          dir="rtl"
        >
          סובב!
        </button>
      </div>

      {/* Lever */}
      <div 
        className="w-16 h-64 flex-shrink-0"
        onClick={!isSpinning ? triggerSpin : undefined}
        >
        <div className={`w-full h-full bg-gray-800 border-2 border-gray-700 rounded-lg shadow-inner relative flex justify-center pt-5 ${isSpinning ? 'cursor-not-allowed' : 'cursor-pointer group'}`}
          aria-label="Spin with lever"
          role="button"
          tabIndex={isSpinning ? -1 : 0}
          onKeyDown={(e) => !isSpinning && (e.key === 'Enter' || e.key === ' ') && triggerSpin()}
        >
            <div className="w-3 h-48 bg-gray-900 rounded-full inset-1 shadow-inner"></div>
            <div className={`absolute top-2 w-full flex justify-center transition-transform duration-200 ease-out ${leverActive ? 'translate-y-32' : (isSpinning ? '' : 'group-hover:-translate-y-1')}`}>
                <div className="w-3 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full shadow-md relative">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-b from-red-500 to-red-700 border-2 border-red-300 shadow-lg"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SpinningWheel;
