import { SPORTS_Q } from "./banks/sports";
import { SCIEX_Q } from "./banks/science-exam";
import { PUZZLES_Q } from "./banks/puzzles-exam";
import { MENTAL_Q } from "./banks/mental-exam";
import { ADAB_QUESTIONS } from "./banks/literature";
import { HISTORY_Q } from "./banks/history-exam";
import { HEALTH_Q as HEALTH_EXAM_Q } from "./banks/health-exam";
import { GENERAL_Q } from "./banks/general-exam";
import { GEO_Q } from "./banks/worldbank";
import { CODE_Q } from "./banks/code-exam";
import type { MCQ } from "./content";

function normalize(raw: any): MCQ {
  const opts = raw.opts || raw.options || [];
  let ans = typeof raw.ans === 'number' ? raw.ans : (typeof raw.answer === 'number' ? raw.answer : 0);
  if (ans < 0 || ans > 3 || isNaN(ans)) ans = 0;
  const exp = raw.exp || raw.explain || "";
  return {
    q: raw.q || "",
    qEn: raw.qEn || raw.q || "",
    opts: opts,
    optsEn: raw.optsEn || opts,
    ans: ans,
    exp: exp,
    expEn: raw.expEn || exp,
  };
}

const INLINE_BASE: Record<string, MCQ[]> = {
  science: [
    { q:"ما وحدة قياس القوة؟", qEn:"Unit of force?", opts:["نيوتن","جول","واط","أمبير"], optsEn:["Newton","Joule","Watt","Ampere"], ans:0 },
    { q:"ما سرعة الضوء تقريبًا؟", qEn:"Speed of light?", opts:["٣٠٠ ألف كم/ث","١٥٠ ألف","مليون","٦٠ ألف"], optsEn:["300K km/s","150K","1M","60K"], ans:0 },
    { q:"ما أكبر عضو في الجسم؟", qEn:"Largest human organ?", opts:["الجلد","الكبد","الرئة","المعدة"], optsEn:["Skin","Liver","Lungs","Stomach"], ans:0 },
    { q:"كم عدد العظام في جسم الإنسان البالغ؟", qEn:"How many bones are in an adult human body?", opts:["٢٠٦","٣٠٠","١٥٠","٢٥٠"], optsEn:["206","300","150","250"], ans:0 },
    { q:"ما أصغر وحدة بنائية للمادة تحتفظ بخصائص العنصر؟", qEn:"Smallest unit of matter retaining chemical properties?", opts:["الذرة","الجزيء","البروتون","الكوارك"], optsEn:["Atom","Molecule","Proton","Quark"], ans:0 },
    { q:"ما الرمز الكيميائي للماء؟", qEn:"Chemical formula for water?", opts:["H₂O","CO₂","NaCl","O₂"], optsEn:["H₂O","CO₂","NaCl","O₂"], ans:0 },
    { q:"ما أقرب كوكب للشمس؟", qEn:"Closest planet to the Sun?", opts:["عطارد","الزهرة","الأرض","المريخ"], optsEn:["Mercury","Venus","Earth","Mars"], ans:0 },
    { q:"من اكتشف الجاذبية؟", qEn:"Who discovered gravity?", opts:["نيوتن","أينشتاين","غاليليو","كوبرنيكوس"], optsEn:["Newton","Einstein","Galileo","Copernicus"], ans:0 },
    { q:"ما الغاز الأكثر وفرة في الغلاف الجوي؟", qEn:"Most abundant atmospheric gas?", opts:["النيتروجين","الأكسجين","CO₂","الأرجون"], optsEn:["Nitrogen","Oxygen","CO₂","Argon"], ans:0 },
    { q:"ما أكبر كوكب في المجموعة الشمسية؟", qEn:"Largest planet?", opts:["المشتري","زحل","أورانوس","نبتون"], optsEn:["Jupiter","Saturn","Uranus","Neptune"], ans:0 },
  ],
  sports: [
    { q:"كم لاعب في فريق كرة القدم؟", qEn:"Players on a football team?", opts:["١١","١٠","١٢","٩"], optsEn:["11","10","12","9"], ans:0 },
    { q:"أين أقيمت أول بطولة كأس عالم؟", qEn:"First World Cup location?", opts:["أوروغواي","البرازيل","إيطاليا","فرنسا"], optsEn:["Uruguay","Brazil","Italy","France"], ans:0 },
    { q:"كم حلقة في شعار الأولمبياد؟", qEn:"Rings in the Olympic logo?", opts:["٥","٤","٦","٣"], optsEn:["5","4","6","3"], ans:0 },
    { q:"من أكثر رياضي حصولًا على ميداليات أولمبية؟", qEn:"Most Olympic medals?", opts:["فيلبس","بولت","لويس","ويليامز"], optsEn:["Phelps","Bolt","Lewis","Williams"], ans:0 },
    { q:"ما مدة شوط كرة القدم؟", qEn:"Length of a football half?", opts:["٤٥ دقيقة","٣٠","٦٠","٤٠"], optsEn:["45 min","30","60","40"], ans:0 },
    { q:"هداف ليفربول التاريخي بالبريميرليج؟", qEn:"Liverpool's all-time PL scorer?", opts:["صلاح","جيرارد","فاولر","راش"], optsEn:["Salah","Gerrard","Fowler","Rush"], ans:0 },
  ],
  adab: [
    { q:"من مؤلف ملحمة «الإلياذة» و«الأوديسة»؟", qEn:"Who authored the epic Iliad and Odyssey?", opts:["هوميروس","سقراط","أفلاطون","فرجيل"], optsEn:["Homer","Socrates","Plato","Virgil"], ans:0 },
    { q:"من كتب «أولاد حارتنا»؟", qEn:"Who wrote 'Children of the Alley'?", opts:["نجيب محفوظ","طه حسين","يوسف إدريس","توفيق الحكيم"], optsEn:["Naguib Mahfouz","Taha Hussein","Yusuf Idris","Tawfiq al-Hakim"], ans:0 },
    { q:"من رسم الموناليزا؟", qEn:"Who painted the Mona Lisa?", opts:["دافنشي","مايكل أنجلو","رافائيل","بيكاسو"], optsEn:["Da Vinci","Michelangelo","Raphael","Picasso"], ans:0 },
    { q:"من صاحب الرواية العالمية «الحرب والسلام»؟", qEn:"Who wrote the epic novel 'War and Peace'?", opts:["تولستوي","دوستويفسكي","تشيخوف","غوغول"], optsEn:["Leo Tolstoy","Dostoevsky","Chekhov","Gogol"], ans:0 },
    { q:"من ألّف السيمفونية التاسعة؟", qEn:"9th Symphony composer?", opts:["بيتهوفن","موتسارت","باخ","شوبان"], optsEn:["Beethoven","Mozart","Bach","Chopin"], ans:0 },
    { q:"من كتب «الأيام»؟", qEn:"Who wrote 'The Days'?", opts:["طه حسين","العقاد","أحمد أمين","زكي نجيب"], optsEn:["Taha Hussein","Al-Aqqad","Ahmad Amin","Zaki Naguib"], ans:0 },
  ],
};

export const ALL_QUIZZES: Record<string, MCQ[]> = {
  general: [
    ...GENERAL_Q.map(normalize),
  ],
  geography: [
    ...GEO_Q.map(normalize),
  ],
  history: [
    ...HISTORY_Q.map(normalize),
  ],
  science: [
    ...INLINE_BASE.science.map(normalize),
    ...SCIEX_Q.map(normalize),
  ],
  sports: [
    ...INLINE_BASE.sports.map(normalize),
    ...SPORTS_Q.map(normalize),
  ],
  mental: [
    ...MENTAL_Q.map(normalize),
  ],
  puzzles: [
    ...PUZZLES_Q.map(normalize),
  ],
  adab: [
    ...INLINE_BASE.adab.map(normalize),
    ...ADAB_QUESTIONS.map(normalize),
  ],
  health: [
    ...HEALTH_EXAM_Q.map(normalize),
  ],
  code: [
    ...CODE_Q.map(normalize),
  ],
};
