import { ComedyEventType } from '@shared/types';

interface HeadlineContext {
  eventType?: ComedyEventType;
  locationNameBn?: string;
  locationNameEn?: string;
  chaosScore?: number;
  fareTaka?: number;
  passengerNameBn?: string;
}

export function generateLiveBreakingHeadline(context: HeadlineContext = {}): { headlineBn: string; headlineEn: string } {
  const locBn = context.locationNameBn || 'সিলেট শহর';
  const locEn = context.locationNameEn || 'Sylhet City';

  const headlines: Array<{ bn: string; en: string }> = [
    {
      bn: `ব্রেকিং নিউজ: ${locBn} মোড়ত মায়ের দোয়া সিএনজির রকেট টান, ট্রাফিক সার্জেন্ট কয় "ই পুয়ারে রোখা অসম্ভব!"`,
      en: `BREAKING: Mayer Dua CNG rocket sprint at ${locEn}, traffic cop admits he cannot be stopped!`,
    },
    {
      bn: `তাজা খবর: ${locBn} জ্যামত ৩ চাকাত সাইকেল মারিয়া রিকশারে ওভারটেক মারলা মায়ের দোয়া ড্রাইভার মামা!`,
      en: `LATEST: Green CNG pulls high-speed 3-wheel overtake past rickshaws at ${locEn}!`,
    },
    {
      bn: `পাবলিক সংবাদ: সামান্য সাইড ঘষা খাইয়া ক্ষিপ্ত পাবলিক চিল্লায়: "পিটাইয়া চামড়া লাল করমু, সব নগরামি ছুডামু!"`,
      en: `MOB REPORT: Furious crowd hollers after minor scrape: "Will beat you red and purge your arrogance!"`,
    },
    {
      bn: `আম্বরখানা আপডেট: রাস্তাত হঠাৎ ভিআইপি খাসির আবির্ভাব, কষে ব্রেক মারিয়া বাঁচলা মামা!`,
      en: `AMBARKHANA UPDATE: VIP Eid goat steps into road, driver slams brakes in the nick of time!`,
    },
    {
      bn: `জরুরি খবর: জিন্দাবাজারত ৫০ টেকা ভাড়া লইয়া কিপটা চাচার লগে ক্যাচাল, বাদে মিষ্টি পান খাইয়া মীমাংসা!`,
      en: `SPECIAL REPORT: Heated 50 Taka fare dispute at Zindabazar resolved over sweet betel leaves!`,
    },
    {
      bn: `সতর্কবার্তা: সিএনজির পিছনোর "১০০ হাত দূরে থাকইন" লেখা দেখিয়া ট্রাক ড্রাইভারের কপালে ঘাম ছুটল!`,
      en: `NOTICE: Truck drivers retreat 100 yards after reading "Keep Distance" bumper script!`,
    },
    {
      bn: `আবহাওয়া বুলেটিন: সিলেটত হুট করি বৃষ্টি নামল, পলিথিনর পর্দা টানাইয়া টান মারলেন মামা!`,
      en: `WEATHER: Sudden Sylhet cloudburst, driver drops waterproof curtain and zooms off!`,
    },
    {
      bn: `বিশেষ প্রতিবেদন: মালনীছড়া চা বাগানের মোড়ত সাতকড়া লাল চা পানের বিরতি চাইলেন যাত্রী!`,
      en: `SPECIAL FEATURE: Passenger pleads for a quick Shatkora red tea stop at Malnicherra!`,
    },
    {
      bn: `সরাসরি খবর: ক্বীন ব্রিজর মুখে মুরগির খাঁচা অক্ষত ডেলিভারি করিয়া সুরমার পারত মামার চা বিলাস!`,
      en: `LIVE: Timely delivery of chicken crates near Keane Bridge, driver sips victory tea!`,
    },
    {
      bn: `কৌতুক সংবাদ: "মায়ের দোয়া লগে আছে কিন্তু ডানা নাই", ডরাইয়া কাঁপনধরা যাত্রীরে কইলা মামা!`,
      en: `HUMOR: "Mother's prayer is with us but wings aren't", driver consoles trembling passenger!`,
    },
    {
      bn: `চৌহাট্টা ডায়েরি: ফুলের দোকানত গুতা না মারিয়া নিখুঁত কাটিং, বাপর রাস্তায় মামার দাপট!`,
      en: `CHOWHATTA DIARY: Flawless drift past flower stalls, locals salute driver's kingly road rule!`,
    },
    {
      bn: `লন্ডনী বার্তা: হিথরো ফেরত লন্ডন প্রবাসী কয় "লন্ডনর ব্ল্যাক ক্যাবও এমন টান দিতে পারে না রে বাজি!"`,
      en: `GLOBAL NOTE: London tourist marvels: "Even London black cabs can't pull such wild speed!"`,
    },
  ];

  const chosen = headlines[Math.floor(Math.random() * headlines.length)];
  return {
    headlineBn: chosen.bn,
    headlineEn: chosen.en,
  };
}
