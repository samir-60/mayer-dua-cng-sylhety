import React from 'react';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { soundService } from '../services/sound.service';
import { comedyEventBus } from '../comedy/ComedyEventBus';
import { Minimap } from './Minimap';
import { vehicleInputState } from '../game/sharedVehicleState';
import {
  Volume2,
  CloudRain,
  Sun,
  Lightbulb,
  Navigation,
  Menu,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
  Flame,
  UserCheck,
} from 'lucide-react';

export const GameHUD: React.FC = () => {
  const {
    speedKmh,
    fuelPercent,
    damagePercent,
    negotiatedFareTaka,
    distanceToTargetMeters,
    currentObjectiveTextBn,
    currentObjectiveTextEn,
    nationalLossTaka,
    comboMultiplier,
    floatingLossList,
    isRain,
    isHeadlightsOn,
    language,
    returnToMenu,
    toggleRain,
    toggleHeadlights,
    incrementHorn,
    chaosScore,
    isPublicChasing,
    publicAngerScore,
    activeMission,
  } = useGameStore();

  const { profile } = usePlayerStore();

  const handleHornClick = () => {
    soundService.playHorn(profile?.equippedHorn === 'horn_hydraulic_blast');
    incrementHorn();
    comedyEventBus.emit('HORN_SPAM');
  };

  const handlePassengerHail = () => {
    // Trigger passenger interaction keyboard event
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', bubbles: true }));
  };

  const bindControl = (action: keyof typeof vehicleInputState) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
      vehicleInputState[action] = true;
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      vehicleInputState[action] = false;
    },
    onPointerCancel: () => {
      vehicleInputState[action] = false;
    },
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const healthPercent = Math.max(0, 100 - damagePercent);
  const isLowGas = fuelPercent < 18;
  const isDanger = healthPercent < 25;

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-2 md:p-4 pb-12 z-20 font-bangla">
      {/* EDGE DANGER FLASHES */}
      {isDanger && (
        <div className="absolute inset-0 border-4 border-red-600/70 animate-pulse pointer-events-none z-10" />
      )}
      {isLowGas && !isDanger && (
        <div className="absolute inset-0 border-4 border-amber-500/50 animate-pulse pointer-events-none z-10" />
      )}
      {isRain && (
        <div className="absolute inset-0 border-2 border-sky-400/30 pointer-events-none z-10" />
      )}

      {/* ---------------- TOP BAR ---------------- */}
      <div className="flex justify-between items-start gap-2 pointer-events-auto">
        {/* TOP LEFT: BAPER RASTA NATIONAL LOSS & COMBO DISPLAY */}
        <div className="flex flex-col gap-1.5">
          {/* Main National Loss Banner */}
          <div className="bg-[#1a0808]/95 border-2 border-[#B3372B] text-white px-3.5 py-2 rounded-sm shadow-[4px_4px_0px_#26282B] flex flex-col min-w-[160px] md:min-w-[190px]">
            <div className="flex items-center justify-between gap-2 border-b border-red-900/60 pb-1 mb-1">
              <span className="text-[11px] font-black uppercase text-red-400 tracking-wider flex items-center gap-1 font-sans">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                {language === 'bn' ? 'জাতীয় ক্ষতি' : 'NATIONAL LOSS'}
              </span>
              {comboMultiplier > 1 && (
                <span className="bg-red-600 text-yellow-200 text-[10px] font-black px-1.5 py-0.2 rounded animate-pulse flex items-center gap-0.5 font-sans">
                  <Flame className="w-3 h-3 fill-yellow-200" />
                  {comboMultiplier}x কম্বো!
                </span>
              )}
            </div>

            {/* Giant Gold Loss Numerals */}
            <div className="text-2xl md:text-3xl font-black font-sans text-yellow-400 drop-shadow-[2px_2px_0px_#000] leading-none tracking-tight">
              ৳ {nationalLossTaka.toLocaleString('bn-BD')}
            </div>
          </div>

          {/* Floating Damage Popups List */}
          <div className="flex flex-col gap-1 pointer-events-none">
            {floatingLossList.map((item) => (
              <div
                key={item.id}
                className="bg-red-900/90 border border-yellow-400 text-yellow-300 text-xs font-black px-2 py-0.5 rounded shadow-lg animate-bounce flex items-center justify-between gap-2 w-max"
              >
                <span>{item.text}</span>
                <span className="text-[10px] text-white font-normal">[{item.sub}]</span>
              </div>
            ))}
          </div>

          {/* Fare & Player Wallet Sub-Badge */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <div className="bg-[#F6F1E4] border-2 border-[#26282B] text-[#26282B] px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_#26282B] flex items-center gap-1">
              <span className="text-[#1F6B3A]">{language === 'bn' ? 'ভাড়া' : 'Fare'}:</span>
              <span className="font-sans font-black text-[#1F6B3A]">৳ {negotiatedFareTaka}</span>
            </div>
            <div className="bg-[#F6F1E4] border-2 border-[#26282B] text-[#26282B] px-2 py-0.5 rounded-sm shadow-[2px_2px_0px_#26282B] flex items-center gap-1">
              <span className="text-[#26282B]">{language === 'bn' ? 'টাকা' : 'Wallet'}:</span>
              <span className="font-sans font-black">৳ {profile?.taka ?? 150}</span>
            </div>
          </div>
        </div>

        {/* TOP CENTER: Mission Road & Objective Banner */}
        <div className="flex flex-col items-center">
          {activeMission && (
            <div className="mb-1.5 bg-[#1F6B3A] border-2 border-[#F2C230] text-white rounded-sm shadow-[3px_3px_0px_#26282B] flex items-center overflow-hidden max-w-xs md:max-w-md">
              {/* Real Road Street Photo */}
              <div className="w-14 h-10 shrink-0 border-r-2 border-[#F2C230] relative overflow-hidden bg-stone-900">
                <img
                  src={activeMission.roadImage || '/images/roads/keane_bridge.jpg'}
                  alt={activeMission.roadNameBn || 'সিলেটের রাস্তা'}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Road Name & Mission Number */}
              <div className="px-2.5 py-1 text-left flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="bg-yellow-400 text-stone-950 font-black text-[9px] px-1.5 py-0.2 rounded font-sans uppercase">
                    {activeMission.titleBn.split('.')[0] ? `মিশন ${activeMission.titleBn.split('.')[0]}/১০` : 'মিশন'}
                  </span>
                  <span className="text-[10px] text-yellow-200 font-bold truncate">
                    {language === 'bn' ? (activeMission.roadNameBn || 'সিলেট প্রধান সড়ক') : (activeMission.roadNameEn || 'Sylhet Main Road')}
                  </span>
                </div>
                <div className="text-xs font-black text-white truncate leading-tight mt-0.5">
                  {language === 'bn' ? activeMission.titleBn : activeMission.titleEn}
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#F6F1E4] border-2 border-[#26282B] text-[#26282B] px-3.5 py-1.5 rounded-sm shadow-[3px_3px_0px_#26282B] flex items-center gap-2 max-w-xs md:max-w-md text-center">
            <Navigation className="w-4 h-4 text-[#1F6B3A] shrink-0" />
            <div className="text-xs md:text-sm font-bold text-[#26282B] truncate">
              {language === 'bn' ? currentObjectiveTextBn : currentObjectiveTextEn}
            </div>
            {distanceToTargetMeters > 0 && (
              <span className="text-xs font-mono font-black text-[#B3372B] shrink-0 bg-red-100 px-1.5 py-0.5 rounded border border-red-300">
                {distanceToTargetMeters}m
              </span>
            )}
          </div>

          {/* Public Mob Chase & Galali Alert Banner */}
          {isPublicChasing && (
            <div className="mt-1.5 bg-red-600 border-2 border-yellow-300 text-yellow-200 px-3 py-1 rounded-sm shadow-[3px_3px_0px_#26282B] flex items-center gap-1.5 animate-bounce font-sans">
              <ShieldAlert className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
              <span className="text-[11px] font-black uppercase tracking-tight font-bangla">
                পাবলিকের গালাগালি ও ধাওয়া শুরু! থামলেই গণধোলাই!
              </span>
            </div>
          )}
        </div>

        {/* TOP RIGHT: Speedometer, Gauges, Minimap & Toggles */}
        <div className="flex items-start gap-2">
          {/* Speedometer & Fuel Meters */}
          <div className="flex flex-col gap-1 items-end">
            {/* Speedometer */}
            <div className="bg-[#F6F1E4] border-2 border-[#26282B] px-3 py-1 rounded-sm shadow-[3px_3px_0px_#26282B] flex items-baseline gap-1.5">
              <span className="text-xl md:text-2xl font-black font-sans text-[#26282B] leading-none">
                {speedKmh}
              </span>
              <span className="text-[9px] font-black uppercase text-stone-600 tracking-wider">
                KM/H
              </span>
            </div>

            {/* Health & Gas Meters */}
            <div className="bg-[#F6F1E4] border-2 border-[#26282B] p-1.5 rounded-sm shadow-[2px_2px_0px_#26282B] flex flex-col gap-1 w-28 md:w-32">
              {/* Health */}
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#B3372B]">বডি</span>
                <span className="font-mono">{Math.round(healthPercent)}%</span>
              </div>
              <div className="w-full bg-stone-300 h-1.5 border border-[#26282B] overflow-hidden">
                <div
                  className={`h-full ${healthPercent < 30 ? 'bg-red-600' : 'bg-emerald-600'}`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>

              {/* Gas */}
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#1F6B3A]">গ্যাস</span>
                <span className="font-mono">{Math.round(fuelPercent)}%</span>
              </div>
              <div className="w-full bg-stone-300 h-1.5 border border-[#26282B] overflow-hidden">
                <div
                  className={`h-full ${isLowGas ? 'bg-amber-600' : 'bg-[#1F6B3A]'}`}
                  style={{ width: `${fuelPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex flex-col gap-1">
            <button
              onClick={toggleRain}
              title="Toggle Rain"
              className="bg-[#F6F1E4] hover:bg-stone-200 border-2 border-[#26282B] p-1.5 rounded-sm shadow-[2px_2px_0px_#26282B] text-[#26282B] transition"
            >
              {isRain ? <CloudRain className="w-4 h-4 text-sky-700" /> : <Sun className="w-4 h-4 text-amber-600" />}
            </button>

            <button
              onClick={toggleHeadlights}
              title="Toggle Headlights"
              className={`bg-[#F6F1E4] hover:bg-stone-200 border-2 border-[#26282B] p-1.5 rounded-sm shadow-[2px_2px_0px_#26282B] transition ${
                isHeadlightsOn ? 'text-amber-600' : 'text-stone-500'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            <button
              onClick={returnToMenu}
              title="Menu"
              className="bg-[#F6F1E4] hover:bg-stone-200 border-2 border-[#26282B] p-1.5 rounded-sm shadow-[2px_2px_0px_#26282B] text-[#26282B] transition"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Circular Minimap */}
          <Minimap />
        </div>
      </div>

      {/* ---------------- BOTTOM TOUCH CONTROLS & PEDALS ---------------- */}
      <div className="flex justify-between items-end gap-2 pointer-events-auto">
        {/* LEFT THUMB: ROUND STEERING BUTTONS, HORN & PASSENGER HAIL */}
        <div className="flex flex-col gap-2">
          {/* Passenger Hail & Horn Sub-bar */}
          <div className="flex items-center gap-1.5">
            {/* Horn Button */}
            <button
              onClick={handleHornClick}
              className="bg-[#F2C230] hover:bg-yellow-400 active:scale-95 border-2 border-[#26282B] shadow-[3px_3px_0px_#26282B] px-3 py-1.5 rounded-sm flex items-center gap-1 font-black text-xs text-[#26282B] transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>[H] ভেঁপু</span>
            </button>

            {/* Passenger Hail Button */}
            <button
              onClick={handlePassengerHail}
              className="bg-[#F6F1E4] hover:bg-stone-200 active:scale-95 border-2 border-[#26282B] shadow-[3px_3px_0px_#26282B] px-2.5 py-1.5 rounded-sm flex items-center gap-1 font-black text-xs text-[#1F6B3A] transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>[E] যাত্রী ডাক</span>
            </button>
          </div>

          {/* Steering Controls (Round Left & Right) */}
          <div className="flex items-center gap-2">
            <button
              {...bindControl('left')}
              title="Steer Left (A / Left Arrow)"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-stone-900/90 active:bg-amber-500 text-white border-2 border-yellow-400/80 shadow-[0_6px_12px_rgba(0,0,0,0.6)] active:scale-95 flex flex-col items-center justify-center font-black transition"
            >
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 text-yellow-300" />
              <span className="text-[9px] font-mono leading-none text-stone-300">বাম [A]</span>
            </button>

            <button
              {...bindControl('right')}
              title="Steer Right (D / Right Arrow)"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-stone-900/90 active:bg-amber-500 text-white border-2 border-yellow-400/80 shadow-[0_6px_12px_rgba(0,0,0,0.6)] active:scale-95 flex flex-col items-center justify-center font-black transition"
            >
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7 text-yellow-300" />
              <span className="text-[9px] font-mono leading-none text-stone-300">ডান [D]</span>
            </button>
          </div>
        </div>

        {/* RIGHT THUMB: BAPER RASTA PEDALS (চালান, ব্রেক, টান) */}
        <div className="flex items-end gap-2">
          {/* Boost / Turbo Pedal */}
          <button
            {...bindControl('boost')}
            title="Nitro Boost (Shift / Space)"
            className="w-12 h-14 md:w-14 md:h-16 bg-[#F2C230] text-[#26282B] active:bg-yellow-400 border-2 border-[#26282B] shadow-[3px_3px_0px_#26282B] active:scale-95 rounded-lg flex flex-col items-center justify-center font-black transition"
          >
            <Zap className="w-5 h-5 fill-[#26282B]" />
            <span className="text-[10px] font-black uppercase tracking-tight">টান</span>
          </button>

          {/* Brake / Reverse Pedal */}
          <button
            {...bindControl('backward')}
            title="Brake / Reverse (S / Down Arrow)"
            className="w-14 h-18 md:w-16 md:h-20 bg-[#B3372B] text-white active:bg-red-800 border-2 border-[#26282B] shadow-[3px_3px_0px_#26282B] active:scale-95 rounded-lg flex flex-col items-center justify-center font-black transition"
          >
            <ArrowDown className="w-6 h-6 text-red-200" />
            <span className="text-xs font-black uppercase tracking-wider">ব্রেক</span>
            <span className="text-[9px] font-mono text-red-200">[S]</span>
          </button>

          {/* Giant Gas Pedal (চালান) */}
          <button
            {...bindControl('forward')}
            title="Accelerate Gas (W / Up Arrow)"
            className="w-16 h-22 md:w-20 md:h-24 bg-[#1F6B3A] text-white active:bg-emerald-800 border-2 border-emerald-400 shadow-[4px_4px_0px_#26282B] active:scale-95 rounded-lg flex flex-col items-center justify-center font-black transition"
          >
            <ArrowUp className="w-8 h-8 text-emerald-200" />
            <span className="text-sm font-black uppercase tracking-widest text-emerald-100">
              চালান
            </span>
            <span className="text-[10px] font-mono text-emerald-200">[W]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
