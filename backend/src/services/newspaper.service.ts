import { GeneratedNewspaper, WitnessComment } from '../../../shared/types';
import { v4 as uuidv4 } from 'uuid';

interface NewspaperGenerationInput {
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
}

export function generateSatiricalNewspaper(input: NewspaperGenerationInput): GeneratedNewspaper {
  const isHighChaos = input.chaosScore >= 60;
  const isSpeedDemon = input.timeElapsedSeconds < 45;
  const isGoatMission = input.gimmick === 'VIP_GOAT';
  const isChickenMission = input.gimmick === 'CHICKEN_DELIVERY';

  let headlineBn = '';
  let headlineEn = '';
  let subheadingBn = '';
  let subheadingEn = '';
  let leadArticleBn = '';
  let leadArticleEn = '';

  if (isGoatMission) {
    if (isHighChaos) {
      headlineBn = 'আম্বরখানার ভিআইপি খাসি সিএনজির ছাদে উইঠা ডান্স, হতবাক টিলাগড়বাসী!';
      headlineEn = 'VIP Eid Goat dances on CNG roof, Tilagor locals stunned in disbelief!';
      subheadingBn = 'মামা কয়: "দোয়া আছে, খাসির কিছু হইতো নায়!"; খাসি কয়: "ম্যাআআআ!"';
      subheadingEn = 'Driver claims: "Mother\'s blessing protects the goat!"; Goat bleats in agreement.';
      leadArticleBn = `আজ দুপুরে আম্বরখানা থেকে টিলাগড় যাওয়ার পথে এক সবুজ সিএনজি অটোরিকশায় নজিরবিহীন চাঞ্চল্য দেখা গেছে। লাখ টাকার ভিআইপি খাসি নিয়ে ড্রাইভার মামা এমন ড্রাগ রেস শুরু করেন যে রাস্তার ট্রাফিক পুলিশ বাঁশি ফেলার জায়গা পায় নাই। খাসিটি নিরাপদে পৌঁছালেও তার চোখে ছিল ড্রাগন রেসের উত্তেজনা। প্রত্যক্ষদর্শীরা জানান, সিএনজির গতি দেখে সুরমা নদীর মাছও পানিতে ডুব দিছে!`;
      leadArticleEn = `A sensational scene unfolded this afternoon on the Ambarkhana-Tilagor road as a green CNG carried a 1-Lakh Taka VIP Eid goat at breakneck speeds. Traffic police dropped their whistles as the 3-wheeler drifted around roundabouts. The goat arrived safely with legendary adrenaline.`;
    } else {
      headlineBn = 'লন্ডনী খাসির রাজকীয় সফর: এসি না পাইয়াও শান্তিতে টিলাগড় পৌঁছল!';
      headlineEn = 'Londoni Goat\'s Royal Journey: Arrives in Tilagor despite lacking AC!';
      subheadingBn = 'সিএনজি চালক মামারে ৫০ টাকা বকশিশ দিয়া খাসির মালিকের সেলফি!';
      subheadingEn = 'Grateful goat owner awards 50 Taka tip and snaps selfie with the pilot!';
      leadArticleBn = `সিলেটের রাস্তায় শৃঙ্খলা ফিরিয়ে আনলেন মায়ের দোয়া সিএনজির বীর চালক। ভিআইপি লাল খাসিকে এক চুল পরিমাণ ঝাঁকুনি না দিয়ে নিপুণ দক্ষতায় গন্তব্যে পৌঁছে দিয়ে তিনি প্রমাণ করেছেন—সিলেটি চালকের হাত স্টিয়ারিংয়ে থাকলে কোনো টেনশন নাই।`;
      leadArticleEn = `A masterclass in auto-rickshaw suspension management! The driver transported the VIP prize goat with surgical smoothness, proving Sylheti drivers rule the streets.`;
    }
  } else if (isChickenMission) {
    headlineBn = 'বন্দরবাজারের মুরগি এক্সপ্রেস: রোস্ট রান্ধার আগেই কিন ব্রিজে অবতরণ!';
    headlineEn = 'Bandar Bazar Chicken Express: Landed near Keane Bridge before feast started!';
    subheadingBn = 'বাবুর্চি আলাউদ্দিন কয়: "এই সিএনজি না থাকলে বিয়া ভাইঙ্গা যাইত রে বাজি!"';
    subheadingEn = 'Chef Alauddin proclaims: "Without this CNG, the wedding was ruined!"';
    leadArticleBn = `বিয়ের আসরে মুরগির আকাল দেখা দিলে জরুরি ভিত্তিতে ডাক পড়ে মায়ের দোয়া সিএনজির। বন্দরবাজার পাইকারি আড়ত থেকে খাঁচা বোঝাই তাজা দেশি মুরগি নিয়ে পাইলট মামা যেভাবে মোড় নিলেন, তাতে রাস্তার কুকুর-বিড়ালও সাইড দিতে বাধ্য হয়েছে। মুরগির পালক কিছুটা বাতাসে উড়লেও একটি মুরগিও অক্ষত অবস্থায় বাবুর্চির ডেকচিতে প্রবেশ করেছে।`;
    leadArticleEn = `When a high-profile wedding faced a chicken crisis, Mayer Dua CNG answered the call. Navigating tight alleys at lightning speed, live chickens arrived just in time for the grand banquet.`;
  } else if (isHighChaos) {
    headlineBn = 'জিন্দাবাজারে সিএনজির ঐতিহাসিক তাণ্ডব: হর্নের চোটে চা স্টলের বিস্কুট জার কাঁপল!';
    headlineEn = 'Zindabazar Historical Turbo Run: Honking shakes tea stall biscuit jars!';
    subheadingBn = 'প্যাসেঞ্জার আবুল চাচা কয়: "৩০ টেকার ভাড়ায় জীবনে এত দোয়া দরুদ পড়ি নাই!"';
    subheadingEn = 'Passenger Abul Chacha confesses: "Never recited so many prayers for 30 Taka!"';
    leadArticleBn = `জিন্দাবাজার থেকে চৌহাট্টা যাওয়ার পথে রেকর্ড সৃষ্টি করলেন সিলেটি সিএনজি মামা। রাস্তায় গর্ত, রিকশার ভিড় আর পথচারীর ভিড় ঠেলে তিনি মাত্র কয়েক মিনিটে চৌহাট্টা মোড়ে গাড়ি থামান। প্রত্যক্ষদর্শীদের মতে, গাড়ির পেছনের "১০০ হাত দূরে থাকুন" লেখাটি দেখে স্বয়ং ট্রাফিক সার্জেন্টও দূরে সরে দাঁড়িয়েছিলেন।`;
    leadArticleEn = `A new land speed record was set between Zindabazar and Chowhatta today. Weaving through dense rickshaws and road craters, the driver showcased supernatural reflexes.`;
  } else {
    headlineBn = 'সিলেটর সিএনজি মামার ঐতিহাসিক সাফল্য: যাত্রী গন্তব্যত পৌঁছাইয়া অবাক!';
    headlineEn = 'Sylheti CNG Driver\'s Historic Triumph: Passenger arrives amazed and unscathed!';
    subheadingBn = 'ভাড়া নিয়া তর্ক শেষ, চাচার চোখে মুখে স্বস্তির হাসি!';
    subheadingEn = 'Fare disputes resolved with a warm cup of Sylheti red tea!';
    leadArticleBn = `আজ জিন্দাবাজার-চৌহাট্টা রুটে এক অনন্য দৃষ্টান্ত স্থাপিত হলো। সাধারণত যেখানে ভাড়া নিয়ে ঘণ্টার পর ঘণ্টা বাহাস চলে, সেখানে মায়ের দোয়া সিএনজির চালক হাসিমুখে মাত্র ৫০ টাকায় যাত্রীকে গন্তব্যে পৌঁছে দেন। এলাকার মুরুব্বিরা চালকের এই সেবাকে জাতীয় পদক দেওয়ার দাবি জানিয়েছেন।`;
    leadArticleEn = `A heartwarming story from Sylhet downtown. Overcoming traditional fare negotiations, the driver delivered his passenger promptly with pure Sylheti hospitality.`;
  }

  const witnessPool: WitnessComment[] = [
    {
      id: 'w1',
      nameBn: 'বদরুল মিয়া',
      nameEn: 'Badrul Mia',
      roleBn: 'আম্বরখানার প্রবীণ চা বিক্রেতা',
      roleEn: 'Veteran Tea Stall Owner',
      avatar: '☕',
      commentBn: 'আমার কেটলির চা ঠান্ডা হওয়ার আগেই এই মামা গাড়ি ঘুরাইয়া চইলা গেল! এইরকম টান আমি জীবনে দেখি নাই!',
      commentEn: 'Before my kettle tea cooled down, this Mama drifted past! Never seen such speed!',
    },
    {
      id: 'w2',
      nameBn: 'সার্জেন্ট কফিল উদ্দিন',
      nameEn: 'Sergeant Kofil Uddin',
      roleBn: 'চৌহাট্টা পয়েন্ট ট্রাফিক পুলিশ',
      roleEn: 'Traffic Sergeant',
      avatar: '👮🏽‍♂️',
      commentBn: 'মামারে থামাইতে গেছিলাম, কিন্তু পিছনের "মায়ের দোয়া" লেখা দেইখা শ্রদ্ধায় স্যালুট দিয়া দিছি!',
      commentEn: 'I stepped out to blow my whistle, but seeing "Mayer Dua" on the bumper, I saluted in respect!',
    },
    {
      id: 'w3',
      nameBn: 'ছালেহা বেগম',
      nameEn: 'Saleha Begum',
      roleBn: 'জিন্দাবাজারের প্রত্যক্ষদর্শী পথচারী',
      roleEn: 'Downtown Pedestrian',
      avatar: '👵🏽',
      commentBn: 'সিএনজির হর্নের আওয়াজে আমার হাতের কাঁচাবাজারের থলি মাটিতে পইড়া গেছিল, তাও হাসতে হাসতে শেষ!',
      commentEn: 'The horn was so loud my shopping bag dropped, yet I couldn\'t stop laughing!',
    },
    {
      id: 'w4',
      nameBn: 'রফিক ড্রাইভার',
      nameEn: 'Rafiq Driver',
      roleBn: 'অন্য সিএনজির সভাপতি',
      roleEn: 'Local CNG Union Rep',
      avatar: '🛺',
      commentBn: 'ই পুয়ায় যেভাবে গর্ত ড্রাগ কইরা পার হইছে, তারে ফর্মুলা ওয়ান রেসিংয়ে পাঠানো দরকার!',
      commentEn: 'The way this lad jumped over potholes, he belongs in Formula One!',
    },
  ];

  // Pick 3 distinct witnesses
  const witnesses = witnessPool.slice(0, 3);

  const editionNo = Math.floor(Math.random() * 899) + 101;
  const priceTagBn = 'মূল্য: মাত্র ২ কাপ লাল চা (বা মিষ্টি পান)';
  const priceTagEn = 'Price: 2 Cups Red Tea (or Sweet Paan)';

  return {
    id: uuidv4(),
    editionNo,
    dateStrBn: '১২ কার্তিক, ১৪৩১ বঙ্গাব্দ | সিলেট সংস্করণ',
    dateStrEn: 'Sylhet Special Edition | Daily Satire',
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
    chaosRatingBn: isHighChaos ? 'চরম বিনোদন (১০০% ক্যাওয়াস)' : 'পরিমিত গতি ও দোয়া',
    takaEarned: input.rewardTaka,
    witnesses,
    stats: {
      timeSeconds: input.timeElapsedSeconds,
      topSpeedKmh: Math.floor(65 + Math.random() * 25),
      hornsHonked: Math.max(input.hornsHonked, Math.floor(input.timeElapsedSeconds / 4)),
      nearMisses: Math.floor(input.chaosScore / 18),
      chaosLevel: input.chaosScore,
    },
  };
}
