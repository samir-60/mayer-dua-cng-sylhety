import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Zap } from 'lucide-react';

export const MobileControls: React.FC = () => {
  const triggerKey = (code: string, isDown: boolean) => {
    const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
      code,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="md:hidden absolute inset-x-0 bottom-3 px-4 flex justify-between items-end pointer-events-none z-30 select-none">
      {/* Steering Buttons (Left / Right) */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onTouchStart={() => triggerKey('KeyA', true)}
          onTouchEnd={() => triggerKey('KeyA', false)}
          onMouseDown={() => triggerKey('KeyA', true)}
          onMouseUp={() => triggerKey('KeyA', false)}
          className="w-14 h-14 rounded-2xl bg-stone-900/80 active:bg-emerald-600 text-white border-2 border-stone-600 flex items-center justify-center shadow-xl active:scale-95 transition"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <button
          onTouchStart={() => triggerKey('KeyD', true)}
          onTouchEnd={() => triggerKey('KeyD', false)}
          onMouseDown={() => triggerKey('KeyD', true)}
          onMouseUp={() => triggerKey('KeyD', false)}
          className="w-14 h-14 rounded-2xl bg-stone-900/80 active:bg-emerald-600 text-white border-2 border-stone-600 flex items-center justify-center shadow-xl active:scale-95 transition"
        >
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>

      {/* Gas, Brake & Drift Pedals */}
      <div className="flex items-end gap-2.5 pointer-events-auto">
        {/* Drift button */}
        <button
          onTouchStart={() => triggerKey('Space', true)}
          onTouchEnd={() => triggerKey('Space', false)}
          onMouseDown={() => triggerKey('Space', true)}
          onMouseUp={() => triggerKey('Space', false)}
          className="w-12 h-12 rounded-2xl bg-stone-900/80 active:bg-amber-600 text-yellow-400 border border-stone-600 flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          <Zap className="w-5 h-5" />
        </button>

        {/* Reverse / Brake Pedal */}
        <button
          onTouchStart={() => triggerKey('KeyS', true)}
          onTouchEnd={() => triggerKey('KeyS', false)}
          onMouseDown={() => triggerKey('KeyS', true)}
          onMouseUp={() => triggerKey('KeyS', false)}
          className="w-14 h-16 rounded-2xl bg-red-950/80 active:bg-red-700 text-white border-2 border-red-700/60 flex flex-col items-center justify-center shadow-xl active:scale-95 transition"
        >
          <ArrowDown className="w-6 h-6 text-red-400" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Brake</span>
        </button>

        {/* Accelerator Gas Pedal */}
        <button
          onTouchStart={() => triggerKey('KeyW', true)}
          onTouchEnd={() => triggerKey('KeyW', false)}
          onMouseDown={() => triggerKey('KeyW', true)}
          onMouseUp={() => triggerKey('KeyW', false)}
          className="w-16 h-20 rounded-2xl bg-emerald-950/80 active:bg-emerald-600 text-white border-2 border-emerald-500/60 flex flex-col items-center justify-center shadow-2xl active:scale-95 transition"
        >
          <ArrowUp className="w-8 h-8 text-emerald-400" />
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">GAS</span>
        </button>
      </div>
    </div>
  );
};
