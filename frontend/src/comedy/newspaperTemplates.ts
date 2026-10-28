import { WitnessComment } from '@shared/types';

export interface NewspaperStoryTemplate {
  category: string;
  headlinesBn: string[];
  headlinesEn: string[];
  subheadingsBn: string[];
  subheadingsEn: string[];
  leadArticlesBn: string[];
  leadArticlesEn: string[];
}

export const WITNESS_ARCHETYPES: WitnessComment[] = [
  {
    id: 'w_tea',
    nameBn: 'বদরুল মিয়া',
    nameEn: 'Badrul Mia',
    roleBn: 'আম্বরখানার প্রবীণ চা বিক্রেতা',
    roleEn: 'Veteran Tea Stall Owner',
    avatar: 'tea',
    commentBn: 'আমার কেটলির লাল চা ঠান্ডা হওয়ার আগেই এই মামা গাড়ি ঘুরাইয়া সুরমার পারে উধাও! এইরকম স্পিড আমি জীবনেও দেখি নাই রে বাজি!',
    commentEn: 'Before my kettle tea cooled down, this driver drifted past! Never seen such speed!',
  },
  {
    id: 'w_police',
    nameBn: 'সার্জেন্ট কফিল উদ্দিন',
    nameEn: 'Sergeant Kofil Uddin',
    roleBn: 'চৌহাট্টা পয়েন্ট ট্রাফিক পুলিশ',
    roleEn: 'Traffic Sergeant',
    avatar: 'police',
    commentBn: 'বাঁশি মারিয়া থামাইতে চাইছিলাম, কিন্তু পিছনের বাম্পারে "মায়ের দোয়া" লেখা দেইখা শ্রদ্ধায় স্যালুট মারিয়া দিছি!',
    commentEn: 'I stepped out to blow my whistle, but seeing "Mayer Dua" on the bumper, I saluted in respect!',
  },
  {
    id: 'w_walker',
    nameBn: 'ছালেহা বেগম',
    nameEn: 'Saleha Begum',
    roleBn: 'জিন্দাবাজারের প্রত্যক্ষদর্শী পথচারী',
    roleEn: 'Downtown Pedestrian',
    avatar: 'walker',
    commentBn: 'সিএনজির হর্নের চোটে আমার হাতর সবজির থলি ছিটকাইয়া মাটিতে পড়ল, তাও মামার টান দেখিয়া হাসতে হাসতে শেষ!',
    commentEn: 'The horn was so loud my shopping bag dropped, yet I could not stop laughing!',
  },
  {
    id: 'w_driver',
    nameBn: 'রফিক ড্রাইভার',
    nameEn: 'Rafiq Driver',
    roleBn: 'সিলেট সিএনজি ইউনিয়ন সভাপতি',
    roleEn: 'Local CNG Union Rep',
    avatar: 'driver',
    commentBn: 'ই পুয়ায় যেমনে খানাখন্দ আর সুরমা ব্রিজে সাইড মারল, তারে সরাসরি ফর্মুলা ওয়ানে পাঠানি দরকার!',
    commentEn: 'The way this lad jumped over potholes, he belongs in racing!',
  },
  {
    id: 'w_londoni',
    nameBn: 'হাজী তবারক আলী',
    nameEn: 'Haji Tobarok Ali',
    roleBn: 'লন্ডন ফেরত ভিআইপি যাত্রী',
    roleEn: 'London-returned VIP',
    avatar: 'londoni',
    commentBn: 'হিথরো এয়ারপোর্টেও এত ফাস্ট ট্যাক্সি পাই নাই রে বাজি! সিএনজির বডিতে ব্রিটিশ ইঞ্জিনিয়ারিং ডরিয়া কাঁপব!',
    commentEn: 'Never caught such a fast taxi at Heathrow airport! British engineering bows to this CNG!',
  },
  {
    id: 'w_reporter',
    nameBn: 'মাসুম রানা',
    nameEn: 'Masum Rana',
    roleBn: 'দৈনিক সুরমা এক্সপ্রেস স্টাফ রিপোর্টার',
    roleEn: 'Surma Express Staff Reporter',
    avatar: 'reporter',
    commentBn: 'সিলেট শহরের ইতিহাসে এই প্রথম কোনো সিএনজি জ্যাম কাটাইয়া ৫ মিনিট আগে গন্তব্যে নামাইয়া দিল!',
    commentEn: 'For the first time in Sylhet history, a CNG arrived 5 minutes ahead of schedule!',
  },
];

export const GENERAL_TEMPLATES: NewspaperStoryTemplate = {
  category: 'GENERAL',
  headlinesBn: [
    'সিলেটর সিএনজি মামার ঐতিহাসিক কেরামতি: খাঁচা ঘেরাও করার আগেই স্পিডে উধাও!',
    'জিন্দাবাজার পয়েন্টত সিএনজির তাণ্ডব: হর্নের চোটে পানর দোকানর বৈয়াম কাঁপল!',
    'মায়ের দোয়া সিএনজির রকেট টান: ট্রাফিক সার্জেন্ট কয় "ই পুয়ারে রোখা অসম্ভব!"',
    'চৌহাট্টা গোলচত্বরত ৩ চাকায় সাইকেল ব্যালেন্স: পথচারী কয় "সাবাস সিলেটর বাঘ!"',
    'সুরমা নদীর ক্বীন ব্রিজে সিএনজির ঝড়: লন্ডনী আত্মীয়রা কয় "মামা, ইউ আর কিং!"',
    'রাস্তার গর্তর উপর দিয়া উড়াল সিএনজি: রিকশা চালকর চোখ কপালে!',
    'ভাড়া যুদ্ধ শেষ: কিপটা চাচার পকেট থাকি ৫০ টেকা হাসিমুখে বাইর করলা মামা!',
    'সিলেটর রাজপথত সবুজ রকেট: গতি আর মায়ের দোয়ার খাঁটি সিলেটি মিলন!',
  ],
  headlinesEn: [
    'Sylheti CNG Driver\'s Historic Triumph: Vanished before crowd could block the road!',
    'Zindabazar Historical Turbo Run: Honking shakes betel leaf glass jars!',
    'Unbelievable Rocket Sprint by Mayer Dua CNG: Traffic Sergeant salutes in awe!',
    'Three-Wheel Stunt at Chowhatta Roundabout: Crowd cheers "Bravo Tiger of Sylhet!"',
    'Storm of Speed across Keane Bridge: London relatives cheer "Mama, You Are King!"',
    'Flying over Sylhet Potholes: Rickshaw pullers left speechless!',
    'Fare Battle Settled: Stingy uncle pays 50 Taka with a stunned smile!',
    'The Green Rocket of Sylhet: Authentic blend of speed and motherly prayers!',
  ],
  subheadingsBn: [
    'ভাড়া নিয়া কিপটা চাচার লগে ক্যাচাল শেষ, মুখে পান দিয়া মামার চওড়া হাসি!',
    'প্যাসেঞ্জার কয়: "জীবনে এত দোয়া আর সূরা কোনো দিন পড়ি নাই রে বাজি!"',
    'চা বিক্রেতা বদরুল মামা কয়: "ই সিএনজিরে অবিলম্বে জাতীয় রকেট ঘোষণা দেওন দরকার!"',
    'মায়ের দোয়া লগে আছিল বলিয়াই আস্ত হাড়গোড় নিয়া নিরাপদে অবতরণ!',
    'ঘণ্টায় ৮০ কিমি গতিতে টান: পথচারীরা কইল "বাপর রাস্তায় মামার রাজত্ব!"',
  ],
  subheadingsEn: [
    'Fare dispute settled with sweet paan and a broad Sylheti smile!',
    'Passenger admits: "Never recited so many emergency prayers in my entire life!"',
    'Tea stall uncle Badrul demands: "Declare this CNG an official national rocket!"',
    'Mother\'s blessing ensured a 100% collision-free miraculous landing!',
    'Cruising at 80 km/h: Pedestrians agree driver truly owns the road!',
  ],
  leadArticlesBn: [
    'আইজ দুপুরবেলা সিলেট শহরের ব্যস্ততম জিন্দাবাজার-চৌহাট্টা সড়কত এক তাজ্জব ঘটনা ঘটল! শত শত রিকশা, লেগুনা আর পথচারীর জ্যাম ঠেলিয়া বাপর মতোন হু হু করিয়া ছুটিয়া গেল সবুজ-হলুদ মায়ের দোয়া সিএনজি। ড্রাইভার মামার স্টিয়ারিং ধরা দেখিয়া মনে অইছিল কোনো ফর্মুলা ওয়ানর পাইলট বিমান লইয়া নামি গেছে! প্যাসেঞ্জার নামিয়া কয় "শরীরের লোম খাড়াইয়া গেছে, তয় মামারে ৫০ টেকা বকশিশ না দিলে পাপ অইব!"',
    'সিলেটের ঐতিহ্যবাহী ক্বীন ব্রিজর তলে আইজ নয়া এক ইতিহাস সৃষ্টি অইল! পিচ্ছিল পিচ রাস্তা আর খানাখন্দ তুড়ি মারিয়া উড়াইয়া নিপুণ কাটিং মারলা আমাদের মায়ের দোয়া ড্রাইভার মামা। স্থানীয় মুরব্বিরা জানাইলা, এমন ড্রাগ রেস তারা শেষবার বহু বছর আগে দেখছিল। এলাকার সব কয়টা চা স্টলে অহন এক কাপ লাল চা হাতে লইয়া সবাই মামার প্রশংসাত পঞ্চমুখ!',
  ],
  leadArticlesEn: [
    'A sensational driving spectacle unfolded today on the busiest arterial avenue of Sylhet. Weaving masterfully through hundreds of rickshaws and wandering street cows, the iconic green-and-yellow Mayer Dua CNG carved its own lane. Passengers landed with wide smiles and generous tips.',
    'Under the shadow of the historical Keane Bridge, a new street record was forged today. Gliding over craters and muddy monsoon puddles, the pilot executed high-speed maneuvers with supreme grace.',
  ],
};
