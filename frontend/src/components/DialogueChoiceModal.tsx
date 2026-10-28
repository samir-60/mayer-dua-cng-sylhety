import React, { useEffect } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { soundService } from '../services/sound.service';
import { comedyEventBus } from '../comedy/ComedyEventBus';
import { Coins, User } from 'lucide-react';

export const DialogueChoiceModal: React.FC = () => {
  const {
    isDialogueModalOpen,
    activeMission,
    language,
    setDialogueModalOpen,
    setPassengerPickedUp,
    addChaos,
  } = useGameStore();

  const dialogue = activeMission?.dialogue;

  // Speak passenger line in Sylheti as soon as the negotiation modal opens
  useEffect(() => {
    if (isDialogueModalOpen && dialogue) {
      soundService.speakSylheti(dialogue.initialTextBn, dialogue.speakerBn, true);
    }
  }, [isDialogueModalOpen, dialogue]);

  if (!isDialogueModalOpen || !activeMission || !dialogue) return null;

  const handleSelectChoice = (choice: any) => {
    soundService.playClick();
    if (choice.responseBn) {
      soundService.speakSylheti(choice.responseBn, dialogue.speakerBn, true);
    }
    addChaos(choice.chaosImpact || 10);
    setPassengerPickedUp(choice.takaImpact || activeMission.baseFareTaka);
    setDialogueModalOpen(false);
    comedyEventBus.emit('PASSENGER_PICKUP');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#26282B]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F6F1E4] border-3 border-[#26282B] text-[#26282B] max-w-xl w-full rounded-sm shadow-[6px_6px_0px_#26282B] overflow-hidden p-6 relative font-bangla">
        {/* Header with Passenger Avatar */}
        <div className="flex items-center gap-4 border-b-2 border-[#26282B] pb-4">
          <div className="w-14 h-14 rounded-sm bg-[#1F6B3A] border-2 border-[#26282B] flex items-center justify-center text-[#F6F1E4] shadow-[2px_2px_0px_#26282B]">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs uppercase font-black text-[#1F6B3A] tracking-wider">
              {language === 'bn' ? 'যাত্রী দর কষাকষি' : 'PASSENGER FARE NEGOTIATION'}
            </div>
            <h3 className="text-xl font-black text-[#26282B] font-bangla">
              {language === 'bn' ? dialogue.speakerBn : dialogue.speakerEn}
            </h3>
          </div>
        </div>

        {/* Initial Passenger Speech */}
        <div className="my-4 bg-white/70 p-4 rounded-sm border-2 border-[#26282B] shadow-[2px_2px_0px_#26282B]">
          <p className="text-base md:text-lg font-black text-[#B3372B] font-bangla leading-relaxed">
            "{dialogue.initialTextBn}"
          </p>
          <p className="text-xs text-[#26282B]/75 italic mt-1 font-sans">
            "{dialogue.initialTextEn}"
          </p>
        </div>

        {/* Dialogue Choices */}
        <div className="space-y-2.5 font-bangla">
          <div className="text-xs font-black text-[#26282B] uppercase tracking-wider mb-1">
            {language === 'bn' ? 'আপনার উত্তর নির্বাচন করুন:' : 'CHOOSE YOUR REPLY:'}
          </div>
          {dialogue.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleSelectChoice(choice)}
              className="w-full text-left bg-[#F6F1E4] hover:bg-[#F2C230]/40 border-2 border-[#26282B] p-3 rounded-sm transition shadow-[2px_2px_0px_#26282B] active:translate-x-0.5 active:translate-y-0.5 flex justify-between items-center group"
            >
              <div>
                <p className="text-sm md:text-base font-bold text-[#26282B] group-hover:text-[#1F6B3A]">
                  {choice.textBn}
                </p>
                <p className="text-xs text-[#26282B]/70 italic font-sans">
                  {choice.textEn}
                </p>
              </div>

              {/* Taka Impact Badge */}
              <div className="flex items-center gap-1.5 bg-[#1F6B3A] text-[#F6F1E4] px-2.5 py-1 rounded-sm text-xs font-black shrink-0 ml-3 border border-[#26282B]">
                <Coins className="w-3.5 h-3.5" />
                <span>৳ {choice.takaImpact}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
