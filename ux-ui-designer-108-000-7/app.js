const LEGACY_STORAGE_KEY = "bloom-ux-life-tracker-v2";
const GUEST_STORAGE_KEY = "bloom-ux-life-tracker-guest-v1";
const userStorageKey = (userId) => `bloom-ux-life-tracker-user-${userId}`;
const SUPABASE_URL = "https://rxbipastbsfmxyyksdxm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_N1cDxWxXCS8nlXS7iZg8DQ_gJNvboZz";
const DEFAULT_SETTINGS = {
  debtTotal: 108000,
  waterDailyTarget: 8,
  exerciseDailyTarget: 30,
  sleepTarget: 7,
  confidenceTarget: 10,
  exerciseWeeklyTarget: 150,
  debtMonthlyTarget: 12000,
  sideIncomeMonthlyTarget: 8000,
  sideIncomeWeeklyTarget: 2000,
  sideIncomeYearlyTarget: 96000,
  sideChannelMonthlyTarget: 3000,
  careerTargetDays: 20,
  skillTargetDays: 20,
  languageDailyTarget: 20,
  languageWeeklyTarget: 140,
  nonEssentialLimit: 6000,
  sweetDrinkLimit: 1200,
  trendExerciseTarget: 45,
  trendNonEssentialLimit: 500
};
const EMPTY_SETTINGS = Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((key) => [key, 0]));
EMPTY_SETTINGS.skillNames = [];
EMPTY_SETTINGS.languageNames = [];
EMPTY_SETTINGS.sideChannelNames = [];

const pages = [
  { id: "dashboard", label: "หน้าแรก", icon: "⌂", title: "แดชบอร์ด", cover: "assets/dashboard.svg", kicker: "ภาพรวมวันนี้", quote: "ทุกบันทึกเล็กๆ คือหลักฐานว่าเรากำลังดูแลอนาคตของตัวเอง" },
  { id: "goals", label: "ตั้งค่าเป้าหมาย", icon: "◎", title: "ตั้งค่าเป้าหมาย", cover: "assets/goals.svg", kicker: "ออกแบบชีวิตแบบมี milestone", quote: "เป้าหมายที่ดีไม่กดดันเรา แต่มันชวนเราเดินต่ออย่างชัดเจน" },
  { id: "checkin", label: "เช็คอินวันนี้", icon: "✓", title: "เช็คอินวันนี้", cover: "assets/checkin.svg", kicker: "บันทึกตัวเองอย่างอ่อนโยน", quote: "วันนี้ไม่ต้องสมบูรณ์แบบ แค่ซื่อสัตย์กับตัวเองก็พอ" },
  { id: "money", label: "เงิน & หนี้", icon: "฿", title: "เงิน & หนี้", cover: "assets/money.svg", kicker: "ปิดหนี้ 108,000 บาท", quote: "เงินทุกบาทที่เห็นชัด จะเริ่มมีทิศทางและมีพลังมากขึ้น" },
  { id: "side", label: "รายได้เสริม", icon: "↗", title: "รายได้เสริม", cover: "assets/side.svg", kicker: "ทดลอง สร้าง วัดผล", quote: "รายได้เสริมเริ่มจากรอบทดลองเล็กๆ ที่ทำซ้ำได้" },
  { id: "health", label: "สุขภาพ & ความสวย", icon: "♡", title: "สุขภาพ & ความสวย", cover: "assets/health.svg", kicker: "ดูแลร่างกายเหมือนดูแลระบบสำคัญ", quote: "ความมั่นใจโตจากการดูแลตัวเองแบบไม่ทอดทิ้งกัน" },
  { id: "skills", label: "ทักษะ & อาชีพ", icon: "▧", title: "ทักษะ & อาชีพ", cover: "assets/skills.svg", kicker: "UX/UI Designer growth map", quote: "งานที่ดีขึ้นมาจากทักษะที่ค่อยๆ คมขึ้นทีละวัน" }
];

const DEFAULT_SKILLS = ["UX Research", "UI Design", "Design System", "AI Tools", "Portfolio", "Case Study"];
const DEFAULT_LANGUAGES = ["อังกฤษ", "อาหรับ"];
const DEFAULT_SIDE_CHANNELS = ["AI Kids Song YouTube", "ร้านเสื้อผ้ามือสอง", "TikTok Cat Affiliate"];
const expenseCategories = ["กาแฟ", "ข้าวเที่ยง", "น้ำหวาน", "ข้าวเย็น", "ค่ารถ"];
const settingGroups = {
  debt: {
    title: "แก้ไขค่าหนี้",
    description: "ค่าหนี้ทั้งหมดเป็นค่า fix ไม่ได้มาจากเช็คอินรายวัน",
    fields: [{ key: "debtTotal", label: "หนี้ทั้งหมด", suffix: "บาท" }]
  },
  goals: {
    title: "แก้ไขค่าเป้าหมาย",
    description: "เป้าหมายเหล่านี้ใช้คำนวณ progress bar และวงแหวนบน dashboard",
    fields: [
      { key: "waterDailyTarget", label: "น้ำต่อวัน", suffix: "แก้ว" },
      { key: "exerciseWeeklyTarget", label: "ออกกำลังกายต่อสัปดาห์", suffix: "นาที" },
      { key: "debtMonthlyTarget", label: "จ่ายหนี้ต่อเดือน", suffix: "บาท" },
      { key: "sideIncomeMonthlyTarget", label: "รายได้เสริมต่อเดือน", suffix: "บาท" },
      { key: "careerTargetDays", label: "วันฝึก portfolio/case study", suffix: "วัน" }
    ]
  },
  dashboard: {
    title: "แก้ไขเป้าสมดุลชีวิต",
    description: "ค่าเหล่านี้ผูกกับกราฟแมงมุม 4 แกน: สุขภาพ เงิน รายได้เสริม และอาชีพ",
    fields: [
      { key: "waterDailyTarget", label: "สุขภาพ: น้ำต่อวัน", suffix: "แก้ว" },
      { key: "exerciseDailyTarget", label: "สุขภาพ: ออกกำลังกายต่อวัน", suffix: "นาที" },
      { key: "sleepTarget", label: "สุขภาพ: นอนต่อวัน", suffix: "ชั่วโมง" },
      { key: "confidenceTarget", label: "สุขภาพ: ความมั่นใจ", suffix: "คะแนน" },
      { key: "debtTotal", label: "เงิน: หนี้ทั้งหมด", suffix: "บาท" },
      { key: "nonEssentialLimit", label: "เงิน: เพดานรายจ่ายไม่จำเป็น", suffix: "บาท" },
      { key: "sweetDrinkLimit", label: "เงิน: เพดานค่าน้ำหวาน", suffix: "บาท" },
      { key: "sideIncomeWeeklyTarget", label: "รายได้เสริม: เป้าสัปดาห์", suffix: "บาท" },
      { key: "sideIncomeMonthlyTarget", label: "รายได้เสริม: เป้าเดือน", suffix: "บาท" },
      { key: "sideIncomeYearlyTarget", label: "รายได้เสริม: เป้าปี", suffix: "บาท" },
      { key: "skillTargetDays", label: "อาชีพ: เป้าวันต่อ skill", suffix: "วัน" }
    ]
  },
  health: {
    title: "แก้ไขเป้าสุขภาพ",
    description: "เป้าสุขภาพใช้กับหน้า Health & Beauty และคะแนนสมดุลชีวิต",
    fields: [
      { key: "waterDailyTarget", label: "น้ำต่อวัน", suffix: "แก้ว" },
      { key: "exerciseDailyTarget", label: "ออกกำลังกายต่อวัน", suffix: "นาที" },
      { key: "exerciseWeeklyTarget", label: "ออกกำลังกายต่อสัปดาห์", suffix: "นาที" },
      { key: "sleepTarget", label: "นอนต่อวัน", suffix: "ชั่วโมง" },
      { key: "confidenceTarget", label: "เป้าความมั่นใจ", suffix: "คะแนน" }
    ]
  },
  side: {
    title: "แก้ไขเป้ารายได้เสริม",
    description: "เพิ่ม/ลดช่องทางรายได้เสริม และตั้งเป้ารายได้ต่อช่วงเวลา",
    fields: [
      { key: "sideIncomeWeeklyTarget", label: "เป้ารายสัปดาห์", suffix: "บาท" },
      { key: "sideIncomeMonthlyTarget", label: "เป้ารายเดือน", suffix: "บาท" },
      { key: "sideIncomeYearlyTarget", label: "เป้ารายปี", suffix: "บาท" },
      { key: "sideChannelMonthlyTarget", label: "เป้าแต่ละช่องทางต่อเดือน", suffix: "บาท" }
    ]
  },
  skills: {
    title: "แก้ไขเป้าทักษะ",
    description: "เพิ่ม/ลด skill ที่อยากติดตาม และตั้งเป้าจำนวนวันต่อ skill",
    fields: [{ key: "skillTargetDays", label: "เป้าจำนวนวันต่อทักษะ", suffix: "วัน" }]
  },
  language: {
    title: "แก้ไขเป้าฝึกภาษา",
    description: "เพิ่ม/ลดภาษาที่อยากเรียน และตั้งเป้านาทีต่อวัน/สัปดาห์",
    fields: [
      { key: "languageDailyTarget", label: "เป้าฝึกภาษาต่อวัน", suffix: "นาที" },
      { key: "languageWeeklyTarget", label: "เป้าฝึกภาษาต่อสัปดาห์", suffix: "นาที" }
    ]
  }
};

let state = loadGuestState();
let activePage = "dashboard";
let selectedDate = toISO(new Date());
let filter = "month";
let calendarCursor = new Date();
let modalCategory = "checkin";
let settingGroup = "debt";
let pendingConfirmAction = null;
let dailyNewsItems = [];
let supabaseClient = null;
let currentUser = null;
let isCloudLoading = false;

const $ = (selector) => document.querySelector(selector);
const money = (value) => Number(value || 0).toLocaleString("th-TH");
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const numericFields = ["water", "exercise", "sleep", "income", "essential", "nonEssential", "sweetDrink", "debtPaid", "sideIncome", "confidence", "thaiMinutes", "arabicMinutes"];
const categoryIcons = {
  health: `<svg viewBox="0 0 24 24"><path class="fill" d="M12 3s6 6.8 6 11a6 6 0 0 1-12 0c0-4.2 6-11 6-11Z"/><path d="M12 3s6 6.8 6 11a6 6 0 0 1-12 0c0-4.2 6-11 6-11Z"/><path d="M9.3 15.4c1.1 1.5 3.2 2 4.9.9"/></svg>`,
  money: `<svg viewBox="0 0 24 24"><rect class="fill" x="4" y="7" width="16" height="11" rx="3"/><path d="M5 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z"/><path d="M15 12h4v3h-4a1.5 1.5 0 0 1 0-3Z"/><path d="M7 7l8-3 2 3"/></svg>`,
  side: `<svg viewBox="0 0 24 24"><path class="fill" d="M14 4c2.6.6 4.6 2.6 5.2 5.2l-4.7 4.7-4.4-4.4L14 4Z"/><path d="M14 4c2.6.6 4.6 2.6 5.2 5.2l-7.8 7.8-4.4-4.4L14 4Z"/><path d="M7 12.6 4.5 15 9 15"/><path d="M11.4 17 11.4 21.5 14 19"/><circle cx="15" cy="8.6" r="1.2"/></svg>`,
  career: `<svg viewBox="0 0 24 24"><path class="fill" d="M5 19 7 13l9-9 4 4-9 9-6 2Z"/><path d="M5 19 7 13l9-9 4 4-9 9-6 2Z"/><path d="M14.5 5.5 18.5 9.5"/><path d="M7 13l4 4"/></svg>`,
  language: `<svg viewBox="0 0 24 24"><circle class="fill" cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8"/><path d="M12 4c-2 2.2-3 4.8-3 8s1 5.8 3 8"/></svg>`,
  thai: "🇬🇧",
  arabic: "ض",
  mood: `<svg viewBox="0 0 24 24"><circle class="fill" cx="12" cy="12" r="8"/><path d="M8.5 10h.01"/><path d="M15.5 10h.01"/><path d="M8.8 14c1.5 1.7 4.9 1.7 6.4 0"/><circle cx="12" cy="12" r="8"/></svg>`,
  win: `<svg viewBox="0 0 24 24"><path class="fill" d="m12 3 2.5 5.4 5.8.7-4.3 4 1.1 5.8-5.1-2.9-5.1 2.9L8 13.1l-4.3-4 5.8-.7L12 3Z"/><path d="m12 3 2.5 5.4 5.8.7-4.3 4 1.1 5.8-5.1-2.9-5.1 2.9L8 13.1l-4.3-4 5.8-.7L12 3Z"/></svg>`,
  debt: `<svg viewBox="0 0 24 24"><circle class="fill" cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M22 12h-3"/><path d="M12 22v-3"/><path d="M2 12h3"/></svg>`,
  income: `<svg viewBox="0 0 24 24"><circle class="fill" cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  expense: `<svg viewBox="0 0 24 24"><path class="fill" d="M7 4h10v16l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2V4Z"/><path d="M7 4h10v16l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2V4Z"/><path d="M9.5 9h5"/><path d="M9.5 13h4"/></svg>`,
  sweet: `<svg viewBox="0 0 24 24"><path class="fill" d="M7 8h10l-1 12H8L7 8Z"/><path d="M7 8h10l-1 12H8L7 8Z"/><path d="M6 8h12"/><path d="M14 8l3-5"/><path d="M9 12h6"/></svg>`,
  sleep: `<svg viewBox="0 0 24 24"><path class="fill" d="M18 16.4A8 8 0 0 1 7.6 6c.4-.6 1.2-.2 1.1.5-.5 4.2 3.1 7.8 7.3 7.3.7-.1 1.1.7.5 1.1Z"/><path d="M18 16.4A8 8 0 0 1 7.6 6c.4-.6 1.2-.2 1.1.5-.5 4.2 3.1 7.8 7.3 7.3.7-.1 1.1.7.5 1.1Z"/></svg>`,
  exercise: `<svg viewBox="0 0 24 24"><path class="fill" d="M8 8h8v8H8z"/><path d="M5 9v6"/><path d="M19 9v6"/><path d="M8 12h8"/><path d="M3 11v2"/><path d="M21 11v2"/></svg>`,
  confidence: `<svg viewBox="0 0 24 24"><path class="fill" d="M12 20s-7-4.5-8.2-9.3C3 7.3 5.2 5 8 5c1.7 0 3 1 4 2.2C13 6 14.3 5 16 5c2.8 0 5 2.3 4.2 5.7C19 15.5 12 20 12 20Z"/><path d="M12 20s-7-4.5-8.2-9.3C3 7.3 5.2 5 8 5c1.7 0 3 1 4 2.2C13 6 14.3 5 16 5c2.8 0 5 2.3 4.2 5.7C19 15.5 12 20 12 20Z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24"><rect class="fill" x="4" y="5" width="16" height="15" rx="3"/><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 10h16"/></svg>`
};

function categoryIcon(key) {
  const icon = categoryIcons[key] || categoryIcons.win;
  return `<span class="category-icon category-icon-${key}" aria-hidden="true">${icon}</span>`;
}

function iconLabel(key, label) {
  return `<span class="icon-label">${categoryIcon(key)}<span>${label}</span></span>`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function safeURL(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(normalized);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

const modalConfigs = {
  dashboard: {
    title: "บันทึกภาพรวมวันนี้",
    description: "รวมข้อมูลสำคัญของวันเดียวในฟอร์มเดียว เหมาะกับการอัปเดตเร็วจาก dashboard",
    fields: ["mood", "water", "exercise", "income", "expenseRows", "debtPaid", "sideIncome", "win"]
  },
  goals: {
    title: "อัปเดตเป้าหมาย",
    description: "กรอกเฉพาะตัวเลขที่ส่งผลต่อ progress bar รายวัน/สัปดาห์/เดือน/ระยะยาว",
    fields: ["water", "exercise", "debtPaid", "sideIncome", "skills", "win"]
  },
  checkin: {
    title: "เช็คอินชีวิตวันนี้",
    description: "บันทึกความรู้สึก ค่าใช้จ่าย สุขภาพ ชัยชนะเล็กๆ และ streak ของวันนี้",
    fields: ["mood", "water", "exercise", "sleep", "income", "expenseRows", "debtPaid", "sideIncome", "sideChannel", "confidence", "languageMinutes", "languageFocus", "skills", "win"]
  },
  money: {
    title: "บันทึกเงิน & หนี้",
    description: "แยกรายรับ รายจ่ายเป็นแถวตามหมวด และเงินที่จ่ายหนี้",
    fields: ["income", "expenseRows", "debtPaid", "win"]
  },
  side: {
    title: "บันทึกรายได้เสริม",
    description: "เก็บยอดและช่องทางของการทดลองหาเงินเสริมในวันนี้",
    fields: ["sideIncome", "sideChannel", "win"]
  },
  health: {
    title: "บันทึกสุขภาพ & ความสวย",
    description: "โฟกัสน้ำ การนอน ออกกำลังกาย skincare streak และความมั่นใจ",
    fields: ["water", "sleep", "exercise", "confidence", "win"]
  },
  skills: {
    title: "บันทึกทักษะ & อาชีพ",
    description: "เลือกทักษะ UX/UI ที่ฝึกวันนี้และบันทึกความคืบหน้าของ portfolio/case study",
    fields: ["skills", "win"]
  },
  language: {
    title: "บันทึกการฝึกภาษา",
    description: "ติดตามเวลาฝึกตามภาษาที่ตั้งไว้ พร้อมโฟกัสของรอบฝึกวันนี้",
    fields: ["languageMinutes", "languageFocus", "win"]
  }
};

function readStoredState(key, defaults = DEFAULT_SETTINGS) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return normalizeState(saved, defaults);
  } catch {
    return normalizeState({}, defaults);
  }
}

function loadGuestState() {
  const saved = readStoredState(GUEST_STORAGE_KEY, EMPTY_SETTINGS);
  return saved.meta?.kind === "guest" ? saved : normalizeState({ meta: { kind: "guest" } }, EMPTY_SETTINGS);
}

function loadUserCache(userId) {
  return readStoredState(userStorageKey(userId));
}

function normalizeState(saved = {}, defaults = DEFAULT_SETTINGS) {
  return {
    entries: saved && saved.entries ? saved.entries : {},
    settings: { ...defaults, ...(saved?.settings || {}) },
    createdAt: saved?.createdAt || new Date().toISOString(),
    meta: saved?.meta || {}
  };
}

function defaultSettingsForState() {
  return currentUser || state?.meta?.mockData ? DEFAULT_SETTINGS : EMPTY_SETTINGS;
}

function settings() {
  state.settings = { ...defaultSettingsForState(), ...(state.settings || {}) };
  if (!Array.isArray(state.settings.skillNames)) {
    state.settings.skillNames = currentUser || state?.meta?.mockData ? [...DEFAULT_SKILLS] : [];
  }
  if (!Array.isArray(state.settings.languageNames)) {
    state.settings.languageNames = currentUser || state?.meta?.mockData ? [...DEFAULT_LANGUAGES] : [];
  }
  if (!Array.isArray(state.settings.sideChannelNames)) {
    state.settings.sideChannelNames = currentUser || state?.meta?.mockData ? [...DEFAULT_SIDE_CHANNELS] : [];
  }
  return state.settings;
}

function skillsList() {
  const list = settings().skillNames;
  return Array.isArray(list) ? list.filter(Boolean) : [...DEFAULT_SKILLS];
}

function languagesList() {
  const list = settings().languageNames;
  return Array.isArray(list) ? list.map((item) => item.trim()).filter(Boolean) : [...DEFAULT_LANGUAGES];
}

function sideChannelsList() {
  const list = settings().sideChannelNames;
  return Array.isArray(list) ? list.map((item) => item.trim()).filter(Boolean) : [...DEFAULT_SIDE_CHANNELS];
}

function hasAnyEntryData() {
  return Object.keys(state.entries || {}).length > 0;
}

function hasGuestSetupData() {
  const cfg = settings();
  return Boolean(
    Number(cfg.debtTotal || 0) > 0 ||
    Number(cfg.sideIncomeWeeklyTarget || 0) > 0 ||
    Number(cfg.sideIncomeMonthlyTarget || 0) > 0 ||
    Number(cfg.sideIncomeYearlyTarget || 0) > 0 ||
    Number(cfg.sideChannelMonthlyTarget || 0) > 0 ||
    Number(cfg.languageDailyTarget || 0) > 0 ||
    Number(cfg.languageWeeklyTarget || 0) > 0 ||
    skillsList().length > 0 ||
    languagesList().length > 0 ||
    sideChannelsList().length > 0 ||
    hasAnyEntryData()
  );
}

function isGuestEmptyState() {
  return !currentUser && !state.meta?.mockData && !hasGuestSetupData();
}

function renderGuestEmptyState(title, description) {
  return `
    <div class="card empty-state-card">
      <div>
        <p class="eyebrow">Guest empty state</p>
        <h2>${title}</h2>
        <p class="muted">${description}</p>
      </div>
      <div class="button-row">
        <button class="soft-button" type="button" data-mock-data>จำลองข้อมูล</button>
        <button class="primary-button" type="button" data-open-entry>เริ่มบันทึกเอง</button>
      </div>
    </div>
  `;
}

function saveState() {
  const key = currentUser ? userStorageKey(currentUser.id) : GUEST_STORAGE_KEY;
  state.meta = currentUser
    ? { ...(state.meta || {}), kind: "user" }
    : { ...(state.meta || {}), kind: "guest" };
  localStorage.setItem(key, JSON.stringify(state));
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

function setAuthMessage(message, isError = false) {
  const authMessage = $("#authMessage");
  if (!authMessage) return;
  authMessage.textContent = message || "";
  authMessage.style.color = isError ? "#b94b62" : "";
}

function updateAuthUI() {
  const authButton = $("#authButton");
  const mockButton = $("#mockDataButton");
  if (!authButton) return;
  document.body.classList.toggle("is-authenticated", Boolean(currentUser));
  if (isCloudLoading) {
    authButton.textContent = "กำลัง sync...";
    if (mockButton) mockButton.hidden = true;
    return;
  }
  authButton.textContent = currentUser ? `DB: ${currentUser.email}` : "เข้าสู่ระบบ";
  if (mockButton) mockButton.hidden = Boolean(currentUser);
}

async function initSupabase() {
  if (!window.supabase?.createClient) {
    setAuthMessage("โหลด Supabase client ไม่สำเร็จ ใช้ localStorage ชั่วคราว", true);
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  state = currentUser ? loadUserCache(currentUser.id) : loadGuestState();
  updateAuthUI();
  if (currentUser) await loadCloudState();
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    state = currentUser ? loadUserCache(currentUser.id) : loadGuestState();
    updateAuthUI();
    if (currentUser) await loadCloudState();
    render();
  });
}

async function loadDailyNews() {
  try {
    const response = await fetch("assets/daily-feed.json", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    dailyNewsItems = Array.isArray(payload.items) ? payload.items : [];
    render();
  } catch {
    dailyNewsItems = [];
  }
}

async function loadCloudState() {
  if (!supabaseClient || !currentUser) return;
  isCloudLoading = true;
  updateAuthUI();
  const [{ data: rows, error: entriesError }, { data: settingsRow, error: settingsError }] = await Promise.all([
    supabaseClient.from("daily_entries").select("entry_date,data").eq("user_id", currentUser.id),
    supabaseClient.from("user_settings").select("settings").eq("user_id", currentUser.id).maybeSingle()
  ]);
  isCloudLoading = false;
  updateAuthUI();
  if (entriesError || settingsError) {
    setAuthMessage(entriesError?.message || settingsError?.message || "โหลดข้อมูลจาก DB ไม่สำเร็จ", true);
    return;
  }
  state.entries = Object.fromEntries((rows || []).map((row) => [row.entry_date, row.data || {}]));
  state.settings = { ...DEFAULT_SETTINGS, ...(settingsRow?.settings || {}) };
  state.meta = { kind: "user" };
  saveState();
  render();
}

async function syncEntry(iso) {
  if (!supabaseClient || !currentUser) return;
  const entry = state.entries[iso];
  if (!entry) return;
  const { error } = await supabaseClient.from("daily_entries").upsert({
    user_id: currentUser.id,
    entry_date: iso,
    data: entry,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id,entry_date" });
  if (error) setAuthMessage(error.message, true);
}

async function deleteCloudEntry(iso) {
  if (!supabaseClient || !currentUser) return;
  const { error } = await supabaseClient.from("daily_entries").delete().eq("user_id", currentUser.id).eq("entry_date", iso);
  if (error) setAuthMessage(error.message, true);
}

async function clearCloudEntries() {
  if (!supabaseClient || !currentUser) return;
  const { error } = await supabaseClient.from("daily_entries").delete().eq("user_id", currentUser.id);
  if (error) setAuthMessage(error.message, true);
}

async function syncSettings() {
  if (!supabaseClient || !currentUser) return;
  const { error } = await supabaseClient.from("user_settings").upsert({
    user_id: currentUser.id,
    settings: settings(),
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id" });
  if (error) setAuthMessage(error.message, true);
}

function toISO(date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 10);
}

function dateLabel(iso, format = "long") {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: format,
    calendar: "gregory"
  }).format(new Date(`${iso}T00:00:00`));
}

function getEntry(iso = selectedDate) {
  return state.entries[iso] || {};
}

function entriesInRange(range = filter) {
  const today = new Date(`${selectedDate}T00:00:00`);
  let start = new Date(today);
  if (range === "week") start.setDate(today.getDate() - 6);
  if (range === "month") start = new Date(today.getFullYear(), today.getMonth(), 1);
  if (range === "year") start = new Date(today.getFullYear(), 0, 1);

  return Object.entries(state.entries)
    .filter(([iso]) => {
      const day = new Date(`${iso}T00:00:00`);
      return day >= start && day <= today;
    })
    .sort(([a], [b]) => a.localeCompare(b));
}

function lastDays(count) {
  const end = new Date(`${selectedDate}T00:00:00`);
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(end);
    day.setDate(end.getDate() - (count - 1 - index));
    const iso = toISO(day);
    return [iso, state.entries[iso] || {}];
  });
}

function trendPeriod() {
  const selected = new Date(`${selectedDate}T00:00:00`);
  if (filter === "year") {
    const labels = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const entries = Array.from({ length: 12 }, (_, month) => {
      const monthEntries = Object.entries(state.entries).filter(([iso]) => {
        const day = new Date(`${iso}T00:00:00`);
        return day.getFullYear() === selected.getFullYear() && day.getMonth() === month;
      });
      return [`${selected.getFullYear()}-${String(month + 1).padStart(2, "0")}`, mergeEntries(monthEntries), labels[month], `${labels[month]} ${selected.getFullYear()}`];
    });
    return { title: "แนวโน้มปีนี้", eyebrow: "Year trend", entries, mode: "month" };
  }

  if (filter === "month") {
    const daysInMonth = new Date(selected.getFullYear(), selected.getMonth() + 1, 0).getDate();
    const todayIso = toISO(selected);
    const entries = Array.from({ length: daysInMonth }, (_, index) => {
      const day = new Date(selected.getFullYear(), selected.getMonth(), index + 1);
      const iso = toISO(day);
      const entry = iso <= todayIso ? state.entries[iso] || {} : {};
      return [iso, entry, String(index + 1), dateLabel(iso, "medium")];
    });
    return { title: "แนวโน้มเดือนนี้", eyebrow: "Month trend", entries, mode: "day" };
  }

  return {
    title: "แนวโน้ม 7 วันล่าสุด",
    eyebrow: "Week trend",
    entries: lastDays(7).map(([iso, entry]) => [iso, entry, new Intl.DateTimeFormat("th-TH", { weekday: "short" }).format(new Date(`${iso}T00:00:00`)), dateLabel(iso, "medium")]),
    mode: "day"
  };
}

function mergeEntries(entries) {
  return entries.reduce((merged, [, entry]) => {
    numericFields.forEach((field) => {
      merged[field] = Number(merged[field] || 0) + Number(entry[field] || 0);
    });
    return merged;
  }, {});
}

function sum(entries, key) {
  return entries.reduce((total, [, entry]) => total + Number(entry[key] || 0), 0);
}

function languageFieldKey(language) {
  if (language === "อังกฤษ") return "thaiMinutes";
  if (language === "อาหรับ") return "arabicMinutes";
  return "";
}

function getLanguageMinutes(entry = {}, language) {
  const legacyKey = languageFieldKey(language);
  if (legacyKey) return Number(entry[legacyKey] || 0);
  return Number(entry.languageMinutes?.[language] || 0);
}

function languageTotal(entry) {
  return languagesList().reduce((total, language) => total + getLanguageMinutes(entry, language), 0);
}

function sumLanguage(entries, language) {
  return entries.reduce((total, [, entry]) => total + getLanguageMinutes(entry, language), 0);
}

function getExpenseItems(entry = {}) {
  if (Array.isArray(entry.expenseItems) && entry.expenseItems.length) {
    return entry.expenseItems
      .map((item) => ({
        category: expenseCategories.includes(item.category) ? item.category : expenseCategories[0],
        amount: Number(item.amount || 0)
      }))
      .filter((item) => item.amount > 0);
  }
  const fallback = [];
  if (Number(entry.nonEssential || 0) > 0) fallback.push({ category: "น้ำหวาน", amount: Number(entry.nonEssential || 0) });
  if (Number(entry.sweetDrink || 0) > 0) fallback.push({ category: "น้ำหวาน", amount: Number(entry.sweetDrink || 0) });
  if (Number(entry.essential || 0) > 0) fallback.push({ category: "ข้าวเที่ยง", amount: Number(entry.essential || 0) });
  return fallback;
}

function expenseTotals(items = []) {
  return items.reduce((totals, item) => {
    const amount = Number(item.amount || 0);
    if (["ข้าวเที่ยง", "ข้าวเย็น", "ค่ารถ"].includes(item.category)) totals.essential += amount;
    if (item.category === "น้ำหวาน") {
      totals.nonEssential += amount;
      totals.sweetDrink += amount;
    }
    return totals;
  }, { essential: 0, nonEssential: 0, sweetDrink: 0 });
}

function expenseTotal(entry = {}) {
  return getExpenseItems(entry).reduce((total, item) => total + Number(item.amount || 0), 0);
}

function progressValue(value, target) {
  const safeTarget = Number(target || 0);
  if (safeTarget <= 0) return 0;
  return clamp((Number(value || 0) / safeTarget) * 100, 0, 100);
}

function inverseProgress(value, limit) {
  if (Number(limit || 0) <= 0) return 0;
  return clamp(100 - progressValue(value, limit), 0, 100);
}

function average(values) {
  return Math.round(values.reduce((total, value) => total + value, 0) / Math.max(values.length, 1));
}

function countSkillDays(skill) {
  return Object.values(state.entries).filter((entry) => (entry.skills || []).includes(skill)).length;
}

function currentStreak(predicate = (entry) => Boolean(entry && Object.keys(entry).length)) {
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i += 1) {
    const iso = toISO(cursor);
    if (!predicate(state.entries[iso])) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function renderNav() {
  const navHTML = pages.map((page) => `
    <button class="nav-item ${page.id === activePage ? "active" : ""}" type="button" data-page="${page.id}" title="${page.label}" aria-label="${page.label}">
      <span class="nav-icon" aria-hidden="true">${page.icon}</span>
      <span>${page.label}</span>
    </button>
  `).join("");
  $("#desktopNav").innerHTML = navHTML;
  $("#mobileNav").innerHTML = navHTML;
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      activePage = button.dataset.page;
      render();
    });
  });
}

function render() {
  const page = pages.find((item) => item.id === activePage);
  $("#todayLabel").textContent = `วันนี้ ${dateLabel(toISO(new Date()))}`;
  $("#pageTitle").textContent = page.title;
  $("#pageKicker").textContent = page.id === "money" ? `ปิดหนี้ ${money(settings().debtTotal)} บาท` : page.kicker;
  $("#coverTitle").textContent = page.title;
  $("#pageQuote").textContent = page.quote;
  $("#coverImage").src = page.cover;
  $("#coverImage").alt = `รูปปก${page.title}`;
  renderNav();

  const content = {
    dashboard: renderDashboard,
    goals: renderGoals,
    checkin: renderCheckin,
    money: renderMoney,
    side: renderSideIncome,
    health: renderHealth,
    skills: renderSkills
  }[activePage]();

  $("#pageContent").innerHTML = `${content}${renderDailyFeed(page.id)}`;
  bindPageEvents();
}

function renderDashboard() {
  const entries = entriesInRange();
  const today = getEntry();
  const cfg = settings();
  const guestEmpty = isGuestEmptyState();
  if (guestEmpty) {
    return `
      <div class="section-head">
        <div class="segmented" aria-label="ตัวกรองช่วงเวลา">
          ${["week", "month", "year"].map((item) => `<button type="button" class="${filter === item ? "active" : ""}" data-filter="${item}">${item === "week" ? "สัปดาห์" : item === "month" ? "เดือน" : "ปี"}</button>`).join("")}
        </div>
        <button class="primary-button" type="button" data-open-entry>เริ่มบันทึกเอง</button>
      </div>
      <div class="grid two">
        ${renderGuestEmptyState("ยังไม่มีข้อมูลสำหรับ guest", "หนี้ รายได้เสริม ทักษะ และภาษาเป้าหมายจะว่างทั้งหมด จนกว่าจะกดจำลองข้อมูลหรือเริ่มบันทึกเอง")}
        ${renderCalendar()}
      </div>
    `;
  }
  const debtPaid = sum(Object.entries(state.entries), "debtPaid");
  const sideIncome = sum(entries, "sideIncome");
  const debtLeft = Math.max(0, cfg.debtTotal - debtPaid);
  const trend = trendPeriod();
  const hasRangeData = entries.length > 0;
  const healthScore = average([
    progressValue(Number(today.water || 0), cfg.waterDailyTarget),
    progressValue(Number(today.exercise || 0), cfg.exerciseDailyTarget),
    progressValue(Number(today.sleep || 0), cfg.sleepTarget),
    progressValue(Number(today.confidence || 0), cfg.confidenceTarget)
  ]);
  const moneyScore = hasRangeData ? average([
    progressValue(debtPaid, cfg.debtTotal),
    inverseProgress(sum(entries, "sweetDrink"), cfg.nonEssentialLimit),
    inverseProgress(sum(entries, "sweetDrink"), cfg.sweetDrinkLimit)
  ]) : 0;
  const sideScore = progressValue(sideIncome, filter === "week" ? cfg.sideIncomeWeeklyTarget : filter === "year" ? cfg.sideIncomeYearlyTarget : cfg.sideIncomeMonthlyTarget);
  const careerSkills = skillsList();
  const careerScore = progressValue(careerSkills.reduce((total, skill) => total + countSkillDays(skill), 0), careerSkills.length * cfg.skillTargetDays);
  return `
    <div class="section-head">
      <div class="segmented" aria-label="ตัวกรองช่วงเวลา">
        ${["week", "month", "year"].map((item) => `<button type="button" class="${filter === item ? "active" : ""}" data-filter="${item}">${item === "week" ? "สัปดาห์" : item === "month" ? "เดือน" : "ปี"}</button>`).join("")}
      </div>
      <button class="primary-button" type="button" data-open-entry>บันทึกวันที่เลือก</button>
    </div>

    <div class="grid two dashboard-visual-grid">
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Life balance</p>
            <h2>ภาพรวมสมดุลชีวิต</h2>
          </div>
          <button class="tiny-button" type="button" data-open-setting="dashboard">แก้ไขเป้ากราฟ</button>
        </div>
        ${lifeRadarChart([
          { key: "health", icon: "health", label: "สุขภาพ", score: healthScore, note: "น้ำ นอน ออกกำลัง", color: "#a9dcc5" },
          { key: "money", icon: "money", label: "เงิน", score: moneyScore, note: "หนี้ + ค่าใช้จ่าย", color: "#ffc39d" },
          { key: "side", icon: "side", label: "รายได้เสริม", score: sideScore, note: `${money(sideIncome)} บาท`, color: "#c6b2f2" },
          { key: "career", icon: "career", label: "อาชีพ", score: careerScore, note: "skill days", color: "#f5a7c6" }
        ])}
      </div>

      ${guestEmpty ? renderGuestEmptyState("ยังไม่ได้ตั้งค่าหนี้และเป้าหมายเงิน", "guest จะเห็นพื้นที่ว่างก่อน เพื่อไม่ปนกับข้อมูลจริงของคนที่ login") : `<div class="card debt-visual-card">
        <div>
          <p class="eyebrow">Debt visual</p>
          <h2>ปิดหนี้ ${money(cfg.debtTotal)} บาท</h2>
          <button class="tiny-button" type="button" data-open-setting="debt">แก้ค่าหนี้</button>
        </div>
        <div class="debt-ring dashboard-debt" style="--debt-angle: ${clamp((debtPaid / Math.max(cfg.debtTotal, 1)) * 100, 0, 100)}%">
          <div>
            <span class="muted">คงเหลือ</span>
            <strong>${money(debtLeft)}</strong>
            <span class="muted">จ่ายแล้ว ${Math.round((debtPaid / Math.max(cfg.debtTotal, 1)) * 100)}%</span>
          </div>
        </div>
      </div>`}
    </div>

    <div class="grid two">
      ${renderCalendar()}
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">${dateLabel(selectedDate)}</p>
            <h2>ข้อมูลย้อนหลัง</h2>
          </div>
          <button class="tiny-button" type="button" data-open-entry data-modal="checkin">แก้ไข</button>
        </div>
        ${renderDayDetail(selectedDate)}
      </div>
    </div>

    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">${trend.eyebrow}</p>
          <h2>${trend.title}</h2>
        </div>
        <span class="pill">${filter === "week" ? "สัปดาห์" : filter === "month" ? "เดือน" : "ปี"}</span>
      </div>
      <div class="trend-grid">
        ${trendChart("น้ำ", "water", trend.entries, cfg.waterDailyTarget, "แก้ว")}
        ${trendChart("ออกกำลังกาย", "exercise", trend.entries, cfg.trendExerciseTarget, "นาที")}
        ${trendChart("รายจ่ายไม่จำเป็น", "sweetDrink", trend.entries, cfg.trendNonEssentialLimit, "บาท", true)}
      </div>
    </div>

    ${languageDashboard(entries)}

    ${moneyMixChart(entries)}
  `;
}

function renderGoals() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่ได้ตั้งค่าเป้าหมาย", "guest จะไม่เห็นเป้าหมายหนี้ รายได้เสริม ทักษะ หรือภาษา จนกว่าจะจำลองข้อมูลหรือเริ่มเพิ่มเป้าหมายเอง");
  }
  const entries = entriesInRange("month");
  const cfg = settings();
  const goalTemplates = [
    { name: `ดื่มน้ำ ${money(cfg.waterDailyTarget)} แก้ว`, type: "รายวัน", target: cfg.waterDailyTarget, metric: "water" },
    { name: `ออกกำลังกาย ${money(cfg.exerciseWeeklyTarget)} นาที`, type: "รายสัปดาห์", target: cfg.exerciseWeeklyTarget, metric: "exercise" },
    { name: `จ่ายหนี้เดือนนี้ ${money(cfg.debtMonthlyTarget)} บาท`, type: "รายเดือน", target: cfg.debtMonthlyTarget, metric: "debtPaid" },
    { name: `สร้างรายได้เสริม ${money(cfg.sideIncomeMonthlyTarget)} บาท`, type: "รายเดือน", target: cfg.sideIncomeMonthlyTarget, metric: "sideIncome" },
    { name: "ทำ Portfolio / Case Study ให้ต่อเนื่อง", type: "ระยะยาว", target: cfg.careerTargetDays, metric: "careerDays" }
  ];
  const goals = goalTemplates.map((goal) => {
    let progress = 0;
    if (goal.metric === "water") progress = Number(getEntry().water || 0);
    if (goal.metric === "exercise") progress = sum(entriesInRange("week"), "exercise");
    if (goal.metric === "debtPaid") progress = sum(entries, "debtPaid");
    if (goal.metric === "sideIncome") progress = sum(entries, "sideIncome");
    if (goal.metric === "careerDays") progress = Object.values(state.entries).filter((entry) => (entry.skills || []).some((skill) => ["Portfolio", "Case Study"].includes(skill))).length;
    return { ...goal, progress };
  });

  return `
    <div class="grid two">
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Daily / Weekly / Monthly / Long-term</p>
            <h2>เป้าหมายที่กำลังเดิน</h2>
          </div>
          <div class="button-row">
            <button class="tiny-button" type="button" data-open-setting="goals">แก้ค่าเป้าหมาย</button>
            <button class="primary-button" type="button" data-open-entry>อัปเดตวันนี้</button>
          </div>
        </div>
        <div class="progress-list">
          ${goals.map(renderProgress).join("")}
        </div>
      </div>
      <div class="card">
        ${renderWeeklyFocus(goals)}
      </div>
    </div>
  `;
}

function renderWeeklyFocus(goals) {
  const cfg = settings();
  const week = entriesInRange("week");
  const month = entriesInRange("month");
  const today = getEntry();
  const goalHealth = goals
    .map((goal) => ({ ...goal, percent: progressValue(goal.progress, goal.target) }))
    .sort((a, b) => a.percent - b.percent);
  const weakest = goalHealth[0];
  const exerciseWeek = sum(week, "exercise");
  const sweetWeek = sum(week, "sweetDrink");
  const sideMonth = sum(month, "sideIncome");
  const languageWeek = week.reduce((total, [, entry]) => total + languageTotal(entry), 0);
  const practicedSkills = [...new Set(week.flatMap(([, entry]) => entry.skills || []))];
  const channelTotals = sideChannelsList().map((channel) => ({
    channel,
    value: sum(month.filter(([, entry]) => entry.sideChannel === channel), "sideIncome")
  })).sort((a, b) => b.value - a.value);
  const bestChannel = channelTotals[0];
  const insights = [];

  if (weakest) {
    insights.push({
      icon: "debt",
      title: "เป้าที่ควรดันก่อน",
      text: `${weakest.name} ตอนนี้อยู่ที่ ${Math.round(weakest.percent)}% (${money(weakest.progress)} / ${money(weakest.target)})`
    });
  }

  if (Number(today.water || 0) < Number(cfg.waterDailyTarget || 0)) {
    insights.push({
      icon: "health",
      title: "สุขภาพวันนี้",
      text: `น้ำยังขาด ${money(Math.max(0, cfg.waterDailyTarget - Number(today.water || 0)))} แก้ว จากเป้าวันนี้`
    });
  } else if (exerciseWeek < Number(cfg.exerciseWeeklyTarget || 0)) {
    insights.push({
      icon: "exercise",
      title: "สุขภาพสัปดาห์นี้",
      text: `ออกกำลังกายเพิ่มอีก ${money(Math.max(0, cfg.exerciseWeeklyTarget - exerciseWeek))} นาที จะถึงเป้าสัปดาห์`
    });
  }

  insights.push({
    icon: sweetWeek > Number(cfg.sweetDrinkLimit || 0) ? "sweet" : "money",
    title: "เงินและรายจ่าย",
    text: sweetWeek > 0
      ? `น้ำหวานสัปดาห์นี้ ${money(sweetWeek)} บาท ใช้เป็นตัวแทนรายจ่ายไม่จำเป็นใน dashboard`
      : "สัปดาห์นี้ยังไม่มีรายจ่ายน้ำหวาน เป็นจังหวะดีในการรักษาเพดานรายจ่ายไม่จำเป็น"
  });

  insights.push({
    icon: "side",
    title: "รายได้เสริม",
    text: bestChannel?.value > 0
      ? `${bestChannel.channel} ทำเงินนำอยู่ ${money(bestChannel.value)} บาท เดือนนี้ รวมรายได้เสริม ${money(sideMonth)} บาท`
      : "ยังไม่มีรายได้เสริมเดือนนี้ เลือก 1 ช่องทางมาทดลองเล็ก ๆ ก่อน"
  });

  insights.push({
    icon: "career",
    title: "ทักษะและภาษา",
    text: practicedSkills.length
      ? `สัปดาห์นี้ฝึก ${practicedSkills.slice(0, 3).join(", ")} และภาษารวม ${money(languageWeek)} นาที`
      : `ยังไม่มี skill ที่บันทึกในสัปดาห์นี้ ลองเริ่ม 1 skill พร้อมฝึกภาษา ${money(cfg.languageDailyTarget)} นาที`
  });

  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">Analysis from your data</p>
        <h2>โฟกัสสัปดาห์นี้</h2>
      </div>
      <span class="pill">${week.length ? `${week.length} วันมีข้อมูล` : "รอข้อมูล"}</span>
    </div>
    <div class="timeline">
      ${insights.slice(0, 5).map((item) => `
        <div class="timeline-item focus-item">
          <strong>${iconLabel(item.icon, item.title)}</strong>
          <span>${item.text}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDailyFeed(pageId) {
  const page = pages.find((item) => item.id === pageId);
  const suggestions = feedSuggestions(pageId);
  const news = matchedDailyNews(pageId, suggestions).slice(0, 4);
  return `
    <div class="card feed-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Personal feed</p>
          <h2>Feed ที่ควรอ่านวันนี้</h2>
          <p class="muted">ข่าวจากเว็บไทยที่อัปเดตทุกวัน 9:00 และคัดให้เข้ากับพฤติกรรมในเมนู ${page?.label || "นี้"}</p>
        </div>
      </div>
      <div class="feed-suggestions">
        ${suggestions.map((item) => `
          <article class="feed-suggestion">
            <strong>${iconLabel(item.icon, item.title)}</strong>
            <span>${item.reason}</span>
          </article>
        `).join("")}
      </div>
      <div class="feed-news">
        <div class="feed-subhead">
          <strong>ข่าว/บทความที่อัปเดตตอน 9:00</strong>
          <span>${dailyNewsItems.length ? `${dailyNewsItems.length} รายการใน feed กลาง` : "ยังไม่มีไฟล์ข่าวล่าสุด"}</span>
        </div>
        <div class="link-list">
          ${news.length ? news.map((item) => `
            <article class="saved-link news-link">
              ${newsThumbnail(item)}
              <div>
                <a href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.title)}</a>
                <span>${escapeHTML(item.source || "Daily feed")} • ${escapeHTML(item.reason || item.category || "matched with this page")}</span>
              </div>
            </article>
          `).join("") : `<p class="muted">ยังไม่มีข่าวที่ match กับเมนูนี้ ระบบจะเติมหลัง GitHub Actions รันตอน 9:00 น.</p>`}
        </div>
      </div>
    </div>
  `;
}

function newsThumbnail(item) {
  const tone = item.pageId || "dashboard";
  return `
    <div class="news-thumb generated-thumb thumb-${tone}">
      <span class="thumb-glow"></span>
      ${categoryIcon(item.icon || "language")}
      <strong>${escapeHTML(newsThumbnailLabel(item))}</strong>
    </div>
  `;
}

function newsThumbnailLabel(item) {
  const text = `${item.title || ""} ${item.category || ""}`.toLowerCase();
  const keywordLabels = [
    { keys: ["หนี้", "การเงิน", "ออม", "เงิน", "debt", "budget"], label: "Money" },
    { keys: ["สุขภาพ", "นอน", "ออกกำลัง", "skincare", "sleep"], label: "Care" },
    { keys: ["เป้าหมาย", "วางแผน", "habit", "goal"], label: "Plan" },
    { keys: ["ux", "ui", "design", "portfolio", "ai"], label: "Design" },
    { keys: ["รายได้", "creator", "tiktok", "youtube", "affiliate"], label: "Side" },
    { keys: ["ภาษา", "english", "arabic"], label: "Lang" }
  ];
  return keywordLabels.find((item) => item.keys.some((key) => text.includes(key)))?.label || {
    dashboard: "Bloom",
    goals: "Goal",
    checkin: "Mood",
    money: "Money",
    side: "Side",
    health: "Care",
    skills: "Skill"
  }[item.pageId] || "Read";
}

function matchedDailyNews(pageId, suggestions = feedSuggestions(pageId)) {
  const queryIds = suggestions.flatMap((item) => item.queryIds || []);
  const topics = feedTopicKeywords(pageId, suggestions);
  const pageNews = dailyNewsItems.filter((item) => item.pageId === pageId);
  const suggestionNews = dailyNewsItems.filter((item) => queryIds.includes(item.queryId));
  const behaviorNews = dailyNewsItems.filter((item) => {
    const text = `${item.title || ""} ${item.category || ""} ${item.queryId || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
    return topics.some((topic) => text.includes(topic));
  });
  return [...suggestionNews, ...behaviorNews, ...pageNews].filter((item, index, array) => (
    item.url && array.findIndex((candidate) => candidate.url === item.url) === index
  ));
}

function feedTopicKeywords(pageId, suggestions = []) {
  const week = entriesInRange("week");
  const today = getEntry();
  const topics = suggestions.flatMap((item) => item.keywords || []);
  topics.push(...({
    dashboard: ["habit", "productivity", "personal finance", "wellness"],
    goals: ["goal", "planning", "habit", "weekly review"],
    checkin: ["journal", "mood", "reflection", "mindfulness"],
    money: ["debt", "budget", "saving", "spending"],
    side: ["creator", "affiliate", "youtube", "tiktok", "resale"],
    health: ["sleep", "hydration", "fitness", "skincare"],
    skills: ["ux", "ui", "design system", "ai tools", "portfolio", "english"]
  }[pageId] || []));
  if (sum(week, "sweetDrink") > 0) topics.push("spending", "sugar", "budget");
  if (Number(today.sleep || 0) < settings().sleepTarget) topics.push("sleep");
  if (sum(week, "exercise") < settings().exerciseWeeklyTarget) topics.push("fitness");
  if (week.reduce((total, [, entry]) => total + languageTotal(entry), 0) > 0) topics.push("language", "english", "arabic");
  return [...new Set(topics.map((topic) => topic.toLowerCase()))];
}

function feedSuggestions(pageId) {
  const cfg = settings();
  const week = entriesInRange("week");
  const month = entriesInRange("month");
  const today = getEntry();
  const sweetWeek = sum(week, "sweetDrink");
  const exerciseWeek = sum(week, "exercise");
  const sideMonth = sum(month, "sideIncome");
  const languageWeek = week.reduce((total, [, entry]) => total + languageTotal(entry), 0);
  const skillCount = week.filter(([, entry]) => (entry.skills || []).length).length;
  const suggestions = {
    dashboard: [
      { icon: "health", title: "ระบบพลังงานส่วนตัว", queryIds: ["energy-habit"], keywords: ["นิสัย", "สุขภาพ", "น้ำ", "habit", "hydration"], reason: Number(today.water || 0) < cfg.waterDailyTarget ? "น้ำวันนี้ยังต่ำกว่าเป้า ลองอ่านเรื่อง habit loop หรือ hydration routine" : "สุขภาพวันนี้โอเค ลองอ่านเรื่อง weekly review เพื่อรักษาจังหวะ" },
      { icon: "money", title: "การเงินที่ลด friction", queryIds: sweetWeek > 0 ? ["impulse-spending"] : ["money-system", "debt-payoff"], keywords: ["การเงิน", "รายจ่าย", "หนี้", "budget", "spending"], reason: sweetWeek > 0 ? `สัปดาห์นี้น้ำหวาน ${money(sweetWeek)} บาท เหมาะกับบทความลด impulse spending` : "รายจ่ายไม่จำเป็นยังนิ่ง เหมาะกับบทความ money system หรือ debt payoff" }
    ],
    goals: [
      { icon: "debt", title: "Goal review", queryIds: ["weekly-planning"], keywords: ["เป้าหมาย", "วางแผน", "planning", "goal"], reason: "หา reference เรื่อง weekly planning, OKR ส่วนตัว หรือ habit tracking เพื่อปรับเป้ารายสัปดาห์" },
      { icon: "calendar", title: "Trend ที่ควรทดลอง", queryIds: exerciseWeek < cfg.exerciseWeeklyTarget ? ["short-workout"] : ["sleep-hygiene"], keywords: ["ออกกำลัง", "routine", "recovery", "sleep"], reason: exerciseWeek < cfg.exerciseWeeklyTarget ? `ออกกำลังยังขาด ${money(Math.max(0, cfg.exerciseWeeklyTarget - exerciseWeek))} นาที ลองหา routine สั้น 10-15 นาที` : "เป้าออกกำลังเดินดี ลองหา trend เรื่อง recovery หรือ sleep quality" }
    ],
    checkin: [
      { icon: "mood", title: "Mood journaling", queryIds: ["mood-journaling"], keywords: ["อารมณ์", "journaling", "reflection", "สุขภาพใจ"], reason: "เหมาะกับบทความ emotional check-in, reflection prompts หรือ tiny wins" },
      { icon: "win", title: "Small wins", queryIds: ["small-wins"], keywords: ["แรงจูงใจ", "motivation", "พัฒนาตัวเอง"], reason: today.win ? "วันนี้มีชัยชนะแล้ว ลองเก็บบทความที่ช่วยต่อยอด momentum" : "ยังไม่มีชัยชนะวันนี้ ลองหา prompt สั้น ๆ สำหรับ reflection" }
    ],
    money: [
      { icon: "sweet", title: "ลดรายจ่ายไม่จำเป็น", queryIds: ["impulse-spending"], keywords: ["รายจ่าย", "น้ำหวาน", "งบประมาณ", "spending"], reason: sweetWeek > 0 ? `น้ำหวานคือรายจ่ายไม่จำเป็นหลักของสัปดาห์นี้ (${money(sweetWeek)} บาท)` : "ยังไม่มีน้ำหวานสัปดาห์นี้ ลองเก็บไอเดีย no-spend หรือ budget template" },
      { icon: "debt", title: "Debt payoff", queryIds: ["debt-payoff"], keywords: ["หนี้", "ปิดหนี้", "การเงิน", "debt"], reason: "เหมาะกับลิงก์เรื่อง snowball/avalanche หรือวิธีทำ debt tracker ที่อ่านง่าย" }
    ],
    side: [
      { icon: "side", title: "ทดลองช่องทางที่ทำเงินจริง", queryIds: ["side-experiment"], keywords: ["รายได้เสริม", "ขายของ", "ทดลองธุรกิจ"], reason: sideMonth > 0 ? `เดือนนี้รายได้เสริม ${money(sideMonth)} บาท ลองหา case study การ scale ช่องทางที่เริ่มติด` : "ยังไม่มีรายได้เสริมเดือนนี้ ลอง feed ไอเดียสินค้าหรือ affiliate content ที่ทำได้เร็ว" },
      { icon: "income", title: "Content monetization", queryIds: ["content-monetization"], keywords: ["creator", "affiliate", "tiktok", "youtube"], reason: "เหมาะกับลิงก์ YouTube/TikTok affiliate hooks และ pricing ของของมือสอง" }
    ],
    health: [
      { icon: "sleep", title: "Sleep & recovery", queryIds: ["sleep-hygiene"], keywords: ["นอน", "sleep", "recovery", "สุขภาพ"], reason: Number(today.sleep || 0) < cfg.sleepTarget ? "นอนวันนี้ต่ำกว่าเป้า ลองอ่านเรื่อง sleep hygiene" : "การนอนโอเค ลองอ่านเรื่อง skincare consistency หรือ strength training เบา ๆ" },
      { icon: "confidence", title: "Confidence habit", queryIds: ["confidence-care"], keywords: ["ดูแลตัวเอง", "skincare", "ความมั่นใจ"], reason: "หา reference เรื่อง body confidence, skincare streak หรือ self-care routine ที่ทำซ้ำง่าย" }
    ],
    skills: [
      { icon: "career", title: "UX/UI growth", queryIds: ["ux-case-study"], keywords: ["ux", "ui", "design", "portfolio", "case study"], reason: skillCount ? `สัปดาห์นี้มีวันฝึก skill ${skillCount} วัน ลองหา case study teardown หรือ design system pattern` : "ยังไม่มี skill log สัปดาห์นี้ ลองเริ่มจาก UX Research หรือ AI tools แบบ micro-learning" },
      { icon: "language", title: "ภาษาเป้าหมาย", queryIds: ["language-practice"], keywords: ["ภาษา", "english", "arabic"], reason: languageWeek > 0 ? `ฝึกภาษารวม ${money(languageWeek)} นาที เหมาะกับลิงก์ vocabulary หรือ speaking practice` : `ลอง feed บทเรียนภาษาที่ตั้งไว้ ${money(cfg.languageDailyTarget)} นาทีวันนี้` }
    ]
  };
  return suggestions[pageId] || suggestions.dashboard;
}

function renderCheckin() {
  return `
    <div class="grid three">
      ${statCard("🔥 เช็คอินต่อเนื่อง", `${currentStreak()} วัน`, "นับจากวันที่มีบันทึก")}
      ${statCard("🔥 skincare streak", `${currentStreak((entry) => Number(entry?.confidence || 0) >= 6)} วัน`, "ใช้ความมั่นใจเป็น proxy")}
      ${statCard(iconLabel("win", "ชัยชนะวันนี้"), getEntry().win || "ยังรอชัยชนะเล็กๆ", "คลิกบันทึกเพื่อเติมเรื่องดีๆ")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">${dateLabel(selectedDate)}</p>
          <h2>ฟอร์มเช็คอิน</h2>
        </div>
        <button class="primary-button" type="button" data-open-entry>เปิดแบบบันทึก</button>
      </div>
      ${renderDayDetail(selectedDate)}
    </div>
  `;
}

function renderMoney() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่มีข้อมูลหนี้และการเงิน", "ระบบจะไม่โชว์หนี้ 108,000 หรือยอดเงินใดๆ ให้ guest จนกว่าจะจำลองข้อมูลหรือเริ่มบันทึกเอง");
  }
  const all = Object.entries(state.entries);
  const entries = entriesInRange("month");
  const cfg = settings();
  const debtPaid = sum(all, "debtPaid");
  const debtLeft = Math.max(0, cfg.debtTotal - debtPaid);
  const debtAngle = `${clamp((debtPaid / Math.max(cfg.debtTotal, 1)) * 100, 0, 100)}%`;
  return `
    <div class="money-split">
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Debt payoff</p>
            <h2>ติดตามหนี้ ${money(cfg.debtTotal)} บาท</h2>
          </div>
          <div class="button-row">
            <button class="tiny-button" type="button" data-open-setting="debt">แก้ค่าหนี้</button>
            <button class="primary-button" type="button" data-open-entry>บันทึกการเงิน</button>
          </div>
        </div>
        <div class="debt-ring" style="--debt-angle: ${debtAngle}">
          <div>
            <span class="muted">คงเหลือ</span>
            <strong>${money(debtLeft)}</strong>
            <span class="muted">จ่ายแล้ว ${money(debtPaid)}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>เดือนนี้</h2>
        <div class="summary-band" style="grid-template-columns:1fr;">
          ${miniSummary("รายรับ", `${money(sum(entries, "income"))} บาท`)}
          ${miniSummary("รายจ่ายจำเป็น", `${money(sum(entries, "essential"))} บาท`)}
          ${miniSummary("รายจ่ายไม่จำเป็น", `${money(sum(entries, "sweetDrink"))} บาท`)}
          ${miniSummary("ค่าน้ำหวาน", `${money(sum(entries, "sweetDrink"))} บาท`)}
        </div>
      </div>
    </div>
    <div class="card">
      <h2>บันทึกล่าสุด</h2>
      <div class="timeline">
        ${all.slice(-8).reverse().map(([iso, entry]) => `
          <div class="timeline-item">
            <strong>${dateLabel(iso, "medium")}</strong> รายรับ ${money(entry.income)} / รายจ่าย ${money(expenseTotal(entry))} / จ่ายหนี้ ${money(entry.debtPaid)}
            ${getExpenseItems(entry).length ? `<div class="timeline-expenses">${getExpenseItems(entry).map((item) => `<span>${item.category} ${money(item.amount)}</span>`).join("")}</div>` : ""}
          </div>
        `).join("") || `<p class="muted">ยังไม่มีข้อมูลการเงิน</p>`}
      </div>
    </div>
  `;
}

function renderSideIncome() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่มีข้อมูลรายได้เสริม", "ช่องทางรายได้เสริมจะว่างสำหรับ guest จนกว่าจะจำลองข้อมูลหรือเพิ่มช่องทางเอง");
  }
  const entries = entriesInRange("month");
  const cfg = settings();
  const channels = sideChannelsList();
  return `
    <div class="grid three">
      ${channels.length ? channels.map((channel) => {
        const channelEntries = entries.filter(([, entry]) => entry.sideChannel === channel);
        const income = sum(channelEntries, "sideIncome");
        return `
          <div class="channel-card">
            <div class="channel-row">
              <h3>${channel}</h3>
              <span class="pill">${money(income)} บาท</span>
            </div>
            ${renderProgress({ name: "เป้าหมายเดือนนี้", type: "ช่องทาง", progress: income, target: cfg.sideChannelMonthlyTarget })}
          </div>
        `;
      }).join("") : renderGuestEmptyState("ยังไม่มีช่องทางรายได้เสริม", "กดแก้ไขเป้ารายได้เพื่อเพิ่มช่องทาง เช่น YouTube, ร้านออนไลน์, Affiliate")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Side income experiment</p>
          <h2>บันทึกการทดลอง</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="side">แก้ไขช่องทาง/เป้ารายได้</button>
          <button class="primary-button" type="button" data-open-entry>เพิ่มรายได้เสริม</button>
        </div>
      </div>
      <div class="timeline">
        ${entries.filter(([, entry]) => Number(entry.sideIncome || 0) > 0).reverse().map(([iso, entry]) => `
          <div class="timeline-item"><strong>${dateLabel(iso, "medium")}</strong> ${entry.sideChannel}: ${money(entry.sideIncome)} บาท</div>
        `).join("") || `<p class="muted">ยังไม่มีรายได้เสริมเดือนนี้</p>`}
      </div>
    </div>
  `;
}

function renderHealth() {
  const entry = getEntry();
  const week = entriesInRange("week");
  const cfg = settings();
  return `
    <div class="grid four">
      ${statCard(iconLabel("health", "น้ำวันนี้"), `${Number(entry.water || 0)}/${money(cfg.waterDailyTarget)}`, "แก้ว")}
      ${statCard(iconLabel("sleep", "นอน"), `${Number(entry.sleep || 0)} ชม.`, `เป้าหมาย ${money(cfg.sleepTarget)} ชม.`)}
      ${statCard(iconLabel("exercise", "ออกกำลังกายสัปดาห์นี้"), `${sum(week, "exercise")} นาที`, `เป้าหมาย ${money(cfg.exerciseWeeklyTarget)} นาที`)}
      ${statCard(iconLabel("confidence", "ความมั่นใจ"), `${Number(entry.confidence || 0)}/${money(cfg.confidenceTarget)}`, "เช็คอินภาพรวมใจ")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Health & Beauty rhythm</p>
          <h2>🔥 streak การดูแลตัวเอง</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="health">แก้ไขเป้าสุขภาพ</button>
          <button class="primary-button" type="button" data-open-entry>บันทึกสุขภาพ</button>
        </div>
      </div>
      <div class="progress-list">
        ${renderProgress({ name: "น้ำวันนี้", type: "รายวัน", progress: Number(entry.water || 0), target: cfg.waterDailyTarget })}
        ${renderProgress({ name: "ออกกำลังกายสัปดาห์นี้", type: "รายสัปดาห์", progress: sum(week, "exercise"), target: cfg.exerciseWeeklyTarget })}
        ${renderProgress({ name: "นอนเฉลี่ยสัปดาห์นี้", type: "รายสัปดาห์", progress: Math.round((sum(week, "sleep") / Math.max(week.length, 1)) * 10) / 10, target: cfg.sleepTarget })}
        ${renderProgress({ name: "ความมั่นใจวันนี้", type: "รายวัน", progress: Number(entry.confidence || 0), target: cfg.confidenceTarget })}
      </div>
    </div>
  `;
}

function renderSkills() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่มีทักษะและภาษาที่ตั้งไว้", "guest จะไม่เห็น skill default หรือภาษาเป้าหมายจนกว่าจะจำลองข้อมูลหรือเพิ่มรายการเอง");
  }
  const cfg = settings();
  const skills = skillsList();
  const week = entriesInRange("week");
  const languageTotals = languagesList().map((language) => ({ language, minutes: sumLanguage(week, language) }));
  const languageWeek = languageTotals.reduce((total, item) => total + item.minutes, 0);
  return `
    <div class="grid three">
      ${skills.map((skill) => statCard(skill, `${countSkillDays(skill)} วัน`, "จำนวนวันที่ฝึกทั้งหมด")).join("")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Career growth</p>
          <h2>แผนพัฒนาทักษะ UX/UI</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="skills">แก้ไขเป้าทักษะ</button>
          <button class="primary-button" type="button" data-open-entry>บันทึกทักษะวันนี้</button>
        </div>
      </div>
      <div class="progress-list">
        ${skills.map((skill) => renderProgress({ name: skill, type: `เป้าหมาย ${money(cfg.skillTargetDays)} วัน`, progress: countSkillDays(skill), target: cfg.skillTargetDays })).join("")}
      </div>
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Language learning</p>
          <h2>${iconLabel("language", "ฝึกภาษา")}</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="language">แก้ไขเป้าภาษา</button>
          <button class="primary-button" type="button" data-open-entry data-modal="language">บันทึกภาษา</button>
        </div>
      </div>
      <div class="progress-list">
        ${languageTotals.map((item) => renderProgress({ name: item.language, type: "สัปดาห์นี้", progress: item.minutes, target: cfg.languageWeeklyTarget })).join("")}
        ${renderProgress({ name: "รวมการฝึกภาษา", type: `เป้ารวม ${money(cfg.languageWeeklyTarget)} นาที`, progress: languageWeek, target: cfg.languageWeeklyTarget })}
      </div>
    </div>
  `;
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const iso = toISO(day);
    const isCurrentMonth = day.getMonth() === month;
    const intensity = dayIntensity(state.entries[iso]);
    return `
      <button class="day intensity-${intensity} ${!isCurrentMonth ? "muted-day" : ""} ${state.entries[iso] ? "has-data" : ""} ${iso === selectedDate ? "selected" : ""}" type="button" data-date="${iso}">
        ${day.getDate()}
      </button>
    `;
  }).join("");

  return `
    <div class="calendar">
      <div class="calendar-head">
        <button class="icon-button" type="button" data-month="-1" aria-label="เดือนก่อน">‹</button>
        <h2>${new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric", calendar: "gregory" }).format(calendarCursor)}</h2>
        <button class="icon-button" type="button" data-month="1" aria-label="เดือนถัดไป">›</button>
      </div>
      <div class="weekdays">${["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="days">${days}</div>
    </div>
  `;
}

function dayIntensity(entry) {
  if (!entry) return 0;
  const score = [
    Number(entry.water || 0) >= 8,
    Number(entry.exercise || 0) > 0,
    Number(entry.debtPaid || 0) > 0,
    Number(entry.sideIncome || 0) > 0,
    (entry.skills || []).length > 0,
    Boolean(entry.win)
  ].filter(Boolean).length;
  return clamp(Math.ceil(score / 2), 1, 3);
}

function renderDayDetail(iso) {
  const entry = getEntry(iso);
  const expenses = getExpenseItems(entry);
  if (!Object.keys(entry).length) return `<p class="muted">ยังไม่มีข้อมูลของวันที่นี้ กดบันทึกเพื่อเพิ่มย้อนหลังได้</p>`;
  return `
    <div class="day-detail">
      <span class="pill">${iconLabel("mood", `อารมณ์ ${entry.mood || "-"}`)}</span>
      <span class="pill">${iconLabel("health", `น้ำ ${Number(entry.water || 0)} แก้ว`)}</span>
      <span class="pill">${iconLabel("exercise", `ออกกำลัง ${Number(entry.exercise || 0)} นาที`)}</span>
      <span class="pill">${iconLabel("income", `รายรับ ${money(entry.income)} บาท`)}</span>
      <span class="pill">${iconLabel("expense", `รายจ่าย ${money(expenseTotal(entry))} บาท`)}</span>
      <span class="pill">${iconLabel("side", `รายได้เสริม ${money(entry.sideIncome)} บาท`)}</span>
      <span class="pill">${iconLabel("debt", `จ่ายหนี้ ${money(entry.debtPaid)} บาท`)}</span>
      <span class="pill">${iconLabel("language", `ภาษา ${languageTotal(entry)} นาที`)}</span>
    </div>
    ${expenses.length ? `
      <div class="expense-list">
        ${expenses.map((item) => `
          <span>${item.category}<strong>${money(item.amount)} บาท</strong></span>
        `).join("")}
      </div>
    ` : ""}
    <p style="margin:14px 0 0;"><strong>${iconLabel("win", "ชัยชนะเล็กๆ:")}</strong> ${entry.win || "ยังไม่ได้บันทึก"}</p>
    <p class="muted" style="margin:8px 0 0;">${iconLabel("career", `ทักษะ: ${(entry.skills || []).join(", ") || "-"}`)}</p>
    <p class="muted" style="margin:8px 0 0;">${iconLabel("language", "ภาษา:")} ${languagesList().map((language) => iconLabel(language === "อาหรับ" ? "arabic" : language === "อังกฤษ" ? "thai" : "language", `${language} ${money(getLanguageMinutes(entry, language))} นาที`)).join(" / ") || "-"} ${entry.languageFocus ? `(${entry.languageFocus})` : ""}</p>
  `;
}

function statCard(label, value, note) {
  return `
    <article class="stat-card">
      <span class="stat-label">${label}</span>
      <strong class="stat-value">${value}</strong>
      <span class="muted">${note}</span>
    </article>
  `;
}

function miniSummary(label, value) {
  return `<div class="mini-summary"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong></div>`;
}

function languageDashboard(entries) {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่มีภาษาเป้าหมาย", "ภาษาที่อยากเรียนจะยังว่างสำหรับ guest จนกว่าจะจำลองข้อมูลหรือเพิ่มภาษาเอง");
  }
  const cfg = settings();
  const languageTotals = languagesList().map((language) => ({ language, minutes: sumLanguage(entries, language) }));
  const total = languageTotals.reduce((amount, item) => amount + item.minutes, 0);
  const week = entriesInRange("week");
  const weekTotal = week.reduce((amount, [, entry]) => amount + languageTotal(entry), 0);
  const streak = currentStreak((entry) => languageTotal(entry) > 0);
  const [primaryLanguage, secondaryLanguage] = languageTotals;

  return `
    <div class="card language-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Language practice</p>
          <h2>ฝึกภาษา</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="language">แก้ไขเป้าภาษา</button>
          <button class="primary-button" type="button" data-open-entry data-modal="language">บันทึกภาษา</button>
        </div>
      </div>
      <div class="language-layout">
        <div class="language-orbit" style="--thai:${progressValue(primaryLanguage?.minutes || 0, total || cfg.languageWeeklyTarget)}%;--arabic:${progressValue(secondaryLanguage?.minutes || 0, total || cfg.languageWeeklyTarget)}%">
          <div class="language-core">
            <strong>${money(total)}</strong>
            <span>นาที</span>
          </div>
          <span class="language-badge thai">${iconLabel(primaryLanguage?.language === "อังกฤษ" ? "thai" : "language", primaryLanguage?.language || "ภาษา")}</span>
          <span class="language-badge arabic">${iconLabel(secondaryLanguage?.language === "อาหรับ" ? "arabic" : "language", secondaryLanguage?.language || "เพิ่มภาษา")}</span>
        </div>
        <div class="language-progress">
          ${languageTotals.map((item, index) => languageProgress(iconLabel(item.language === "อังกฤษ" ? "thai" : item.language === "อาหรับ" ? "arabic" : "language", item.language), item.minutes, cfg.languageWeeklyTarget, index % 2 ? "#c6b2f2" : "#a9dcc5")).join("")}
          ${languageProgress(iconLabel("language", "รวมสัปดาห์นี้"), weekTotal, cfg.languageWeeklyTarget, "#f5a7c6")}
        </div>
        <div class="language-stats">
          ${miniSummary("🔥 streak ภาษา", `${streak} วัน`)}
          ${miniSummary(iconLabel("debt", "เป้าต่อวัน"), `${money(cfg.languageDailyTarget)} นาที`)}
          ${miniSummary(iconLabel("calendar", "เป้าต่อสัปดาห์"), `${money(cfg.languageWeeklyTarget)} นาที`)}
        </div>
      </div>
    </div>
  `;
}

function languageProgress(label, progress, target, color) {
  const percent = progressValue(progress, target);
  return `
    <div class="language-progress-item" style="--language-color:${color};--language-progress:${percent}%">
      <div class="progress-meta">
        <span>${label}</span>
        <span>${money(progress)} นาที</span>
      </div>
      <div class="bar"><span></span></div>
    </div>
  `;
}

function lifeRadarChart(items) {
  const points = items.map((item, index) => radarPoint(index, clamp(item.score, 0, 100))).join(" ");
  const averageScore = average(items.map((item) => item.score));
  return `
    <div class="life-radar">
      <div class="radar-panel" aria-label="กราฟแมงมุมพลังชีวิตเฉลี่ย ${averageScore} เปอร์เซ็นต์">
        <svg viewBox="0 0 320 320" role="img" aria-hidden="true">
          <polygon class="radar-grid" points="160,36 284,160 160,284 36,160" />
          <polygon class="radar-grid inner" points="160,72 248,160 160,248 72,160" />
          <polygon class="radar-grid inner faint" points="160,108 212,160 160,212 108,160" />
          <line class="radar-axis" x1="160" y1="160" x2="160" y2="36" />
          <line class="radar-axis" x1="160" y1="160" x2="284" y2="160" />
          <line class="radar-axis" x1="160" y1="160" x2="160" y2="284" />
          <line class="radar-axis" x1="160" y1="160" x2="36" y2="160" />
          <polygon class="radar-area" points="${points}" />
          <polyline class="radar-line" points="${points} ${points.split(" ")[0]}" />
          ${items.map((item, index) => {
            const point = radarPoint(index, clamp(item.score, 0, 100));
            const [x, y] = point.split(",");
            return `<circle class="radar-point" cx="${x}" cy="${y}" r="7" style="--point-color:${item.color}" />`;
          }).join("")}
          <text class="radar-label top" x="160" y="22">${items[0].label}</text>
          <text class="radar-label right" x="296" y="166">${items[2].label}</text>
          <text class="radar-label bottom" x="160" y="310">${items[3].label}</text>
          <text class="radar-label left" x="24" y="166">${items[1].label}</text>
        </svg>
        <div class="radar-score">
          <strong>${averageScore}%</strong>
          <span>สมดุลรวม</span>
        </div>
      </div>
      <div class="radar-metrics">
        ${items.map((item) => `
          <div class="radar-metric" style="--metric:${clamp(item.score, 0, 100)}%;--metric-color:${item.color}">
            <div class="radar-metric-head">
              <span>${iconLabel(item.icon, item.label)}</span>
              <strong>${Math.round(item.score)}%</strong>
            </div>
            <div class="radar-track"><span></span></div>
            <p class="muted">${item.note}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function radarPoint(index, score) {
  const center = 160;
  const radius = 124 * (score / 100);
  const angles = [-90, 180, 0, 90];
  const angle = (angles[index] * Math.PI) / 180;
  const x = Math.round(center + Math.cos(angle) * radius);
  const y = Math.round(center + Math.sin(angle) * radius);
  return `${x},${y}`;
}

function moneyMixChart(entries) {
  const items = [
    { key: "income", icon: "income", label: "รายรับหลัก", value: sum(entries, "income"), color: "#a9dcc5" },
    { key: "sideIncome", icon: "side", label: "รายได้เสริม", value: sum(entries, "sideIncome"), color: "#c6b2f2" },
    { key: "essential", icon: "expense", label: "รายจ่ายจำเป็น", value: sum(entries, "essential"), color: "#ffc39d" },
    { key: "nonEssential", icon: "money", label: "รายจ่ายไม่จำเป็น", value: sum(entries, "sweetDrink"), color: "#f5a7c6" },
    { key: "sweetDrink", icon: "sweet", label: "ค่าน้ำหวาน", value: sum(entries, "sweetDrink"), color: "#e874a8", duplicateOf: "nonEssential" }
  ];
  const visualItems = items.filter((item) => !item.duplicateOf);
  const total = visualItems.reduce((amount, item) => amount + item.value, 0);
  let cursor = 0;
  const stops = visualItems.map((item) => {
    const start = cursor;
    const size = total ? (item.value / total) * 100 : 0;
    cursor += size;
    return `${item.color} ${start}% ${cursor}%`;
  }).join(", ");
  const incomeTotal = items[0].value + items[1].value;
  const expenseTotal = items[2].value + items[3].value;
  const net = incomeTotal - expenseTotal;

  return `
    <div class="card money-mix-card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Money mix</p>
          <h2>สัดส่วนเงินในช่วงที่เลือก</h2>
        </div>
        <span class="pill">${filter === "week" ? "สัปดาห์" : filter === "month" ? "เดือน" : "ปี"}</span>
      </div>
      <div class="money-mix-layout">
        <div class="money-donut" style="--money-mix:${total ? stops : "#efe1e9 0 100%"}">
          <div>
            <span class="muted">คงเหลือสุทธิ</span>
            <strong>${money(net)}</strong>
            <span class="muted">บาท</span>
          </div>
        </div>
        <div class="money-legend">
          ${items.map((item) => `
            <div class="money-legend-item">
              <span class="legend-dot" style="background:${item.color}"></span>
              <span>${iconLabel(item.icon, item.label)}</span>
              <strong>${money(item.value)} บาท</strong>
            </div>
          `).join("")}
        </div>
        <div class="money-insight">
          ${miniSummary(iconLabel("income", "เงินเข้า"), `${money(incomeTotal)} บาท`)}
          ${miniSummary(iconLabel("expense", "เงินออก"), `${money(expenseTotal)} บาท`)}
          ${miniSummary(iconLabel(net >= 0 ? "win" : "debt", net >= 0 ? "เหลือเก็บ" : "ติดลบ"), `${money(Math.abs(net))} บาท`)}
        </div>
      </div>
    </div>
  `;
}

function trendChart(label, key, entries, target, unit, inverse = false) {
  const maxValue = Math.max(target, ...entries.map(([, entry]) => Number(entry[key] || 0)));
  const bars = entries.map(([iso, entry, labelText, tooltip]) => {
    const raw = Number(entry[key] || 0);
    const height = clamp((raw / Math.max(maxValue, 1)) * 100, raw > 0 ? 8 : 3, 100);
    return `
      <div class="trend-bar-item" title="${tooltip || iso}: ${money(raw)} ${unit}">
        <span class="trend-bar ${inverse ? "inverse" : ""}" style="height:${height}%"></span>
        <small>${labelText || iso}</small>
      </div>
    `;
  }).join("");
  const total = entries.reduce((amount, [, entry]) => amount + Number(entry[key] || 0), 0);
  return `
    <div class="trend-card">
      <div class="trend-head">
        <div>
          <span class="stat-label">${label}</span>
          <strong>${money(total)} ${unit}</strong>
        </div>
        <span class="pill">${inverse ? "ยิ่งต่ำยิ่งดี" : "เป้าหมาย"}</span>
      </div>
      <div class="trend-bars" style="--trend-count:${entries.length}">${bars}</div>
    </div>
  `;
}

function renderProgress(goal) {
  const percent = clamp((Number(goal.progress || 0) / Number(goal.target || 1)) * 100, 0, 100);
  return `
    <div class="progress-item">
      <div class="progress-meta">
        <span>${goal.name}</span>
        <span>${Math.round(percent)}%</span>
      </div>
      <div class="bar" aria-label="${goal.name} ${Math.round(percent)} เปอร์เซ็นต์"><span style="width:${percent}%"></span></div>
      <p class="muted" style="margin:8px 0 0;">${goal.type}: ${money(goal.progress)} / ${money(goal.target)}</p>
    </div>
  `;
}

function bindPageEvents() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      render();
    });
  });
  document.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDate = button.dataset.date;
      render();
    });
  });
  document.querySelectorAll("[data-month]").forEach((button) => {
    button.addEventListener("click", () => {
      calendarCursor.setMonth(calendarCursor.getMonth() + Number(button.dataset.month));
      render();
    });
  });
  document.querySelectorAll("[data-open-entry]").forEach((button) => {
    button.addEventListener("click", () => openEntryModal(button.dataset.modal || activePage));
  });
  document.querySelectorAll("[data-open-setting]").forEach((button) => {
    button.addEventListener("click", () => openSettingModal(button.dataset.openSetting));
  });
  document.querySelectorAll("[data-mock-data]").forEach((button) => {
    button.addEventListener("click", createMockData);
  });
}

function openEntryModal(category = activePage) {
  const modal = $("#entryModal");
  const form = $("#entryForm");
  const entry = getEntry();
  modalCategory = modalConfigs[category] ? category : "checkin";
  const config = modalConfigs[modalCategory];
  $("#modalDateLabel").textContent = dateLabel(selectedDate);
  $("#modalTitle").textContent = config.title;
  $("#modalDescription").textContent = config.description;
  $("#modalFields").innerHTML = renderModalFields(config.fields);
  $("#modalFields").querySelectorAll("[data-open-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      modal.close();
      openSettingModal(button.dataset.openSetting);
    });
  });
  bindExpenseRows();
  form.reset();
  Object.entries(entry).forEach(([key, value]) => {
    if (["skills", "expenseItems", "languageMinutes"].includes(key)) return;
    const input = form.elements[key];
    if (input) input.value = value;
  });
  [...form.querySelectorAll('input[name="skills"]')].forEach((input) => {
    input.checked = (entry.skills || []).includes(input.value);
  });
  modal.showModal();
}

function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const config = modalConfigs[modalCategory] || modalConfigs.checkin;
  const existing = getEntry();
  const nextEntry = { ...existing };

  config.fields.forEach((field) => {
    if (field === "skills") {
      nextEntry.skills = data.getAll("skills");
      return;
    }
    if (field === "expenseRows") {
      const categories = data.getAll("expenseCategory");
      const amounts = data.getAll("expenseAmount");
      const items = categories.map((category, index) => ({
        category: expenseCategories.includes(category) ? category : expenseCategories[0],
        amount: Number(amounts[index] || 0)
      })).filter((item) => item.amount > 0);
      const totals = expenseTotals(items);
      nextEntry.expenseItems = items;
      nextEntry.essential = totals.essential;
      nextEntry.nonEssential = totals.nonEssential;
      nextEntry.sweetDrink = totals.sweetDrink;
      return;
    }
    if (field === "languageMinutes") {
      nextEntry.languageMinutes = {};
      languagesList().forEach((language) => {
        const value = Number(data.get(`languageMinutes:${language}`) || 0);
        const legacyKey = languageFieldKey(language);
        if (legacyKey) nextEntry[legacyKey] = value;
        else nextEntry.languageMinutes[language] = value;
      });
      return;
    }
    if (numericFields.includes(field)) {
      nextEntry[field] = Number(data.get(field) || 0);
      return;
    }
    if (field === "win") {
      nextEntry.win = (data.get("win") || "").trim();
      return;
    }
    nextEntry[field] = data.get(field);
  });

  state.entries[selectedDate] = nextEntry;
  saveState();
  syncEntry(selectedDate);
  $("#entryModal").close();
  render();
}

function renderModalFields(fields) {
  const fieldHTML = fields
    .filter((field) => !["win", "skills", "expenseRows", "languageMinutes"].includes(field))
    .map(renderField)
    .join("");
  const expenseHTML = fields.includes("expenseRows") ? renderField("expenseRows") : "";
  const winHTML = fields.includes("win") ? renderField("win") : "";
  const skillsHTML = fields.includes("skills") ? renderField("skills") : "";
  const languageHTML = fields.includes("languageMinutes") ? renderField("languageMinutes") : "";
  return `
    ${fieldHTML ? `<div class="form-grid">${fieldHTML}</div>` : ""}
    ${expenseHTML}
    ${languageHTML}
    ${winHTML}
    ${skillsHTML}
  `;
}

function renderField(field) {
  const fields = {
    mood: `
      <label>
        อารมณ์
        <select name="mood">
          <option value="สดใส">สดใส</option>
          <option value="นิ่งๆ">นิ่งๆ</option>
          <option value="เหนื่อย">เหนื่อย</option>
          <option value="กังวล">กังวล</option>
          <option value="ภูมิใจ">ภูมิใจ</option>
        </select>
      </label>
    `,
    water: textInput("water", "น้ำที่ดื่ม (แก้ว)", "numeric", "[0-9]*"),
    exercise: textInput("exercise", "ออกกำลังกาย (นาที)", "numeric", "[0-9]*"),
    sleep: textInput("sleep", "นอน (ชั่วโมง)", "decimal"),
    income: textInput("income", "รายรับ", "decimal"),
    expenseRows: renderExpenseRows(),
    debtPaid: textInput("debtPaid", "จ่ายหนี้วันนี้", "decimal"),
    sideIncome: textInput("sideIncome", "รายได้เสริม", "decimal"),
    languageMinutes: renderLanguageMinuteFields(),
    languageFocus: `
      <label>
        โฟกัสการฝึก
        <select name="languageFocus">
          <option value="คำศัพท์">คำศัพท์</option>
          <option value="อ่าน">อ่าน</option>
          <option value="เขียน">เขียน</option>
          <option value="ฟัง">ฟัง</option>
          <option value="พูด">พูด</option>
          <option value="ทบทวน">ทบทวน</option>
        </select>
      </label>
    `,
    sideChannel: `
      <label>
        ช่องทางรายได้เสริม
        <select name="sideChannel">
          ${sideChannelsList().map((channel) => `<option value="${escapeHTML(channel)}">${escapeHTML(channel)}</option>`).join("")}
        </select>
        ${sideChannelsList().length ? "" : `<span class="field-hint">ยังไม่มีช่องทาง ไปที่แก้ไขช่องทางรายได้เสริมเพื่อเพิ่มเอง</span>`}
      </label>
    `,
    confidence: textInput("confidence", "ความมั่นใจ (1-10)", "numeric", "[0-9]*"),
    win: `
      <label class="wide-label">
        ชัยชนะเล็กๆ / note ของหมวดนี้
        <textarea name="win" rows="3" placeholder="เช่น ส่ง portfolio 1 เคส / ไม่ซื้อน้ำหวาน / เดิน 20 นาที"></textarea>
      </label>
    `,
    skills: `
      <div class="skill-checks">
        <span>ทักษะที่ฝึกวันนี้</span>
        ${skillsList().map((skill) => `<label><input type="checkbox" name="skills" value="${escapeHTML(skill)}" /> ${escapeHTML(skill)}</label>`).join("")}
      </div>
    `
  };
  return fields[field] || "";
}

function renderLanguageMinuteFields() {
  const languages = languagesList();
  const entry = getEntry();
  if (!languages.length) {
    return `
      <section class="skill-editor wide-label">
        <div class="skill-editor-head">
          <div>
            <span>ยังไม่ได้เพิ่มภาษาที่อยากเรียน</span>
            <small>ไปที่ แก้ไขเป้าภาษา เพื่อเพิ่มภาษา เช่น อังกฤษ อาหรับ ญี่ปุ่น หรือจีน</small>
          </div>
          <button class="tiny-button" type="button" data-open-setting="language">เพิ่มภาษา</button>
        </div>
      </section>
    `;
  }
  return `
    <section class="skill-editor wide-label">
      <div class="skill-editor-head">
        <div>
          <span>เวลาฝึกภาษา</span>
          <small>สร้างช่องตามภาษาที่ตั้งไว้เอง</small>
        </div>
        <button class="tiny-button" type="button" data-open-setting="language">แก้ไขภาษา</button>
      </div>
      <div class="form-grid">
        ${languages.map((language) => `
          <label>
            ${escapeHTML(language)} (นาที)
            <input name="languageMinutes:${escapeHTML(language)}" type="text" inputmode="numeric" pattern="[0-9]*" value="${getLanguageMinutes(entry, language) || ""}" />
          </label>
        `).join("")}
      </div>
    </section>
  `;
}

function renderExpenseRows(items = getExpenseItems(getEntry())) {
  const rows = items.length ? items : [{ category: "น้ำหวาน", amount: 0 }];
  return `
    <section class="expense-editor wide-label">
      <div class="expense-editor-head">
        <div>
          <span>รายจ่ายเป็นรายการ</span>
          <small>เลือกหมวดแล้วใส่จำนวนเงิน ระบบจะรวมให้ dashboard อัตโนมัติ</small>
        </div>
        <button class="tiny-button" type="button" data-add-expense-row>เพิ่มแถว</button>
      </div>
      <div class="expense-rows" data-expense-rows>
        ${rows.map((item) => renderExpenseRow(item)).join("")}
      </div>
    </section>
  `;
}

function renderExpenseRow(item = { category: "น้ำหวาน", amount: 0 }) {
  return `
    <div class="expense-row">
      <label>
        หมวดหมู่
        <select name="expenseCategory">
          ${expenseCategories.map((category) => `<option value="${category}" ${category === item.category ? "selected" : ""}>${category}</option>`).join("")}
        </select>
      </label>
      <label>
        จำนวนเงิน
        <input name="expenseAmount" type="text" inputmode="decimal" value="${Number(item.amount || 0) || ""}" placeholder="0" />
      </label>
      <button class="icon-button expense-remove" type="button" data-remove-expense-row aria-label="ลบแถว">×</button>
    </div>
  `;
}

function renderSkillEditor() {
  const skills = skillsList();
  return `
    <section class="skill-editor wide-label">
      <div class="skill-editor-head">
        <div>
          <span>รายการ skill ที่ติดตาม</span>
          <small>เพิ่ม skill ใหม่หรือลบ skill ที่ไม่อยากโชว์บนหน้าอาชีพได้ ข้อมูลเก่าจะยังอยู่ในบันทึกเดิม</small>
        </div>
        <button class="tiny-button" type="button" data-add-skill-row>เพิ่ม skill</button>
      </div>
      <div class="skill-rows" data-skill-rows>
        ${skills.map((skill) => renderSkillRow(skill)).join("")}
      </div>
    </section>
  `;
}

function renderSkillRow(skill = "") {
  return `
    <div class="skill-row">
      <input name="skillName" type="text" value="${escapeHTML(skill)}" placeholder="เช่น UX Writing" />
      <button class="icon-button skill-remove" type="button" data-remove-skill-row aria-label="ลบ skill">×</button>
    </div>
  `;
}

function renderLanguageEditor() {
  const languages = languagesList();
  const rows = languages.length ? languages : [""];
  return `
    <section class="skill-editor wide-label">
      <div class="skill-editor-head">
        <div>
          <span>ภาษาที่อยากเรียน</span>
          <small>เพิ่มภาษาเองได้ เช่น อังกฤษ อาหรับ ญี่ปุ่น จีน เกาหลี หรือภาษาอื่นๆ</small>
        </div>
        <button class="tiny-button" type="button" data-add-language-row>เพิ่มภาษา</button>
      </div>
      <div class="skill-rows" data-language-rows>
        ${rows.map((language) => renderLanguageRow(language)).join("")}
      </div>
    </section>
  `;
}

function renderLanguageRow(language = "") {
  return `
    <div class="skill-row">
      <input name="languageName" type="text" value="${escapeHTML(language)}" placeholder="เช่น ญี่ปุ่น" />
      <button class="icon-button skill-remove" type="button" data-remove-language-row aria-label="ลบภาษา">×</button>
    </div>
  `;
}

function renderSideChannelEditor() {
  const channels = sideChannelsList();
  const rows = channels.length ? channels : [""];
  return `
    <section class="skill-editor wide-label">
      <div class="skill-editor-head">
        <div>
          <span>ช่องทางรายได้เสริม</span>
          <small>เพิ่มช่องทางเองได้ เช่น YouTube, ร้านออนไลน์, รับ freelance, affiliate หรืออื่นๆ</small>
        </div>
        <button class="tiny-button" type="button" data-add-side-channel-row>เพิ่มช่องทาง</button>
      </div>
      <div class="skill-rows" data-side-channel-rows>
        ${rows.map((channel) => renderSideChannelRow(channel)).join("")}
      </div>
    </section>
  `;
}

function renderSideChannelRow(channel = "") {
  return `
    <div class="skill-row">
      <input name="sideChannelName" type="text" value="${escapeHTML(channel)}" placeholder="เช่น รับออกแบบ landing page" />
      <button class="icon-button skill-remove" type="button" data-remove-side-channel-row aria-label="ลบช่องทาง">×</button>
    </div>
  `;
}

function bindSideChannelRows() {
  const rows = $("[data-side-channel-rows]");
  if (!rows) return;
  const syncRemoveButtons = () => {
    const buttons = [...rows.querySelectorAll("[data-remove-side-channel-row]")];
    buttons.forEach((button) => {
      button.disabled = buttons.length <= 1;
    });
  };
  const addButton = $("[data-add-side-channel-row]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      rows.insertAdjacentHTML("beforeend", renderSideChannelRow());
      const lastInput = rows.querySelector(".skill-row:last-child input");
      if (lastInput) lastInput.focus();
      syncRemoveButtons();
    });
  }
  rows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-side-channel-row]");
    if (!button || rows.children.length <= 1) return;
    button.closest(".skill-row").remove();
    syncRemoveButtons();
  });
  syncRemoveButtons();
}

function bindLanguageRows() {
  const rows = $("[data-language-rows]");
  if (!rows) return;
  const syncRemoveButtons = () => {
    const buttons = [...rows.querySelectorAll("[data-remove-language-row]")];
    buttons.forEach((button) => {
      button.disabled = buttons.length <= 1;
    });
  };
  const addButton = $("[data-add-language-row]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      rows.insertAdjacentHTML("beforeend", renderLanguageRow());
      const lastInput = rows.querySelector(".skill-row:last-child input");
      if (lastInput) lastInput.focus();
      syncRemoveButtons();
    });
  }
  rows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-language-row]");
    if (!button || rows.children.length <= 1) return;
    button.closest(".skill-row").remove();
    syncRemoveButtons();
  });
  syncRemoveButtons();
}

function bindSkillRows() {
  const rows = $("[data-skill-rows]");
  if (!rows) return;
  const syncRemoveButtons = () => {
    const buttons = [...rows.querySelectorAll("[data-remove-skill-row]")];
    buttons.forEach((button) => {
      button.disabled = buttons.length <= 1;
    });
  };

  const addButton = $("[data-add-skill-row]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      rows.insertAdjacentHTML("beforeend", renderSkillRow());
      const lastInput = rows.querySelector(".skill-row:last-child input");
      if (lastInput) lastInput.focus();
      syncRemoveButtons();
    });
  }

  rows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-skill-row]");
    if (!button || rows.children.length <= 1) return;
    button.closest(".skill-row").remove();
    syncRemoveButtons();
  });

  syncRemoveButtons();
}

function bindExpenseRows() {
  const rows = $("[data-expense-rows]");
  if (!rows) return;
  const syncRemoveButtons = () => {
    const buttons = [...rows.querySelectorAll("[data-remove-expense-row]")];
    buttons.forEach((button) => {
      button.disabled = buttons.length <= 1;
    });
  };

  const addButton = $("[data-add-expense-row]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      rows.insertAdjacentHTML("beforeend", renderExpenseRow());
      syncRemoveButtons();
    });
  }

  rows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-expense-row]");
    if (!button || rows.children.length <= 1) return;
    button.closest(".expense-row").remove();
    syncRemoveButtons();
  });

  syncRemoveButtons();
}

function textInput(name, label, inputMode, pattern = "") {
  return `
    <label>
      ${label}
      <input name="${name}" type="text" inputmode="${inputMode}" ${pattern ? `pattern="${pattern}"` : ""} />
    </label>
  `;
}

function openSettingModal(group = "debt") {
  const config = settingGroups[group] || settingGroups.debt;
  settingGroup = group;
  $("#settingTitle").textContent = config.title;
  $("#settingDescription").textContent = config.description;
  const genericFields = config.fields.map((field) => `
    <label>
      ${field.label}
      <input name="${field.key}" type="text" inputmode="decimal" value="${settings()[field.key] ?? 0}" />
      <span class="field-hint">${field.suffix}</span>
    </label>
  `).join("");
  $("#settingFields").innerHTML = `${genericFields}${group === "side" ? renderSideChannelEditor() : ""}${group === "skills" ? renderSkillEditor() : ""}${group === "language" ? renderLanguageEditor() : ""}`;
  if (group === "side") bindSideChannelRows();
  if (group === "skills") bindSkillRows();
  if (group === "language") bindLanguageRows();
  $("#settingModal").showModal();
}

function handleSettingSubmit(event) {
  event.preventDefault();
  const config = settingGroups[settingGroup] || settingGroups.debt;
  const data = new FormData(event.currentTarget);
  config.fields.forEach((field) => {
    settings()[field.key] = Number(data.get(field.key) || 0);
  });
  if (settingGroup === "skills") {
    const nextSkills = [...new Set(data.getAll("skillName").map((skill) => skill.trim()).filter(Boolean))];
    settings().skillNames = nextSkills;
  }
  if (settingGroup === "side") {
    const nextChannels = [...new Set(data.getAll("sideChannelName").map((channel) => channel.trim()).filter(Boolean))];
    settings().sideChannelNames = nextChannels;
  }
  if (settingGroup === "language") {
    const nextLanguages = [...new Set(data.getAll("languageName").map((language) => language.trim()).filter(Boolean))];
    settings().languageNames = nextLanguages;
  }
  saveState();
  syncSettings();
  $("#settingModal").close();
  render();
}

function resetSettingGroup() {
  const config = settingGroups[settingGroup] || settingGroups.debt;
  config.fields.forEach((field) => {
    settings()[field.key] = DEFAULT_SETTINGS[field.key];
  });
  if (settingGroup === "skills") {
    settings().skillNames = [...DEFAULT_SKILLS];
  }
  if (settingGroup === "side") {
    settings().sideChannelNames = [...DEFAULT_SIDE_CHANNELS];
  }
  if (settingGroup === "language") {
    settings().languageNames = [...DEFAULT_LANGUAGES];
  }
  saveState();
  syncSettings();
  $("#settingModal").close();
  render();
}

function clearEntryData() {
  openConfirmModal(
    "ล้างค่าข้อมูล",
    "ล้างข้อมูลรายวันทั้งหมดให้เป็น 0 โดยค่าเป้าหมายและค่าหนี้จะยังอยู่เหมือนเดิม",
    () => {
      state.entries = {};
      saveState();
      clearCloudEntries();
      selectedDate = toISO(new Date());
      calendarCursor = new Date();
      render();
    }
  );
}

function clearTargetValues() {
  openConfirmModal(
    "ล้างค่าเป้าหมาย",
    "ล้างค่าเป้าหมายและค่า fix ทั้งหมดให้เป็น 0 โดยข้อมูลรายวันจะยังอยู่เหมือนเดิม",
    () => {
      state.settings = Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((key) => [key, 0]));
      saveState();
      syncSettings();
      render();
    }
  );
}

function createMockEntries() {
  const today = new Date();
  const mockMoods = ["สดใส", "นิ่งๆ", "ภูมิใจ", "เหนื่อย", "กังวล"];
  const mockFocuses = ["คำศัพท์", "ฟัง", "พูด", "อ่าน", "ทบทวน", "เขียน"];
  const mockWins = [
    "อัปเดตชีวิตวันนี้ครบ",
    "ทำ task สำคัญเสร็จ 1 เรื่อง",
    "ไม่ซื้อน้ำหวานและเก็บเงินไว้",
    "ฝึก skill สั้นๆ แต่ต่อเนื่อง",
    "จัดเวลาให้ตัวเองได้ดีขึ้น"
  ];
  const mockSkills = [...DEFAULT_SKILLS, "UX Writing"];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const sample = (items) => items[randomInt(0, items.length - 1)];
  const maybe = (chance) => Math.random() < chance;
  const randomAmount = (min, max, step = 5) => Math.round(randomInt(min, max) / step) * step;
  return Object.fromEntries(Array.from({ length: randomInt(18, 28) }, (_, index, days) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (days.length - 1 - index));
    const iso = toISO(day);
    const sideIncome = maybe(0.38) ? randomAmount(120, 950, 10) : 0;
    const debtPaid = maybe(0.28) ? randomAmount(300, 1800, 100) : 0;
    const sweetDrink = maybe(0.42) ? randomAmount(25, 95, 5) : 0;
    const expenseItems = [
      { category: "ข้าวเที่ยง", amount: randomAmount(55, 120, 5) },
      { category: "ข้าวเย็น", amount: maybe(0.48) ? randomAmount(60, 140, 5) : 0 },
      { category: "ค่ารถ", amount: maybe(0.62) ? randomAmount(20, 80, 5) : 0 },
      { category: "กาแฟ", amount: maybe(0.32) ? randomAmount(35, 95, 5) : 0 },
      { category: "น้ำหวาน", amount: sweetDrink }
    ].filter((item) => item.amount > 0);
    const totals = expenseTotals(expenseItems);
    const practicedSkills = mockSkills.filter(() => maybe(0.24)).slice(0, randomInt(0, 2));
    const thaiMinutes = maybe(0.56) ? randomInt(10, 45) : 0;
    const arabicMinutes = maybe(0.42) ? randomInt(8, 35) : 0;
    return [iso, {
      mood: sample(mockMoods),
      water: randomInt(3, 10),
      exercise: maybe(0.58) ? randomInt(10, 70) : 0,
      sleep: Math.round((5.5 + Math.random() * 3) * 2) / 2,
      income: maybe(0.16) ? randomAmount(500, 2200, 100) : 0,
      expenseItems,
      essential: totals.essential,
      nonEssential: totals.nonEssential,
      sweetDrink: totals.sweetDrink,
      debtPaid,
      sideIncome,
      sideChannel: sideIncome ? sample(DEFAULT_SIDE_CHANNELS) : "",
      confidence: randomInt(4, 10),
      thaiMinutes,
      arabicMinutes,
      languageMinutes: {},
      languageFocus: sample(mockFocuses),
      skills: practicedSkills,
      win: sample(mockWins)
    }];
  }));
}

function createMockData() {
  if (currentUser) {
    openConfirmModal(
      "จำลองข้อมูลใช้กับ guest เท่านั้น",
      "ตอนนี้กำลังเข้าสู่ระบบอยู่ ข้อมูลจำลองจะไม่ถูกสร้างเพื่อป้องกันการปนกับข้อมูลจริง",
      () => {}
    );
    return;
  }
  openConfirmModal(
    "จำลองข้อมูล",
    "สร้างข้อมูลตัวอย่างสำหรับ guest เพื่อดู dashboard โดยไม่ใช้ข้อมูลจริงและไม่บันทึกลง Supabase",
    () => {
      state = normalizeState({
        entries: createMockEntries(),
        meta: { kind: "guest", mockData: true },
        settings: {
          ...DEFAULT_SETTINGS,
          skillNames: [...DEFAULT_SKILLS, "UX Writing"],
          languageNames: [...DEFAULT_LANGUAGES],
          sideChannelNames: [...DEFAULT_SIDE_CHANNELS]
        }
      }, DEFAULT_SETTINGS);
      selectedDate = toISO(new Date());
      calendarCursor = new Date();
      saveState();
      render();
    }
  );
}

function openConfirmModal(title, description, action) {
  pendingConfirmAction = action;
  $("#confirmTitle").textContent = title;
  $("#confirmDescription").textContent = description;
  $("#confirmModal").showModal();
}

function runPendingConfirmAction() {
  const action = pendingConfirmAction;
  pendingConfirmAction = null;
  $("#confirmModal").close();
  if (action) action();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `bloom-ux-life-tracker-${toISO(new Date())}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function openAuthModal() {
  setAuthMessage(currentUser ? `กำลังเชื่อมกับ ${currentUser.email}` : "ยังไม่ได้เข้าสู่ระบบ ข้อมูลจะอยู่ในเครื่องนี้จนกว่าจะ login");
  $("#authModal").showModal();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) {
    setAuthMessage("Supabase client ยังไม่พร้อม", true);
    return;
  }
  const data = new FormData(event.currentTarget);
  const email = (data.get("email") || "").trim();
  const password = data.get("password") || "";
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    setAuthMessage(error.message, true);
    return;
  }
  setAuthMessage("เข้าสู่ระบบสำเร็จ กำลังโหลดข้อมูลจาก DB...");
}

async function signUpUser() {
  if (!supabaseClient) {
    setAuthMessage("Supabase client ยังไม่พร้อม", true);
    return;
  }
  const form = $("#authForm");
  const data = new FormData(form);
  const email = (data.get("email") || "").trim();
  const password = data.get("password") || "";
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    setAuthMessage(error.message, true);
    return;
  }
  setAuthMessage("สมัครแล้ว เช็กอีเมลเพื่อยืนยันบัญชี ถ้า Supabase ปิด confirm email จะ login ได้ทันที");
}

async function signOutUser() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  state = loadGuestState();
  updateAuthUI();
  setAuthMessage("ออกจากระบบแล้ว ตอนนี้กำลังดูข้อมูล guest แยกจากบัญชีที่ login");
  $("#authModal").close();
  render();
}

$("#entryForm").addEventListener("submit", handleSubmit);
$("#settingForm").addEventListener("submit", handleSettingSubmit);
$("#authForm").addEventListener("submit", handleAuthSubmit);
$("#authButton").addEventListener("click", openAuthModal);
$("#closeAuthButton").addEventListener("click", () => $("#authModal").close());
$("#signUpButton").addEventListener("click", signUpUser);
$("#signOutButton").addEventListener("click", signOutUser);
$("#quickAddButton").addEventListener("click", () => openEntryModal(activePage));
$("#closeModalButton").addEventListener("click", () => $("#entryModal").close());
$("#closeSettingButton").addEventListener("click", () => $("#settingModal").close());
$("#cancelConfirmButton").addEventListener("click", () => $("#confirmModal").close());
$("#confirmActionButton").addEventListener("click", runPendingConfirmAction);
$("#resetSettingsButton").addEventListener("click", resetSettingGroup);
$("#clearDayButton").addEventListener("click", () => {
  delete state.entries[selectedDate];
  saveState();
  deleteCloudEntry(selectedDate);
  $("#entryModal").close();
  render();
});
$("#clearEntriesButton").addEventListener("click", clearEntryData);
$("#clearTargetsButton").addEventListener("click", clearTargetValues);
$("#mockDataButton").addEventListener("click", createMockData);
$("#exportButton").addEventListener("click", exportData);

render();
initSupabase();
loadDailyNews();
