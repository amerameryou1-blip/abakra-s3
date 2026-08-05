import type { MCQ } from "./content";

export interface TopicDef {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
}

export const CATEGORY_TOPICS: Record<string, TopicDef[]> = {
  science: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "equations", label: "معادلات وتفاعلات", labelEn: "Scientific Equations", icon: "🧪" },
    { id: "physics", label: "فيزياء وميكانيكا", labelEn: "Physics & Mechanics", icon: "⚡" },
    { id: "chemistry", label: "كيمياء وعناصر", labelEn: "Chemistry & Elements", icon: "⚗️" },
    { id: "biology", label: "أحياء وجسم الإنسان", labelEn: "Biology & Anatomy", icon: "🧬" },
    { id: "astronomy", label: "فلك وفضاء", labelEn: "Astronomy & Space", icon: "🪐" },
  ],
  geography: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "capitals", label: "عواصم ودول", labelEn: "Capitals & Countries", icon: "🏛️" },
    { id: "rivers", label: "أنهار وبحار ومحيطات", labelEn: "Rivers & Oceans", icon: "🌊" },
    { id: "mountains", label: "جبال وتضاريس", labelEn: "Mountains & Terrain", icon: "🏔️" },
    { id: "landmarks", label: "معالم وخرائط", labelEn: "Landmarks & Maps", icon: "🗺️" },
  ],
  history: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "pharaohs", label: "الفراعنة ومصر القديمة", labelEn: "Pharaohs & Ancient Egypt", icon: "🏺" },
    { id: "islamic", label: "التاريخ الإسلامي والعربي", labelEn: "Islamic & Arab History", icon: "🕌" },
    { id: "modern", label: "التاريخ الحديث والمعاصر", labelEn: "Modern & World History", icon: "📜" },
  ],
  general: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "nature", label: "كائنات وطبيعة", labelEn: "Nature & Animals", icon: "🐙" },
    { id: "inventions", label: "اختراعات وتكنولوجيا", labelEn: "Inventions & Tech", icon: "💡" },
    { id: "trivia", label: "طرائف وغرائب", labelEn: "Trivia & Wonders", icon: "✨" },
  ],
  sports: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "football", label: "كرة القدم وكأس العالم", labelEn: "Football & World Cup", icon: "⚽" },
    { id: "olympics", label: "الأولمبياد وألعاب القوى", labelEn: "Olympics & Athletics", icon: "🥇" },
    { id: "champions", label: "أبطال ورياضات متنوعة", labelEn: "Various Sports & Champions", icon: "🏆" },
  ],
  adab: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "poetry", label: "الشعر والشعراء", labelEn: "Poetry & Poets", icon: "✒️" },
    { id: "novels", label: "روايات ومؤلفات", labelEn: "Novels & Authors", icon: "📚" },
    { id: "arts", label: "فنون وموسيقى ومسرح", labelEn: "Arts & Music", icon: "🎭" },
  ],
  mental: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "logic", label: "منطق وتسلسل", labelEn: "Logic & Sequences", icon: "🧩" },
    { id: "math", label: "حساب وسرعة ذهنية", labelEn: "Mental Math", icon: "🔢" },
    { id: "focus", label: "ذاكرة وتركيز", labelEn: "Memory & Focus", icon: "🧠" },
  ],
  puzzles: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "riddles", label: "ألغاز كلامية", labelEn: "Word Riddles", icon: "🔍" },
    { id: "tricks", label: "خدع وذكاء", labelEn: "Trick Questions", icon: "💡" },
    { id: "numbers", label: "ألغاز أرقام", labelEn: "Number Puzzles", icon: "🎯" },
  ],
  health: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "firstaid", label: "إسعافات وطوارئ", labelEn: "First Aid & Emergencies", icon: "🚑" },
    { id: "nutrition", label: "تغذية وعادات صحية", labelEn: "Nutrition & Lifestyle", icon: "🥗" },
    { id: "body", label: "أجهزة الجسم والوقاية", labelEn: "Body Systems & Hygiene", icon: "🩺" },
  ],
  code: [
    { id: "all", label: "الكل", labelEn: "All", icon: "🌐" },
    { id: "networks", label: "شبكات وبروتوكولات", labelEn: "Networks & Protocols", icon: "🌐" },
    { id: "languages", label: "لغات البرمجة ومبتكروها", labelEn: "Languages & Creators", icon: "💻" },
    { id: "systems", label: "أنظمة تشغيل وعتاد", labelEn: "OS & Hardware", icon: "🖥️" },
  ],
};

export function classifyQuestion(q: MCQ, catId: string): string {
  if (q.topic) return q.topic;
  const text = `${q.q} ${q.qEn || ''} ${(q.opts || []).join(' ')} ${q.exp || ''}`.toLowerCase();

  switch (catId) {
    case 'science': {
      if (/معادلة|تفاعل|رمز|صيغة|مركب|حمض|h2o|co2|nacl|equation|reaction|formula|compound|acid|حمضية|قاعدية|ذرة/i.test(text)) {
        return 'equations';
      }
      if (/كوكب|شمس|قمر|مجرة|نجوم|فلك|مشتري|عطارد|الزهرة|مريخ|زحل|أورانوس|نبتون|ثقب أسود|مكوك|ناسا|مدار|فضاء|planet|sun|moon|galaxy|star|jupiter|mercury|mars|saturn|space|orbit/i.test(text)) {
        return 'astronomy';
      }
      if (/فيزياء|قوة|سرعة|ضوء|جاذبية|طاقة|كهرباء|ضغط|نيوتن|أمبير|واط|جول|أينشتاين|موجة|حرارة|صوت|فولت|physics|force|speed|light|gravity|energy|electricity|newton|joule|watt|volt/i.test(text)) {
        return 'physics';
      }
      if (/كيمياء|عنصر|جدول دوري|هيدروجين|أكسجين|نيتروجين|حديد|ذهب|فضة|نحاس|كربون|تفاعل كيميائي|محلول|ph|chemistry|element|periodic|hydrogen|oxygen|nitrogen|iron|gold/i.test(text)) {
        return 'chemistry';
      }
      return 'biology';
    }

    case 'geography': {
      if (/عاصمة|دولة|جمهورية|مملكة|حدود|سكان|capital|country|nation|city/i.test(text)) {
        return 'capitals';
      }
      if (/نهر|بحر|محيط|بحيرة|شلال|مضيق|خليج|ماء|شاطئ|river|sea|ocean|lake|water|strait/i.test(text)) {
        return 'rivers';
      }
      if (/جبل|قمة|تضاريس|صحراء|هضبة|بركان|سلسلة|ارتفاع|mountain|peak|desert|volcano|plateau/i.test(text)) {
        return 'mountains';
      }
      return 'landmarks';
    }

    case 'history': {
      if (/فرعون|مصر القديمة|هرم|أهرامات|مينا|رمسيس|كليوباترا|توت|حتشبسوت|قادش|تحتمس|طيبة|منف|ممفيس|بردي|أقصر|pharaoh|egypt|pyramid|ramses|cleopatra/i.test(text)) {
        return 'pharaohs';
      }
      if (/إسلام|مسلم|فتح|أموي|عباسي|فاطمي|مملوكي|عثماني|قاهرة|أزهر|بغداد|أندلس|صلاح الدين|قطز|خليفة|دولة إسلامية|islam|caliph/i.test(text)) {
        return 'islamic';
      }
      return 'modern';
    }

    case 'general': {
      if (/حيوان|طبيعة|أخطبوط|قلب|دم|نبات|شجرة|موز|توت|فراولة|بحر|حيوانات|طائر|سمكة|أسد|أفريقيا|شجرة|كلب|قط|nature|animal|octopus|heart|banana/i.test(text)) {
        return 'nature';
      }
      if (/اختراع|اكتشاف|كهرباء|هاتف|طائرة|بوصلة|سيارة|طباعة|صاعقة|شاشة|حاسوب|روبوت|invention|discovery|phone|car|computer/i.test(text)) {
        return 'inventions';
      }
      return 'trivia';
    }

    case 'sports': {
      if (/كرة القدم|كأس العالم|بريميرليج|ليفربول|هدف|دوري|ملعب|فيفا|ريال|برشلونة|صلاح|ميسي|رونالدو|نادي|لاعب|حكم|football|soccer|world cup|fifa/i.test(text)) {
        return 'football';
      }
      if (/أولمبياد|ميدالية|سباق|جرّاي|ألعاب قوى|سباحة|مضمار|جمباز|olympic|medal|athletics/i.test(text)) {
        return 'olympics';
      }
      return 'champions';
    }

    case 'adab': {
      if (/شاعر|شعر|أمير الشعراء|معلقة|بيت|قصيدة|شوقي|حافظ|متنبي|معري|نزار|جواهر|قصائد|poet|poem/i.test(text)) {
        return 'poetry';
      }
      if (/رواية|مؤلف|نجيب محفوظ|طه حسين|العقاد|أولاد حارتنا|الأيام|كتاب|كاتب|أديب|قصة|novel|author|writer|book/i.test(text)) {
        return 'novels';
      }
      return 'arts';
    }

    case 'mental': {
      if (/رقم|حساب|جمع|ضرب|قسمة|معادلة|نسبة|محيط|مساحة|رقمين|متتالية|math|number|multiply|sum/i.test(text)) {
        return 'math';
      }
      if (/تتابع|نمط|منطق|إذا كان|شكل|رمز|sequence|logic|pattern/i.test(text)) {
        return 'logic';
      }
      return 'focus';
    }

    case 'puzzles': {
      if (/رقم|عدد|حساب|رياضيات|أكبر|أصغر|مجموع|أرقام|number|digit/i.test(text)) {
        return 'numbers';
      }
      if (/خدعة|فخ|ذكاء|مستحيل|سر|لغز ذكي|trick/i.test(text)) {
        return 'tricks';
      }
      return 'riddles';
    }

    case 'health': {
      if (/إسعاف|طوارئ|نزيف|حرق|كسر|إغماء|تنفس|أولية|شريان|ضمادة|جرح|قلب|first aid|emergency|burn|bleed/i.test(text)) {
        return 'firstaid';
      }
      if (/تغذية|فيتامين|طعام|وجبة|سعر|كالوري|سكر|بروتين|ماء|سمنة|فطور|مشروب|وجبات|nutrition|vitamin|food|water|diet/i.test(text)) {
        return 'nutrition';
      }
      return 'body';
    }

    case 'code': {
      if (/منفذ|بروتوكول|شبكة|شبكات|http|https|sftp|port|network|protocol/i.test(text)) {
        return 'networks';
      }
      if (/لغة|جوسلينج|ريتشي|java|c#|تطوير|مبتكر|امتداد|language|creator/i.test(text)) {
        return 'languages';
      }
      return 'systems';
    }

    default:
      return 'all';
  }
}
