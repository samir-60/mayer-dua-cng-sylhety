import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { soundService } from '../services/sound.service';
import { X, Globe, Volume2, VolumeX, Keyboard } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, language, setLanguage } = useGameStore();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);

  if (!isSettingsModalOpen) return null;

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundService.setMute(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundService.setVolume(val / 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-stone-700 text-stone-100 max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden p-6 relative font-bangla">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
          <h2 className="text-xl font-black text-white">
            {language === 'bn' ? 'গেম সেটিংস ও অডিও' : 'SETTINGS & AUDIO'}
          </h2>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5 space-y-5">
          {/* Language Switch */}
          <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="font-bold text-sm text-white">
                  {language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}
                </div>
                <div className="text-xs text-stone-400">
                  {language === 'bn' ? 'বাংলা ও সিলেটি সংলাপ' : 'Bengali & English subtitles'}
                </div>
              </div>
            </div>

            <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-800 font-sans text-xs font-bold">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 rounded-lg transition ${
                  language === 'bn' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg transition ${
                  language === 'en' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-yellow-400" />}
                <div>
                  <div className="font-bold text-sm text-white">
                    {language === 'bn' ? 'সাউন্ড ও ইঞ্জিন আওয়াজ' : 'Audio & Engine SFX'}
                  </div>
                  <div className="text-xs text-stone-400">
                    {language === 'bn' ? '২-স্ট্রোক সিএনজি আওয়াজ ও হর্ন' : 'Procedural CNG Engine & Horns'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleMuteToggle}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  isMuted
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-stone-700 text-stone-200 border-stone-600 hover:bg-stone-600'
                }`}
              >
                {isMuted ? (language === 'bn' ? 'আনমিউট' : 'Unmute') : (language === 'bn' ? 'মিউট' : 'Mute')}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                disabled={isMuted}
                className="w-full accent-yellow-400 cursor-pointer"
              />
              <span className="text-xs font-mono text-stone-300 w-8">{isMuted ? 0 : volume}%</span>
            </div>
          </div>

          {/* Keyboard & Driving Controls Guide */}
          <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700">
            <div className="flex items-center gap-2 font-bold text-sm text-white mb-2">
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span>{language === 'bn' ? 'কন্ট্রোল গাইড (কী-বোর্ড)' : 'Driving Controls'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="font-bold text-yellow-400 font-mono">W / Up</span> : {language === 'bn' ? 'গ্যাস (Accelerate)' : 'Accelerate'}
              </div>
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="font-bold text-yellow-400 font-mono">S / Down</span> : {language === 'bn' ? 'ব্রেক / রিভার্স' : 'Brake / Reverse'}
              </div>
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="font-bold text-yellow-400 font-mono">A / D</span> : {language === 'bn' ? 'ডানে/বাঁয়ে স্টিয়ারিং' : 'Steer Left / Right'}
              </div>
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="font-bold text-yellow-400 font-mono">H</span> : {language === 'bn' ? 'সিলেটি পীপ-পীপ হর্ন!' : 'Pee-Pee Honk!'}
              </div>
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="font-bold text-yellow-400 font-mono">Shift / Space</span> : {language === 'bn' ? 'হ্যান্ডব্রেক ড্রিফট' : 'Handbrake Drift'}
              </div>
              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="font-bold text-yellow-400 font-mono">L</span> : {language === 'bn' ? 'হেডলাইট অন/অফ' : 'Headlights Toggle'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
