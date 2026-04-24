// ================================================================
//  PRAYERZ — app.js
// ================================================================

// ────────────────────────────────────────────────────────────────
//  CITIES DATABASE
//  Each entry: { city, country, lat, lng, timezone }
//  Using coordinates avoids the unreliable city-name lookup.
// ────────────────────────────────────────────────────────────────
const CITIES_DB = [
  // Jordan
  { city:"عمّان",      cityEn:"Amman",      country:"الأردن",   countryEn:"Jordan",       lat:31.9539, lng:35.9106 },
  { city:"إربد",       cityEn:"Irbid",      country:"الأردن",   countryEn:"Jordan",       lat:32.5556, lng:35.8500 },
  { city:"الزرقاء",    cityEn:"Zarqa",      country:"الأردن",   countryEn:"Jordan",       lat:32.0728, lng:36.0880 },
  { city:"العقبة",     cityEn:"Aqaba",      country:"الأردن",   countryEn:"Jordan",       lat:29.5321, lng:35.0063 },
  { city:"المفرق",     cityEn:"Mafraq",     country:"الأردن",   countryEn:"Jordan",       lat:32.3426, lng:36.2043 },
  { city:"الكرك",      cityEn:"Karak",      country:"الأردن",   countryEn:"Jordan",       lat:31.1826, lng:35.7054 },
  // Saudi Arabia
  { city:"مكة المكرمة",cityEn:"Makkah",     country:"السعودية", countryEn:"Saudi Arabia", lat:21.3891, lng:39.8579 },
  { city:"المدينة",    cityEn:"Madinah",    country:"السعودية", countryEn:"Saudi Arabia", lat:24.5247, lng:39.5692 },
  { city:"الرياض",     cityEn:"Riyadh",     country:"السعودية", countryEn:"Saudi Arabia", lat:24.6877, lng:46.7219 },
  { city:"جدة",        cityEn:"Jeddah",     country:"السعودية", countryEn:"Saudi Arabia", lat:21.5433, lng:39.1728 },
  { city:"الدمام",     cityEn:"Dammam",     country:"السعودية", countryEn:"Saudi Arabia", lat:26.4207, lng:50.0888 },
  // Palestine
  { city:"القدس",      cityEn:"Jerusalem",  country:"فلسطين",   countryEn:"Palestine",    lat:31.7683, lng:35.2137 },
  { city:"غزة",        cityEn:"Gaza",       country:"فلسطين",   countryEn:"Palestine",    lat:31.5017, lng:34.4668 },
  { city:"رام الله",   cityEn:"Ramallah",   country:"فلسطين",   countryEn:"Palestine",    lat:31.9038, lng:35.2034 },
  // Egypt
  { city:"القاهرة",    cityEn:"Cairo",      country:"مصر",      countryEn:"Egypt",        lat:30.0444, lng:31.2357 },
  { city:"الإسكندرية", cityEn:"Alexandria", country:"مصر",      countryEn:"Egypt",        lat:31.2001, lng:29.9187 },
  { city:"الجيزة",     cityEn:"Giza",       country:"مصر",      countryEn:"Egypt",        lat:30.0131, lng:31.2089 },
  // UAE
  { city:"دبي",        cityEn:"Dubai",      country:"الإمارات", countryEn:"UAE",          lat:25.2048, lng:55.2708 },
  { city:"أبوظبي",     cityEn:"Abu Dhabi",  country:"الإمارات", countryEn:"UAE",          lat:24.4539, lng:54.3773 },
  // Kuwait
  { city:"الكويت",     cityEn:"Kuwait City",country:"الكويت",   countryEn:"Kuwait",       lat:29.3759, lng:47.9774 },
  // Qatar
  { city:"الدوحة",     cityEn:"Doha",       country:"قطر",      countryEn:"Qatar",        lat:25.2854, lng:51.5310 },
  // Bahrain
  { city:"المنامة",    cityEn:"Manama",     country:"البحرين",  countryEn:"Bahrain",      lat:26.2235, lng:50.5876 },
  // Oman
  { city:"مسقط",       cityEn:"Muscat",     country:"عُمان",    countryEn:"Oman",         lat:23.5880, lng:58.3829 },
  // Syria
  { city:"دمشق",       cityEn:"Damascus",   country:"سوريا",    countryEn:"Syria",        lat:33.5138, lng:36.2765 },
  { city:"حلب",        cityEn:"Aleppo",     country:"سوريا",    countryEn:"Syria",        lat:36.2021, lng:37.1343 },
  // Lebanon
  { city:"بيروت",      cityEn:"Beirut",     country:"لبنان",    countryEn:"Lebanon",      lat:33.8886, lng:35.4955 },
  // Iraq
  { city:"بغداد",      cityEn:"Baghdad",    country:"العراق",   countryEn:"Iraq",         lat:33.3152, lng:44.3661 },
  { city:"البصرة",     cityEn:"Basra",      country:"العراق",   countryEn:"Iraq",         lat:30.5085, lng:47.7804 },
  { city:"أربيل",      cityEn:"Erbil",      country:"العراق",   countryEn:"Iraq",         lat:36.1901, lng:44.0091 },
  // Turkey
  { city:"إسطنبول",    cityEn:"Istanbul",   country:"تركيا",    countryEn:"Turkey",       lat:41.0082, lng:28.9784 },
  { city:"أنقرة",      cityEn:"Ankara",     country:"تركيا",    countryEn:"Turkey",       lat:39.9334, lng:32.8597 },
  // Morocco
  { city:"الرباط",     cityEn:"Rabat",      country:"المغرب",   countryEn:"Morocco",      lat:34.0132, lng:-6.8326 },
  { city:"الدار البيضاء",cityEn:"Casablanca",country:"المغرب",  countryEn:"Morocco",      lat:33.5731, lng:-7.5898 },
  // Tunisia
  { city:"تونس",       cityEn:"Tunis",      country:"تونس",     countryEn:"Tunisia",      lat:36.8190, lng:10.1658 },
  // Algeria
  { city:"الجزائر",    cityEn:"Algiers",    country:"الجزائر",  countryEn:"Algeria",      lat:36.7372, lng:3.0865 },
  // Libya
  { city:"طرابلس",     cityEn:"Tripoli",    country:"ليبيا",    countryEn:"Libya",        lat:32.9024, lng:13.1800 },
  // Sudan
  { city:"الخرطوم",    cityEn:"Khartoum",   country:"السودان",  countryEn:"Sudan",        lat:15.5007, lng:32.5599 },
  // Malaysia
  { city:"كوالالمبور", cityEn:"Kuala Lumpur",country:"ماليزيا", countryEn:"Malaysia",     lat:3.1390,  lng:101.6869 },
  // Indonesia
  { city:"جاكرتا",     cityEn:"Jakarta",    country:"إندونيسيا",countryEn:"Indonesia",    lat:-6.2088, lng:106.8456 },
  // Pakistan
  { city:"كراتشي",     cityEn:"Karachi",    country:"باكستان",  countryEn:"Pakistan",     lat:24.8607, lng:67.0011 },
  { city:"إسلام آباد", cityEn:"Islamabad",  country:"باكستان",  countryEn:"Pakistan",     lat:33.7294, lng:73.0931 },
  // UK
  { city:"لندن",       cityEn:"London",     country:"المملكة المتحدة",countryEn:"United Kingdom",lat:51.5074,lng:-0.1278 },
  // USA
  { city:"نيويورك",    cityEn:"New York",   country:"الولايات المتحدة",countryEn:"USA",   lat:40.7128, lng:-74.0060 },
  { city:"لوس أنجلوس", cityEn:"Los Angeles",country:"الولايات المتحدة",countryEn:"USA",  lat:34.0522, lng:-118.2437 },
  { city:"شيكاغو",     cityEn:"Chicago",    country:"الولايات المتحدة",countryEn:"USA",  lat:41.8781, lng:-87.6298 },
  // Germany
  { city:"برلين",      cityEn:"Berlin",     country:"ألمانيا",  countryEn:"Germany",      lat:52.5200, lng:13.4050 },
  // France
  { city:"باريس",      cityEn:"Paris",      country:"فرنسا",    countryEn:"France",       lat:48.8566, lng:2.3522 },
  // Canada
  { city:"تورونتو",    cityEn:"Toronto",    country:"كندا",     countryEn:"Canada",       lat:43.6532, lng:-79.3832 },
];

// Build unique sorted country list
function getCountries(lang) {
  const seen = new Set();
  const list = [];
  for (const c of CITIES_DB) {
    const key = c.countryEn;
    if (!seen.has(key)) {
      seen.add(key);
      list.push({ label: lang === 'ar' ? c.country : c.countryEn, value: c.countryEn });
    }
  }
  return list.sort((a,b) => a.label.localeCompare(b.label, lang === 'ar' ? 'ar' : 'en'));
}

function getCitiesForCountry(countryEn, lang) {
  return CITIES_DB
    .filter(c => c.countryEn === countryEn)
    .map(c => ({ label: lang === 'ar' ? c.city : c.cityEn, value: c.cityEn, data: c }));
}

function getCityData(cityEn, countryEn) {
  return CITIES_DB.find(c => c.cityEn === cityEn && c.countryEn === countryEn)
    || CITIES_DB.find(c => c.cityEn === cityEn)
    || null;
}

// ────────────────────────────────────────────────────────────────
//  i18n
// ────────────────────────────────────────────────────────────────
const LABELS = {
  ar: {
    tracker:'المتابعة', members:'الأعضاء', settings:'الإعدادات',
    current_prayer:'الصلاة الحالية', next_prayer:'الصلاة القادمة',
    gregorian:'الميلادي', hijri:'الهجري', loading:'جاري التحميل...',
    fajr:'الفجر', dhuhr:'الظهر', jumuah:'الجمعة', asr:'العصر', maghrib:'المغرب', isha:'العشاء',
    sunrise:'الشروق',
    pending:'لم تحن بعد', current:'حان وقتها', ontime:'في وقتها', qadaa:'قضاء', missed:'فائتة',
    members_title:'أعضاء العائلة', add_member:'+ إضافة عضو',
    edit_member:'تعديل العضو', add_member_title:'إضافة عضو جديد',
    name:'الاسم', birthdate:'تاريخ الميلاد', gender:'الجنس', parent:'ولي الأمر',
    city:'المدينة', country:'الدولة', email:'البريد الإلكتروني',
    male:'ذكر', female:'أنثى', select_country:'— اختر الدولة —', select_city:'— اختر المدينة —',
    no_parent:'بدون', save:'حفظ', cancel:'إلغاء',
    settings_title:'الإعدادات', general:'عام', prayer_settings:'إعدادات الصلاة',
    language:'اللغة', reminder:'التنبيه قبل (دقيقة)', time_format:'تنسيق الوقت',
    date_format:'تنسيق التاريخ', calc_method:'طريقة الحساب', athan:'صوت الأذان',
    marquee_speed:'سرعة النص المتحرك', theme:'المظهر', danger_zone:'إعادة الضبط',
    reset_all:'مسح جميع البيانات وبدء من جديد',
    reset_confirm:'هل أنت متأكد؟ سيتم مسح جميع البيانات.',
    today:'اليوم', past_viewing:'تصفح تاريخ:',
    prayer_call:'حان وقت الصلاة', dismiss_hint:'انقر للإغلاق',
    no_members:'لا يوجد أعضاء — أضف عضواً جديداً',
    edit:'تعديل', delete:'حذف',
    fajr_ends:'ينتهي عند الشروق',
    delete_confirm:'هل تريد حذف هذا العضو؟',
    font_face:'الخط', font_size:'حجم الخط',
    backup_title:'النسخ الاحتياطي',
    export_btn:'📤 تصدير البيانات',
    export_hint:'يصدّر الأعضاء والإعدادات وسجل الصلوات. الصلوات الفائتة لا تُصدَّر — تُعامل ضمنياً كفائتة عند الاستيراد.',
    import_btn:'📥 استيراد نسخة احتياطية',
    import_hint:'يستورد ملف .prayerz ويحل محل البيانات الحالية. التواريخ الغائبة تُعامل كصلوات فائتة.',
  },
  en: {
    tracker:'Tracker', members:'Members', settings:'Settings',
    current_prayer:'Current Prayer', next_prayer:'Next Prayer',
    gregorian:'Gregorian', hijri:'Hijri', loading:'Loading...',
    fajr:'Fajr', dhuhr:'Dhuhr', jumuah:"Jumu'ah", asr:'Asr', maghrib:'Maghrib', isha:'Isha',
    sunrise:'Sunrise',
    pending:'Not yet', current:'Due now', ontime:'On time', qadaa:'Make-up', missed:'Missed',
    members_title:'Family Members', add_member:'+ Add Member',
    edit_member:'Edit Member', add_member_title:'Add New Member',
    name:'Name', birthdate:'Birthdate', gender:'Gender', parent:'Parent/Guardian',
    city:'City', country:'Country', email:'Email',
    male:'Male', female:'Female', select_country:'— Select Country —', select_city:'— Select City —',
    no_parent:'None', save:'Save', cancel:'Cancel',
    settings_title:'Settings', general:'General', prayer_settings:'Prayer Settings',
    language:'Language', reminder:'Remind before (min)', time_format:'Time Format',
    date_format:'Date Format', calc_method:'Calculation Method', athan:'Athan Sound',
    marquee_speed:'Marquee Speed', theme:'Theme', danger_zone:'Reset',
    reset_all:'Clear all data and restart',
    reset_confirm:'Are you sure? All data will be cleared.',
    today:'Today', past_viewing:'Viewing:',
    prayer_call:'Prayer Time', dismiss_hint:'Tap to dismiss',
    no_members:'No members — add a new member',
    edit:'Edit', delete:'Delete',
    fajr_ends:'Ends at Sunrise',
    delete_confirm:'Delete this member?',
    font_face:'Font', font_size:'Font Size',
    backup_title:'Backup & Restore',
    export_btn:'📤 Export Data',
    export_hint:'Exports members, settings, and prayer log. Missed prayers are excluded — they are treated as missed on import.',
    import_btn:'📥 Import Backup File',
    import_hint:'Imports a .prayerz file and replaces current data. Missing dates are treated as missed prayers.',
  }
};

// ────────────────────────────────────────────────────────────────
//  Arabic font options
// ────────────────────────────────────────────────────────────────
const ARABIC_FONTS = [
  { value:"'Scheherazade New',serif",  label:"Scheherazade New" },
  { value:"'Amiri',serif",             label:"Amiri"            },
  { value:"'Noto Naskh Arabic',serif", label:"Noto Naskh"       },
  { value:"'Noto Kufi Arabic',sans-serif", label:"Noto Kufi"    },
  { value:"'Reem Kufi',sans-serif",    label:"Reem Kufi"        },
  { value:"'Lateef',serif",            label:"Lateef"           },
  { value:"'Aref Ruqaa',serif",        label:"Aref Ruqaa"       },
  { value:"'Tajawal',sans-serif",      label:"Tajawal"          },
  { value:"'Cairo',sans-serif",        label:"Cairo"            },
  { value:"'Harmattan',sans-serif",    label:"Harmattan"        },
];

// Inject Google Fonts
(function injectFonts() {
  const families = [
    'Scheherazade+New:wght@400;600;700',
    'Amiri:ital,wght@0,400;0,700;1,400',
    'Noto+Naskh+Arabic:wght@400;700',
    'Noto+Kufi+Arabic:wght@400;700',
    'Reem+Kufi:wght@400;700',
    'Lateef:wght@400;700',
    'Aref+Ruqaa',
    'Tajawal:wght@400;700',
    'Cairo:wght@400;700',
    'Harmattan:wght@400;700',
    'Cinzel:wght@400;600',
  ].join('&family=');
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  document.head.appendChild(link);
})();

// ────────────────────────────────────────────────────────────────
//  App state
// ────────────────────────────────────────────────────────────────
let cfg = {};
let members        = [];
let prayerRecords  = {};
let timesCache     = {};          // key → {fajr,dhuhr,asr,maghrib,isha,sunrise}
let viewingDate    = todayStr();
let editingMemberId = null;
let athanPlayed    = {};
let athanAudio     = null;
let tickInterval   = null;
let marqueeTimer   = null;
let marqueePool    = [];
let marqueeIdx     = 0;

// ────────────────────────────────────────────────────────────────
//  Helpers
// ────────────────────────────────────────────────────────────────
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function pad(n) { return String(n).padStart(2,'0'); }
function dateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function addDays(str, n) {
  const d = new Date(str + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return dateStr(d);
}
function L(key) { return (LABELS[cfg.language] || LABELS.ar)[key] || key; }
function uid()  { return Math.random().toString(36).substr(2,9); }
function isFriday()          { return new Date().getDay() === 5; }
function isFridayOn(ds)      { return new Date(ds + 'T12:00:00').getDay() === 5; }

function formatTime(hhmm) {
  if (!hhmm) return '--:--';
  const [hh, mm] = hhmm.split(':').map(Number);
  if (cfg.time_format === '12') {
    const ampm = hh < 12 ? 'AM' : 'PM';
    return `${hh % 12 || 12}:${pad(mm)} ${ampm}`;
  }
  return `${pad(hh)}:${pad(mm)}`;
}

function formatDateDisplay(isoStr) {
  const d = new Date(isoStr + 'T12:00:00');
  const dd = pad(d.getDate()), mm = pad(d.getMonth()+1), yyyy = d.getFullYear();
  const monthsAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const monthsEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mon = cfg.language === 'ar' ? monthsAr[d.getMonth()] : monthsEn[d.getMonth()];
  if (cfg.date_format === 'MM/DD/YYYY') return `${mm}/${dd}/${yyyy}`;
  if (cfg.date_format === 'YYYY-MM-DD') return `${yyyy}-${mm}-${dd}`;
  return `${dd}/${mon}(${mm})/${yyyy}`;
}

function timeToMinutes(hhmm) {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function nowMinutes() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes() + n.getSeconds() / 60;
}
function secondsToHMS(sec) {
  sec = Math.max(0, sec);
  return `${pad(Math.floor(sec/3600))}:${pad(Math.floor((sec%3600)/60))}:${pad(Math.floor(sec%60))}`;
}

// ────────────────────────────────────────────────────────────────
//  Storage
// ────────────────────────────────────────────────────────────────
function saveData() {
  try {
    localStorage.setItem('pz_members',  JSON.stringify(members));
    localStorage.setItem('pz_records',  JSON.stringify(prayerRecords));
    localStorage.setItem('pz_cfg',      JSON.stringify(cfg));
    localStorage.setItem('pz_tcache',   JSON.stringify(timesCache));
  } catch(e) {}
}
function loadData() {
  try { members       = JSON.parse(localStorage.getItem('pz_members')  || '[]'); } catch(e) { members=[]; }
  try { prayerRecords = JSON.parse(localStorage.getItem('pz_records')  || '{}'); } catch(e) { prayerRecords={}; }
  try { timesCache    = JSON.parse(localStorage.getItem('pz_tcache')   || '{}'); } catch(e) { timesCache={}; }
  let sc = {};
  try { sc = JSON.parse(localStorage.getItem('pz_cfg') || '{}'); } catch(e) {}
  cfg = Object.assign({}, PrayerzConfig, sc);
  cfg.athan_sources = PrayerzConfig.athan_sources; // never override from storage
}

// ────────────────────────────────────────────────────────────────
//  Prayer Times — coordinate-based API (accurate)
//
//  Aladhan API endpoint:
//  GET /v1/timings/{DD-MM-YYYY}?latitude=X&longitude=Y&method=M
//
//  This is the CORRECT and most reliable endpoint.
//  The city-name endpoint is unreliable because names can be
//  ambiguous and the server can match wrong cities.
// ────────────────────────────────────────────────────────────────
const PRAYER_KEYS = ['fajr','dhuhr','asr','maghrib','isha'];

async function fetchPrayerTimes(cityEn, countryEn, dateIso) {
  const cd = getCityData(cityEn, countryEn);
  if (!cd) {
    console.warn('City not found in DB:', cityEn, countryEn);
    return null;
  }

  const cacheKey = `${cd.lat}|${cd.lng}|${dateIso}|${cfg.calculation_method}`;
  if (timesCache[cacheKey]) return timesCache[cacheKey];

  const d  = new Date(dateIso + 'T12:00:00');
  const dd = pad(d.getDate()), mm = pad(d.getMonth()+1), yyyy = d.getFullYear();

  // Use coordinate-based endpoint — accurate for any city
  const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}`
            + `?latitude=${cd.lat}&longitude=${cd.lng}&method=${cfg.calculation_method}`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (data.code === 200 && data.data?.timings) {
      const t = data.data.timings;
      const times = {
        fajr:    t.Fajr?.substring(0,5),
        dhuhr:   t.Dhuhr?.substring(0,5),
        asr:     t.Asr?.substring(0,5),
        maghrib: t.Maghrib?.substring(0,5),
        isha:    t.Isha?.substring(0,5),
        sunrise: t.Sunrise?.substring(0,5),
      };
      timesCache[cacheKey] = times;
      saveData();
      return times;
    }
  } catch(e) { console.warn('Prayer API error', e); }
  return null;
}

// ────────────────────────────────────────────────────────────────
//  State Machine
// ────────────────────────────────────────────────────────────────
function getPrayerEnd(prayerKey, times) {
  if (prayerKey === 'fajr') return timeToMinutes(times.sunrise) || timeToMinutes(times.dhuhr);
  const idx = PRAYER_KEYS.indexOf(prayerKey);
  if (idx >= 0 && idx < PRAYER_KEYS.length - 1) return timeToMinutes(times[PRAYER_KEYS[idx+1]]);
  // Isha ends at next-day Fajr: 1440 (24h) + fajr minutes
  return 24 * 60 + timeToMinutes(times.fajr);
}

function determinePrayerStatus(prayerKey, times, stored, dateIso) {
  if (!times) return 'pending';
  const isToday  = dateIso === todayStr();
  const isPast   = dateIso < todayStr();
  const isFuture = dateIso > todayStr();
  if (isFuture) return 'pending';
  if (isPast)   return stored || 'missed';

  // Today
  const now   = nowMinutes();
  const start = timeToMinutes(times[prayerKey]);
  const end   = getPrayerEnd(prayerKey, times);

  if (stored === 'ontime') return 'ontime';
  if (stored === 'qadaa')  return 'qadaa';
  if (now < start)         return 'pending';
  if (now < end)           return (stored === 'missed') ? 'missed' : 'current';
  return (!stored || stored === 'current') ? 'missed' : stored;
}

// Three-way toggle for current window: current ↔ ontime
// Three-way cycle for past:  missed → ontime → qadaa → missed
function toggleStatus(memberId, prayerKey, dateIso, times) {
  if (dateIso > todayStr()) return;

  const isToday  = dateIso === todayStr();
  const now      = nowMinutes();
  const start    = timeToMinutes(times[prayerKey]);
  const end      = getPrayerEnd(prayerKey, times);
  const inWindow = isToday && now >= start && now < end;
  const isPast   = isToday ? now >= end : true;

  if (isToday && now < start) return; // pending, not editable

  if (!prayerRecords[dateIso])           prayerRecords[dateIso] = {};
  if (!prayerRecords[dateIso][memberId]) prayerRecords[dateIso][memberId] = {};

  const stored = prayerRecords[dateIso][memberId][prayerKey];
  let next;

  if (inWindow) {
    next = (stored === 'ontime') ? null : 'ontime';
  } else if (isPast) {
    if      (!stored || stored === 'missed') next = 'ontime';
    else if (stored === 'ontime')            next = 'qadaa';
    else if (stored === 'qadaa')             next = 'missed';
    else                                     next = 'ontime';
  } else { return; }

  prayerRecords[dateIso][memberId][prayerKey] = next;
  saveData();
  renderTables();
}

// ────────────────────────────────────────────────────────────────
//  Hijri date
// ────────────────────────────────────────────────────────────────
async function getHijriDate(isoDate) {
  const key = `hijri_${isoDate}`;
  const cached = sessionStorage.getItem(key);
  if (cached) return cached;
  try {
    const [y,m,d] = isoDate.split('-');
    const res  = await fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`);
    const data = await res.json();
    if (data.code === 200) {
      const h = data.data.hijri;
      const result = cfg.language === 'ar'
        ? `${h.day} ${h.month.ar} ${h.year} هـ`
        : `${h.day} ${h.month.en} ${h.year} AH`;
      sessionStorage.setItem(key, result);
      return result;
    }
  } catch(e) {}
  return '';
}

// ────────────────────────────────────────────────────────────────
//  City groups (group members by city+country)
// ────────────────────────────────────────────────────────────────
function getCityGroups() {
  const groups = {};
  for (const m of members) {
    const k = `${m.cityEn||''}|${m.countryEn||''}`;
    if (!groups[k]) groups[k] = { cityEn: m.cityEn||'', countryEn: m.countryEn||'', cityLabel: m.city||m.cityEn||'', members:[] };
    groups[k].members.push(m);
  }
  for (const g of Object.values(groups)) {
    g.members.sort((a,b) => new Date(a.birthdate||0) - new Date(b.birthdate||0));
  }
  return Object.values(groups);
}

function getCurrentPrayerKey(times) {
  if (!times) return null;
  const now = nowMinutes();
  for (let i = PRAYER_KEYS.length-1; i >= 0; i--) {
    const k = PRAYER_KEYS[i];
    if (now >= timeToMinutes(times[k]) && now < getPrayerEnd(k, times)) return k;
  }
  return null;
}
function getNextPrayerKey(times) {
  if (!times) return null;
  const now = nowMinutes();
  for (const k of PRAYER_KEYS) if (timeToMinutes(times[k]) > now) return k;
  return null;
}

// ────────────────────────────────────────────────────────────────
//  Render Tables
// ────────────────────────────────────────────────────────────────
async function renderTables() {
  const container = document.getElementById('tables-container');
  if (!container) return;

  if (members.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px 20px;color:var(--muted);font-size:1rem;">${L('no_members')}</div>`;
    return;
  }

  const groups   = getCityGroups();
  const isToday  = viewingDate === todayStr();
  const isFri    = isFridayOn(viewingDate);
  const nowM     = nowMinutes();
  const multiCity = groups.length > 1;

  let html = '';

  for (const group of groups) {
    const times = await fetchPrayerTimes(group.cityEn, group.countryEn, viewingDate);
    if (!times) {
      html += `<div style="color:var(--missed);padding:12px;background:var(--surface);border-radius:8px;margin-bottom:8px;">
        ⚠ ${group.cityLabel} — ${L('loading')}</div>`;
      continue;
    }

    const currentKey = isToday ? getCurrentPrayerKey(times) : null;

    if (multiCity) {
      html += `<div class="city-label">🌙 ${group.cityLabel}, ${group.countryEn}</div>`;
    }

    html += `<div class="city-section"><div class="prayer-table-wrap">
      <table class="prayer-table"><thead><tr>`;
    html += `<th class="th-name">—</th>`;

    for (const pk of PRAYER_KEYS) {
      const isCur   = pk === currentKey;
      const pname   = (pk === 'dhuhr' && isFri) ? L('jumuah') : L(pk);
      const ptime   = formatTime(times[pk]);
      const surStr  = pk === 'fajr'
        ? `<span class="prayer-subtime">↑${formatTime(times.sunrise)}</span>` : '';
      const pin     = isCur ? `<span class="prayer-pin"> 📍</span>` : '';
      const pStart  = timeToMinutes(times[pk]);
      // Header blinks only in first reminder_minutes of prayer window
      const blink   = isToday && isCur && (nowM - pStart) <= cfg.reminder_minutes;
      html += `<th class="${isCur?'current-prayer':''} ${blink?'blinking':''}">
        ${pname}${pin}
        <span class="prayer-subtime">${ptime}</span>${surStr}
      </th>`;
    }
    html += `</tr></thead><tbody>`;

    for (const member of group.members) {
      const age      = getAge(member.birthdate);
      const ageLabel = age > 0 ? `<span class="member-age">${age} ${cfg.language==='ar'?'سنة':'yrs'}</span>` : '';
      html += `<tr><td class="name-cell">${member.name}${ageLabel}</td>`;

      for (const pk of PRAYER_KEYS) {
        const stored = prayerRecords[viewingDate]?.[member.id]?.[pk];
        const status = determinePrayerStatus(pk, times, stored, viewingDate);
        const emoji  = statusEmoji(status);
        const label  = L(status);
        const pStart = timeToMinutes(times[pk]);
        const nxtKey = getNextPrayerKey(times);
        const nxtStart = nxtKey ? timeToMinutes(times[nxtKey]) : null;

        // Blink the PENDING cell when prayer is about to start (within reminder window)
        const pendingWarn = isToday && status === 'pending'
          && (pStart - nowM) > 0 && (pStart - nowM) <= cfg.reminder_minutes;

        // Blink the CURRENT (blue) cell when user hasn't prayed yet AND
        // the NEXT prayer is starting within reminder_minutes
        const currentWarn = isToday && status === 'current'
          && nxtStart !== null
          && (nxtStart - nowM) > 0 && (nxtStart - nowM) <= cfg.reminder_minutes;

        const warnBlink = pendingWarn || currentWarn;
        const tb64 = btoa(JSON.stringify(times));
        html += `<td class="status-cell ${warnBlink?'blink-warn':''}"
          data-status="${status}"
          onclick="handleCellClick('${member.id}','${pk}','${tb64}','${viewingDate}')"
        >${emoji}<div class="status-tooltip">${label}</div></td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table></div></div>`;
  }

  container.innerHTML = html;

  if (groups.length > 0 && isToday) {
    const g = groups[0];
    const t = await fetchPrayerTimes(g.cityEn, g.countryEn, viewingDate);
    if (t) updatePrayerHeader(t);
  }
}

function statusEmoji(s) {
  return {pending:'⚪',current:'🔵',ontime:'🟢',qadaa:'🟡',missed:'🔴'}[s]||'⚪';
}
function getAge(bd) {
  if (!bd) return 0;
  const b=new Date(bd), t=new Date();
  let a=t.getFullYear()-b.getFullYear();
  const m=t.getMonth()-b.getMonth();
  if (m<0||(m===0&&t.getDate()<b.getDate())) a--;
  return a;
}
function handleCellClick(memberId, prayerKey, tb64, dateIso) {
  try { toggleStatus(memberId, prayerKey, dateIso, JSON.parse(atob(tb64))); }
  catch(e) { console.error('cellClick', e); }
}

// ────────────────────────────────────────────────────────────────
//  Prayer Header (live counters updated every second)
//
//  Special progress bar rule for Dhuhr/Jumuah as next prayer:
//   • While Fajr is current  → bar spans Fajr-start … Dhuhr-start
//   • After Fajr ends (post-Sunrise, before Dhuhr) → bar spans Sunrise … Dhuhr-start
// ────────────────────────────────────────────────────────────────
function updatePrayerHeader(times) {
  if (!times) return;
  const nowM   = nowMinutes();
  const curKey = getCurrentPrayerKey(times);
  const nxtKey = getNextPrayerKey(times);
  const isFri  = isFriday();
  const pname  = k => k ? ((k==='dhuhr'&&isFri)?L('jumuah'):L(k)) : '—';

  setText('current-prayer-name',  pname(curKey));
  setText('next-prayer-name',     pname(nxtKey));

  // ── Elapsed counter for current prayer ──
  if (curKey && times[curKey]) {
    const elapsed = (nowM - timeToMinutes(times[curKey])) * 60;
    setText('current-prayer-elapsed', '+' + secondsToHMS(elapsed));
  } else {
    setText('current-prayer-elapsed', '');
  }

  // ── Countdown to next prayer ──
  if (nxtKey && times[nxtKey]) {
    let remaining = (timeToMinutes(times[nxtKey]) - nowM) * 60;
    if (remaining < 0) remaining += 24 * 3600;
    const cd = '-' + secondsToHMS(remaining);
    setText('next-prayer-countdown',      cd);
    setText('progress-countdown-label',   cd);
  } else {
    setText('next-prayer-countdown',    '');
    setText('progress-countdown-label', '');
  }

  // ── Progress bar ──
  const bar = document.getElementById('prayer-progress');
  if (bar) {
    let barStart, barEnd;

    if (nxtKey === 'dhuhr') {
      // Special rule: show full Fajr→Dhuhr span
      const dhuhrM   = timeToMinutes(times.dhuhr);
      const fajrM    = timeToMinutes(times.fajr);
      const sunriseM = timeToMinutes(times.sunrise);

      if (curKey === 'fajr') {
        // During Fajr: bar starts at Fajr
        barStart = fajrM;
      } else {
        // After Fajr ended (post-sunrise gap): bar starts at Sunrise
        barStart = sunriseM;
      }
      barEnd = dhuhrM;
    } else if (curKey) {
      barStart = timeToMinutes(times[curKey]);
      barEnd   = getPrayerEnd(curKey, times);
    }

    if (barStart !== undefined && barEnd !== undefined && barEnd > barStart) {
      const pct = Math.min(100, Math.max(0, ((nowM - barStart) / (barEnd - barStart)) * 100));
      bar.style.width = pct + '%';
    }
  }

  // ── Fajr sunrise note ──
  const note = document.getElementById('fajr-sunrise-note');
  if (note) note.textContent = (curKey === 'fajr' && times.sunrise)
    ? `${L('fajr')} ${L('fajr_ends')}: ${formatTime(times.sunrise)}` : '';

  checkAthan(times);
}

// ────────────────────────────────────────────────────────────────
//  Export / Import
//
//  Storage layout in localStorage:
//    pz_members  → JSON array of member objects
//    pz_records  → { "YYYY-MM-DD": { memberId: { fajr, dhuhr, … } } }
//    pz_cfg      → settings object
//    pz_tcache   → prayer-times cache (excluded from export — re-fetched on demand)
//
//  Export format (.prayerz JSON):
//  {
//    version: 1,
//    exported: "ISO timestamp",
//    members:  [...],
//    settings: {...},
//    records:  {
//      "YYYY-MM-DD": {
//        "memberId": { "fajr": "ontime", "asr": "qadaa" }
//        // only ontime/qadaa entries — missed is implicit for any gap
//      }
//    }
//  }
// ────────────────────────────────────────────────────────────────

function exportData() {
  // Find the earliest date that has any ontime or qadaa record
  let minDate = null;
  for (const [date, dayRecords] of Object.entries(prayerRecords)) {
    for (const memberRecords of Object.values(dayRecords)) {
      for (const status of Object.values(memberRecords)) {
        if (status === 'ontime' || status === 'qadaa') {
          if (!minDate || date < minDate) minDate = date;
          break;
        }
      }
    }
  }

  // Build compact records: only include ontime/qadaa, skip missed/null
  const compactRecords = {};
  if (minDate) {
    for (const [date, dayRecords] of Object.entries(prayerRecords)) {
      if (date < minDate) continue;
      const dayOut = {};
      for (const [memberId, prayers] of Object.entries(dayRecords)) {
        const prayerOut = {};
        for (const [pk, status] of Object.entries(prayers)) {
          if (status === 'ontime' || status === 'qadaa') prayerOut[pk] = status;
        }
        if (Object.keys(prayerOut).length) dayOut[memberId] = prayerOut;
      }
      if (Object.keys(dayOut).length) compactRecords[date] = dayOut;
    }
  }

  // Strip athan_sources from exported settings (large + re-created from config.js)
  const exportSettings = {...cfg};
  delete exportSettings.athan_sources;
  delete exportSettings.verses;
  delete exportSettings.available_themes;

  const payload = {
    version:  1,
    exported: new Date().toISOString(),
    members,
    settings: exportSettings,
    records:  compactRecords,
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], {type: 'application/json'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `prayerz-backup-${todayStr()}.prayerz`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement('input');
  input.type   = 'file';
  input.accept = '.prayerz,.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text    = await file.text();
      const payload = JSON.parse(text);
      if (!payload.version || !payload.members) {
        alert('Invalid backup file.');
        return;
      }
      const confirmMsg = cfg.language === 'ar'
        ? `استيراد البيانات سيحل محل البيانات الحالية.\nتم التصدير: ${payload.exported?.substring(0,10)||'?'}\nعدد الأعضاء: ${payload.members?.length||0}\nهل تريد المتابعة؟`
        : `Import will replace current data.\nExported: ${payload.exported?.substring(0,10)||'?'}\nMembers: ${payload.members?.length||0}\nContinue?`;
      if (!confirm(confirmMsg)) return;

      members       = payload.members  || [];
      prayerRecords = payload.records  || {};
      // Merge settings but keep athan_sources from config.js
      if (payload.settings) {
        cfg = Object.assign({}, PrayerzConfig, payload.settings);
        cfg.athan_sources = PrayerzConfig.athan_sources;
      }
      saveData();
      applyTheme(); applyFont(); applyLanguage();
      renderSettings();
      await updateDateDisplay();
      await renderTables();
      alert(cfg.language === 'ar' ? 'تم الاستيراد بنجاح ✓' : 'Import successful ✓');
    } catch(err) {
      alert('Error reading file: ' + err.message);
    }
  };
  input.click();
}

// ────────────────────────────────────────────────────────────────
//  Athan
// ────────────────────────────────────────────────────────────────
function checkAthan(times) {
  if (viewingDate !== todayStr()) return;
  const nowM = nowMinutes();
  for (const pk of PRAYER_KEYS) {
    const key = `${todayStr()}|${pk}`;
    if (athanPlayed[key]) continue;
    if (Math.abs((nowM - timeToMinutes(times[pk]))*60) < 30) {
      athanPlayed[key] = true;
      playAthan(pk);
      break;
    }
  }
}
function playAthan(pk) {
  const src   = cfg.athan_sources?.[cfg.athan_sound];
  const pname = (pk==='dhuhr'&&isFriday()) ? L('jumuah') : L(pk);
  setText('athan-prayer-name',  pname);
  setText('athan-sub-text',     L('prayer_call'));
  setText('athan-dismiss-hint', L('dismiss_hint'));
  document.getElementById('athan-overlay').classList.remove('hidden');
  if (src) { athanAudio = new Audio(src); athanAudio.play().catch(()=>{}); }
}
document.getElementById('athan-overlay').addEventListener('click', () => {
  document.getElementById('athan-overlay').classList.add('hidden');
  if (athanAudio) { athanAudio.pause(); athanAudio = null; }
});

// ────────────────────────────────────────────────────────────────
//  Marquee — CSS animation, ALWAYS enters from LEFT exits RIGHT.
//  from { translateX(-100%) } → to { translateX(100%) }
//  Duration driven by cfg.marquee_speed (higher = faster).
// ────────────────────────────────────────────────────────────────
function startMarqueeAnimation() { /* no-op */ }

function setMarqueeContent(text) {
  const wrap = document.getElementById('marquee-wrap');
  if (!wrap) return;
  // duration: speed 10→~20s, speed 150→~2s
  const duration = Math.max(2, Math.round(200 / (cfg.marquee_speed || 50)));
  wrap.innerHTML =
    `<span class="marquee-text" style="animation-duration:${duration}s">${text}</span>`;
}

function buildMarqueePool(prayerKey) {
  const v = cfg.verses || PrayerzConfig.verses || {};
  return [...(v[prayerKey]||[]), ...(v.general||[])].filter(Boolean);
}

function rotateMaEquee(prayerKey) {
  const pool = buildMarqueePool(prayerKey);
  if (!pool.length) return;
  marqueeIdx = (marqueeIdx + 1) % pool.length;
  setMarqueeContent(pool[marqueeIdx]);
}

// ────────────────────────────────────────────────────────────────
//  Clock tick (every second)
// ────────────────────────────────────────────────────────────────
function tick() {
  const now = new Date();
  const clockEl = document.getElementById('live-clock');
  if (clockEl) {
    if (cfg.time_format === '12') {
      const ampm = now.getHours() < 12 ? 'AM' : 'PM';
      clockEl.textContent = `${now.getHours()%12||12}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}`;
    } else {
      clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
  }
  if (now.getSeconds() === 0) renderTables();
  if (viewingDate === todayStr()) {
    const g = getCityGroups()[0];
    if (g) {
      const ck = `${getCityData(g.cityEn,g.countryEn)?.lat}|${getCityData(g.cityEn,g.countryEn)?.lng}|${viewingDate}|${cfg.calculation_method}`;
      const t  = timesCache[ck];
      if (t) updatePrayerHeader(t);
    }
  }
}

// ────────────────────────────────────────────────────────────────
//  Date navigation
// ────────────────────────────────────────────────────────────────
function navigateDate(delta) {
  const candidate = addDays(viewingDate, delta);
  if (candidate > todayStr()) return;
  viewingDate = candidate;
  refreshDateUI();
  renderTables();
}
function goToday() { viewingDate = todayStr(); refreshDateUI(); renderTables(); }

function refreshDateUI() {
  const isToday = viewingDate === todayStr();
  const isRTL   = cfg.language === 'ar';

  setText('viewing-date-label', formatDateDisplay(viewingDate));
  setText('btn-today', L('today'));

  const btnToday = document.getElementById('btn-today');
  const btnNext  = document.getElementById('btn-next-day');
  if (btnToday) btnToday.style.display = isToday ? 'none' : '';
  if (btnNext)  btnNext.style.display  = isToday ? 'none' : '';

  // Fix arrow direction:
  // btn-prev-day always navigates to an OLDER date (delta = -1)
  // btn-next-day always navigates to a NEWER date (delta = +1)
  // In Arabic (RTL layout), older = visually to the right → use ►
  // In English (LTR layout), older = visually to the left → use ◄
  const btnPrev = document.getElementById('btn-prev-day');
  if (btnPrev) btnPrev.textContent = isRTL ? '►' : '◄';
  if (btnNext)  btnNext.textContent = isRTL ? '◄' : '►';

  const pi = document.getElementById('past-indicator');
  if (pi) {
    pi.textContent = isToday ? '' : `${L('past_viewing')} ${formatDateDisplay(viewingDate)}`;
    pi.classList.toggle('hidden', isToday);
  }
}

// ────────────────────────────────────────────────────────────────
//  Date & Hijri display
// ────────────────────────────────────────────────────────────────
async function updateDateDisplay() {
  setText('gregorian-date', formatDateDisplay(todayStr()));
  setText('lbl-gregorian',  L('gregorian'));
  setText('lbl-hijri',      L('hijri'));
  const hijri = await getHijriDate(todayStr());
  setText('hijri-date', hijri);
  const g = getCityGroups()[0];
  const lang = cfg.language;
  if (g) {
    const cd = getCityData(g.cityEn, g.countryEn);
    setText('current-city-label', cd ? (lang==='ar' ? cd.city : cd.cityEn) : g.cityEn);
  }
}

// ────────────────────────────────────────────────────────────────
//  i18n apply
// ────────────────────────────────────────────────────────────────
function applyLanguage() {
  const lang = cfg.language;
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  const map = {
    'nav-tracker':L('tracker'), 'nav-members':L('members'), 'nav-settings':L('settings'),
    'lbl-current-prayer-hdr':L('current_prayer'), 'lbl-next-prayer-hdr':L('next_prayer'),
    'lbl-loading':L('loading'), 'lbl-gregorian':L('gregorian'), 'lbl-hijri':L('hijri'),
    'lbl-members-title':L('members_title'), 'btn-add-member':L('add_member'),
    'lbl-name':L('name'), 'lbl-birthdate':L('birthdate'),
    'lbl-gender':L('gender'), 'lbl-parent':L('parent'),
    'lbl-city':L('city'), 'lbl-country':L('country'), 'lbl-email':L('email'),
    'btn-save-member':L('save'), 'btn-cancel-member':L('cancel'),
    'lbl-settings-title':L('settings_title'), 'lbl-general-settings':L('general'),
    'lbl-prayer-settings':L('prayer_settings'), 'lbl-language-s':L('language'),
    'lbl-reminder-s':L('reminder'), 'lbl-timeformat-s':L('time_format'),
    'lbl-dateformat-s':L('date_format'), 'lbl-calcmethod-s':L('calc_method'),
    'lbl-athan-s':L('athan'), 'lbl-marquee-speed-s':L('marquee_speed'),
    'lbl-theme-s':L('theme'), 'lbl-danger-zone':L('danger_zone'),
    'btn-reset-all':L('reset_all'), 'btn-today':L('today'),
    'lbl-font-face-s':L('font_face'), 'lbl-font-size-s':L('font_size'),
    'lbl-backup-title':L('backup_title'),
    'lbl-export-btn':L('export_btn'), 'lbl-export-hint':L('export_hint'),
    'lbl-import-btn':L('import_btn'), 'lbl-import-hint':L('import_hint'),
  };
  for (const [id, text] of Object.entries(map)) setText(id, text);

  const fg = document.getElementById('f-gender');
  if (fg) fg.innerHTML = `<option value="male">${L('male')}</option><option value="female">${L('female')}</option>`;

  refreshDateUI();
}

function setText(id, text) { const e=document.getElementById(id); if(e) e.textContent=text; }

// ────────────────────────────────────────────────────────────────
//  Font / Theme
// ────────────────────────────────────────────────────────────────
function applyFont() {
  const face = cfg.font_face || ARABIC_FONTS[0].value;
  const size = cfg.font_size || 16;
  document.documentElement.style.setProperty('--font-arabic', face);
  document.documentElement.style.setProperty('--base-font-size', size + 'px');
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', cfg.theme || 'dark-emerald');
}

// ────────────────────────────────────────────────────────────────
//  Screens
// ────────────────────────────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  document.getElementById(`nav-${name}`).classList.add('active');
  if (name==='members')  renderMembers();
  if (name==='settings') renderSettings();
  if (name==='tracker')  renderTables();
}

// ────────────────────────────────────────────────────────────────
//  Members
// ────────────────────────────────────────────────────────────────
function renderMembers() {
  const grid = document.getElementById('members-grid');
  if (!grid) return;
  if (!members.length) {
    grid.innerHTML = `<div style="color:var(--muted);padding:20px;grid-column:1/-1;text-align:center;">${L('no_members')}</div>`;
    return;
  }
  const sorted = [...members].sort((a,b)=>new Date(a.birthdate||0)-new Date(b.birthdate||0));
  const lang = cfg.language;
  grid.innerHTML = sorted.map(m => {
    const parent = members.find(x=>x.id===m.parentId);
    const age    = getAge(m.birthdate);
    const cityDisplay = lang==='ar' ? (getCityData(m.cityEn,m.countryEn)?.city||m.cityEn||'') : (m.cityEn||'');
    const ctryDisplay = lang==='ar' ? (getCityData(m.cityEn,m.countryEn)?.country||m.countryEn||'') : (m.countryEn||'');
    return `<div class="member-card">
      <div class="member-card-name">${m.name}</div>
      <div class="member-card-detail">📅 ${m.birthdate||'—'} ${age>0?`(${age} ${lang==='ar'?'سنة':'yrs'})`:''}  </div>
      <div class="member-card-detail">👤 ${m.gender==='male'?L('male'):L('female')}</div>
      <div class="member-card-detail">📍 ${cityDisplay}, ${ctryDisplay}</div>
      ${parent?`<div class="member-card-detail">👨‍👩‍👧 ${parent.name}</div>`:''}
      <div class="member-card-actions">
        <button class="btn-edit" onclick="editMember('${m.id}')">${L('edit')}</button>
        <button class="btn-del"  onclick="deleteMember('${m.id}')">${L('delete')}</button>
      </div>
    </div>`;
  }).join('');
}

function showAddMember() {
  editingMemberId = null;
  setText('member-form-title', L('add_member_title'));
  document.getElementById('member-form-panel').style.display = 'block';
  clearMemberForm();
  populateCountryDropdown(null);
  populateCityDropdown(null, null);
  populateParentDropdown(null);
}

function editMember(id) {
  editingMemberId = id;
  const m = members.find(x=>x.id===id); if (!m) return;
  setText('member-form-title', L('edit_member'));
  document.getElementById('f-name').value     = m.name     ||'';
  document.getElementById('f-birthdate').value = m.birthdate||'';
  document.getElementById('f-gender').value   = m.gender   ||'male';
  document.getElementById('f-email').value    = m.email    ||'';
  populateCountryDropdown(m.countryEn);
  populateCityDropdown(m.countryEn, m.cityEn);
  populateParentDropdown(m.parentId);
  document.getElementById('member-form-panel').style.display = 'block';
  document.getElementById('member-form-panel').scrollIntoView({behavior:'smooth'});
}

function populateCountryDropdown(selectedCountryEn) {
  const sel = document.getElementById('f-country');
  if (!sel) return;
  sel.innerHTML = `<option value="">${L('select_country')}</option>`;
  for (const c of getCountries(cfg.language)) {
    const opt = document.createElement('option');
    opt.value       = c.value;
    opt.textContent = c.label;
    if (c.value === selectedCountryEn) opt.selected = true;
    sel.appendChild(opt);
  }
}

function populateCityDropdown(countryEn, selectedCityEn) {
  const sel = document.getElementById('f-city');
  if (!sel) return;
  sel.innerHTML = `<option value="">${L('select_city')}</option>`;
  if (!countryEn) return;
  for (const c of getCitiesForCountry(countryEn, cfg.language)) {
    const opt = document.createElement('option');
    opt.value       = c.value;          // always English key
    opt.textContent = c.label;          // localized display
    if (c.value === selectedCityEn) opt.selected = true;
    sel.appendChild(opt);
  }
}

// Called when country dropdown changes
function onCountryChange() {
  const countryEn = document.getElementById('f-country')?.value;
  populateCityDropdown(countryEn, null);
}

function populateParentDropdown(selectedId) {
  const sel = document.getElementById('f-parent'); if (!sel) return;
  sel.innerHTML = `<option value="">${L('no_parent')}</option>`;
  for (const m of members) {
    if (m.id === editingMemberId) continue;
    const opt = document.createElement('option');
    opt.value = m.id; opt.textContent = m.name;
    if (m.id === selectedId) opt.selected = true;
    sel.appendChild(opt);
  }
}

function saveMember() {
  const name = (document.getElementById('f-name').value||'').trim();
  if (!name) { alert(L('name') + '?'); return; }
  const countryEn = document.getElementById('f-country')?.value || '';
  const cityEn    = document.getElementById('f-city')?.value    || '';
  const cd        = getCityData(cityEn, countryEn);
  const data = {
    name,
    birthdate:  document.getElementById('f-birthdate').value,
    gender:     document.getElementById('f-gender').value,
    cityEn,
    countryEn,
    city:       cd?.city    || cityEn,
    country:    cd?.country || countryEn,
    email:     (document.getElementById('f-email').value||'').trim(),
    parentId:   document.getElementById('f-parent').value || null,
  };
  if (editingMemberId) {
    const idx = members.findIndex(m=>m.id===editingMemberId);
    if (idx>-1) members[idx] = {...members[idx],...data};
  } else {
    members.push({id:uid(),...data});
  }
  saveData(); cancelMemberForm(); renderMembers();
}

function deleteMember(id) {
  if (!confirm(L('delete_confirm'))) return;
  members = members.filter(m=>m.id!==id);
  saveData(); renderMembers();
}
function cancelMemberForm() {
  document.getElementById('member-form-panel').style.display = 'none';
  editingMemberId = null; clearMemberForm();
}
function clearMemberForm() {
  ['f-name','f-birthdate','f-email'].forEach(id=>{ const e=document.getElementById(id); if(e)e.value=''; });
}

// ────────────────────────────────────────────────────────────────
//  Settings
// ────────────────────────────────────────────────────────────────
function renderSettings() {
  const s=(id,v)=>{ const e=document.getElementById(id); if(e)e.value=v; };
  s('s-language',   cfg.language);
  s('s-reminder',   cfg.reminder_minutes);
  s('s-timeformat', cfg.time_format);
  s('s-dateformat', cfg.date_format);
  s('s-method',     cfg.calculation_method);
  s('s-athan',      cfg.athan_sound);
  s('s-marquee',    cfg.marquee_speed);
  s('s-fontsize',   cfg.font_size||16);
  setText('font-size-val', (cfg.font_size||16)+'px');
  renderFontSelector();
  renderThemeGrid();
}

function renderFontSelector() {
  const sel = document.getElementById('s-fontface'); if (!sel) return;
  sel.innerHTML = ARABIC_FONTS.map(f =>
    `<option value="${f.value}" ${cfg.font_face===f.value?'selected':''} style="font-family:${f.value}">${f.label}</option>`
  ).join('');
}

function settingChanged() {
  const g = id => document.getElementById(id);
  cfg.language          = g('s-language')?.value   || cfg.language;
  cfg.reminder_minutes  = parseInt(g('s-reminder')?.value)  ||15;
  cfg.time_format       = g('s-timeformat')?.value || cfg.time_format;
  cfg.date_format       = g('s-dateformat')?.value || cfg.date_format;
  cfg.calculation_method= parseInt(g('s-method')?.value)    ||16;
  cfg.athan_sound       = g('s-athan')?.value      || cfg.athan_sound;
  cfg.marquee_speed     = parseInt(g('s-marquee')?.value)   ||50;
  cfg.font_face         = g('s-fontface')?.value   || cfg.font_face;
  cfg.font_size         = parseInt(g('s-fontsize')?.value)  ||16;
  saveData();
  applyLanguage(); applyTheme(); applyFont();
  updateDateDisplay();
  // Restart marquee with updated speed
  const pool = buildMarqueePool(null);
  if (pool.length) setMarqueeContent(pool[marqueeIdx] || pool[0]);
}

const THEME_COLORS = {
  'sand':['#f5f0e8','#8b6914'],'pearl':['#f0f7f4','#1a6b48'],
  'dawn':['#fdf4f8','#8b2252'],'ivory':['#faf8f2','#1a5a58'],'linen':['#f8f4ee','#9a6800'],
  'dark-emerald':['#0a1a12','#c9a84c'],'midnight':['#070d1a','#4fc3f7'],
  'obsidian':['#0d0d0d','#f5a623'],'deep-rose':['#1a0810','#f48fb1'],'starlight':['#080820','#c0c0ff'],
};
const THEME_NAMES = {
  'sand':'Sand','pearl':'Pearl','dawn':'Dawn','ivory':'Ivory','linen':'Linen',
  'dark-emerald':'Dark Emerald','midnight':'Midnight','obsidian':'Obsidian',
  'deep-rose':'Deep Rose','starlight':'Starlight',
};
function renderThemeGrid() {
  const grid = document.getElementById('theme-grid'); if (!grid) return;
  grid.innerHTML = PrayerzConfig.available_themes.map(t => {
    const [bg,acc] = THEME_COLORS[t]||['#ccc','#333'];
    return `<div class="theme-swatch ${cfg.theme===t?'selected':''}"
      title="${THEME_NAMES[t]||t}"
      style="background:linear-gradient(135deg,${bg} 0%,${acc} 100%);"
      onclick="setTheme('${t}')"></div>`;
  }).join('');
}
function setTheme(t) { cfg.theme=t; saveData(); applyTheme(); renderThemeGrid(); }
function confirmReset() {
  if (confirm(L('reset_confirm'))) { localStorage.clear(); sessionStorage.clear(); location.reload(); }
}

// ────────────────────────────────────────────────────────────────
//  Init
// ────────────────────────────────────────────────────────────────
async function init() {
  loadData();
  applyTheme();
  applyFont();
  applyLanguage();
  refreshDateUI();
  await updateDateDisplay();

  // Start marquee with first verse
  const pool = buildMarqueePool(null);
  if (pool.length) setMarqueeContent(pool[0]);

  if (marqueeTimer) clearInterval(marqueeTimer);
  marqueeTimer = setInterval(() => rotateMaEquee(null), 35000);

  await renderTables();

  if (tickInterval) clearInterval(tickInterval);
  tickInterval = setInterval(tick, 1000);
  tick();
}

init();
