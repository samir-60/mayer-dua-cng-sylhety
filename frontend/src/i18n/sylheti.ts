// Sylheti passenger lines (DRAFT, as noted in Master Build Prompt Part 10)
// Kept in one file for native Sylheti speaker review and editing.
// One array per situation. Never mix directly into general UI labels.

export interface SylhetiDialogueSet {
  pickup: { bn: string; en: string }[];
  fareTalk: { bn: string; en: string }[];
  midRideHappy: { bn: string; en: string }[];
  midRideBumpy: { bn: string; en: string }[];
  midRideLate: { bn: string; en: string }[];
  dropOff: { bn: string; en: string }[];
  dropOffHappy: { bn: string; en: string }[];
}

export const SYLHETI_PASSENGER_LINES: SylhetiDialogueSet = {
  pickup: [
    {
      bn: 'কিতা খবর ভাই, স্টেশনে যাইবাইন?',
      en: 'What is the news, brother, can you go to the station?',
    },
    {
      bn: 'আফনে কই যাইবাইন?',
      en: 'Where will you go?',
    },
    {
      bn: 'কিন ব্রিজ পার অইবা নি ভাই?',
      en: 'Will you cross Keane Bridge, brother?',
    },
    {
      bn: 'চা বাগানর দিকে যাইতায় পারবা নি?',
      en: 'Can you head up toward the tea hills?',
    },
  ],
  fareTalk: [
    {
      bn: 'কত লাগব?',
      en: 'How much will it cost?',
    },
    {
      bn: 'মিটার ঠিক আছে নি?',
      en: 'Is the meter working right?',
    },
    {
      bn: 'বেশি ডাকিও না ভাই, পরিচিত মানুষ!',
      en: 'Do not overcharge, brother, we are locals!',
    },
  ],
  midRideHappy: [
    {
      bn: 'বালা চালাইছইন।',
      en: 'You are driving well.',
    },
    {
      bn: 'রাস্তা ক্লিয়ার পাইছেন মাশাল্লাহ।',
      en: 'Got a clear road, mashallah.',
    },
    {
      bn: 'সিলেটের খাঁটি সিএনজি চালক বুঝা যায়!',
      en: 'A true Sylheti CNG driver, indeed!',
    },
  ],
  midRideBumpy: [
    {
      bn: 'আস্তে চালাইন, ব্যথা পাইতাছি!',
      en: 'Drive slowly, it hurts!',
    },
    {
      bn: 'গাড়ি কি ড্রেনও ফালাইবা নি?',
      en: 'Are you trying to drop the car into the drain?',
    },
    {
      bn: 'মাথা ছাদও বাড়ি খাইছে ভাই!',
      en: 'My head just hit the roof, brother!',
    },
  ],
  midRideLate: [
    {
      bn: 'জলদি করিও, দেরি অইয়া গেছে!',
      en: 'Hurry up, it is getting late!',
    },
    {
      bn: 'ট্রেন ছাড়ি দিব তো ভাই!',
      en: 'The train is going to leave, brother!',
    },
    {
      bn: 'একটু টান দেওন যায় না?',
      en: 'Can you not pull a bit faster?',
    },
  ],
  dropOff: [
    {
      bn: 'এইখানে থামাইন।',
      en: 'Stop here.',
    },
    {
      bn: 'বামে চাপাইয়া নামাইয়া দেন।',
      en: 'Pull to the left and drop me off.',
    },
  ],
  dropOffHappy: [
    {
      bn: 'হাইর দোয়া লাওক।',
      en: 'May you be blessed.',
    },
    {
      bn: 'ভাঙতি নাই ভাই, বাকিটা আপনের বখশিশ।',
      en: 'No small change, keep the rest as a tip.',
    },
    {
      bn: 'ভালা থাকিও ভাই, নিরাপদ সফর অইলো।',
      en: 'Stay well, brother, safe trip.',
    },
  ],
};
