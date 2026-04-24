// ============================================================
//  Prayerz — Configuration File
//  Edit this file to customize the app for your family
// ============================================================

const PrayerzConfig = {

  // --- General ---
  reminder_minutes: 15,       // Warn N minutes before next prayer
  date_format: "DD/MM/YYYY",  // DD/MM/YYYY or MM/DD/YYYY or YYYY-MM-DD
  time_format: "24",          // "24" or "12"
  language: "ar",             // "ar" | "en"
  calculation_method: 16,     // Aladhan method: 16=Jordan Awqaf, 4=UmmAlQura, 3=MWL, 2=ISNA
  theme: "dark-emerald",      // See themes list below
  marquee_speed: 50,          // pixels per second

  // --- Athan ---
  athan_sound: "jordan",      // "jordan" | "makkah" | "egypt" | "turkey" | "alquds" | "none"

  // Athan audio URLs — replace with local files if preferred
  athan_sources: {
    jordan:  "https://www.islamcan.com/audio/adhan/azan1.mp3",
    makkah:  "https://www.islamcan.com/audio/adhan/azan4.mp3",
    egypt:   "https://www.islamcan.com/audio/adhan/azan2.mp3",
    turkey:  "https://www.islamcan.com/audio/adhan/azan3.mp3",
    alquds:  "https://www.islamcan.com/audio/adhan/azan5.mp3",
    none:    null
  },

  // --- Verses / Hadiths per prayer ---
  verses: {
    fajr: [
      "إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا — الإسراء:٧٨",
      "الصلاة خير من النوم",
      "من صلى الفجر في جماعة فكأنما قام الليل كله — مسلم"
    ],
    dhuhr: [
      "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ — الإسراء:٧٨",
      "رحم الله امرأ صلى قبل العصر أربعاً — أبو داود"
    ],
    asr: [
      "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ — البقرة:٢٣٨",
      "من فاتته صلاة العصر فكأنما وُتِر أهله وماله — البخاري"
    ],
    maghrib: [
      "فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ — الروم:١٧",
      "أفضل الأعمال الصلاة على وقتها — البخاري"
    ],
    isha: [
      "وَمِنَ اللَّيْلِ فَسَبِّحْهُ وَإِدْبَارَ النُّجُومِ — الطور:٤٩",
      "من صلى العشاء في جماعة فكأنما قام نصف الليل — مسلم",
      "لو يعلمون ما في العتمة والصبح لأتوهما ولو حبواً — البخاري"
    ],
    general: [
      "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا — النساء:١٠٣",
      "وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ — البقرة:٤٣",
      "الصلاة عماد الدين، من أقامها فقد أقام الدين — البيهقي",
      "إن أول ما يحاسب به العبد يوم القيامة من عمله صلاته — ابن ماجه",
      "أحب الأعمال إلى الله الصلاة على وقتها — البخاري"
    ]
  },

  // --- Available themes ---
  // light: sand, pearl, dawn, ivory, linen
  // dark:  dark-emerald, midnight, obsidian, deep-rose, starlight
  available_themes: [
    "sand","pearl","dawn","ivory","linen",
    "dark-emerald","midnight","obsidian","deep-rose","starlight"
  ]
};
