import { GeneratedNewspaper, WitnessComment } from '@shared/types';
import { WITNESS_ARCHETYPES, GENERAL_TEMPLATES } from './newspaperTemplates';

interface LocalGenerateInput {
  missionId: string;
  missionTitleBn: string;
  missionTitleEn: string;
  locationBn: string;
  locationEn: string;
  timeElapsedSeconds: number;
  chaosScore: number;
  damagePercent: number;
  fareTaka: number;
  rewardTaka: number;
  hornsHonked: number;
  gimmick?: string | null;
  passengerNameBn: string;
  screenshotUrl?: string;
}

export function generateOfflineNewspaper(input: LocalGenerateInput): GeneratedNewspaper {
  const isGoat = input.gimmick === 'VIP_GOAT';
  const isChicken = input.gimmick === 'CHICKEN_DELIVERY';
  const isChaos = input.chaosScore >= 50;

  let headlineBn = '';
  let headlineEn = '';
  let subheadingBn = '';
  let subheadingEn = '';
  let leadArticleBn = '';
  let leadArticleEn = '';

  if (isGoat) {
    headlineBn = isChaos
      ? 'আম্বরখানার ভিআইপি খাসি সিএনজির ছাদে উইঠা ডান্স, হতবাক টিলাগড়বাসী!'
      : 'লন্ডনী খাসির রাজকীয় সফর: এসি না পাইয়াও শান্তিতে টিলাগড় পৌঁছল!';
    headlineEn = isChaos
      ? 'VIP Eid Goat dances on CNG roof, Tilagor locals stunned in disbelief!'
      : 'Londoni Goat\'s Royal Ride: Arrives safely in Tilagor without AC!';
    subheadingBn = 'মামা কয়: "মায়ের দোয়া আছে, লাখ টাকার খাসির কোনো ক্ষতি হইতো নায়!"';
    subheadingEn = 'Driver claims: "Mother\'s blessing protects the 1-Lakh Taka goat!"';
    leadArticleBn = `আজ দুপুরে আম্বরখানা পয়েন্ট থেকে টিলাগড় যাওয়ার পথে এক সবুজ-হলুদ সিএনজি অটোরিকশায় নজিরবিহীন দৃশ্য দেখা গেছে। লাখ টাকার ভিআইপি খাসি নিয়ে ড্রাইভার মামা এমন নিপুণ গতিতে মোড় নিলেন যে ট্রাফিক পুলিশ বাঁশি ফেলার জায়গা পায়নি। খাসিটি নির্বিঘ্নে পৌঁছালেও তার চোখে ছিল ড্রাগন রেসের রোমাঞ্চ!`;
    leadArticleEn = `A sensational scene unfolded this afternoon on the Ambarkhana-Tilagor road as a green CNG carried a 1-Lakh Taka VIP Eid goat at breakneck speeds. Traffic police dropped their whistles as the 3-wheeler drifted around roundabouts. The goat arrived safely with legendary adrenaline.`;
  } else if (isChicken) {
    headlineBn = 'বন্দরবাজারের মুরগি এক্সপ্রেস: রোস্ট রান্ধার আগেই কিন ব্রিজে অবতরণ!';
    headlineEn = 'Bandar Bazar Chicken Express: Landed near Keane Bridge before feast started!';
    subheadingBn = 'বাবুর্চি আলাউদ্দিন কয়: "এই সিএনজি না থাকলে বিয়া ভাইঙ্গা যাইত রে বাজি!"';
    subheadingEn = 'Chef Alauddin proclaims: "Without this CNG, the wedding was ruined!"';
    leadArticleBn = `বিয়ের আসরে মুরগির আকাল দেখা দিলে জরুরি ভিত্তিতে ডাক পড়ে মায়ের দোয়া সিএনজির। বন্দরবাজার পাইকারি আড়ত থেকে খাঁচা বোঝাই তাজা দেশি মুরগি নিয়ে পাইলট মামা যেভাবে রাস্তা পরিষ্কার করলেন, তাতে সুরমা পাড়ের বাবুর্চি দল এক বাক্যে চালকের শ্রেষ্ঠত্ব স্বীকার করেছেন।`;
    leadArticleEn = `When a high-profile wedding faced a chicken crisis, Mayer Dua CNG answered the call. Navigating tight alleys at lightning speed, live chickens arrived just in time for the grand banquet.`;
  } else {
    const hIndex = Math.floor(Math.random() * GENERAL_TEMPLATES.headlinesBn.length);
    headlineBn = GENERAL_TEMPLATES.headlinesBn[hIndex];
    headlineEn = GENERAL_TEMPLATES.headlinesEn[hIndex];

    const sIndex = Math.floor(Math.random() * GENERAL_TEMPLATES.subheadingsBn.length);
    subheadingBn = GENERAL_TEMPLATES.subheadingsBn[sIndex];
    subheadingEn = GENERAL_TEMPLATES.subheadingsEn[sIndex];

    const aIndex = Math.floor(Math.random() * GENERAL_TEMPLATES.leadArticlesBn.length);
    leadArticleBn = GENERAL_TEMPLATES.leadArticlesBn[aIndex];
    leadArticleEn = GENERAL_TEMPLATES.leadArticlesEn[aIndex];
  }

  // Pick 3 random witness archetypes
  const shuffledWitnesses = [...WITNESS_ARCHETYPES].sort(() => 0.5 - Math.random());
  const witnesses: WitnessComment[] = shuffledWitnesses.slice(0, 3);

  const editionNo = Math.floor(Math.random() * 899) + 101;
  const priceTagBn = 'মূল্য: মাত্র ২ কাপ লাল চা (বা মিষ্টি পান)';
  const priceTagEn = 'Price: 2 Cups Red Tea (or Sweet Paan)';

  return {
    id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    editionNo,
    dateStrBn: '১২ কার্তিক, ১৪৩১ বঙ্গাব্দ | সিলেট বিশেষ সংস্করণ',
    dateStrEn: 'Sylhet Special Edition | Satirical Daily',
    priceTagBn,
    priceTagEn,
    headlineBn,
    headlineEn,
    subheadingBn,
    subheadingEn,
    leadArticleBn,
    leadArticleEn,
    incidentLocationBn: input.locationBn,
    incidentLocationEn: input.locationEn,
    chaosRatingBn: isChaos ? 'চরম বিনোদন (১০০% ক্যাওয়াস)' : 'পরিমিত গতি ও দোয়া',
    takaEarned: input.rewardTaka,
    witnesses,
    imageUrl: input.screenshotUrl,
    stats: {
      timeSeconds: input.timeElapsedSeconds,
      topSpeedKmh: Math.floor(65 + Math.random() * 25),
      hornsHonked: Math.max(input.hornsHonked, Math.floor(input.timeElapsedSeconds / 3)),
      nearMisses: Math.floor(input.chaosScore / 20),
      chaosLevel: input.chaosScore,
    },
  };
}
