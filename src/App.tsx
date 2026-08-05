import { useState, useCallback, useMemo, useEffect, memo, type ReactNode } from "react";
import { cn } from "./utils/cn";
import { CATS, FACTS, TIMELINE, QUIZZES, CODE_CHALLENGES, RIDDLES, MEMORY_EMOJIS, HEALTH_Q, SPARKS, type CatId, type Cat, type MCQ } from "./data/content";
import { CATEGORY_TOPICS, classifyQuestion } from "./data/topics";
import { submitComplaintToFirestore, submitScoreToFirestore } from "./lib/services";

/* ═══════════ LANG ═══════════ */
type Lang = "ar" | "en";
function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return typeof window !== "undefined" && localStorage.getItem("lang") === "en" ? "en" : "ar";
    } catch {
      return "ar";
    }
  });
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("lang", lang);
    } catch { /* ignore */ }
  }, [lang]);
  return { lang, setLang, en: lang === "en" } as const;
}

/* ═══════════ REVEAL (INSTANT ZERO-ANIMATION FOR WEAK DEVICES) ═══════════ */
function Reveal({ children, className }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={className}>{children}</div>;
}

/* ═══════════ TILT CARD (INSTANT LIGHTWEIGHT WRAPPER) ═══════════ */
function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/* ═══════════ COUNTER (DIRECT STATIC RENDER) ═══════════ */
function Counter({ to, className }: { to: number; className?: string }) {
  return <span className={className}>{to}</span>;
}

/* ═══════════ SCROLL BAR ═══════════ */
function ScrollBar() {
  return null;
}

/* ═══════════ LANG TOGGLE ═══════════ */
const LangToggle = memo(function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div dir="ltr" className="flex shrink-0 items-center gap-0.5 rounded-full border border-ink-600/70 bg-ink-900/90 p-0.5 text-xs font-bold">
      <span className="px-1 opacity-40 text-[10px]">🌐</span>
      {(["ar", "en"] as const).map(l => (
        <button key={l} onClick={() => setLang(l)} className={cn("rounded-full px-2 py-1 transition-all duration-200", lang === l ? "bg-gold-400 text-ink-950" : "text-paper-dim hover:text-paper")}>
          {l === "ar" ? "ع" : "EN"}
        </button>
      ))}
    </div>
  );
});

/* ═══════════ TOP BAR ═══════════ */
const TopBar = memo(function TopBar({ view, setView, lang, setLang, en }: { view: CatId | "home"; setView: (v: CatId | "home") => void; lang: Lang; setLang: (l: Lang) => void; en: boolean }) {
  const home = view === "home";
  return (
    <header className={cn("z-40 border-b transition-colors duration-150",
      home
        ? "fixed inset-x-0 top-0 border-gold-400/10 bg-ink-950/90 shadow-md"
        : "sticky top-0 border-gold-400/15 bg-ink-950/98 shadow-md")}>
      <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5 sm:py-2.5">
        <button onClick={() => setView("home")} className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-gold-400/50 bg-gold-400/10 text-base text-gold-300 sm:h-9 sm:w-9">✦</span>
          <span className="font-display text-lg text-paper sm:text-xl">عباقرة<span className="text-gold-400">✦</span></span>
        </button>
        <nav className="nav-scroll flex flex-1 items-center gap-1.5 overflow-x-auto">
          {CATS.map(c => (
            <button key={c.id} onClick={() => setView(c.id)}
              className={cn("shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-150 sm:px-3 sm:py-1.5 sm:text-sm",
                view === c.id ? "text-ink-950" : "border-ink-600/50 text-paper-dim hover:border-gold-400/40 hover:text-paper")}
              style={view === c.id ? { background: c.hue, borderColor: c.hue } : undefined}>
              <span className="inline-block leading-none me-0.5">{c.icon}</span> <span className="hidden md:inline">{en ? c.labelEn : c.label}</span>
            </button>
          ))}
        </nav>
        <LangToggle lang={lang} setLang={setLang} />
      </div>
    </header>
  );
});

/* ═══════════ HERO DECOR ═══════════ */
const HeroParticles = memo(function HeroParticles() {
  return null;
});

function HeroRings() {
  return null;
}

/* ═══════════ HERO ═══════════ */
const Hero = memo(function Hero({ en, onStart, onPuzzle }: { en: boolean; onStart: () => void; onPuzzle: () => void }) {
  return (
    <section className="relative flex h-[100svh] max-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/hero-bg.jpg" alt="" className="h-full w-full object-cover hero-bg-drift" />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ink-950/75 via-ink-950/40 to-ink-950" />
      {/* Soft dark plate behind title/buttons so they never fade into gold */}
      <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 55% 48% at 50% 42%, rgba(6,13,18,.55) 0%, rgba(6,13,18,.2) 55%, transparent 75%)" }} />
      <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(232,182,76,.08), transparent)" }} />
      <HeroRings />
      <HeroParticles />
      <div className="absolute inset-0 z-[5]" style={{ background: "radial-gradient(ellipse 110% 85% at 50% 45%, transparent 35%, rgba(6,13,18,.78) 100%)" }} />

      <div className="relative z-10 my-auto mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 pt-16 pb-6 sm:pt-20 text-center">
        {/* Emblem image */}
        <div className="ani-up emblem-glow mb-3">
          <div className="hero-float relative mx-auto h-16 w-16 overflow-hidden rounded-2xl border border-gold-400/40 shadow-[0_0_40px_rgba(232,182,76,.25)] sm:h-20 sm:w-20 sm:rounded-3xl">
            <img src="/images/emblem-star.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/30 to-transparent" />
          </div>
        </div>

        <p className="ani-up delay-1 font-callig text-base sm:text-lg md:text-xl" style={{
          background: "linear-gradient(90deg, #f2d489, #7dd3c0, #f2d489, #e05a7a, #f2d489)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,.75))",
          animation: "royal-shift 8s ease-in-out infinite",
        }}>
          {en ? "✦ From Cairo… for every curious mind ✦" : "✦ من القاهرة… لكل عقلٍ فضولي ✦"}
        </p>

        <div className="ani-up delay-2 hero-title-wrap my-2 sm:my-3">
          <h1 className="hero-title relative leading-tight" style={{ fontSize: "clamp(3.2rem, 11vw, 7.5rem)" }}>
            عباقرة
            <span className="inline-block align-top text-xl sm:text-3xl md:text-4xl" style={{ WebkitTextFillColor: "#e8b64c", color: "#e8b64c", filter: "drop-shadow(0 0 14px rgba(91,141,239,.5)) drop-shadow(0 0 10px rgba(232,182,76,.9))" }}>
              <span className="ani-spin inline-block ms-2" style={{ animationDuration: "16s" }}>✦</span>
            </span>
          </h1>
        </div>

        <p className="ani-up delay-3 max-w-lg font-callig text-base leading-snug sm:text-xl md:text-2xl" style={{
          color: "#e8dcc0",
          textShadow: "0 2px 14px rgba(0,0,0,.8), 0 0 24px rgba(91,141,239,.15)",
        }}>
          {en ? "Where a question is born… and grows into an idea" : "حيث يولد السؤال… ويكبر ليصبح فكرة"}
        </p>

        <div className="ani-up delay-4 mx-auto my-4 flex items-center gap-2.5">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400/50 sm:w-16" />
          <span className="text-[10px] font-semibold tracking-wider text-gold-300/70 sm:text-xs">مصنع العباقرة</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400/50 sm:w-16" />
        </div>

        <div className="ani-up delay-5 mt-2 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <button onClick={onStart}
            className="btn-primary group relative overflow-hidden rounded-full px-8 py-3.5 font-display text-base font-bold transition-transform duration-200 hover:scale-105 active:scale-95 sm:px-10 sm:py-4 sm:text-lg">
            <span className="relative z-10">{en ? "Start the journey ↓" : "ابدأ الرحلة ↓"}</span>
            <span className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%)", animation: "shimmer 2.5s ease-in-out infinite" }} />
          </button>
          <button onClick={onPuzzle}
            className="btn-secondary rounded-full px-8 py-3.5 font-display text-base font-bold transition-all duration-200 hover:scale-105 active:scale-95 sm:px-10 sm:py-4 sm:text-lg">
            {en ? "🧩 Try a puzzle" : "🧩 جرّب لغزًا"}
          </button>
        </div>

        {/* Scroll cue */}
        <div className="mt-6 flex flex-col items-center gap-1 sm:mt-8">
          <span className="text-[9px] font-semibold uppercase tracking-[.15em] text-paper-dim/50">{en ? "Scroll" : "اسحب"}</span>
          <div className="scroll-cue"><div className="h-6 w-3.5 rounded-full border border-gold-400/30 p-[2px]"><div className="mx-auto h-1.5 w-1 rounded-full bg-gold-400/60" style={{ animation: "scroll-dot 1.6s ease-in-out infinite" }} /></div></div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-14 bg-gradient-to-t from-[#060d12] to-transparent" />
    </section>
  );
});

/* ═══════════ DUAL TICKER ═══════════ */
const DualTicker = memo(function DualTicker({ en }: { en: boolean }) {
  const ar = ["هل تعلم أن العسل لا يفسد أبدًا؟ 🍯", "الخوارزمي… أبو الجبر", "قسم التاريخ: ١٠ محطات عبر ٧٠٠٠ عام", "ابن الهيثم… رائد البصريات", "لعبة الذاكرة: كم محاولة تحتاج؟", "٦ ألغاز تنتظر عبقريًا 🧩", "ماري كوري… جائزة نوبل مرتين", "جسمك يحتوي ٣٧ تريليون خلية", "اختبر عاداتك الصحية ❤️", "البرمجة تبدأ بـ HTML 💻", "قسم الأدب: من شوقي إلى دافنشي 📖"];
  const enT = ["Honey never spoils 🍯", "Al-Khwarizmi — father of algebra", "History: 10 stations across 7,000 years", "Ibn al-Haytham — pioneer of optics", "Memory game: how many tries?", "6 riddles await a genius 🧩", "Marie Curie — two Nobel Prizes", "Your body has 37 trillion cells", "Test your daily habits ❤️", "Coding starts with HTML 💻", "Literature: from Shawqi to Da Vinci 📖"];
  const jewels = ["#e8b64c", "#7dd3c0", "#e05a7a", "#5b8def"];
  const items = en ? enT : ar;
  const row = (rev = false) => (
    <div className={cn("flex whitespace-nowrap py-3", rev ? "ani-ticker-rev" : "ani-ticker")}>
      {[0, 1].map(k => (
        <div key={k} className="flex shrink-0">
          {items.map((t, i) => (
            <span key={i} className="mx-7 flex items-center gap-2.5 text-sm font-medium text-[#d8c9a8]">
              <span className="jewel-dot" style={{ background: jewels[i % 4], color: jewels[i % 4] }} />
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-gold-400/15" style={{ background: "linear-gradient(180deg, rgba(14,26,36,.95), rgba(8,16,24,.98))" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      {row(false)}
      <div className="h-px bg-gradient-to-r from-transparent via-[#5b8def33] to-transparent" />
      {row(true)}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
    </div>
  );
});

/* ═══════════ STATS STRIP ═══════════ */
const StatsStrip = memo(function StatsStrip({ en }: { en: boolean }) {
  const stats = useMemo(() => en
    ? [{ n: 10, l: "knowledge sections", c: "#e8b64c" }, { n: 24, l: "mind-blowing facts", c: "#7dd3c0" }, { n: 10, l: "history stations", c: "#5b8def" }, { n: 6, l: "riddles for geniuses", c: "#e05a7a" }]
    : [{ n: 10, l: "أقسام معرفية", c: "#e8b64c" }, { n: 24, l: "حقيقة مدهشة", c: "#7dd3c0" }, { n: 10, l: "محطات تاريخية", c: "#5b8def" }, { n: 6, l: "ألغاز للعباقرة", c: "#e05a7a" }], [en]);
  return (
    <section className="mx-auto max-w-5xl px-5 py-14 md:py-16">
      <Reveal>
        <div className="section-crown">
          <span className="royal-label">{en ? "✦ Kingdom of Knowledge ✦" : "✦ مملكة المعرفة ✦"}</span>
        </div>
      </Reveal>
      <div className="royal-panel grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] md:grid-cols-4" style={{ background: "rgba(20,34,46,.4)" }}>
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="group relative px-4 py-9 text-center transition-colors duration-300" style={{ background: "linear-gradient(180deg, rgba(14,26,36,.95), rgba(8,16,24,.98))" }}>
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${s.c}, transparent)` }} />
              <div className="mx-auto mb-3 h-1.5 w-1.5 rounded-full" style={{ background: s.c, boxShadow: `0 0 14px ${s.c}` }} />
              <p className="royal-stat-num text-4xl md:text-5xl"><Counter to={s.n} /></p>
              <p className="mt-2 text-xs font-semibold text-[#b8a888] md:text-sm">{s.l}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
});

/* ═══════════ SPARK SECTION ═══════════ */
const SparkSection = memo(function SparkSection({ en }: { en: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(s => (s + 1) % SPARKS.length), 6000); return () => clearInterval(t); }, []);
  return (
    <section className="mx-auto max-w-3xl px-5 pb-10">
      <Reveal>
        <button onClick={() => setI(s => (s + 1 + Math.floor(Math.random() * (SPARKS.length - 1))) % SPARKS.length)}
          className="royal-panel group w-full rounded-[1.75rem] p-8 text-center transition-all duration-400 hover:border-gold-400/35 sm:p-11">
          <div className="relative z-10">
            <div className="royal-divider mb-5">
              <span className="royal-label">{en ? "Spark of wisdom" : "شرارة حكمة"}</span>
            </div>
            <p key={i} className="ani-in font-callig text-xl leading-relaxed sm:text-2xl md:text-3xl" style={{
              background: "linear-gradient(165deg, #fff1c4, #e8dcc0 40%, #7dd3c0 70%, #e8dcc0)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 10px rgba(0,0,0,.5))",
            }}>
              {en ? SPARKS[i].en : SPARKS[i].ar}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              {["#e8b64c", "#7dd3c0", "#5b8def", "#e05a7a"].map((c, n) => (
                <span key={n} className="jewel-dot" style={{ background: c, color: c, opacity: n === i % 4 ? 1 : 0.35 }} />
              ))}
            </div>
            <p className="mt-4 text-xs text-[#8a7e68] transition-colors group-hover:text-gold-400/70">{en ? "tap for another →" : "اضغط لأخرى ←"}</p>
          </div>
        </button>
      </Reveal>
    </section>
  );
});

/* ═══════════ CATEGORY GRID ═══════════ */
const CatGrid = memo(function CatGrid({ en, onOpen }: { en: boolean; onOpen: (id: CatId) => void }) {
  const featured = useMemo(() => CATS.filter(c => ["science", "sports", "adab", "health"].includes(c.id)), []);
  const rest = useMemo(() => CATS.filter(c => !["science", "sports", "adab", "health"].includes(c.id)), []);
  return (
    <section id="doors" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <div className="section-crown">
          <span className="royal-label">{en ? "The Full Index" : "الفهرس الكامل"}</span>
          <div className="flex items-center gap-2">
            {["#e8b64c", "#7dd3c0", "#5b8def", "#e05a7a"].map(c => (
              <span key={c} className="jewel-dot" style={{ background: c, color: c }} />
            ))}
          </div>
        </div>
        <h2 className="royal-heading text-center text-3xl md:text-5xl lg:text-6xl">
          {en ? "Ten doors… each one an idea" : "عشرة أبواب… كل باب فكرة"}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm text-[#a89878]">
          {en ? "Switch between study mode and exam mode in every section." : "بدّل بين وضع المذاكرة ووضع الامتحان في كل قسم."}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {featured.map((c, i) => (
          <Reveal key={c.id} delay={i * 70}>
            <Tilt className="h-full">
              <button onClick={() => onOpen(c.id)}
                className="royal-card group relative flex h-full w-full flex-col rounded-[1.5rem] p-6 text-start sm:p-8"
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.hue}77`; e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,248,231,.08), 0 28px 60px -20px rgba(0,0,0,.9), 0 0 50px -12px ${c.hue}55`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${c.hue}99, transparent)` }} />
                <span className="pointer-events-none absolute -bottom-8 -end-4 select-none text-[8rem] opacity-[.06] transition-all duration-500 group-hover:scale-125 group-hover:opacity-[.14]">{c.icon}</span>
                <div className="relative z-10 flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border text-3xl transition-transform duration-300 group-hover:scale-110" style={{ borderColor: `${c.hue}55`, background: `linear-gradient(145deg, ${c.hue}22, ${c.hue}08)`, boxShadow: `0 0 24px -6px ${c.hue}66` }}>{c.icon}</span>
                  <span className="rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider" style={{ borderColor: `${c.hue}44`, color: c.hue, background: `${c.hue}10` }}>{c.tag}</span>
                </div>
                <h3 className="relative z-10 mt-5 font-display text-2xl md:text-3xl" style={{ color: c.hue, textShadow: `0 0 28px ${c.hue}44` }}>{en ? c.labelEn : c.label}</h3>
                <p className="relative z-10 mt-2 flex-1 text-sm leading-relaxed text-[#b8a888]">{en ? c.introEn : c.intro}</p>
                <span className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-bold transition-transform duration-300 group-hover:-translate-x-1.5" style={{ color: c.hue }}>
                  <span className="h-px w-6 transition-all duration-300 group-hover:w-10" style={{ background: c.hue }} />
                  {en ? "Enter the hall" : "ادخل القاعة"}
                </span>
              </button>
            </Tilt>
          </Reveal>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((c, i) => (
          <Reveal key={c.id} delay={i * 55}>
            <Tilt className="h-full">
              <button onClick={() => onOpen(c.id)}
                className="royal-card group relative flex h-full w-full flex-col rounded-2xl p-5 text-start sm:p-6"
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.hue}66`; e.currentTarget.style.boxShadow = `0 20px 44px -18px rgba(0,0,0,.85), 0 0 36px -10px ${c.hue}44`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50" style={{ background: `linear-gradient(90deg, transparent, ${c.hue}88, transparent)` }} />
                <span className="pointer-events-none absolute -bottom-4 -end-2 select-none text-[5rem] opacity-[.05] transition-all duration-500 group-hover:scale-125 group-hover:opacity-[.12]">{c.icon}</span>
                <div className="relative z-10 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border text-2xl transition-transform duration-300 group-hover:scale-110" style={{ borderColor: `${c.hue}44`, background: `${c.hue}14`, boxShadow: `0 0 18px -6px ${c.hue}55` }}>{c.icon}</span>
                  <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold" style={{ borderColor: `${c.hue}33`, color: c.hue }}>{c.tag}</span>
                </div>
                <h3 className="relative z-10 mt-3.5 font-display text-xl" style={{ color: c.hue }}>{en ? c.labelEn : c.label}</h3>
                <p className="relative z-10 mt-1 flex-1 text-xs leading-relaxed text-[#a89878] line-clamp-2">{en ? c.introEn : c.intro}</p>
                <span className="relative z-10 mt-3 inline-flex text-xs font-bold transition-transform duration-300 group-hover:-translate-x-1" style={{ color: c.hue }}>{en ? "Enter ←" : "ادخل ←"}</span>
              </button>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
});

/* ═══════════ FACTS ═══════════ */
const FactsView = memo(function FactsView({ catId, hue, en }: { catId: string; hue: string; en: boolean }) {
  const facts = FACTS[catId] || [];
  return (
    <div className="space-y-4">
      <div className="mb-2 flex items-center gap-3">
        <span className="royal-label">{en ? "Hall of wonders" : "قاعة العجائب"}</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/25" />
        <span className="text-xs font-bold text-[#8a7e68]">{facts.length} {en ? "entries" : "مدخل"}</span>
      </div>
      {facts.map((f, i) => (
        <Reveal key={i} delay={Math.min(i * 55, 200)}>
          <article className="royal-card group relative overflow-hidden rounded-[1.35rem] p-5 sm:p-7"
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${hue}55`; e.currentTarget.style.boxShadow = `0 20px 48px -18px rgba(0,0,0,.85), 0 0 40px -14px ${hue}44`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${hue}99, transparent)` }} />
            <div className="relative z-10 grid items-center gap-5 md:grid-cols-[100px_1fr_auto]">
              <div className="flex items-center gap-3 md:block">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border text-3xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20 sm:text-4xl" style={{ borderColor: `${hue}44`, background: `linear-gradient(145deg, ${hue}22, ${hue}08)`, boxShadow: `0 0 28px -8px ${hue}66` }}>
                  {f.icon}
                </div>
                <span className="font-display text-4xl md:mt-3 md:block md:text-5xl" style={{ color: hue, textShadow: `0 0 28px ${hue}55` }}>
                  {en ? String(i + 1).padStart(2, "0") : (i + 1).toLocaleString("ar-EG", { minimumIntegerDigits: 2 })}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-display text-2xl text-[#f0e6d0] transition-colors group-hover:text-gold-200 md:text-3xl">{en ? f.titleEn : f.title}</h4>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[#b8a888]">{en ? f.bodyEn : f.body}</p>
              </div>
              <div className="hidden md:block">
                <span className="inline-flex rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider" style={{ borderColor: `${hue}33`, color: hue, background: `${hue}0d` }}>
                  {en ? "FACT" : "حقيقة"}
                </span>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
});

/* ═══════════ TIMELINE ═══════════ */
const ERA_COLORS: Record<string, string> = { "الفراعنة": "#fbbf24", "البطالمة": "#22d3ee", "الإسلامي": "#34d399", "الحديث": "#fb7185" };
const TimelineView = memo(function TimelineView({ en }: { en: boolean }) {
  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="royal-label">{en ? "River of time" : "نهر الزمن"}</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400/25" />
      </div>
      <div className="relative ps-12 md:ps-16">
        <div className="absolute bottom-4 start-[11px] top-4 w-[2px] md:start-[15px]" style={{ background: "linear-gradient(180deg, #e8b64c, #22d3ee, #34d399, #fb7185, transparent)" }} />
        {TIMELINE.map((e, i) => {
          const c = ERA_COLORS[e.era] ?? "#e8b64c";
          const newEra = i === 0 || TIMELINE[i - 1].era !== e.era;
          return (
            <div key={i}>
              {newEra && (
                <Reveal delay={30}>
                  <div className="relative pb-2 pt-10 first:pt-1">
                    <span className="absolute -start-[1.35rem] top-10 h-6 w-6 rounded-full border-4 border-ink-950 md:-start-[1.6rem] first:top-1" style={{ background: c, boxShadow: `0 0 22px ${c}` }} />
                    <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-display text-lg text-ink-950" style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)`, boxShadow: `0 10px 28px -10px ${c}` }}>
                      ✦ {en ? e.eraEn : e.era}
                    </span>
                  </div>
                </Reveal>
              )}
              <Reveal delay={Math.min(i * 40, 160)}>
                <article className="royal-card group relative mb-4 rounded-2xl p-5 sm:p-6">
                  <span className="absolute -start-[1.2rem] top-8 h-3.5 w-3.5 rounded-full border-[3px] border-ink-950 transition-transform duration-300 group-hover:scale-150 md:-start-[1.45rem]" style={{ background: c, boxShadow: `0 0 14px ${c}` }} />
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-3xl leading-none md:text-4xl" style={{ color: c, textShadow: `0 0 24px ${c}55` }}>{e.year}</span>
                      <span className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold" style={{ borderColor: `${c}44`, color: c, background: `${c}12` }}>{en ? e.eraEn : e.era}</span>
                    </div>
                    <h4 className="mt-2.5 font-display text-2xl text-[#f0e6d0] md:text-3xl">{en ? e.titleEn : e.title}</h4>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#b8a888]">{en ? e.bodyEn : e.body}</p>
                  </div>
                </article>
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
});

/* ═══════════ FLAG QUESTION MODAL ═══════════ */
const FLAG_REASONS = [
  { id: "wrong_answer", ar: "الإجابة المحددة خاطئة", en: "The marked answer is wrong" },
  { id: "typo", ar: "خطأ إملائي أو صياغة سيئة", en: "Typo or poor wording" },
  { id: "unclear", ar: "السؤال غير واضح / غامض", en: "Question is unclear / ambiguous" },
  { id: "outdated", ar: "المعلومة قديمة أو غير دقيقة", en: "Outdated or inaccurate info" },
  { id: "duplicate", ar: "سؤال مكرر", en: "Duplicate question" },
  { id: "other", ar: "سبب آخر", en: "Other reason" },
] as const;

const FlagButton = memo(function FlagButton({ onClick, en, compact }: { onClick: () => void; en: boolean; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "group/flag inline-flex items-center gap-1.5 rounded-full border border-rose-400/25 bg-rose-400/5 font-semibold text-rose-300/80 transition-all duration-300 hover:border-rose-400/55 hover:bg-rose-400/12 hover:text-rose-200 hover:shadow-[0_0_20px_-6px_rgba(251,113,133,.45)]",
        compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs"
      )}
      title={en ? "Report this question" : "بلّغ عن هذا السؤال"}
    >
      <span className="text-sm transition-transform duration-300 group-hover/flag:scale-110 group-hover/flag:-rotate-12">🚩</span>
      {!compact && <span>{en ? "Flag" : "بلّغ"}</span>}
    </button>
  );
});

const FlagModal = memo(function FlagModal({
  open, onClose, en, hue, questionText, contextLabel,
}: {
  open: boolean; onClose: () => void; en: boolean; hue: string;
  questionText: string; contextLabel?: string;
}) {
  const [reason, setReason] = useState<string>("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!open) return;
    setReason(""); setNote(""); setSent(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const submit = async () => {
    if (!reason) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    const payload = {
      id: `flag_${Date.now()}`,
      reason,
      note: note.trim(),
      question: questionText,
      context: contextLabel || "",
      at: new Date().toISOString(),
      lang: en ? "en" : "ar",
    };
    try {
      const prev = JSON.parse(localStorage.getItem("abakra-flags") || "[]");
      prev.push(payload);
      localStorage.setItem("abakra-flags", JSON.stringify(prev.slice(-100)));
    } catch { /* ignore */ }

    try {
      await submitComplaintToFirestore({
        id: payload.id,
        reason: payload.reason,
        note: payload.note,
        question: payload.question,
        context: payload.context,
        lang: payload.lang as 'ar' | 'en',
        createdAt: payload.at,
        status: 'pending',
      });
    } catch (err) {
      console.warn("Firestore complaint log info:", err);
    }

    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/75 backdrop-blur-md ani-in" onClick={onClose} />
      <div className={cn("royal-panel relative z-10 w-full max-w-lg overflow-hidden rounded-[1.75rem] ani-scale", shake && "ani-shake")}>
        {/* top jewel line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/60 to-transparent" />
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-40" style={{ background: `radial-gradient(circle, ${hue}33, transparent 70%)` }} />

        <div className="relative z-10 p-5 sm:p-7">
          {sent ? (
            <div className="py-6 text-center ani-scale">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 text-3xl" style={{ boxShadow: "0 0 30px -6px rgba(52,211,153,.5)" }}>✓</div>
              <h3 className="mt-5 font-display text-2xl text-emerald-300">{en ? "Report received" : "تم استلام البلاغ"}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a89878]">
                {en ? "Thank you — your note helps us keep the palace of knowledge accurate." : "شكرًا لك — ملاحظتك تساعدنا نحافظ على دقة قصر المعرفة."}
              </p>
              <button onClick={onClose} className="btn-primary mt-6 rounded-full px-8 py-2.5 text-sm font-bold transition-transform hover:scale-105">
                {en ? "Close" : "إغلاق"}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="royal-label !text-left mb-1">{en ? "Report issue" : "إبلاغ عن مشكلة"}</p>
                  <h3 className="font-display text-2xl text-[#f0e6d0]">{en ? "Flag this question" : "بلّغ عن هذا السؤال"}</h3>
                </div>
                <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-gold-400/20 text-[#a89878] transition-colors hover:border-gold-400/40 hover:text-gold-300">✕</button>
              </div>

              <div className="mt-4 rounded-2xl border border-gold-400/12 bg-ink-950/50 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400/50 mb-1.5">{en ? "Question" : "السؤال"}</p>
                <p className="text-sm leading-relaxed text-[#d8c9a8] line-clamp-3">{questionText}</p>
              </div>

              <p className="mt-5 mb-2.5 text-xs font-bold text-[#c4b48a]">{en ? "Why are you flagging it?" : "لماذا تبلّغ عنه؟"}</p>
              <div className="grid gap-2">
                {FLAG_REASONS.map((r, i) => {
                  const active = reason === r.id;
                  return (
                    <button key={r.id} type="button" onClick={() => setReason(r.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-start text-sm transition-all duration-200",
                        active
                          ? "border-rose-400/50 bg-rose-400/10 text-rose-100 shadow-[0_0_24px_-8px_rgba(251,113,133,.4)]"
                          : "border-ink-600/50 bg-ink-950/40 text-[#c4b48a] hover:border-gold-400/25 hover:bg-ink-900/50"
                      )}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] transition-all", active ? "border-rose-400 bg-rose-400 text-ink-950" : "border-[#6a6048]")}>
                        {active ? "✓" : ""}
                      </span>
                      {en ? r.en : r.ar}
                    </button>
                  );
                })}
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-bold text-[#c4b48a]">{en ? "Extra details (optional)" : "تفاصيل إضافية (اختياري)"}</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={400}
                  placeholder={en ? "What should be corrected?" : "ما الذي يجب تصحيحه؟"}
                  className="w-full resize-none rounded-xl border border-ink-600/60 bg-ink-950/60 px-3.5 py-3 text-sm text-[#f0e6d0] placeholder:text-[#6a6048] outline-none transition-colors focus:border-gold-400/45"
                />
                <span className="mt-1 block text-end text-[10px] text-[#6a6048]">{note.length}/400</span>
              </label>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <button onClick={submit}
                  className="btn-primary flex-1 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95 min-w-[140px]">
                  {en ? "Submit report" : "إرسال البلاغ"}
                </button>
                <button onClick={onClose}
                  className="btn-secondary rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95">
                  {en ? "Cancel" : "إلغاء"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

/* ═══════════ SUB-TOPIC TABS BAR ═══════════ */
const TopicTabBar = memo(function TopicTabBar({
  catId,
  questions,
  activeTopic,
  onSelectTopic,
  hue,
  en,
}: {
  catId: string;
  questions: MCQ[];
  activeTopic: string;
  onSelectTopic: (topicId: string) => void;
  hue: string;
  en: boolean;
}) {
  const topics = CATEGORY_TOPICS[catId];
  if (!topics || topics.length <= 1) return null;

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: questions.length };
    for (const q of questions) {
      const top = classifyQuestion(q, catId);
      map[top] = (map[top] || 0) + 1;
    }
    return map;
  }, [questions, catId]);

  const num = (n: number) => (en ? String(n) : n.toLocaleString("ar-EG"));

  return (
    <div className="mb-6 rounded-2xl border border-gold-400/20 bg-ink-950/80 p-3 backdrop-blur-md shadow-lg">
      <div className="mb-2.5 flex items-center justify-between gap-2 px-1">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300/80">
          <span className="text-base">🏷️</span>
          {en ? "Question Sub-Topics / Categories" : "أقسام وتخصصات الأسئلة"}
        </span>
        <span className="rounded-full bg-gold-400/10 px-2.5 py-0.5 text-[10px] font-bold text-gold-300">
          {topics.length - 1} {en ? "Topics" : "تخصصات"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {topics.map((t) => {
          const isActive = activeTopic === t.id;
          const count = counts[t.id] || 0;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTopic(t.id)}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300",
                isActive
                  ? "scale-[1.03] text-ink-950 shadow-md"
                  : "bg-ink-900/60 text-[#c4b48a] hover:bg-ink-800/90 hover:text-[#f0e6d0] border border-gold-400/10 hover:border-gold-400/30"
              )}
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${hue}, ${hue}dd)`,
                      boxShadow: `0 0 20px -3px ${hue}`,
                    }
                  : undefined
              }
            >
              <span className="inline-flex shrink-0 items-center justify-center text-sm leading-none transition-transform duration-300 group-hover:scale-110">{t.icon}</span>
              <span>{en ? t.labelEn : t.label}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors",
                  isActive
                    ? "bg-ink-950/30 text-ink-950"
                    : "bg-gold-400/15 text-gold-300 group-hover:bg-gold-400/25"
                )}
              >
                {num(count)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

/* ═══════════ STUDY QUESTION ROW ═══════════ */
const StudyQuestionRow = memo(function StudyQuestionRow({
  item,
  i,
  n,
  isRev,
  qText,
  topicTag,
  activeTopic,
  showOpts,
  hue,
  en,
  numStr,
  onToggle,
  onFlag,
}: {
  item: MCQ;
  i: number;
  n: number;
  isRev: boolean;
  qText: string;
  topicTag?: { icon: string; label: string; labelEn: string } | null;
  activeTopic: string;
  showOpts: boolean;
  hue: string;
  en: boolean;
  numStr: string;
  onToggle: (i: number) => void;
  onFlag: (qText: string, n: number) => void;
}) {
  return (
    <div className="royal-card group rounded-2xl p-0 overflow-hidden ani-up" style={{ animationDelay: `${Math.min(n, 8) * 40}ms` }}>
      <div className="flex items-stretch">
        <button type="button" onClick={() => onToggle(i)}
          className="flex flex-1 items-start gap-3 p-4 text-start sm:p-5">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold transition-transform duration-300 group-hover:scale-110" style={{ background: `${hue}18`, color: hue, boxShadow: isRev ? `0 0 16px -4px ${hue}` : undefined }}>{numStr}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {topicTag && activeTopic === "all" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/20 bg-gold-400/10 px-2.5 py-0.5 text-[10px] font-bold text-gold-300">
                  <span>{topicTag.icon}</span>
                  <span>{en ? topicTag.labelEn : topicTag.label}</span>
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-[#f0e6d0] sm:text-[15px]">{qText}</p>
            <div className={cn("grid transition-all duration-350 ease-out", isRev ? "mt-2.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                <span className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold" style={{ background: "#34d3991a", color: "#34d399", borderColor: "#34d39944" }}>
                  ✓ {en ? item.optsEn[item.ans] : item.opts[item.ans]}
                </span>
                {showOpts && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {(en ? item.optsEn : item.opts).map((o, oi) => (
                      <span key={oi} className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold"
                        style={oi === item.ans
                          ? { borderColor: "#34d39966", color: "#6ee7b7", background: "rgba(16,60,48,.85)" }
                          : { borderColor: "rgba(232,182,76,.3)", color: "#f0e6d0", background: "rgba(28,44,58,.9)" }}>
                        <span className="grid h-5 w-5 place-items-center rounded-md text-[10px] font-bold" style={oi === item.ans ? { background: "rgba(52,211,153,.2)", color: "#34d399" } : { background: "rgba(232,182,76,.15)", color: "#e8b64c" }}>{String.fromCharCode(65 + oi)}</span>
                        {o}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </button>
        <div className="flex items-start border-s border-gold-400/10 p-3">
          <FlagButton compact en={en} onClick={() => onFlag(qText, n)} />
        </div>
      </div>
    </div>
  );
});

/* ═══════════ QUIZ ═══════════ */
const QuizView = memo(function QuizView({ questions, catId, hue, en }: { questions: MCQ[]; catId?: string; hue: string; en: boolean }) {
  const [activeTopic, setActiveTopic] = useState("all");
  const [mode, setMode] = useState<"study" | "exam">("study");

  const topicQuestions = useMemo(() => {
    if (!catId || activeTopic === "all") return questions;
    return questions.filter(q => classifyQuestion(q, catId) === activeTopic);
  }, [questions, catId, activeTopic]);

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => topicQuestions.map(() => null));
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set(topicQuestions.map((_, i) => i)));
  const [query, setQuery] = useState("");
  const [showOpts, setShowOpts] = useState(false);
  const [flagTarget, setFlagTarget] = useState<{ text: string; label: string } | null>(null);
  const [seed, setSeed] = useState(0);
  const num = useCallback((n: number) => en ? String(n) : n.toLocaleString("ar-EG"), [en]);

  useEffect(() => {
    setIdx(0);
    setPicks(topicQuestions.map(() => null));
    setDone(false);
    setRevealed(new Set(topicQuestions.map((_, i) => i)));
  }, [topicQuestions]);

  const reset = useCallback(() => { setIdx(0); setPicks(topicQuestions.map(() => null)); setDone(false); }, [topicQuestions]);

  const handleToggleRow = useCallback((i: number) => {
    setRevealed(p => { const next = new Set(p); next.has(i) ? next.delete(i) : next.add(i); return next; });
  }, []);

  const handleFlagRow = useCallback((qText: string, n: number) => {
    setFlagTarget({ text: qText, label: en ? `Study #${n + 1}` : `مذاكرة #${n + 1}` });
  }, [en]);

  const shuffled = useMemo(() => {
    const a = [...topicQuestions];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }, [topicQuestions, seed]);

  const score = picks.filter((p, i) => p === shuffled[i]?.ans).length;
  const q = shuffled[idx];
  const picked = picks[idx];

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    return topicQuestions.map((_, i) => i).filter(i => !s || (en ? topicQuestions[i].qEn : topicQuestions[i].q).toLowerCase().includes(s) || (en ? topicQuestions[i].optsEn[topicQuestions[i].ans] : topicQuestions[i].opts[topicQuestions[i].ans]).toLowerCase().includes(s));
  }, [topicQuestions, query, en]);

  const shownRevealed = filtered.filter(i => revealed.has(i)).length;
  const allRev = filtered.length > 0 && shownRevealed === filtered.length;

  const ModeBar = ({ active }: { active: "study" | "exam" }) => (
    <div className="royal-panel mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-1.5">
      <div className="relative z-10 flex gap-1 rounded-xl bg-ink-950/70 p-1">
        {(["study", "exam"] as const).map(k => (
          <button key={k} onClick={() => { if (k === "exam") reset(); setMode(k); }}
            className="relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300"
            style={active === k ? { background: `linear-gradient(135deg, ${hue}, ${hue}bb)`, color: "#060d12", boxShadow: `0 0 24px -4px ${hue}` } : { color: "#a89878" }}>
            {active === k && <span className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%)", animation: "shimmer 2.8s ease-in-out infinite" }} />}
            <span className="relative z-10">{k === "study" ? (en ? "📖 Study" : "📖 مذاكرة") : (en ? "⚡ Exam" : "⚡ امتحان")}</span>
          </button>
        ))}
      </div>
      <div className="relative z-10 flex items-center gap-2">
        {active === "exam" && (
          <button onClick={() => { setSeed(s => s + 1); reset(); }} className="rounded-full border border-gold-400/20 px-3 py-1.5 text-xs font-bold text-[#a89878] transition-colors hover:border-gold-400/40 hover:text-gold-300">
            ↻ {en ? "Shuffle" : "خلط"}
          </button>
        )}
        <span className="rounded-full border border-gold-400/15 px-3 py-1 text-xs font-semibold text-[#a89878]">{num(topicQuestions.length)} {en ? "Q" : "س"}</span>
      </div>
    </div>
  );

  const modal = (
    <FlagModal
      open={!!flagTarget}
      onClose={() => setFlagTarget(null)}
      en={en}
      hue={hue}
      questionText={flagTarget?.text || ""}
      contextLabel={flagTarget?.label}
    />
  );

  if (mode === "study") {
    return (
      <div>
        <ModeBar active="study" />
        {catId && (
          <TopicTabBar
            catId={catId}
            questions={questions}
            activeTopic={activeTopic}
            onSelectTopic={setActiveTopic}
            hue={hue}
            en={en}
          />
        )}
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[180px] flex-1">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={en ? "Search questions or answers…" : "ابحث في الأسئلة أو الإجابات…"}
              className="w-full rounded-xl border border-gold-400/15 bg-ink-950/70 px-4 py-2.5 pe-10 text-sm text-[#f0e6d0] placeholder:text-[#6a6048] outline-none transition-colors focus:border-gold-400/50" />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#6a6048]">🔍</span>
          </div>
          <button onClick={() => setRevealed(allRev ? new Set() : new Set(filtered))}
            className="rounded-full border px-4 py-2 text-xs font-bold transition-all hover:scale-105" style={{ borderColor: `${hue}55`, color: hue, background: `${hue}10` }}>
            {allRev ? (en ? "🙈 Hide all" : "🙈 إخفاء الكل") : (en ? "👁 Show all" : "👁 إظهار الكل")}
          </button>
          <button onClick={() => setShowOpts(s => !s)}
            className="rounded-full border border-gold-400/20 px-4 py-2 text-xs font-bold text-[#a89878] transition-all hover:border-gold-400/40 hover:text-gold-300">
            {showOpts ? (en ? "Hide options" : "إخفاء الخيارات") : (en ? "Show options" : "عرض الخيارات")}
          </button>
        </div>
        <p className="mb-3 text-xs text-[#8a7e68]">
          {en
            ? `${num(shownRevealed)} of ${num(filtered.length)} revealed · tap card to flip · flag if wrong`
            : `ظاهر ${num(shownRevealed)} من ${num(filtered.length)} · اضغط للكشف · بلّغ إن وُجد خطأ`}
        </p>
        <div className="space-y-2.5">
          {filtered.map((i, n) => {
            const item = topicQuestions[i]; const isRev = revealed.has(i);
            const qText = en ? item.qEn : item.q;
            const topicTag = catId ? CATEGORY_TOPICS[catId]?.find(t => t.id === classifyQuestion(item, catId)) : null;
            return (
              <StudyQuestionRow
                key={i}
                item={item}
                i={i}
                n={n}
                isRev={isRev}
                qText={qText}
                topicTag={topicTag}
                activeTopic={activeTopic}
                showOpts={showOpts}
                hue={hue}
                en={en}
                numStr={num(n + 1)}
                onToggle={handleToggleRow}
                onFlag={handleFlagRow}
              />
            );
          })}
          {filtered.length === 0 && <p className="py-12 text-center text-[#8a7e68]">{en ? "No results" : "لا نتائج"}</p>}
        </div>
        {modal}
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / Math.max(1, shuffled.length)) * 100);
    const grade = pct >= 90 ? { e: "🏆", t: en ? "Outstanding!" : "ممتاز!", c: "#34d399" }
      : pct >= 70 ? { e: "⚡", t: en ? "Great job!" : "عمل رائع!", c: "#22d3ee" }
      : pct >= 50 ? { e: "👍", t: en ? "Not bad" : "لا بأس", c: "#fbbf24" }
      : { e: "🌱", t: en ? "Keep learning" : "واصل التعلم", c: "#fb7185" };
    return (
      <div>
        <ModeBar active="exam" />
        <div className="royal-panel ani-scale mx-auto max-w-md rounded-[1.75rem] p-8 text-center sm:p-10">
          <div className="relative z-10">
            <span className="inline-block text-7xl" style={{ animation: "float 2.5s ease-in-out infinite", filter: `drop-shadow(0 0 24px ${grade.c}88)` }}>{grade.e}</span>
            <h3 className="mt-4 font-display text-3xl" style={{ color: grade.c }}>{grade.t}</h3>
            <p className="mt-2 font-display text-4xl text-[#f0e6d0]">{num(score)} <span className="text-2xl text-[#8a7e68]">/ {num(shuffled.length)}</span></p>
            <div className="mx-auto mt-4 h-2.5 w-44 overflow-hidden rounded-full bg-ink-950/80">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${grade.c}, ${hue})`, boxShadow: `0 0 16px ${grade.c}` }} />
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-1.5">
              {shuffled.map((_, i) => <span key={i} className={cn("h-3 w-3 rounded-full transition-transform hover:scale-125", picks[i] === shuffled[i]?.ans ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-rose-400 shadow-[0_0_8px_#fb7185]")} />)}
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <button onClick={() => { setSeed(s => s + 1); reset(); }} className="btn-primary rounded-full px-7 py-2.5 text-sm font-bold transition-transform hover:scale-105">
                {en ? "↻ Try again" : "↻ جولة تانية"}
              </button>
              <button onClick={() => setMode("study")} className="btn-secondary rounded-full px-6 py-2.5 text-sm font-bold transition-transform hover:scale-105">
                {en ? "📖 Study" : "📖 مذاكرة"}
              </button>
            </div>
          </div>
        </div>
        {modal}
      </div>
    );
  }

  return (
    <div>
      <ModeBar active="exam" />
      {catId && (
        <TopicTabBar
          catId={catId}
          questions={questions}
          activeTopic={activeTopic}
          onSelectTopic={setActiveTopic}
          hue={hue}
          en={en}
        />
      )}
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-[#a89878]">
        <span className="inline-flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md text-[10px] font-bold text-ink-950" style={{ background: hue }}>⚡</span>
          {num(idx + 1)} / {num(shuffled.length)}
        </span>
        <span>{en ? "Score: " : "الصحيح: "}<b style={{ color: hue }}>{num(score)}</b></span>
      </div>
      <div className="mb-5 flex gap-1">{shuffled.map((_, i) => (
        <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500",
          i < idx ? (picks[i] === shuffled[i]?.ans ? "bg-emerald-400 shadow-[0_0_8px_#34d39988]" : "bg-rose-400") : i === idx ? "bg-gold-400 shadow-[0_0_10px_#e8b64c]" : "bg-ink-700")} />
      ))}</div>
      <div className="royal-panel ani-scale rounded-[1.5rem] p-5 sm:p-7" key={idx}>
        <div className="relative z-10 flex items-start justify-between gap-3">
          <h4 className="font-display text-xl text-[#f0e6d0] md:text-2xl">{en ? q?.qEn : q?.q}</h4>
          <FlagButton en={en} onClick={() => setFlagTarget({ text: en ? (q?.qEn || "") : (q?.q || ""), label: en ? `Exam Q${idx + 1}` : `امتحان س${idx + 1}` })} />
        </div>
        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
          {(en ? q?.optsEn : q?.opts)?.map((opt, oi) => {
            const isP = picked === oi; const isR = oi === q?.ans; const answered = picked !== null;
            return (
              <button key={oi} disabled={answered} onClick={() => setPicks(p => p.map((v, j) => j === idx ? oi : v))}
                className={cn("choice-btn",
                  answered && isR && "is-correct",
                  answered && isP && !isR && "is-wrong ani-shake",
                  answered && !isP && !isR && "is-dim"
                )}>
                <span className="choice-key">{String.fromCharCode(65 + oi)}</span>
                <span className="min-w-0 flex-1 leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>
        {picked !== null && q && (
          <div className="relative z-10 ani-scale mt-5 rounded-2xl border p-4" style={{ borderColor: `${hue}44`, background: `${hue}0c` }}>
            <p className="font-bold" style={{ color: picked === q.ans ? "#34d399" : "#fb7185" }}>
              {picked === q.ans ? (en ? "✓ Correct!" : "✓ مظبوط!") : (en ? "✗ Not quite" : "✗ مش هي")}
            </p>
            {q.exp && <p className="mt-1.5 text-sm text-[#a89878]">{en ? q.expEn : q.exp}</p>}
            <button onClick={() => {
              if (idx < shuffled.length - 1) {
                setIdx(idx + 1);
              } else {
                setDone(true);
                submitScoreToFirestore({
                  id: `score_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                  categoryId: catId || "quiz",
                  score: score,
                  total: shuffled.length,
                  percentage: Math.round((score / Math.max(1, shuffled.length)) * 100),
                  createdAt: new Date().toISOString(),
                }).catch(err => console.warn("Firestore score log info:", err));
              }
            }}
              className="mt-3 rounded-full px-6 py-2 text-sm font-bold text-ink-950 transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${hue}, ${hue}cc)`, boxShadow: `0 0 20px -4px ${hue}` }}>
              {idx < shuffled.length - 1 ? (en ? "Next question ←" : "السؤال التالي ←") : (en ? "Results 🏁" : "النتيجة 🏁")}
            </button>
          </div>
        )}
      </div>
      {modal}
    </div>
  );
});

/* ═══════════ CODE ═══════════ */
const CodeView = memo(function CodeView({ en }: { en: boolean }) {
  const HUE = "#60a5fa";
  const [mode, setMode] = useState<"study" | "exam">("exam");
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(CODE_CHALLENGES.map(() => null));
  const [revealedStudy, setRevealedStudy] = useState<Set<number>>(() => new Set(CODE_CHALLENGES.map((_, i) => i)));
  const [flagTarget, setFlagTarget] = useState<{ text: string; label: string } | null>(null);
  const c = CODE_CHALLENGES[idx]; const sel = picks[idx];
  const num = (n: number) => en ? String(n) : n.toLocaleString("ar-EG");
  const score = picks.filter((p, i) => p === CODE_CHALLENGES[i]?.ans).length;
  const roadmap = [
    { s: "01", n: "HTML", d: en ? "Page skeleton — the bones" : "هيكل الصفحة — العظام", c: "#fb923c", icon: " fort" },
    { s: "02", n: "CSS", d: en ? "Design & colors — the face" : "التصميم والألوان — الملامح", c: "#22d3ee", icon: "🎨" },
    { s: "03", n: "JavaScript", d: en ? "Interactivity — the soul" : "التفاعل والحركة — الروح", c: "#fbbf24", icon: "⚡" },
    { s: "04", n: en ? "Ship it" : "أطلقه", d: en ? "Build something real" : "ابنِ شيئًا حقيقيًا", c: "#a3e635", icon: "🚀" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero strip */}
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-sky-400/20 p-6 sm:p-8" style={{ background: "linear-gradient(135deg, rgba(14,30,48,.95) 0%, rgba(8,18,32,.98) 50%, rgba(12,28,44,.95) 100%)" }}>
          <div className="pointer-events-none absolute -end-10 -top-10 h-48 w-48 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #60a5fa66, transparent 70%)" }} />
          <div className="pointer-events-none absolute -start-8 bottom-0 h-32 w-32 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #22d3ee55, transparent 70%)" }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-sky-400/70">{en ? "// init academy" : "// أكاديمية الشيفرة"}</p>
              <h3 className="mt-2 font-display text-3xl text-[#e8f1ff] md:text-4xl" style={{ textShadow: "0 0 40px rgba(96,165,250,.35)" }}>
                {en ? "Code Laboratory" : "مختبر البرمجة"}
              </h3>
              <p className="mt-2 max-w-md text-sm text-sky-100/50">{en ? "Read code. Predict output. Think like a machine." : "اقرأ الشيفرة. توقّع الناتج. فكّر كآلة."}</p>
            </div>
            <div className="flex gap-3">
              {[{ n: CODE_CHALLENGES.length, l: en ? "challenges" : "تحدي" }, { n: score, l: en ? "solved" : "محلول" }].map((s, i) => (
                <div key={i} className="rounded-2xl border border-sky-400/20 bg-sky-400/5 px-4 py-3 text-center min-w-[72px]">
                  <p className="font-display text-2xl text-sky-300">{num(s.n)}</p>
                  <p className="text-[10px] font-bold text-sky-100/40">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Roadmap path */}
      <Reveal delay={60}>
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-sky-400/60">{en ? "Learning path" : "مسار التعلم"}</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-sky-400/25" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((s, i) => (
              <Tilt key={i}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/5 p-5 transition-all duration-300 hover:border-white/10" style={{ background: `linear-gradient(160deg, ${s.c}14 0%, rgba(8,16,24,.95) 55%)` }}>
                  <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${s.c}, transparent)` }} />
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-mono text-xs font-bold" style={{ color: s.c }}>{s.s}</span>
                  </div>
                  <p dir="ltr" className="mt-3 font-mono text-xl font-bold text-[#eef4ff]">{s.n}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#8aa0b8]">{s.d}</p>
                  {i < 3 && <span className="pointer-events-none absolute -end-1 top-1/2 hidden -translate-y-1/2 text-sky-400/20 lg:block">›</span>}
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Mode toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-400/15 bg-gradient-to-r from-sky-950/40 to-ink-950/60 p-1.5">
        <div className="flex gap-1 rounded-xl bg-ink-950/80 p-1">
          {(["study", "exam"] as const).map(k => (
            <button key={k} onClick={() => setMode(k)}
              className="relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-300"
              style={mode === k ? { background: "linear-gradient(135deg, #60a5fa, #3b82f6)", color: "#041018", boxShadow: "0 0 24px -4px #60a5fa" } : { color: "#7a94ae" }}>
              {mode === k && <span className="pointer-events-none absolute inset-0 opacity-50" style={{ background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%)", animation: "shimmer 2.5s ease-in-out infinite" }} />}
              <span className="relative z-10">{k === "study" ? (en ? "📖 Study" : "📖 مذاكرة") : (en ? "⚡ Live challenge" : "⚡ تحدي مباشر")}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-2">
          {CODE_CHALLENGES.map((_, i) => (
            <button key={i} onClick={() => { setIdx(i); if (mode === "exam") {/* stay */} }}
              className={cn("h-2 rounded-full transition-all duration-300", i === idx ? "w-6 bg-sky-400 shadow-[0_0_10px_#60a5fa]" : picks[i] !== null ? (picks[i] === CODE_CHALLENGES[i].ans ? "w-2 bg-emerald-400" : "w-2 bg-rose-400") : "w-2 bg-ink-600")} />
          ))}
        </div>
      </div>

      {mode === "study" ? (
        <div className="space-y-4">
          {CODE_CHALLENGES.map((ch, i) => {
            const open = revealedStudy.has(i);
            const title = en ? ch.titleEn : ch.title;
            return (
              <Reveal key={i} delay={i * 50}>
                <div className="overflow-hidden rounded-[1.35rem] border border-sky-400/15" style={{ background: "linear-gradient(165deg, rgba(12,28,44,.95), rgba(6,14,24,.98))" }}>
                  <div className="flex items-stretch">
                    <button type="button" onClick={() => setRevealedStudy(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                      className="flex flex-1 flex-col gap-3.5 p-5 text-start sm:p-6">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-xl text-xs font-bold text-ink-950" style={{ background: "linear-gradient(135deg,#60a5fa,#3b82f6)", boxShadow: "0 0 16px -4px #60a5fa" }}>{num(i + 1)}</span>
                        <span className="font-display text-lg text-sky-200 sm:text-xl">{title}</span>
                        <span className="rounded-md border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-300" dir="ltr">{ch.lang}</span>
                        <span className="ms-auto text-xs text-sky-400/40">{open ? "▾" : "▸"}</span>
                      </div>
                      <div dir="ltr" className="overflow-hidden rounded-xl border border-sky-400/20 shadow-[inset_0_0_40px_rgba(0,0,0,.5)]" style={{ background: "#050d14" }}>
                        <div className="flex items-center gap-1.5 border-b border-sky-400/10 px-3 py-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                          <span className="ml-2 font-mono text-[10px] text-sky-400/30">~/challenges/{i + 1}.{ch.lang === "Python" ? "py" : "js"}</span>
                        </div>
                        <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-emerald-300 sm:text-[15px]">{ch.code}</pre>
                      </div>
                      <div className={cn("grid transition-all duration-350", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                        <div className="overflow-hidden">
                          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/8 p-3.5">
                            <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-400/15 px-3 py-1.5 font-mono text-sm font-bold text-emerald-300">✓ {(en && ch.optsEn ? ch.optsEn : ch.opts)[ch.ans]}</span>
                            <p className="mt-2.5 text-sm leading-relaxed text-sky-100/55">{en ? ch.expEn : ch.exp}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-start border-s border-sky-400/10 p-3">
                      <FlagButton compact en={en} onClick={() => setFlagTarget({ text: `${title}\n${ch.code}`, label: en ? `Code #${i + 1}` : `برمجة #${i + 1}` })} />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="ani-scale overflow-hidden rounded-[1.5rem] border border-sky-400/20" style={{ background: "linear-gradient(165deg, rgba(10,26,42,.97), rgba(5,12,22,.99))" }} key={idx}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl font-display text-lg text-ink-950" style={{ background: "linear-gradient(135deg,#60a5fa,#3b82f6)", boxShadow: "0 0 20px -4px #60a5fa" }}>{num(idx + 1)}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400/50">{en ? "Live challenge" : "تحدي مباشر"}</p>
                <h3 className="font-display text-xl text-sky-100 sm:text-2xl">{en ? c.titleEn : c.title}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-sky-400/25 bg-sky-400/10 px-3 py-1 font-mono text-xs font-bold text-sky-300" dir="ltr">{c.lang}</span>
              <FlagButton en={en} onClick={() => setFlagTarget({ text: `${en ? c.titleEn : c.title}\n${c.code}`, label: en ? `Code ${idx + 1}` : `برمجة ${idx + 1}` })} />
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div dir="ltr" className="overflow-hidden rounded-2xl border border-sky-400/25 shadow-[0_0_60px_-20px_rgba(96,165,250,.35)]" style={{ background: "#030a10" }}>
              <div className="flex items-center gap-1.5 border-b border-sky-400/15 bg-sky-950/30 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-rose-400/90 shadow-[0_0_6px_#fb7185]" />
                <span className="h-3 w-3 rounded-full bg-amber-400/90 shadow-[0_0_6px_#fbbf24]" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/90 shadow-[0_0_6px_#34d399]" />
                <span className="ml-3 font-mono text-xs text-sky-400/40">challenge.{c.lang === "Python" ? "py" : "js"}</span>
                <span className="ml-auto font-mono text-[10px] text-sky-400/25">UTF-8</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-base leading-relaxed text-emerald-300 md:p-6 md:text-lg">
                <span className="select-none text-sky-400/20 me-3">1</span>{c.code.split("\n").map((line, li) => (
                  <span key={li}>{li > 0 && <><br /><span className="select-none text-sky-400/20 me-3">{li + 1}</span></>}{line}</span>
                ))}
                <span className="text-sky-300/50" style={{ animation: "pulse 1s step-end infinite" }}>▌</span>
              </pre>
            </div>

            <p className="mt-5 flex items-center gap-2 font-semibold text-sky-100/80">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-sky-400/15 text-xs text-sky-300">?</span>
              {en ? "What gets printed to the console?" : "ماذا يُطبع على الشاشة؟"}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(en && c.optsEn ? c.optsEn : c.opts).map((opt, oi) => {
                const revealed = sel !== null; const isR = oi === c.ans; const isP = sel === oi;
                return (
                  <button key={oi} disabled={revealed} onClick={() => setPicks(p => p.map((v, j) => j === idx ? oi : v))} dir="ltr"
                    className={cn("choice-btn font-mono",
                      revealed && isR && "is-correct",
                      revealed && isP && !isR && "is-wrong ani-shake",
                      revealed && !isP && !isR && "is-dim"
                    )}>
                    <span className="choice-key">{String.fromCharCode(65 + oi)}</span>
                    <span className="min-w-0 flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {sel !== null && (
              <div className="ani-scale mt-5 overflow-hidden rounded-2xl border p-5" style={{ borderColor: sel === c.ans ? "rgba(52,211,153,.35)" : "rgba(251,113,133,.35)", background: sel === c.ans ? "rgba(16,60,48,.35)" : "rgba(60,16,28,.3)" }}>
                <p className="font-bold text-lg" style={{ color: sel === c.ans ? "#34d399" : "#fb7185" }}>
                  {sel === c.ans ? (en ? "✓ Correct — compiler agrees" : "✓ صحيح — المترجم يوافق") : (en ? "✗ Not quite — read the types" : "✗ ليست الصحيحة — انتبه للأنواع")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-sky-100/55">{en ? c.expEn : c.exp}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {idx < CODE_CHALLENGES.length - 1 && (
                    <button onClick={() => setIdx(idx + 1)} className="rounded-full px-6 py-2.5 text-sm font-bold text-ink-950 transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg,#60a5fa,#3b82f6)", boxShadow: "0 0 24px -4px #60a5fa" }}>
                      {en ? "Next challenge ←" : "التحدي التالي ←"}
                    </button>
                  )}
                  {idx > 0 && (
                    <button onClick={() => setIdx(idx - 1)} className="rounded-full border border-sky-400/25 px-5 py-2.5 text-sm font-bold text-sky-200/70 hover:border-sky-400/50 hover:text-sky-100">
                      {en ? "→ Previous" : "→ السابق"}
                    </button>
                  )}
                  {idx === CODE_CHALLENGES.length - 1 && sel !== null && (
                    <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-300">
                      {en ? `Score ${num(score)}/${num(CODE_CHALLENGES.length)}` : `النتيجة ${num(score)}/${num(CODE_CHALLENGES.length)}`}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <FlagModal open={!!flagTarget} onClose={() => setFlagTarget(null)} en={en} hue={HUE} questionText={flagTarget?.text || ""} contextLabel={flagTarget?.label} />
    </div>
  );
});

/* ═══════════ MEMORY ═══════════ */
const MemoryView = memo(function MemoryView({ en }: { en: boolean }) {
  const HUE = "#a3e635";
  const shuffle = useCallback(() => {
    const p = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS].map((emoji, i) => ({ emoji, id: i }));
    for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    return p;
  }, []);
  const [deck, setDeck] = useState(shuffle);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [best, setBest] = useState<number | null>(() => {
    try {
      const v = typeof window !== "undefined" ? localStorage.getItem("mem-best") : null;
      return v ? +v : null;
    } catch {
      return null;
    }
  });
  const won = matched.size === MEMORY_EMOJIS.length;
  const num = (n: number) => en ? String(n) : n.toLocaleString("ar-EG");

  const click = useCallback((i: number) => {
    if (lock || won) return;
    if (matched.has(deck[i].emoji) || flipped.includes(i)) return;
    const nf = [...flipped, i]; setFlipped(nf);
    if (nf.length === 2) {
      const nm = moves + 1; setMoves(nm);
      if (deck[nf[0]].emoji === deck[nf[1]].emoji) {
        const ns = new Set(matched); ns.add(deck[nf[0]].emoji); setMatched(ns); setFlipped([]);
        if (ns.size === MEMORY_EMOJIS.length && (best === null || nm < best)) {
          setBest(nm);
          try { localStorage.setItem("mem-best", String(nm)); } catch { /* ignore */ }
        }
      } else { setLock(true); setTimeout(() => { setFlipped([]); setLock(false); }, 700); }
    }
  }, [deck, flipped, matched, moves, lock, won, best]);

  const reset = () => { setDeck(shuffle()); setFlipped([]); setMatched(new Set()); setMoves(0); setLock(false); };

  return (
    <div className="space-y-5">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-lime-400/20 p-6 sm:p-8" style={{ background: "linear-gradient(135deg, rgba(20,36,12,.95), rgba(8,16,10,.98) 55%, rgba(14,28,12,.95))" }}>
          <div className="pointer-events-none absolute -end-8 -top-8 h-40 w-40 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #a3e63555, transparent 70%)" }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-400/45 to-transparent" />
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-lime-400/60">{en ? "neural gym" : "صالة العقل"}</p>
              <h3 className="mt-2 font-display text-3xl text-[#eef8d8] md:text-4xl" style={{ textShadow: "0 0 36px rgba(163,230,53,.3)" }}>
                {en ? "Memory Arena" : "حلبة الذاكرة"}
              </h3>
              <p className="mt-2 max-w-sm text-sm text-lime-100/40">{en ? "Find every pair. Fewer moves = stronger mind." : "اعثر على كل زوج. محاولات أقل = عقل أقوى."}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: en ? "Moves" : "محاولات", v: num(moves), c: "#e8b64c" },
                { l: en ? "Pairs" : "أزواج", v: `${num(matched.size)}/${num(MEMORY_EMOJIS.length)}`, c: HUE },
                { l: en ? "Best" : "أفضل", v: best === null ? "—" : num(best), c: "#22d3ee" },
              ].map((s, i) => (
                <div key={i} className="min-w-[70px] rounded-2xl border border-white/5 bg-black/25 px-3 py-2.5 text-center">
                  <p className="font-display text-xl" style={{ color: s.c }}>{s.v}</p>
                  <p className="text-[10px] font-bold text-white/30">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/40">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(matched.size / MEMORY_EMOJIS.length) * 100}%`, background: `linear-gradient(90deg, ${HUE}, #e8b64c)`, boxShadow: `0 0 12px ${HUE}` }} />
            </div>
            <button onClick={reset} className="rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 text-xs font-bold text-lime-200 transition-all hover:bg-lime-400/20 hover:scale-105">
              ↻ {en ? "New round" : "جولة جديدة"}
            </button>
          </div>
        </div>
      </Reveal>

      {won && (
        <div className="ani-scale overflow-hidden rounded-[1.5rem] border border-emerald-400/40 p-7 text-center" style={{ background: "linear-gradient(165deg, rgba(16,60,30,.5), rgba(8,24,14,.9))", boxShadow: "0 0 50px -12px rgba(52,211,153,.4)" }}>
          <span className="text-6xl" style={{ animation: "float 2.5s ease-in-out infinite", filter: "drop-shadow(0 0 20px #34d399)" }}>🎉</span>
          <p className="mt-3 font-display text-3xl text-emerald-300">{en ? "Iron Memory!" : "ذاكرة حديدية!"}</p>
          <p className="mt-1 text-sm text-emerald-100/50">{en ? `Cleared in ${num(moves)} moves${best === moves ? " — new record!" : ""}` : `أنهيت في ${num(moves)} محاولة${best === moves ? " — رقم قياسي!" : ""}`}</p>
          <button onClick={reset} className="mt-5 rounded-full px-6 py-2.5 text-sm font-bold text-ink-950" style={{ background: "linear-gradient(135deg,#a3e635,#65a30d)", boxShadow: "0 0 24px -4px #a3e635" }}>
            {en ? "Play again" : "العب مجددًا"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
        {deck.map((card, i) => {
          const isUp = flipped.includes(i) || matched.has(card.emoji);
          const isM = matched.has(card.emoji);
          return (
            <button key={i} onClick={() => click(i)} className="flip-perspective aspect-square group">
              <div className={cn("flip-inner", isUp && "flipped")}>
                <div className="flip-face grid place-items-center rounded-2xl border border-lime-400/20 text-2xl text-lime-400/80 sm:text-3xl transition-shadow group-hover:shadow-[0_0_24px_-8px_rgba(163,230,53,.4)]" style={{ background: "linear-gradient(145deg, rgba(30,48,18,.95), rgba(10,18,8,.98))", boxShadow: "inset 0 1px 0 rgba(163,230,53,.08)" }}>
                  <span className="opacity-70">✦</span>
                </div>
                <div className={cn("flip-face flip-back grid place-items-center rounded-2xl border text-2xl sm:text-4xl", isM ? "border-emerald-400/50 bg-emerald-400/15 shadow-[0_0_24px_-6px_#34d399]" : "border-lime-400/35 bg-ink-900/95")}>{card.emoji}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm text-[#8a9a70]">{en ? "💡 Even mismatches train your map of the board." : "💡 حتى الأخطاء تدرّب خريطة اللوحة في ذهنك."}</p>
    </div>
  );
});

/* ═══════════ PUZZLES ═══════════ */
const PuzzlesView = memo(function PuzzlesView({ en }: { en: boolean }) {
  const [picks, setPicks] = useState<(number | null)[]>(RIDDLES.map(() => null));
  const [flagTarget, setFlagTarget] = useState<{ text: string; label: string } | null>(null);
  const HUE = "#c084fc";
  const solved = picks.filter((p, i) => p === RIDDLES[i].ans).length;
  const answered = picks.filter(p => p !== null).length;
  const num = (n: number) => en ? String(n) : n.toLocaleString("ar-EG");

  return (
    <div className="space-y-5">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-purple-400/20 p-6 sm:p-8" style={{ background: "linear-gradient(135deg, rgba(36,16,48,.95), rgba(14,8,22,.98) 55%, rgba(28,12,40,.95))" }}>
          <div className="pointer-events-none absolute -end-10 top-0 h-44 w-44 rounded-full opacity-30" style={{ background: "radial-gradient(circle, #c084fc55, transparent 70%)" }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/45 to-transparent" />
          <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-purple-300/60">{en ? "chamber of riddles" : "قاعة الألغاز"}</p>
              <h3 className="mt-2 font-display text-3xl text-[#f3e8ff] md:text-4xl" style={{ textShadow: "0 0 36px rgba(192,132,252,.35)" }}>
                {en ? "The trap is in the details" : "الفخ في التفاصيل"}
              </h3>
              <p className="mt-2 max-w-md text-sm text-purple-100/40">{en ? "Read slowly. Think twice. Then choose." : "اقرأ ببطء. فكّر مرتين. ثم اختر."}</p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-2xl border border-purple-400/20 bg-purple-400/8 px-4 py-3 text-center">
                <p className="font-display text-2xl text-purple-300">{num(solved)}/{num(RIDDLES.length)}</p>
                <p className="text-[10px] font-bold text-purple-100/35">{en ? "solved" : "محلول"}</p>
              </div>
              <div className="rounded-2xl border border-purple-400/20 bg-black/20 px-4 py-3 text-center">
                <p className="font-display text-2xl text-gold-300">{num(answered)}</p>
                <p className="text-[10px] font-bold text-purple-100/35">{en ? "tried" : "مجرّب"}</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-5 h-1.5 overflow-hidden rounded-full bg-black/40">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(solved / RIDDLES.length) * 100}%`, background: "linear-gradient(90deg, #c084fc, #e05a7a)", boxShadow: "0 0 12px #c084fc" }} />
          </div>
        </div>
      </Reveal>

      {RIDDLES.map((r, i) => {
        const picked = picks[i]; const isAnswered = picked !== null;
        const qText = en ? r.qEn : r.q;
        return (
          <Reveal key={i} delay={i * 50}>
            <Tilt>
              <div className="relative overflow-hidden rounded-[1.35rem] border border-purple-400/15 p-5 sm:p-7" style={{ background: "linear-gradient(165deg, rgba(28,14,40,.92), rgba(10,6,18,.97))" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#c084fc55"; e.currentTarget.style.boxShadow = "0 20px 48px -16px rgba(192,132,252,.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70" style={{ background: "linear-gradient(90deg, transparent, #c084fc99, transparent)" }} />
                <div className="relative z-10 mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl font-display text-lg text-ink-950" style={{ background: "linear-gradient(135deg, #c084fc, #a855f7)", boxShadow: "0 0 20px -4px #c084fc" }}>
                      {en ? String(i + 1).padStart(2, "0") : (i + 1).toLocaleString("ar-EG", { minimumIntegerDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300/45">{en ? "Riddle" : "لغز"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAnswered && (
                      <span className={cn("rounded-full border px-3 py-1 text-xs font-bold", picked === r.ans ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-rose-400/40 bg-rose-400/10 text-rose-300")}>
                        {picked === r.ans ? (en ? "✓ Solved" : "✓ حُلّ") : (en ? "✗ Missed" : "✗ أخطأت")}
                      </span>
                    )}
                    <FlagButton en={en} compact onClick={() => setFlagTarget({ text: qText, label: en ? `Riddle #${i + 1}` : `لغز #${i + 1}` })} />
                  </div>
                </div>
                <p className="relative z-10 font-callig text-xl leading-relaxed text-[#f3e8ff] sm:text-2xl">{qText}</p>
                <div className="relative z-10 mt-5 grid gap-2.5 sm:grid-cols-2">
                  {(en ? r.optsEn : r.opts).map((opt, oi) => {
                    const isP = picked === oi; const isR = oi === r.ans;
                    return (
                      <button key={oi} disabled={isAnswered} onClick={() => setPicks(p => p.map((v, j) => j === i ? oi : v))}
                        className={cn("choice-btn",
                          isAnswered && isR && "is-correct",
                          isAnswered && isP && !isR && "is-wrong ani-shake",
                          isAnswered && !isP && !isR && "is-dim"
                        )}>
                        <span className="choice-key">{String.fromCharCode(65 + oi)}</span>
                        <span className="min-w-0 flex-1 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {isAnswered && picked !== r.ans && (
                  <p className="relative z-10 mt-3 text-sm text-emerald-300/85">{en ? `Answer: ${r.optsEn[r.ans]}` : `الحل: ${r.opts[r.ans]}`}</p>
                )}
              </div>
            </Tilt>
          </Reveal>
        );
      })}
      <FlagModal open={!!flagTarget} onClose={() => setFlagTarget(null)} en={en} hue={HUE} questionText={flagTarget?.text || ""} contextLabel={flagTarget?.label} />
    </div>
  );
});

/* ═══════════ HEALTH ═══════════ */
const HealthView = memo(function HealthView({ en }: { en: boolean }) {
  const [phase, setPhase] = useState<"intro" | "ask" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>(HEALTH_Q.map(() => false));
  const score = answers.filter(Boolean).length;
  const num = (n: number) => en ? String(n) : n.toLocaleString("ar-EG");
  const HUE = "#2dd4bf";
  const tier = score <= 2
    ? { t: en ? "Excellent habits!" : "عاداتك ممتازة!", e: "🌟", c: "#a3e635", m: en ? "Your body thanks you! Keep this balance." : "جسمك يشكرك! حافظ على هذا التوازن.", tips: en ? ["Keep consistent sleep times", "Share habits with friends", "Try a new sport monthly"] : ["حافظ على مواعيد نوم ثابتة", "شارك عاداتك مع أصدقائك", "جرّب رياضة جديدة كل شهر"] }
    : score <= 5
    ? { t: en ? "On the right track" : "في الطريق الصحيح", e: "👍", c: "#22d3ee", m: en ? "Good foundation, small gaps to fix." : "أساس جيد لكن توجد ثغرات صغيرة.", tips: en ? ["Start with sleep", "Replace one sugary drink with water", "Move 5 min every hour"] : ["ابدأ بمشكلة النوم", "استبدل مشروبًا سكريًا بالماء", "حرّك جسمك ٥ دقائق كل ساعة"] }
    : score <= 8
    ? { t: en ? "Watch out" : "انتبه لنفسك", e: "⚠️", c: "#fbbf24", m: en ? "Your body is sending signals." : "جسمك يرسل إشارات: إرهاق وتشتت.", tips: en ? ["Phone outside bedroom", "20-20-20 eye rule", "Don't skip breakfast", "Walk 20 min daily"] : ["هاتف خارج غرفة النوم", "قاعدة ٢٠-٢٠-٢٠ للعين", "لا تفوّت الفطور", "امشِ ٢٠ دقيقة يوميًا"] }
    : { t: en ? "Emergency plan" : "خطة إنقاذ عاجلة", e: "🚨", c: "#fb7185", m: en ? "Your routine is draining you." : "يومك يستهلكك بدل أن يغذّيك.", tips: en ? ["Week 1: sleep before 11 PM", "Week 2: water with every meal", "Week 3: 15 min walk daily", "Tell a friend your plan"] : ["الأسبوع ١: النوم قبل ١١", "الأسبوع ٢: ماء مع كل وجبة", "الأسبوع ٣: ١٥ دقيقة مشي", "أخبر صديقًا بخطتك"] };

  if (phase === "intro") return (
    <div className="ani-scale mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border border-teal-400/25 p-8 text-center sm:p-12" style={{ background: "linear-gradient(165deg, rgba(8,40,40,.95), rgba(6,16,20,.98))" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-[1.5rem] border border-teal-400/40 text-5xl" style={{ background: "linear-gradient(145deg, rgba(45,212,191,.15), rgba(45,212,191,.05))", boxShadow: "0 0 40px -8px #2dd4bf", animation: "float 3s ease-in-out infinite" }}>❤️</div>
      <h3 className="mt-6 font-display text-3xl md:text-4xl" style={{ color: HUE, textShadow: "0 0 36px rgba(45,212,191,.35)" }}>{en ? "Daily Habits Checkup" : "فحص عاداتك اليومية"}</h3>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-teal-100/50">{en ? "10 honest Yes/No questions. Every Yes is a habit draining your energy — end with a personal plan." : "١٠ أسئلة صريحة. كل «نعم» عادة تستهلك طاقتك — وفي النهاية خطة شخصية."}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {[en ? "⏱️ 2 min" : "⏱️ دقيقتان", en ? "🔒 Private" : "🔒 خاص", en ? "📋 Plan at end" : "📋 خطة في النهاية"].map(t => (
          <span key={t} className="rounded-full border border-teal-400/25 bg-teal-400/8 px-3.5 py-1.5 text-xs font-bold text-teal-200/70">{t}</span>
        ))}
      </div>
      <button onClick={() => setPhase("ask")} className="mt-8 rounded-full px-10 py-3.5 font-display text-lg text-ink-950 transition-transform hover:scale-105" style={{ background: "linear-gradient(135deg, #2dd4bf, #14b8a6)", boxShadow: "0 0 32px -4px #2dd4bf" }}>
        {en ? "Start checkup ←" : "ابدأ الفحص ←"}
      </button>
    </div>
  );

  if (phase === "done") return (
    <div className="ani-scale mx-auto max-w-xl overflow-hidden rounded-[1.75rem] border p-7 text-center sm:p-10" style={{ borderColor: `${tier.c}55`, background: `linear-gradient(165deg, ${tier.c}18, rgba(8,16,20,.97))`, boxShadow: `0 0 50px -16px ${tier.c}` }}>
      <span className="text-6xl" style={{ animation: "float 2.5s ease-in-out infinite", filter: `drop-shadow(0 0 18px ${tier.c})` }}>{tier.e}</span>
      <h3 className="mt-4 font-display text-3xl md:text-4xl" style={{ color: tier.c }}>{tier.t}</h3>
      <p className="mt-2 font-display text-xl text-[#c4b48a]">{en ? `Score: ${num(score)} of ${num(HEALTH_Q.length)}` : `نتيجتك: ${num(score)} من ${num(HEALTH_Q.length)}`}</p>
      <div className="mx-auto mt-4 h-2.5 w-52 overflow-hidden rounded-full bg-black/40"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(score / HEALTH_Q.length) * 100}%`, background: `linear-gradient(90deg, ${tier.c}, ${HUE})`, boxShadow: `0 0 14px ${tier.c}` }} /></div>
      <p className="mx-auto mt-5 max-w-md leading-relaxed text-[#a89878]">{tier.m}</p>
      <div className="mt-6 rounded-2xl border border-white/5 bg-black/25 p-5 text-start">
        <p className="font-display text-lg text-[#f0e6d0]">{en ? "🗺️ Action Plan" : "🗺️ خطتك العملية"}</p>
        <ul className="mt-3 space-y-2.5">
          {tier.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#b8a888]">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-ink-950" style={{ background: tier.c }}>{num(i + 1)}</span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => { setAnswers(HEALTH_Q.map(() => false)); setIdx(0); setPhase("intro"); }}
        className="mt-6 rounded-full border px-7 py-2.5 font-bold transition-transform hover:scale-105" style={{ borderColor: `${tier.c}66`, color: tier.c }}>
        {en ? "↻ Retake" : "↻ أعد الفحص"}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-teal-100/50">
        <span>{en ? `Question ${num(idx + 1)} of ${num(HEALTH_Q.length)}` : `سؤال ${num(idx + 1)} من ${num(HEALTH_Q.length)}`}</span>
        <span>{en ? `"Yes": ${num(answers.slice(0, idx).filter(Boolean).length)}` : `«نعم»: ${num(answers.slice(0, idx).filter(Boolean).length)}`}</span>
      </div>
      <div className="mb-6 flex gap-1.5">{HEALTH_Q.map((_, i) => (
        <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-500" style={{ background: i < idx ? (answers[i] ? "#fb7185" : HUE) : i === idx ? `${HUE}88` : "#162e40", boxShadow: i === idx ? `0 0 8px ${HUE}` : undefined }} />
      ))}</div>
      <div className="ani-scale overflow-hidden rounded-[1.75rem] border border-teal-400/20 p-7 text-center sm:p-10" style={{ background: "linear-gradient(165deg, rgba(8,36,36,.95), rgba(6,14,18,.98))" }} key={idx}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
        <h3 className="font-callig text-2xl leading-relaxed text-[#e8f8f4] md:text-3xl">{en ? HEALTH_Q[idx].qEn : HEALTH_Q[idx].q}</h3>
        <div className="mt-9 flex justify-center gap-4">
          <button onClick={() => { const a = [...answers]; a[idx] = true; setAnswers(a); idx < HEALTH_Q.length - 1 ? setIdx(idx + 1) : setPhase("done"); }}
            className="w-36 rounded-2xl border border-rose-400/45 bg-rose-400/12 py-4 font-display text-xl text-rose-200 transition-all hover:scale-105 hover:bg-rose-400/20 hover:shadow-[0_0_28px_-8px_#fb7185]">{en ? "Yes" : "نعم"}</button>
          <button onClick={() => { const a = [...answers]; a[idx] = false; setAnswers(a); idx < HEALTH_Q.length - 1 ? setIdx(idx + 1) : setPhase("done"); }}
            className="w-36 rounded-2xl border border-teal-400/45 bg-teal-400/12 py-4 font-display text-xl text-teal-200 transition-all hover:scale-105 hover:bg-teal-400/20 hover:shadow-[0_0_28px_-8px_#2dd4bf]">{en ? "No" : "لا"}</button>
        </div>
        {idx > 0 && <button onClick={() => setIdx(idx - 1)} className="mt-6 text-sm text-teal-100/40 underline-offset-4 hover:text-teal-200 hover:underline">{en ? "← Previous" : "→ السابق"}</button>}
      </div>
    </div>
  );
});

/* ═══════════ CATEGORY PAGE ═══════════ */
const CategoryPage = memo(function CategoryPage({ cat, en, onBack, onOpen }: { cat: Cat; en: boolean; onBack: () => void; onOpen: (id: CatId) => void }) {
  const others = CATS.filter(c => c.id !== cat.id).slice(0, 4);
  const hasQuizBank = !!QUIZZES[cat.id];
  const isSpecialKind = cat.kind !== "quiz" && cat.kind !== "code";
  const [activeViewTab, setActiveViewTab] = useState<"questions" | "interactive">(
    cat.kind === "quiz" || !isSpecialKind ? "questions" : "questions"
  );

  return (
    <div className="pt-20 md:pt-24">
      <div className="relative overflow-hidden border-b border-gold-400/10">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 90% 120% at 50% -10%, ${cat.hue}28, transparent 60%), linear-gradient(180deg, rgba(10,20,28,.4), transparent)` }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-2">
          <button onClick={onBack} className="group inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-ink-950/50 px-4 py-2 text-sm font-medium text-[#c4b48a] backdrop-blur-sm transition-all hover:border-gold-400/50 hover:text-gold-300">
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            {en ? "Home" : "الرئيسية"}
          </button>
          <Reveal>
            <div className="mt-8 flex flex-wrap items-end gap-5">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[10px] font-bold tracking-[.18em]" style={{ borderColor: `${cat.hue}55`, color: cat.hue, background: `${cat.hue}12`, boxShadow: `0 0 20px -6px ${cat.hue}66` }}>{cat.tag}</span>
                  <span className="h-px w-10" style={{ background: `linear-gradient(90deg, ${cat.hue}88, transparent)` }} />
                </div>
                <h2 className="font-display text-4xl leading-tight md:text-6xl" style={{ color: cat.hue, textShadow: `0 0 50px ${cat.hue}44, 0 4px 20px rgba(0,0,0,.5)` }}>
                  {cat.icon} {en ? cat.labelEn : cat.label}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-[#b8a888]">{en ? cat.introEn : cat.intro}</p>
              </div>
              <span className="hidden select-none text-[9rem] leading-none opacity-[.1] md:block" style={{ filter: `drop-shadow(0 0 50px ${cat.hue})` }}>{cat.icon}</span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12 md:py-14">
        {hasQuizBank && isSpecialKind && (
          <div className="mb-8 flex flex-wrap justify-center gap-2 rounded-2xl border border-gold-400/20 bg-ink-950/70 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setActiveViewTab("questions")}
              className={cn(
                "rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 sm:text-sm",
                activeViewTab === "questions"
                  ? "text-ink-950 shadow-md"
                  : "text-[#a89878] hover:text-[#f0e6d0]"
              )}
              style={activeViewTab === "questions" ? { background: `linear-gradient(135deg, ${cat.hue}, ${cat.hue}bb)`, boxShadow: `0 0 20px -4px ${cat.hue}` } : undefined}
            >
              ⚡ {en ? `Subtopic Questions (${QUIZZES[cat.id]?.length || 0})` : `أسئلة وتخصصات القسم (${QUIZZES[cat.id]?.length || 0})`}
            </button>
            <button
              onClick={() => setActiveViewTab("interactive")}
              className={cn(
                "rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 sm:text-sm",
                activeViewTab === "interactive"
                  ? "text-ink-950 shadow-md"
                  : "text-[#a89878] hover:text-[#f0e6d0]"
              )}
              style={activeViewTab === "interactive" ? { background: `linear-gradient(135deg, ${cat.hue}, ${cat.hue}bb)`, boxShadow: `0 0 20px -4px ${cat.hue}` } : undefined}
            >
              {cat.kind === "facts" ? (en ? "🌟 Visual Fact Cards" : "🌟 بطاقات الحقائق التفاعلية") :
               cat.kind === "timeline" ? (en ? "📜 Historical Timeline" : "📜 الخط الزمني التفاعلي") :
               cat.kind === "memory" ? (en ? "🧠 Memory Game" : "🧠 لعبة الذاكرة") :
               cat.kind === "puzzles" ? (en ? "🧩 Riddles Chamber" : "🧩 قاعة الألغاز التفاعلية") :
               cat.kind === "health" ? (en ? "❤️ Health Checkup" : "❤️ فحص العادات الصحية") :
               (en ? "Interactive Experience" : "العرض التفاعلي")}
            </button>
          </div>
        )}

        {activeViewTab === "questions" && hasQuizBank && (
          <QuizView questions={QUIZZES[cat.id]} catId={cat.id} hue={cat.hue} en={en} />
        )}

        {(activeViewTab === "interactive" || !hasQuizBank || cat.kind === "code") && (
          <>
            {cat.kind === "facts" && <FactsView catId={cat.id} hue={cat.hue} en={en} />}
            {cat.kind === "timeline" && <TimelineView en={en} />}
            {cat.kind === "code" && <CodeView en={en} />}
            {cat.kind === "memory" && <MemoryView en={en} />}
            {cat.kind === "puzzles" && <PuzzlesView en={en} />}
            {cat.kind === "health" && <HealthView en={en} />}
          </>
        )}
      </div>

      <div className="relative border-t border-gold-400/10" style={{ background: "linear-gradient(180deg, rgba(12,24,34,.7), rgba(8,16,24,.9))" }}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/25 to-transparent" />
        <div className="mx-auto max-w-6xl px-5 py-12">
          <Reveal>
            <div className="section-crown !items-start !mb-2">
              <span className="royal-label">{en ? "Continue the journey" : "أكمل الرحلة"}</span>
            </div>
            <h3 className="royal-heading text-2xl md:text-4xl">
              {en ? "The door stays open for more" : "الباب مفتوح للمزيد"}
            </h3>
          </Reveal>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((c, i) => (
              <Reveal key={c.id} delay={i * 55}>
                <button onClick={() => onOpen(c.id)}
                  className="royal-card group flex w-full items-center gap-3 rounded-2xl p-4 text-start"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.hue}66`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ""; }}>
                  <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-xl" style={{ borderColor: `${c.hue}44`, background: `${c.hue}14`, boxShadow: `0 0 16px -4px ${c.hue}55` }}>{c.icon}</span>
                  <span className="relative z-10 min-w-0 flex-1">
                    <span className="block font-display text-base" style={{ color: c.hue }}>{en ? c.labelEn : c.label}</span>
                    <span className="block truncate text-xs text-[#a89878]">{en ? c.introEn : c.intro}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ═══════════ FOOTER ═══════════ */
const Footer = memo(function Footer({ en, onOpen }: { en: boolean; onOpen: (id: CatId) => void }) {
  return (
    <footer className="relative z-10 border-t border-gold-400/10" style={{ background: "linear-gradient(180deg, rgba(10,20,28,.95), rgba(6,12,18,1))" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/35 to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl" style={{ background: "linear-gradient(165deg,#fff1c4,#e8b64c,#7dd3c0)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            عباقرة<span style={{ WebkitTextFillColor: "#e8b64c" }}>✦</span>
          </p>
          <p className="font-callig mt-1 text-gold-300/90">{en ? "Where ideas are born" : "حيث تولد الأفكار"}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#a89878]">
            {en
              ? "It began as a simple school project in plain HTML… then was rebuilt from scratch with curiosity, play, and knowledge told beautifully."
              : "بدأ كمشروع مدرسي بسيط بصفحات HTML… وأُعيد بناؤه بالكامل بنفس الروح: فضول، لعب، ومعرفة تُروى بلغة جميلة."}
          </p>
        </div>
        <div>
          <p className="royal-label !tracking-[.15em] mb-4">{en ? "Original project" : "المشروع الأصلي"}</p>
          <ul className="space-y-2.5 text-sm leading-relaxed text-[#b8a888]">
            <li className="flex items-center gap-2"><span className="jewel-dot" style={{ background: "#e8b64c", color: "#e8b64c" }} />{en ? "Cairo Governorate" : "محافظة القاهرة"}</li>
            <li className="flex items-center gap-2"><span className="jewel-dot" style={{ background: "#7dd3c0", color: "#7dd3c0" }} />{en ? "Cairo Directorate of Education" : "مديرية التربية والتعليم بالقاهرة"}</li>
            <li className="flex items-center gap-2"><span className="jewel-dot" style={{ background: "#5b8def", color: "#5b8def" }} />{en ? "Zeitoun Educational Administration" : "إدارة الزيتون التعليمية"}</li>
            <li className="flex items-center gap-2"><span className="jewel-dot" style={{ background: "#e05a7a", color: "#e05a7a" }} />{en ? "El-Salam Official School for Boys" : "مدرسة كلية السلام الرسمية بنين"}</li>
          </ul>
        </div>
        <div>
          <p className="royal-label !tracking-[.15em] mb-4">{en ? "Sections" : "الأقسام"}</p>
          <div className="flex flex-wrap gap-2">
            {CATS.map(c => (
              <button key={c.id} onClick={() => onOpen(c.id)}
                className="rounded-full border border-gold-400/15 bg-ink-950/40 px-3 py-1 text-xs font-semibold text-[#b8a888] transition-all hover:border-gold-400/40 hover:text-gold-300">
                {en ? c.labelEn : c.label}
              </button>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#6a6048]">{en ? "Fully redeveloped — rebuilt from scratch ✦ Cairo, Egypt" : "نسخة مطوّرة بالكامل — إعادة بناء من الصفر ✦ القاهرة، مصر"}</p>
        </div>
      </div>
      <div className="border-t border-gold-400/10 py-4 text-center text-xs text-[#6a6048]">
        {en ? 'Made with endless curiosity… always ask "why?"' : "صُنع بفضول لا ينتهي… اسأل دائمًا «ليه؟»"}
      </div>
    </footer>
  );
});

/* ═══════════ APP ═══════════ */
export default function App() {
  const { lang, setLang, en } = useLang();
  const [view, setView] = useState<CatId | "home">("home");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [view]);
  const cat = view !== "home" ? CATS.find(c => c.id === view) : null;

  return (
    <div className="relative min-h-screen">
      {/* Living background — pure CSS + image, GPU only */}
      <div className="site-bg" aria-hidden />
      <div className="space-photo" aria-hidden />
      <div className="space-photo-tint" aria-hidden />
      <div className="aurora" aria-hidden />
      <div className="orb orb-gold orb-pulse" aria-hidden />
      <div className="orb orb-teal" aria-hidden />
      <div className="orb orb-blue orb-pulse" aria-hidden />
      <div className="orb orb-rose" aria-hidden />
      <div className="orb orb-purple" aria-hidden />
      <div className="pointer-events-none fixed inset-0 z-0 dot-grid" aria-hidden />
      <div className="lattice-drift" aria-hidden />
      <div className="starfield" aria-hidden />
      <div className="starfield-b" aria-hidden />
      <div className="glow-pulses" aria-hidden>
        <span className="gp gp1" /><span className="gp gp2" /><span className="gp gp3" />
      </div>
      <div className="dust" aria-hidden />
      <div className="ring-halo rh1" aria-hidden />
      <div className="ring-halo rh2" aria-hidden />
      <div className="shimmer-band" aria-hidden />
      <div className="vignette" aria-hidden />

      <ScrollBar />
      <TopBar view={view} setView={setView} lang={lang} setLang={setLang} en={en} />

      <main className="relative z-10">
        {view === "home" ? (
          <div className="ani-in">
            <Hero en={en} onStart={() => document.getElementById("doors")?.scrollIntoView({ behavior: "smooth" })} onPuzzle={() => setView("puzzles")} />
            <DualTicker en={en} />
            <StatsStrip en={en} />
            <SparkSection en={en} />
            <CatGrid en={en} onOpen={id => setView(id)} />
          </div>
        ) : cat ? (
          <div className="ani-in" key={view}>
            <CategoryPage cat={cat} en={en} onBack={() => setView("home")} onOpen={id => setView(id)} />
          </div>
        ) : null}
      </main>

      <Footer en={en} onOpen={id => setView(id)} />
      <div className="grain" aria-hidden />
    </div>
  );
}
