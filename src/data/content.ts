export type CatId = "general"|"geography"|"history"|"science"|"sports"|"code"|"mental"|"puzzles"|"adab"|"health";

export interface Cat {
  id: CatId; label: string; labelEn: string; tag: string;
  intro: string; introEn: string;
  icon: string; hue: string;
  kind: "facts"|"timeline"|"quiz"|"code"|"memory"|"puzzles"|"health";
}

export interface Fact { icon: string; title: string; titleEn: string; body: string; bodyEn: string; }
export interface TL { year: string; era: string; eraEn: string; title: string; titleEn: string; body: string; bodyEn: string; }
export interface MCQ { q: string; qEn: string; opts: string[]; optsEn: string[]; ans: number; exp?: string; expEn?: string; topic?: string; }
export interface RawMCQ { q: string; qEn?: string; options?: string[]; opts?: string[]; optsEn?: string[]; answer?: number; ans?: number; exp?: string; expEn?: string; explain?: string; }
export interface Riddle { q: string; qEn: string; opts: string[]; optsEn: string[]; ans: number; }

export const CATS: Cat[] = [
  { id:"general", label:"معلومات عامة", labelEn:"General Knowledge", tag:"GENERAL", icon:"💡", hue:"#fbbf24", kind:"facts", intro:"١٠٠ سؤال في المعرفة العامة والحقائق الغريبة.", introEn:"100 general knowledge & trivia exam questions." },
  { id:"geography", label:"جغرافيا", labelEn:"Geography", tag:"GEO", icon:"🌍", hue:"#34d399", kind:"facts", intro:"١٠٦ أسئلة: عواصم، أنهار، جبال، ودول العالم.", introEn:"106 questions on capitals, rivers, peaks & countries." },
  { id:"history", label:"تاريخ", labelEn:"History", tag:"HISTORY", icon:"🏛️", hue:"#fb923c", kind:"timeline", intro:"٧٠٠٠ عام من الحضارة + ١٠١ سؤال في التاريخ.", introEn:"7,000 years of history + 101 history exam questions." },
  { id:"science", label:"علوم", labelEn:"Science", tag:"SCIENCE", icon:"🔬", hue:"#22d3ee", kind:"quiz", intro:"١٣٧ سؤال: فيزياء وكيمياء وأحياء وفلك.", introEn:"137 questions: Physics, chemistry, biology & astronomy." },
  { id:"sports", label:"رياضة", labelEn:"Sports", tag:"SPORTS", icon:"⚽", hue:"#fb7185", kind:"quiz", intro:"١٠٦ أسئلة: كرة قدم وأولمبياد وألعاب.", introEn:"106 sports questions across every game." },
  { id:"code", label:"برمجة", labelEn:"Coding", tag:"CODE", icon:"💻", hue:"#60a5fa", kind:"code", intro:"خريطة البداية + تحديات شيفرة.", introEn:"Beginner roadmap + code challenges." },
  { id:"mental", label:"قدرات عقلية", labelEn:"Brain Power", tag:"BRAIN", icon:"🧠", hue:"#a3e635", kind:"memory", intro:"لعبة ذاكرة + ١٠٠ سؤال قدرات عقلية.", introEn:"Memory game + 100 mental agility questions." },
  { id:"puzzles", label:"ألغاز", labelEn:"Puzzles", tag:"RIDDLES", icon:"🧩", hue:"#c084fc", kind:"puzzles", intro:"ألغاز ذكاء + ١٠٠ لغز اختيار من متعدد.", introEn:"Logic riddles + 100 puzzle questions." },
  { id:"adab", label:"الأدب", labelEn:"Literature", tag:"LIT", icon:"📖", hue:"#e05a7a", kind:"quiz", intro:"١٠٦ أسئلة: شعراء ومؤلفات وفنون.", introEn:"106 questions on poets, novels & art." },
  { id:"health", label:"صحتك", labelEn:"Health", tag:"HEALTH", icon:"❤️", hue:"#2dd4bf", kind:"health", intro:"فحص عاداتك + ١٠٠ سؤال في الصحة والإسعافات.", introEn:"Habits check + 100 health & first aid questions." },
];

export const FACTS: Record<string, Fact[]> = {
  general: [
    { icon:"🐙", title:"ثلاثة قلوب ودم أزرق", titleEn:"Three Hearts & Blue Blood", body:"الأخطبوط يمتلك ثلاثة قلوب، ودمه أزرق لأنه يعتمد على النحاس.", bodyEn:"The octopus has three hearts and blue blood — it uses copper instead of iron." },
    { icon:"🍯", title:"العسل لا يفسد أبدًا", titleEn:"Honey Never Spoils", body:"وجد علماء عسلًا فرعونيًا عمره ٣٠٠٠ عام… وما زال صالحًا للأكل!", bodyEn:"Archaeologists found 3,000-year-old honey in Egyptian tombs — still edible!" },
    { icon:"⚡", title:"١٠٠ صاعقة كل ثانية", titleEn:"100 Strikes Per Second", body:"تضرب الصواعق سطح الأرض نحو ١٠٠ مرة في الثانية.", bodyEn:"Lightning strikes Earth about 100 times every second." },
    { icon:"🍌", title:"الموز توت… والفراولة ليست", titleEn:"Bananas Are Berries", body:"نباتيًا، الموز والبطيخ «توت حقيقي» بينما الفراولة ليست!", bodyEn:"Botanically bananas are true berries, but strawberries aren't!" },
    { icon:"❤️", title:"١٠٠ ألف نبضة يوميًا", titleEn:"100,000 Beats Daily", body:"قلبك ينبض ١٠٠ ألف مرة يوميًا ويضخ ٧٥٠٠ لتر دم.", bodyEn:"Your heart beats 100K times daily, pumping 7,500 liters of blood." },
    { icon:"🧬", title:"٣٧ تريليون خلية", titleEn:"37 Trillion Cells", body:"جسمك مكوّن من ٣٧ تريليون خلية تحمل كل منها حمضك النووي.", bodyEn:"Your body is made of 37 trillion cells, each carrying your full DNA." },
  ],
  geography: [
    { icon:"🌊", title:"النيل… شريان الحياة", titleEn:"The Nile — Lifeline", body:"أطول أنهار العالم بطول ٦٦٥٠ كم، يعبر ١١ دولة.", bodyEn:"World's longest river at 6,650 km, crossing 11 countries." },
    { icon:"🏜️", title:"الصحراء الكبرى", titleEn:"The Great Sahara", body:"أكبر صحراء حارة: ٩.٢ مليون كم² — أكبر من أستراليا!", bodyEn:"Largest hot desert: 9.2M km² — bigger than Australia!" },
    { icon:"🗻", title:"قمة إفرست", titleEn:"Mount Everest", body:"أعلى نقطة على الأرض: ٨٨٤٩ مترًا.", bodyEn:"Highest point on Earth at 8,849 meters." },
    { icon:"🕐", title:"روسيا عبر ١١ توقيتًا", titleEn:"Russia: 11 Time Zones", body:"أكبر دول العالم مساحةً، تمتد عبر ١١ منطقة زمنية.", bodyEn:"World's largest country, spanning 11 time zones." },
    { icon:"💧", title:"بايكال: خزان الأرض", titleEn:"Baikal: Earth's Tank", body:"أعمق بحيرة تحتوي ٢٠٪ من المياه العذبة السطحية.", bodyEn:"Deepest lake holding 20% of the world's surface fresh water." },
    { icon:"🌉", title:"مصر… قارتان", titleEn:"Egypt — Two Continents", body:"معظمها في إفريقيا وسيناء في آسيا — دولة عابرة للقارات.", bodyEn:"Most in Africa, Sinai in Asia — a transcontinental country." },
  ],
};

export const TIMELINE: TL[] = [
  { year:"٣١٠٠ ق.م", era:"الفراعنة", eraEn:"Pharaohs", title:"توحيد القطرين", titleEn:"Unification of Egypt", body:"الملك مينا يوحّد مصر العليا والسفلى.", bodyEn:"King Menes unifies Upper and Lower Egypt." },
  { year:"٢٥٦٠ ق.م", era:"الفراعنة", eraEn:"Pharaohs", title:"الهرم الأكبر", titleEn:"Great Pyramid", body:"أعجوبة الدنيا الوحيدة الباقية.", bodyEn:"The only surviving ancient wonder of the world." },
  { year:"١٢٧٤ ق.م", era:"الفراعنة", eraEn:"Pharaohs", title:"معركة قادش", titleEn:"Battle of Kadesh", body:"أقدم معاهدة سلام مكتوبة في التاريخ.", bodyEn:"The oldest known written peace treaty in history." },
  { year:"٣٣٢ ق.م", era:"البطالمة", eraEn:"Ptolemaic", title:"تأسيس الإسكندرية", titleEn:"Alexandria Founded", body:"الإسكندر الأكبر يبني عاصمة العلم القديم.", bodyEn:"Alexander the Great builds the capital of ancient knowledge." },
  { year:"٣٠ ق.م", era:"البطالمة", eraEn:"Ptolemaic", title:"نهاية كليوباترا", titleEn:"End of Cleopatra", body:"مصر تصبح ولاية رومانية.", bodyEn:"Egypt becomes a Roman province." },
  { year:"٦٤١ م", era:"الإسلامي", eraEn:"Islamic", title:"الفتح الإسلامي", titleEn:"Islamic Conquest", body:"عمرو بن العاص يؤسس الفسطاط.", bodyEn:"Amr ibn al-As founds Fustat." },
  { year:"٩٦٩ م", era:"الإسلامي", eraEn:"Islamic", title:"تأسيس القاهرة", titleEn:"Cairo Founded", body:"جوهر الصقلي يبني القاهرة ويبدأ بناء الأزهر.", bodyEn:"Jawhar al-Siqilli builds Cairo and begins Al-Azhar." },
  { year:"١٨٦٩", era:"الحديث", eraEn:"Modern", title:"قناة السويس", titleEn:"Suez Canal", body:"افتتاح القناة التي غيّرت خريطة التجارة العالمية.", bodyEn:"The canal that changed the world trade map opens." },
  { year:"١٩٢٢", era:"الحديث", eraEn:"Modern", title:"الاستقلال", titleEn:"Independence", body:"مصر تصبح مملكة مستقلة.", bodyEn:"Egypt becomes an independent kingdom." },
  { year:"١٩٧١", era:"الحديث", eraEn:"Modern", title:"السد العالي", titleEn:"Aswan High Dam", body:"أكبر مشروع هندسي في تاريخ مصر الحديث.", bodyEn:"Largest engineering project in modern Egyptian history." },
];

import { ALL_QUIZZES } from "./allQuestions";

export const QUIZZES: Record<string, MCQ[]> = ALL_QUIZZES;

export const CODE_CHALLENGES = [
  { title:"جمع أم دمج؟", titleEn:"Add or Concat?", lang:"JavaScript", code:'console.log(2 + "2");', opts:['"22"',"4","22","Error"], optsEn:['"22"',"4","22","Error"], ans:0, exp:"JavaScript يحوّل الرقم إلى نص ويدمجهما.", expEn:"JS converts the number to a string and concatenates." },
  { title:"عدّاد بايثون", titleEn:"Python Counter", lang:"Python", code:"for i in range(3):\n  print(i)", opts:["0 1 2","1 2 3","0 1 2 3","3"], optsEn:["0 1 2","1 2 3","0 1 2 3","3"], ans:0, exp:"range(3) تبدأ من صفر وتتوقف قبل 3.", expEn:"range(3) starts at 0 and stops before 3." },
  { title:"طول النص", titleEn:"String Length", lang:"Python", code:'print(len("Hello"))', opts:["5","6","4","10"], optsEn:["5","6","4","10"], ans:0, exp:"len() تحسب عدد الحروف.", expEn:"len() counts characters." },
  { title:"الفخ التاريخي", titleEn:"The Historic Bug", lang:"JavaScript", code:"console.log(typeof null);", opts:['"object"','"null"','"undefined"','"boolean"'], optsEn:['"object"','"null"','"undefined"','"boolean"'], ans:0, exp:"أشهر خطأ لم يُصلح في JS!", expEn:"The most famous unfixed JS bug!" },
];

export const RIDDLES: Riddle[] = [
  { q:"شيء هو لك لكن الناس يستخدمونه أكثر منك.", qEn:"Something that's yours but others use it more.", opts:["اسمك","عمرك","هاتفك","مفتاحك"], optsEn:["Your name","Your age","Your phone","Your key"], ans:0 },
  { q:"شيء يصعد دائمًا ولا ينزل أبدًا.", qEn:"Something that always goes up, never comes down.", opts:["الدخان","العمر","السهم","البخار"], optsEn:["Smoke","Your age","Arrow","Steam"], ans:1 },
  { q:"ما الشهر الذي فيه ٢٨ يومًا؟", qEn:"Which month has 28 days?", opts:["فبراير فقط","كل الشهور","ديسمبر","لا يوجد"], optsEn:["February only","All of them","December","None"], ans:1 },
  { q:"لي مدنٌ بلا سكان وأنهار بلا ماء.", qEn:"I have cities but no people, rivers but no water.", opts:["الحلم","التاريخ","الخريطة","الصحراء"], optsEn:["A dream","History","A map","The desert"], ans:2 },
  { q:"كلما جفّفت أكثر… ابتللت أكثر.", qEn:"The more I dry, the wetter I get.", opts:["الشمع","الصابون","المنشفة","الثلج"], optsEn:["Wax","Soap","Towel","Ice"], ans:2 },
  { q:"شيء ينكسر دون أن يلمسه أحد.", qEn:"Something that breaks without being touched.", opts:["الزجاج","القلب","الصمت","الوعد"], optsEn:["Glass","Heart","Silence","A promise"], ans:3 },
];

export const MEMORY_EMOJIS = ["🧠","⚡","🔬","📚","🌍","🎯","🧩","💡"];

export const HEALTH_Q = [
  { q:"هل تنام أقل من ٧ ساعات؟", qEn:"Do you sleep less than 7 hours?" },
  { q:"هل تقضي أكثر من ٤ ساعات على الشاشة؟", qEn:"More than 4 hrs of screen time?" },
  { q:"هل تفوّت الفطور كثيرًا؟", qEn:"Do you often skip breakfast?" },
  { q:"هل تشرب أقل من ٦ أكواب ماء؟", qEn:"Fewer than 6 glasses of water?" },
  { q:"هل نادرًا ما تمارس رياضة؟", qEn:"Rarely exercise?" },
  { q:"هل تشعر بتوتر شديد قبل الامتحانات؟", qEn:"Strong anxiety before exams?" },
  { q:"هل تشرب مشروبات غازية بكثرة؟", qEn:"Drink lots of soda?" },
  { q:"هل تجلس ساعتين+ دون حركة؟", qEn:"Sit 2+ hrs without moving?" },
  { q:"هل تسهر على الهاتف رغم النعاس؟", qEn:"Stay up on phone despite sleepiness?" },
  { q:"هل تعتمد على الوجبات السريعة؟", qEn:"Rely on fast food?" },
];

export const SPARKS = [
  { ar:"الفكرة مثل الشرارة: إن لم تسجّلها لحظة ولادتها اختفت.", en:"An idea is like a spark — catch it the moment it's born, or it's gone." },
  { ar:"اسأل كثيرًا… الأسئلة مفاتيح المعرفة.", en:"Ask often — questions are the keys to knowledge." },
  { ar:"علّم غيرك ما تعلمته اليوم.", en:"Teach others what you learned today." },
  { ar:"دقيقة تفكير هادئ أفضل من ساعة حفظ.", en:"One quiet minute of thinking beats an hour of memorizing." },
  { ar:"كل خبير كان يومًا مبتدئًا رفض أن يتوقف.", en:"Every expert was once a beginner who refused to quit." },
];
