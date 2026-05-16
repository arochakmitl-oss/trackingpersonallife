const LEGACY_STORAGE_KEY = "bloom-ux-life-tracker-v2";
const GUEST_STORAGE_KEY = "bloom-ux-life-tracker-guest-v1";
const userStorageKey = (userId) => `bloom-ux-life-tracker-user-${userId}`;
const SUPABASE_URL = "https://rxbipastbsfmxyyksdxm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_N1cDxWxXCS8nlXS7iZg8DQ_gJNvboZz";
const COFFEE_STRIPE_URL = "https://buy.stripe.com/";
const DEFAULT_SETTINGS = {
  debtTotal: 0,
  waterDailyTarget: 8,
  exerciseDailyTarget: 30,
  sleepTarget: 7,
  confidenceTarget: 10,
  calorieDailyTarget: 1800,
  exerciseWeeklyTarget: 150,
  debtMonthlyTarget: 12000,
  savingMonthlyTarget: 5000,
  investmentMonthlyTarget: 3000,
  sideIncomeMonthlyTarget: 8000,
  sideIncomeWeeklyTarget: 2000,
  sideIncomeYearlyTarget: 96000,
  sideChannelMonthlyTarget: 3000,
  careerTargetDays: 20,
  skillTargetDays: 20,
  languageDailyTarget: 20,
  languageWeeklyTarget: 140,
  trendExerciseTarget: 45
};
const EMPTY_SETTINGS = Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map((key) => [key, 0]));
EMPTY_SETTINGS.skillNames = [];
EMPTY_SETTINGS.languageNames = [];
EMPTY_SETTINGS.sideChannelNames = [];
EMPTY_SETTINGS.enabledFeatures = [];
EMPTY_SETTINGS.expenseCategoryNames = [];
EMPTY_SETTINGS.paymentMethodNames = [];
EMPTY_SETTINGS.debtPaymentMethods = [];
EMPTY_SETTINGS.healthGoalIds = [];
EMPTY_SETTINGS.moneyGoalIds = [];

const pages = [
  { id: "dashboard", label: "หน้าแรก", icon: "home-01", title: "แดชบอร์ด", cover: "assets/dashboard.svg", kicker: "ภาพรวมวันนี้", quote: "ทุกบันทึกเล็กๆ คือหลักฐานว่าเรากำลังดูแลอนาคตของตัวเอง" },
  { id: "checkin", label: "เช็คอินวันนี้", icon: "checkmark-circle-02", title: "เช็คอินวันนี้", cover: "assets/checkin.svg", kicker: "บันทึกตัวเองอย่างอ่อนโยน", quote: "วันนี้ไม่ต้องสมบูรณ์แบบ แค่ซื่อสัตย์กับตัวเองก็พอ" },
  { id: "money", label: "สุขภาพทางการเงิน", icon: "wallet-01", title: "สุขภาพทางการเงิน", cover: "assets/money.svg", kicker: "สุขภาพการเงินรายวัน", quote: "เงินทุกบาทที่เห็นชัด จะเริ่มมีทิศทางและมีพลังมากขึ้น" },
  { id: "side", label: "รายได้เสริม", icon: "arrow-up-right-01", title: "รายได้เสริม", cover: "assets/side.svg", kicker: "ทดลอง สร้าง วัดผล", quote: "รายได้เสริมเริ่มจากรอบทดลองเล็กๆ ที่ทำซ้ำได้" },
  { id: "health", label: "สุขภาพ & ความสวย", icon: "heart-check", title: "สุขภาพ & ความสวย", cover: "assets/health.svg", kicker: "ดูแลร่างกายเหมือนดูแลระบบสำคัญ", quote: "ความมั่นใจโตจากการดูแลตัวเองแบบไม่ทอดทิ้งกัน" },
  { id: "skills", label: "ทักษะ & อาชีพ", icon: "pencil-edit-02", title: "ทักษะ & อาชีพ", cover: "assets/skills.svg", kicker: "แผนเติบโตในแบบของคุณ", quote: "งานที่ดีขึ้นมาจากทักษะที่ค่อยๆ คมขึ้นทีละวัน" },
  { id: "membership", label: "ค่ากาแฟ", icon: "coffee-02", title: "Mood ช่วยค่ากาแฟ", cover: "assets/goals.svg", kicker: "ใช้ฟรีทุกฟีเจอร์ 7 วัน", quote: "เริ่มจากทดลองใช้ให้เข้ากับชีวิตจริง แล้วค่อยตัดสินใจอย่างสบายใจ" },
  { id: "settings", label: "ตั้งค่า", icon: "settings-01", title: "ตั้งค่าแอป", cover: "assets/dashboard.svg", kicker: "เลือกฟีเจอร์และข้อมูลพื้นฐาน", quote: "ระบบที่ดีควรปรับให้เข้ากับเรา ไม่ใช่ให้เราฝืนเข้ากับระบบ" }
];

const DEFAULT_SKILLS = ["การสื่อสาร", "การวางแผน", "การจัดการเวลา", "AI Tools", "การเงินส่วนตัว", "สุขภาพ"];
const DEFAULT_LANGUAGES = ["อังกฤษ"];
const LEGACY_SIDE_CHANNELS = ["AI Kids Song YouTube", "ร้านเสื้อผ้ามือสอง", "TikTok Cat Affiliate"];
const DEFAULT_SIDE_CHANNELS = ["ขายของออนไลน์", "รับงานเสริม", "คอนเทนต์ออนไลน์"];
const DEFAULT_FEATURES = ["money", "side", "health", "skills"];
const CORE_PAGES = ["dashboard", "checkin", "membership", "settings"];
const DEFAULT_EXPENSE_CATEGORIES = ["กาแฟ", "ข้าวเที่ยง", "น้ำหวาน", "ข้าวเย็น", "ค่ารถ", "ค่าใช้จ่ายภายในบ้าน", "ขนม7-11"];
const DEFAULT_PAYMENT_METHODS = ["เงินสด", "บัตรเครดิต", "บัตรเดบิต", "โอนเงิน"];
const DEFAULT_DEBT_PAYMENT_METHODS = ["บัตรเครดิต"];
const HEALTH_GOAL_MASTER = [
  { id: "water", label: "กินน้ำ", icon: "droplet", field: "water", targetKey: "waterDailyTarget", unit: "แก้ว", period: "รายวัน" },
  { id: "exercise", label: "ออกกำลังกาย", icon: "body-part-muscle", field: "exercise", targetKey: "exerciseWeeklyTarget", unit: "นาที", period: "รายสัปดาห์" },
  { id: "sleep", label: "นอน", icon: "moon-02", field: "sleep", targetKey: "sleepTarget", unit: "ชั่วโมง", period: "รายวัน" },
  { id: "confidence", label: "ความมั่นใจ", icon: "heart-check", field: "confidence", targetKey: "confidenceTarget", unit: "คะแนน", period: "รายวัน" },
  { id: "calories", label: "นับแคลลอรี่", icon: "fire", field: "calories", targetKey: "calorieDailyTarget", unit: "kcal", period: "รายวัน" }
];
const MONEY_GOAL_MASTER = [
  { id: "debt", label: "ปิดหนี้", icon: "target-02", field: "debtPaid", targetKey: "debtMonthlyTarget", unit: "บาท", period: "รายเดือน" },
  { id: "saving", label: "ออมเงิน", icon: "safe", field: "saving", targetKey: "savingMonthlyTarget", unit: "บาท", period: "รายเดือน" },
  { id: "investment", label: "ลงทุน", icon: "chart-line-data-01", field: "investment", targetKey: "investmentMonthlyTarget", unit: "บาท", period: "รายเดือน" }
];
const FEATURE_SETTING_GROUPS = {
  money: [
    { group: "moneyGoals", label: "ตั้งค่าข้อมูลและเป้าหมาย", icon: "target-02" },
    { group: "financeOptions", label: "ตั้งค่าหมวดรายจ่ายและวิธีชำระ", icon: "wallet-01" },
    { group: "debt", label: "ตั้งค่ายอดหนี้", icon: "credit-card" }
  ],
  side: [{ group: "side", label: "ช่องทาง + เป้ารายได้เสริม", icon: "arrow-up-right-01" }],
  health: [{ group: "health", label: "ตั้งค่าข้อมูลและเป้าสุขภาพ", icon: "heart-check" }],
  skills: [
    { group: "skills", label: "ทักษะ + เป้าการฝึก", icon: "pencil-edit-02" },
    { group: "language", label: "ภาษา + เป้านาที", icon: "translation" }
  ]
};
const trialDays = 7;
const settingGroups = {
  debt: {
    title: "ตั้งค่ายอดหนี้",
    description: "ตั้งยอดหนี้ปัจจุบันของคุณเอง หรือปล่อยไว้เป็น 0 แล้วให้ระบบเพิ่มจากวิธีจ่ายที่เลือกเป็นหนี้",
    fields: [{ key: "debtTotal", label: "หนี้ทั้งหมด", suffix: "บาท" }]
  },
  goals: {
    title: "ตั้งค่าเป้าหมาย",
    description: "เลือกข้อมูลที่อยากติดตามและตั้งค่าตัวเลขที่ใช้คำนวณกราฟ",
    fields: [
      { key: "waterDailyTarget", label: "น้ำต่อวัน", suffix: "แก้ว" },
      { key: "exerciseWeeklyTarget", label: "ออกกำลังกายต่อสัปดาห์", suffix: "นาที" },
      { key: "sleepTarget", label: "นอนต่อวัน", suffix: "ชั่วโมง" },
      { key: "confidenceTarget", label: "ความมั่นใจ", suffix: "คะแนน" },
      { key: "calorieDailyTarget", label: "แคลลอรี่ต่อวัน", suffix: "kcal" },
      { key: "debtMonthlyTarget", label: "จ่ายหนี้ต่อเดือน", suffix: "บาท" },
      { key: "savingMonthlyTarget", label: "ออมเงินต่อเดือน", suffix: "บาท" },
      { key: "investmentMonthlyTarget", label: "ลงทุนต่อเดือน", suffix: "บาท" },
      { key: "sideIncomeMonthlyTarget", label: "รายได้เสริมต่อเดือน", suffix: "บาท" },
      { key: "careerTargetDays", label: "วันฝึกทักษะอาชีพ", suffix: "วัน" }
    ]
  },
  moneyGoals: {
    title: "ตั้งค่าข้อมูลสุขภาพทางการเงิน",
    description: "เลือกข้อมูลการเงินที่อยากติดตาม แล้วตั้งค่าเป้าหมายแต่ละตัว",
    fields: [
      { key: "debtMonthlyTarget", label: "ปิดหนี้ต่อเดือน", suffix: "บาท" },
      { key: "savingMonthlyTarget", label: "ออมเงินต่อเดือน", suffix: "บาท" },
      { key: "investmentMonthlyTarget", label: "ลงทุนต่อเดือน", suffix: "บาท" }
    ]
  },
  dashboard: {
    title: "แก้ไขเป้าสมดุลชีวิต",
    description: "ค่าเหล่านี้ผูกกับกราฟแมงมุมตามฟีเจอร์และเป้าหมายที่เปิดใช้งาน",
    fields: [
      { key: "waterDailyTarget", label: "สุขภาพ: น้ำต่อวัน", suffix: "แก้ว" },
      { key: "exerciseDailyTarget", label: "สุขภาพ: ออกกำลังกายต่อวัน", suffix: "นาที" },
      { key: "sleepTarget", label: "สุขภาพ: นอนต่อวัน", suffix: "ชั่วโมง" },
      { key: "confidenceTarget", label: "สุขภาพ: ความมั่นใจ", suffix: "คะแนน" },
      { key: "debtMonthlyTarget", label: "เงิน: เป้าปิดหนี้ต่อเดือน", suffix: "บาท" },
      { key: "savingMonthlyTarget", label: "เงิน: เป้าออมต่อเดือน", suffix: "บาท" },
      { key: "investmentMonthlyTarget", label: "เงิน: เป้าลงทุนต่อเดือน", suffix: "บาท" },
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
      { key: "confidenceTarget", label: "เป้าความมั่นใจ", suffix: "คะแนน" },
      { key: "calorieDailyTarget", label: "แคลลอรี่ต่อวัน", suffix: "kcal" }
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
  },
  financeOptions: {
    title: "ตั้งค่าหมวดรายจ่ายและวิธีชำระ",
    description: "เพิ่มหมวดรายจ่ายเอง และเลือกว่าวิธีจ่ายไหนต้องบวกยอดเข้าเป็นหนี้ เช่น บัตรเครดิต",
    fields: []
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
let dashboardManageMode = false;
let dashboardDraftOrder = null;
let supabaseClient = null;
let currentUser = null;
let isCloudLoading = false;
let authMode = "login";

const $ = (selector) => document.querySelector(selector);
const money = (value) => Number(value || 0).toLocaleString("th-TH");
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const numericFields = ["water", "exercise", "sleep", "calories", "income", "essential", "nonEssential", "sweetDrink", "debtPaid", "saving", "investment", "sideIncome", "confidence", "thaiMinutes", "arabicMinutes"];
const hugeIcon = (name) => `<i class="hgi hgi-stroke hgi-${name}" aria-hidden="true"></i>`;
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
    description: "รวมข้อมูลสำคัญของวันเดียวในฟอร์มเดียว ครบทุกฟีเจอร์จากหน้าแรก และทุกช่องกรอกข้อมูล",
    fields: ["mood", "water", "exercise", "sleep", "calories", "income", "expenseRows", "debtPaid", "saving", "investment", "sideIncome", "sideChannel", "confidence", "languageMinutes", "languageFocus", "skills", "win"]
  },
  goals: {
    title: "อัปเดตเป้าหมาย",
    description: "กรอกเฉพาะตัวเลขที่ส่งผลต่อ progress bar รายวัน/สัปดาห์/เดือน/ระยะยาว",
    fields: ["water", "exercise", "sleep", "calories", "confidence", "debtPaid", "saving", "investment", "sideIncome", "skills", "win"]
  },
  checkin: {
    title: "เช็คอินชีวิตวันนี้",
    description: "บันทึกความรู้สึก ค่าใช้จ่าย สุขภาพ ชัยชนะเล็กๆ และ streak ของวันนี้",
    fields: ["mood", "water", "exercise", "sleep", "calories", "income", "expenseRows", "debtPaid", "saving", "investment", "sideIncome", "sideChannel", "confidence", "languageMinutes", "languageFocus", "skills", "win"]
  },
  money: {
    title: "บันทึกสุขภาพทางการเงิน",
    description: "แยกรายรับ รายจ่ายเป็นแถวตามหมวด และเงินที่จ่ายหนี้",
    fields: ["income", "expenseRows", "debtPaid", "saving", "investment", "win"]
  },
  side: {
    title: "บันทึกรายได้เสริม",
    description: "เก็บยอดและช่องทางของการทดลองหาเงินเสริมในวันนี้",
    fields: ["sideIncome", "sideChannel", "win"]
  },
  health: {
    title: "บันทึกสุขภาพ & ความสวย",
    description: "โฟกัสเป้าหมายสุขภาพที่เลือกไว้ เช่น น้ำ การนอน ออกกำลังกาย และความมั่นใจ",
    fields: ["water", "sleep", "exercise", "confidence", "calories", "win"]
  },
  skills: {
    title: "บันทึกทักษะ & อาชีพ",
    description: "เลือกทักษะที่ฝึกวันนี้และบันทึกความคืบหน้าตามอาชีพของคุณ",
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
  return normalizeState({ meta: { kind: "guest" } }, DEFAULT_SETTINGS);
}

function loadUserCache(userId) {
  return readStoredState(userStorageKey(userId));
}

function guestHasMockData() {
  return false;
}

function sanitizeGuestMockState(saved) {
  if (!saved.meta?.mockData) return saved;
  const legacySet = new Set(LEGACY_SIDE_CHANNELS);
  const next = normalizeState(saved, DEFAULT_SETTINGS);
  const hasLegacyChannel = (next.settings.sideChannelNames || []).some((channel) => legacySet.has(channel)) ||
    Object.values(next.entries || {}).some((entry) => legacySet.has(entry.sideChannel));
  if (!hasLegacyChannel) return next;

  next.settings.sideChannelNames = [...DEFAULT_SIDE_CHANNELS];
  Object.values(next.entries || {}).forEach((entry, index) => {
    if (legacySet.has(entry.sideChannel)) {
      entry.sideChannel = DEFAULT_SIDE_CHANNELS[index % DEFAULT_SIDE_CHANNELS.length];
    }
  });
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next));
  return next;
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
  return DEFAULT_SETTINGS;
}

function settings() {
  state.settings = { ...defaultSettingsForState(), ...(state.settings || {}) };
  const useDefaultLists = true;
  if (!Array.isArray(state.settings.skillNames)) {
    state.settings.skillNames = useDefaultLists ? [...DEFAULT_SKILLS] : [];
  }
  if (!Array.isArray(state.settings.languageNames)) {
    state.settings.languageNames = useDefaultLists ? [...DEFAULT_LANGUAGES] : [];
  }
  if (!Array.isArray(state.settings.sideChannelNames)) {
    state.settings.sideChannelNames = useDefaultLists ? [...DEFAULT_SIDE_CHANNELS] : [];
  }
  if (!Array.isArray(state.settings.enabledFeatures)) {
    state.settings.enabledFeatures = useDefaultLists ? [...DEFAULT_FEATURES] : [];
  }
  if (!Array.isArray(state.settings.expenseCategoryNames)) {
    state.settings.expenseCategoryNames = useDefaultLists ? [...DEFAULT_EXPENSE_CATEGORIES] : [];
  }
  if (!Array.isArray(state.settings.paymentMethodNames)) {
    state.settings.paymentMethodNames = useDefaultLists ? [...DEFAULT_PAYMENT_METHODS] : [];
  }
  if (!Array.isArray(state.settings.debtPaymentMethods)) {
    state.settings.debtPaymentMethods = useDefaultLists ? [...DEFAULT_DEBT_PAYMENT_METHODS] : [];
  }
  if (!Array.isArray(state.settings.healthGoalIds)) {
    state.settings.healthGoalIds = useDefaultLists ? HEALTH_GOAL_MASTER.map((item) => item.id) : [];
  }
  if (!Array.isArray(state.settings.moneyGoalIds)) {
    state.settings.moneyGoalIds = useDefaultLists ? MONEY_GOAL_MASTER.map((item) => item.id) : [];
  }
  if (!Array.isArray(state.settings.dashboardSectionOrder)) {
    state.settings.dashboardSectionOrder = ["balance", "debt", "day", "trend", "language", "moneyMix"];
  }
  return state.settings;
}

function healthGoalsList() {
  const ids = Array.isArray(settings().healthGoalIds) ? settings().healthGoalIds : [];
  return HEALTH_GOAL_MASTER.filter((item) => ids.includes(item.id));
}

function moneyGoalsList() {
  const ids = Array.isArray(settings().moneyGoalIds) ? settings().moneyGoalIds : [];
  return MONEY_GOAL_MASTER.filter((item) => ids.includes(item.id));
}

function settingFieldLabel(field) {
  return `${field.label} ${money(settings()[field.key] ?? 0)} ${field.suffix}`;
}

function featureSettingSummary(id) {
  if (id === "health") {
    return healthGoalsList().map((goal) => `${goal.label}: ${money(settings()[goal.targetKey])} ${goal.unit}`);
  }
  if (id === "money") {
    return [
      ...moneyGoalsList().map((goal) => `${goal.label}: ${money(settings()[goal.targetKey])} ${goal.unit}`),
      `${expenseCategoriesList().length} หมวดรายจ่าย`,
      `${paymentMethodsList().length} วิธีจ่าย`
    ];
  }
  if (id === "side") {
    return [
      ...sideChannelsList().slice(0, 3),
      settingFieldLabel({ key: "sideIncomeMonthlyTarget", label: "เป้าเดือน", suffix: "บาท" })
    ];
  }
  if (id === "skills") {
    return [
      `${skillsList().length} ทักษะ`,
      `${languagesList().join(", ") || "ยังไม่มีภาษา"}`,
      settingFieldLabel({ key: "skillTargetDays", label: "เป้าทักษะ", suffix: "วัน" })
    ];
  }
  return [];
}

function enabledFeaturesList() {
  const list = settings().enabledFeatures;
  return Array.isArray(list) ? list.filter((id) => DEFAULT_FEATURES.includes(id)) : [...DEFAULT_FEATURES];
}

function isFeatureEnabled(pageId) {
  return CORE_PAGES.includes(pageId) || enabledFeaturesList().includes(pageId);
}

function featurePage(id) {
  return pages.find((page) => page.id === id);
}

function featureFields(fields = []) {
  const fieldMap = {
    mood: "checkin",
    win: "checkin",
    water: "health",
    exercise: "health",
    sleep: "health",
    calories: "health",
    confidence: "health",
    income: "money",
    expenseRows: "money",
    debtPaid: "money",
    saving: "money",
    investment: "money",
    sideIncome: "side",
    sideChannel: "side",
    skills: "skills",
    languageMinutes: "skills",
    languageFocus: "skills"
  };
  const selectedHealthFields = new Set(healthGoalsList().map((goal) => goal.field));
  const selectedMoneyFields = new Set(moneyGoalsList().map((goal) => goal.field));
  return fields.filter((field) => {
    if (fieldMap[field] && !isFeatureEnabled(fieldMap[field])) return false;
    if (HEALTH_GOAL_MASTER.some((goal) => goal.field === field)) return selectedHealthFields.has(field);
    if (MONEY_GOAL_MASTER.some((goal) => goal.field === field)) return selectedMoneyFields.has(field);
    return true;
  });
}

function activeEntryCategory(category = activePage) {
  if (modalConfigs[category] && isFeatureEnabled(category)) return category;
  if (category === "dashboard" || category === "settings" || category === "membership") return "dashboard";
  return "checkin";
}

function dashboardSectionOrder() {
  const defaults = ["balance", "checkin", "financialGoals", "day", "trend", "language", "moneyMix"];
  const legacyMap = { debt: "financialGoals" };
  const saved = Array.isArray(settings().dashboardSectionOrder) ? settings().dashboardSectionOrder : defaults;
  const normalized = saved.map((item) => legacyMap[item] || item);
  return [...normalized.filter((item) => defaults.includes(item)), ...defaults.filter((item) => !normalized.includes(item))];
}

function moveDashboardSection(section, direction) {
  if (!dashboardManageMode) return;
  const order = dashboardDraftOrder || dashboardSectionOrder();
  const index = order.indexOf(section);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return;
  [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
  dashboardDraftOrder = order;
  render();
}

function startDashboardManage() {
  dashboardManageMode = true;
  dashboardDraftOrder = dashboardSectionOrder();
  render();
}

function cancelDashboardManage() {
  dashboardManageMode = false;
  dashboardDraftOrder = null;
  render();
}

function saveDashboardManage() {
  if (dashboardDraftOrder) settings().dashboardSectionOrder = dashboardDraftOrder;
  saveState();
  syncSettings();
  dashboardManageMode = false;
  dashboardDraftOrder = null;
  render();
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

function expenseCategoriesList() {
  const list = settings().expenseCategoryNames;
  return Array.isArray(list) ? list.map((item) => item.trim()).filter(Boolean) : [...DEFAULT_EXPENSE_CATEGORIES];
}

function paymentMethodsList() {
  const list = settings().paymentMethodNames;
  return Array.isArray(list) ? list.map((item) => item.trim()).filter(Boolean) : [...DEFAULT_PAYMENT_METHODS];
}

function debtPaymentMethodsList() {
  const list = settings().debtPaymentMethods;
  return Array.isArray(list) ? list.map((item) => item.trim()).filter(Boolean) : [...DEFAULT_DEBT_PAYMENT_METHODS];
}

function isDebtPaymentMethod(method) {
  return debtPaymentMethodsList().includes(method);
}

function trialStartedAt() {
  if (!state.meta?.trialStartedAt) {
    state.meta = { ...(state.meta || {}), trialStartedAt: new Date().toISOString() };
  }
  return state.meta.trialStartedAt;
}

function trialInfo() {
  const start = new Date(trialStartedAt());
  const end = new Date(start);
  end.setDate(start.getDate() + trialDays);
  const remainingMs = end.getTime() - Date.now();
  return {
    start,
    end,
    daysLeft: Math.max(0, Math.ceil(remainingMs / 86400000)),
    active: remainingMs > 0
  };
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
    enabledFeaturesList().length > 0 ||
    expenseCategoriesList().length > 0 ||
    paymentMethodsList().length > 0 ||
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
        <button class="primary-button" type="button" data-open-entry>เริ่มบันทึกเอง</button>
      </div>
    </div>
  `;
}

function saveState() {
  state.meta = currentUser
    ? { ...(state.meta || {}), kind: "user" }
    : { ...(state.meta || {}), kind: "guest" };
  if (currentUser) localStorage.setItem(userStorageKey(currentUser.id), JSON.stringify(state));
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.removeItem(GUEST_STORAGE_KEY);
}

function setAuthMessage(message, isError = false) {
  const authMessage = $("#authMessage");
  if (!authMessage) return;
  authMessage.textContent = message || "";
  authMessage.style.color = isError ? "#b94b62" : "";
}

function setAuthMode(mode = "login") {
  authMode = mode;
  const form = $("#authForm");
  if (!form) return;
  form.dataset.authMode = authMode;
  $("#authModal h2").textContent = authMode === "signup" ? "สมัครสมาชิก" : "เข้าสู่ระบบ";
  $("#authDescription").textContent = authMode === "signup"
    ? "กรอกข้อมูลเพื่อสร้างบัญชีและจัดเก็บข้อมูล"
    : "เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน";
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.textContent = authMode === "signup" ? "สมัครสมาชิก" : "เข้าสู่ระบบ";
  const signUpButton = $("#signUpButton");
  if (signUpButton) signUpButton.textContent = authMode === "signup" ? "กลับไปเข้าสู่ระบบ" : "สมัครสมาชิก";
  setAuthMessage("");
}

function updateAuthUI() {
  const authButton = $("#authButton");
  const profileMenu = $("#profileMenu");
  const displayName = currentUser?.user_metadata?.name || currentUser?.email || "U";
  if (!authButton) return;
  document.body.classList.toggle("is-authenticated", Boolean(currentUser));
  authButton.classList.toggle("profile-avatar", Boolean(currentUser));
  if (profileMenu) profileMenu.hidden = true;
  if (isCloudLoading) {
    authButton.textContent = currentUser ? displayName.trim().slice(0, 1).toUpperCase() : "กำลัง sync...";
    authButton.title = "กำลัง sync...";
    return;
  }
  authButton.textContent = currentUser ? displayName.trim().slice(0, 1).toUpperCase() : "เข้าสู่ระบบ";
  authButton.title = currentUser ? displayName : "เข้าสู่ระบบ";
  authButton.setAttribute("aria-label", currentUser ? `โปรไฟล์ ${displayName}` : "เข้าสู่ระบบ");
}

async function initSupabase() {
  if (!window.supabase?.createClient) {
    setAuthMessage("เชื่อมระบบบัญชีไม่สำเร็จ ใช้ข้อมูลในเครื่องชั่วคราว", true);
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

function summaryEndDate() {
  return [toISO(new Date()), selectedDate, ...Object.keys(state.entries || {})]
    .filter(Boolean)
    .sort()
    .at(-1);
}

function entriesInRange(range = filter) {
  const end = new Date(`${summaryEndDate()}T00:00:00`);
  let start = new Date(end);
  if (range === "week") start.setDate(end.getDate() - 6);
  if (range === "month") start = new Date(end.getFullYear(), end.getMonth(), 1);
  if (range === "year") start = new Date(end.getFullYear(), 0, 1);

  return Object.entries(state.entries)
    .filter(([iso]) => {
      const day = new Date(`${iso}T00:00:00`);
      return day >= start && day <= end;
    })
    .sort(([a], [b]) => a.localeCompare(b));
}

function lastDays(count) {
  const end = new Date(`${summaryEndDate()}T00:00:00`);
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(end);
    day.setDate(end.getDate() - (count - 1 - index));
    const iso = toISO(day);
    return [iso, state.entries[iso] || {}];
  });
}

function trendPeriod() {
  const selected = new Date(`${summaryEndDate()}T00:00:00`);
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
        category: expenseCategoriesList().includes(item.category) ? item.category : item.category || expenseCategoriesList()[0] || "",
        amount: Number(item.amount || 0),
        paymentMethod: paymentMethodsList().includes(item.paymentMethod) ? item.paymentMethod : item.paymentMethod || ""
      }))
      .filter((item) => item.category && item.amount > 0);
  }
  const fallback = [];
  if (Number(entry.nonEssential || 0) > 0) fallback.push({ category: "น้ำหวาน", amount: Number(entry.nonEssential || 0), paymentMethod: "" });
  if (Number(entry.sweetDrink || 0) > 0) fallback.push({ category: "น้ำหวาน", amount: Number(entry.sweetDrink || 0), paymentMethod: "" });
  if (Number(entry.essential || 0) > 0) fallback.push({ category: "ข้าวเที่ยง", amount: Number(entry.essential || 0), paymentMethod: "" });
  return fallback;
}

function expenseTotals(items = []) {
  return items.reduce((totals, item) => {
    const amount = Number(item.amount || 0);
    if (item.category === "น้ำหวาน") {
      totals.sweetDrink += amount;
    }
    totals.total += amount;
    return totals;
  }, { essential: 0, nonEssential: 0, sweetDrink: 0, total: 0 });
}

function expenseTotal(entry = {}) {
  return getExpenseItems(entry).reduce((total, item) => total + Number(item.amount || 0), 0);
}

function categoryTotals(entries = entriesInRange("month")) {
  const totals = new Map();
  entries.forEach(([, entry]) => {
    getExpenseItems(entry).forEach((item) => {
      totals.set(item.category, (totals.get(item.category) || 0) + Number(item.amount || 0));
    });
  });
  return [...totals.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function cardDebtTotal(entry = {}) {
  return getExpenseItems(entry).reduce((total, item) => (
    isDebtPaymentMethod(item.paymentMethod) ? total + Number(item.amount || 0) : total
  ), 0);
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
  const navHTML = pages.filter((page) => page.id !== "checkin" && isFeatureEnabled(page.id)).map((page) => `
    <button class="nav-item ${page.id === activePage ? "active" : ""}" type="button" data-page="${page.id}" title="${page.label}" aria-label="${page.label}">
      <span class="nav-icon" aria-hidden="true">${hugeIcon(page.icon)}</span>
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
  if (!isFeatureEnabled(activePage)) activePage = "dashboard";
  const page = pages.find((item) => item.id === activePage) || pages[0];
  $("#todayLabel").textContent = `วันนี้ ${dateLabel(toISO(new Date()))}`;
  $("#pageTitle").textContent = page.title;
  $("#pageKicker").textContent = page.kicker;
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
    skills: renderSkills,
    membership: renderMembership,
    settings: renderSettingsPage
  }[activePage]();

  $("#pageContent").innerHTML = content;
  bindPageEvents();
}

function renderDashboard() {
  const entries = entriesInRange();
  const today = getEntry(summaryEndDate());
  const cfg = settings();
  const checkinSummary = renderCheckinSummary();
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
        ${renderGuestEmptyState("ยังไม่มีข้อมูลสำหรับ guest", "ข้อมูลจะเริ่มแสดงหลังจากเริ่มบันทึกเอง")}
        ${renderCalendar()}
      </div>
    `;
  }
  const debtPaid = sum(Object.entries(state.entries), "debtPaid");
  const sideIncome = sum(entries, "sideIncome");
  const debtLeft = Math.max(0, cfg.debtTotal - debtPaid);
  const trend = trendPeriod();
  const hasRangeData = entries.length > 0;
  const healthGoalScores = healthGoalsList().map((goal) => {
    const value = goal.id === "exercise" ? sum(entriesInRange("week"), "exercise") : Number(today[goal.field] || 0);
    return progressValue(value, cfg[goal.targetKey]);
  });
  const healthScore = healthGoalScores.length ? average(healthGoalScores) : 0;
  const moneyGoalScores = moneyGoalsList().map((goal) => progressValue(sum(entries, goal.field), cfg[goal.targetKey]));
  const moneyScore = hasRangeData ? average(moneyGoalScores.length ? moneyGoalScores : [progressValue(debtPaid, cfg.debtMonthlyTarget)]) : 0;
  const sideScore = progressValue(sideIncome, filter === "week" ? cfg.sideIncomeWeeklyTarget : filter === "year" ? cfg.sideIncomeYearlyTarget : cfg.sideIncomeMonthlyTarget);
  const careerSkills = skillsList();
  const careerScore = progressValue(careerSkills.reduce((total, skill) => total + countSkillDays(skill), 0), careerSkills.length * cfg.skillTargetDays);
  const radarItems = [
    isFeatureEnabled("health") ? { key: "health", icon: "health", label: "สุขภาพ", score: healthScore, note: healthGoalsList().map((item) => item.label).join(", ") || "ยังไม่เลือกเป้าหมาย", color: "#a9dcc5" } : null,
    isFeatureEnabled("money") ? { key: "money", icon: "money", label: "เงิน", score: moneyScore, note: moneyGoalsList().map((item) => item.label).join(", ") || "รายรับรายจ่าย", color: "#ffc39d" } : null,
    isFeatureEnabled("side") ? { key: "side", icon: "side", label: "รายได้เสริม", score: sideScore, note: `${money(sideIncome)} บาท`, color: "#c6b2f2" } : null,
    isFeatureEnabled("skills") ? { key: "career", icon: "career", label: "อาชีพ", score: careerScore, note: "skill days", color: "#f5a7c6" } : null
  ].filter(Boolean);
  const trendCharts = [
    isFeatureEnabled("health") ? trendChart("น้ำ", "water", trend.entries, cfg.waterDailyTarget, "แก้ว") : "",
    isFeatureEnabled("health") ? trendChart("ออกกำลังกาย", "exercise", trend.entries, cfg.trendExerciseTarget, "นาที") : "",
    isFeatureEnabled("money") ? trendChart("รายจ่าย", "expenseTotal", trend.entries.map(([iso, entry, labelText, tooltip]) => [iso, { expenseTotal: expenseTotal(entry) }, labelText, tooltip]), Math.max(...categoryTotals(entries).map((item) => item.amount), 1), "บาท", true) : ""
  ].filter(Boolean).join("");
  const sections = {
    balance: radarItems.length ? dashboardSection("balance", `
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Life balance</p>
            <h2>ภาพรวมสมดุลชีวิต</h2>
          </div>
          <span class="pill">จากเป้าหมายที่เปิด</span>
        </div>
        ${lifeRadarChart(radarItems)}
      </div>
    `) : "",
    financialGoals: isFeatureEnabled("money") ? dashboardSection("financialGoals", `
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Financial health</p>
            <h2>สุขภาพทางการเงินตามข้อมูลที่ตั้งไว้</h2>
          </div>
          <span class="pill">${moneyGoalsList().length} เป้าหมาย</span>
        </div>
        <div class="money-goal-rings">
          ${moneyGoalsList().map((goal) => {
            const value = sum(entries, goal.field);
            return `
              <div class="mini-ring" style="--ring:${progressValue(value, cfg[goal.targetKey])}%">
                <div>${hugeIcon(goal.icon)}<strong>${money(value)}</strong><span>${goal.label}</span></div>
              </div>
            `;
          }).join("") || `<p class="muted">ยังไม่ได้เลือกข้อมูลการเงินใน Settings</p>`}
        </div>
        ${cfg.debtTotal ? `
          <div class="debt-inline">
            <span>หนี้คงเหลือ</span>
            <strong>${money(debtLeft)} บาท</strong>
            <div class="bar"><span style="width:${clamp((debtPaid / Math.max(cfg.debtTotal, 1)) * 100, 0, 100)}%"></span></div>
          </div>
        ` : ""}
      </div>
    `) : "",
    day: dashboardSection("day", `
      <div class="grid two">
        ${renderCalendar()}
        <div class="card">
          <div class="section-head">
            <div>
              <p class="eyebrow">${dateLabel(selectedDate)}</p>
              <h2>ข้อมูลย้อนหลัง</h2>
            </div>
            ${featureFields(modalConfigs.checkin.fields).length ? `<button class="tiny-button" type="button" data-open-entry data-modal="checkin">แก้ไข</button>` : ""}
          </div>
          ${renderDayDetail(selectedDate)}
        </div>
      </div>
    `),
    checkin: dashboardSection("checkin", checkinSummary),
    trend: trendCharts ? dashboardSection("trend", `
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">${trend.eyebrow}</p>
            <h2>${trend.title}</h2>
          </div>
          <span class="pill">${filter === "week" ? "สัปดาห์" : filter === "month" ? "เดือน" : "ปี"}</span>
        </div>
        <div class="trend-grid">${trendCharts}</div>
      </div>
    `) : "",
    language: isFeatureEnabled("skills") ? dashboardSection("language", languageDashboard(entries)) : "",
    moneyMix: isFeatureEnabled("money") ? dashboardSection("moneyMix", moneyMixChart(entries)) : ""
  };
  const sectionOrder = dashboardManageMode && dashboardDraftOrder ? dashboardDraftOrder : dashboardSectionOrder();
  return `
    <div class="section-head">
      <div class="segmented" aria-label="ตัวกรองช่วงเวลา">
        ${["week", "month", "year"].map((item) => `<button type="button" class="${filter === item ? "active" : ""}" data-filter="${item}">${item === "week" ? "สัปดาห์" : item === "month" ? "เดือน" : "ปี"}</button>`).join("")}
      </div>
      <div class="button-row">
        ${dashboardManageMode ? `
          <button class="ghost-button" type="button" data-dashboard-manage="cancel">ยกเลิก</button>
          <button class="primary-button" type="button" data-dashboard-manage="save">บันทึก</button>
        ` : `<button class="soft-button" type="button" data-dashboard-manage="start">${hugeIcon("layout-03")}<span>จัดการหน้าแรก</span></button>`}
        ${featureFields(modalConfigs.dashboard.fields).length ? `<button class="primary-button" type="button" data-open-entry>${hugeIcon("plus-sign")}<span>บันทึกวันที่เลือก</span></button>` : ""}
      </div>
    </div>
    <div class="dashboard-sections">
      ${sectionOrder.map((key) => sections[key]).filter(Boolean).join("")}
    </div>
  `;
}

function dashboardSection(key, content) {
  return `
    <section class="dashboard-section" data-dashboard-section="${key}">
      ${dashboardManageMode ? `
        <div class="section-move-controls" aria-label="ย้าย section">
          <button class="icon-button mini-icon-button" type="button" data-move-section="${key}" data-direction="-1" aria-label="ย้ายขึ้น">${hugeIcon("arrow-up-01")}</button>
          <button class="icon-button mini-icon-button" type="button" data-move-section="${key}" data-direction="1" aria-label="ย้ายลง">${hugeIcon("arrow-down-01")}</button>
        </div>
      ` : ""}
      ${content}
    </section>
  `;
}

function renderGoals() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่ได้ตั้งค่าเป้าหมาย", "guest จะเห็นเป้าหมายหลังจากเริ่มเพิ่มเป้าหมายเอง");
  }
  const entries = entriesInRange("month");
  const cfg = settings();
  const goalTemplates = [
    { name: `ดื่มน้ำ ${money(cfg.waterDailyTarget)} แก้ว`, type: "รายวัน", target: cfg.waterDailyTarget, metric: "water" },
    { name: `ออกกำลังกาย ${money(cfg.exerciseWeeklyTarget)} นาที`, type: "รายสัปดาห์", target: cfg.exerciseWeeklyTarget, metric: "exercise" },
    { name: `จ่ายหนี้เดือนนี้ ${money(cfg.debtMonthlyTarget)} บาท`, type: "รายเดือน", target: cfg.debtMonthlyTarget, metric: "debtPaid" },
    { name: `สร้างรายได้เสริม ${money(cfg.sideIncomeMonthlyTarget)} บาท`, type: "รายเดือน", target: cfg.sideIncomeMonthlyTarget, metric: "sideIncome" },
    { name: "ฝึกทักษะอาชีพให้ต่อเนื่อง", type: "ระยะยาว", target: cfg.careerTargetDays, metric: "careerDays" }
  ];
  const goals = goalTemplates.map((goal) => {
    let progress = 0;
    if (goal.metric === "water") progress = Number(getEntry().water || 0);
    if (goal.metric === "exercise") progress = sum(entriesInRange("week"), "exercise");
    if (goal.metric === "debtPaid") progress = sum(entries, "debtPaid");
    if (goal.metric === "sideIncome") progress = sum(entries, "sideIncome");
    if (goal.metric === "careerDays") progress = Object.values(state.entries).filter((entry) => (entry.skills || []).length).length;
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
            <span class="pill">ตั้งค่าจาก Settings</span>
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
  const weekCategories = categoryTotals(week);
  const topWeekCategory = weekCategories[0];
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
    icon: "money",
    title: "เงินและรายจ่าย",
    text: topWeekCategory
      ? `หมวดที่ใช้มากสุดสัปดาห์นี้คือ ${topWeekCategory.category} ${money(topWeekCategory.amount)} บาท`
      : "สัปดาห์นี้ยังไม่มีรายจ่ายตามหมวด ลองบันทึกจากหน้าเงินและหนี้"
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


function renderCheckin() {
  return renderCheckinSummary();
}

function renderCheckinSummary() {
  const today = getEntry();
  const week = entriesInRange("week");
  const cfg = settings();
  const healthGoal = healthGoalsList()[0];
  const moneyGoal = moneyGoalsList()[0];
  const healthValue = healthGoal ? (healthGoal.id === "exercise" ? sum(week, "exercise") : Number(today[healthGoal.field] || 0)) : 0;
  const moneyValue = moneyGoal ? sum(entriesInRange("month"), moneyGoal.field) : 0;
  return `
    <div class="grid four">
      ${statCard("🔥 เช็คอินต่อเนื่อง", `${currentStreak()} วัน`, "นับจากวันที่มีบันทึก")}
      ${healthGoal ? statCard(iconLabel(healthGoal.id === "water" ? "health" : healthGoal.id, healthGoal.label), `${money(healthValue)} ${healthGoal.unit}`, `${healthGoal.period} เป้า ${money(cfg[healthGoal.targetKey])}`) : statCard("เป้าสุขภาพ", "ยังไม่ตั้ง", "เลือกข้อมูลใน Settings")}
      ${moneyGoal ? statCard(iconLabel("money", moneyGoal.label), `${money(moneyValue)} ${moneyGoal.unit}`, `${moneyGoal.period} เป้า ${money(cfg[moneyGoal.targetKey])}`) : statCard("เป้าการเงิน", "ยังไม่ตั้ง", "เลือกข้อมูลใน Settings")}
      ${statCard(iconLabel("win", "ชัยชนะวันนี้"), getEntry().win || "ยังรอชัยชนะเล็กๆ", "คลิกบันทึกเพื่อเติมเรื่องดีๆ")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">${dateLabel(selectedDate)}</p>
          <h2>เช็คอินวันนี้</h2>
        </div>
        <button class="primary-button" type="button" data-open-entry>เปิดแบบบันทึก</button>
      </div>
      ${renderDayDetail(selectedDate)}
    </div>
  `;
}

function renderMoney() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่มีข้อมูลหนี้และการเงิน", "ระบบจะไม่โชว์ยอดเงินใดๆ จนกว่าจะเริ่มบันทึกเอง");
  }
  const all = Object.entries(state.entries);
  const entries = entriesInRange("month");
  const cfg = settings();
  const monthExpense = entries.reduce((total, [, entry]) => total + expenseTotal(entry), 0);
  const debtPaid = sum(all, "debtPaid");
  const debtLeft = Math.max(0, cfg.debtTotal - debtPaid);
  const debtAngle = `${clamp((debtPaid / Math.max(cfg.debtTotal, 1)) * 100, 0, 100)}%`;
  const goals = moneyGoalsList();
  const categories = categoryTotals(entries);
  const cardDebt = entries.reduce((total, [, entry]) => total + cardDebtTotal(entry), 0);
  const income = sum(entries, "income");
  const saving = sum(entries, "saving");
  const investment = sum(entries, "investment");
  const netCashflow = income + sum(entries, "sideIncome") - monthExpense - debtPaid - saving - investment;
  const savingsRate = income > 0 ? Math.round(((saving + investment) / income) * 100) : 0;
  const debtRatio = income > 0 ? Math.round((debtPaid / income) * 100) : 0;
  return `
    <div class="financial-health-hero">
      <div>
        <p class="eyebrow">Financial health</p>
        <h2>ภาพรวมสุขภาพทางการเงินเดือนนี้</h2>
      </div>
      <div class="financial-score">
        <strong>${clamp(50 + savingsRate - Math.min(debtRatio, 40), 0, 100)}</strong>
        <span>คะแนน</span>
      </div>
    </div>
    <div class="grid four">
      ${statCard(iconLabel("income", "เงินเข้า"), `${money(income + sum(entries, "sideIncome"))} บาท`, "รายรับรวม")}
      ${statCard(iconLabel("expense", "เงินออก"), `${money(monthExpense)} บาท`, categories[0] ? `สูงสุด: ${escapeHTML(categories[0].category)}` : "รอข้อมูลตามหมวด")}
      ${statCard(iconLabel("win", "อัตราออม"), `${money(savingsRate)}%`, `ออม+ลงทุน ${money(saving + investment)} บาท`)}
      ${statCard(iconLabel("debt", "กระแสเงินสด"), `${money(netCashflow)} บาท`, netCashflow >= 0 ? "เหลือหลังจ่าย" : "ติดลบเดือนนี้")}
    </div>
    <div class="money-split">
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Financial goals</p>
            <h2>เป้าหมายเงินและหนี้</h2>
          </div>
          <div class="button-row">
          <button class="primary-button" type="button" data-open-entry>บันทึกการเงิน</button>
          </div>
        </div>
        <div class="money-goal-rings">
          ${goals.length ? goals.map((goal) => {
            const value = sum(entries, goal.field);
            return `
              <div class="mini-ring" style="--ring:${progressValue(value, cfg[goal.targetKey])}%">
                <div>${hugeIcon(goal.icon)}<strong>${money(value)}</strong><span>${goal.label}</span></div>
              </div>
            `;
          }).join("") : `<p class="muted">เลือกเป้าหมายเงินจากหน้า Settings เพื่อแสดงกราฟ</p>`}
        </div>
        ${cfg.debtTotal ? `
          <div class="debt-inline">
            <span>หนี้คงเหลือ</span>
            <strong>${money(debtLeft)} บาท</strong>
            <div class="bar"><span style="width:${debtAngle}"></span></div>
          </div>
        ` : ""}
      </div>
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Category spending</p>
            <h2>รายจ่ายตามหมวดที่มีข้อมูล</h2>
          </div>
          <span class="pill">${categories.length} หมวด</span>
        </div>
        <div class="category-bars">
          ${categories.map((item) => `
            <div class="category-bar">
              <div class="progress-meta"><span>${escapeHTML(item.category)}</span><strong>${money(item.amount)} บาท</strong></div>
              <div class="bar"><span style="width:${progressValue(item.amount, Math.max(categories[0]?.amount || 1, 1))}%"></span></div>
            </div>
          `).join("") || `<p class="muted">ยังไม่มีรายจ่ายเดือนนี้</p>`}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Cashflow story</p>
          <h2>เงินไหลเข้าออก</h2>
        </div>
        <span class="pill">เดือนนี้</span>
      </div>
      <div class="cashflow-bars">
        ${cashflowBar("เงินเข้า", income + sum(entries, "sideIncome"), "#a9dcc5")}
        ${cashflowBar("รายจ่าย", monthExpense, "#ffc39d")}
        ${cashflowBar("จ่ายหนี้", debtPaid + cardDebt, "#f5a7c6")}
        ${cashflowBar("ออม/ลงทุน", saving + investment, "#c6b2f2")}
      </div>
    </div>
    <div class="card">
      <h2>บันทึกล่าสุด</h2>
      <div class="timeline">
        ${all.slice(-8).reverse().map(([iso, entry]) => `
          <div class="timeline-item">
            <strong>${dateLabel(iso, "medium")}</strong> รายรับ ${money(entry.income)} / รายจ่าย ${money(expenseTotal(entry))} / จ่ายหนี้ ${money(entry.debtPaid)}
            ${getExpenseItems(entry).length ? `<div class="timeline-expenses">${getExpenseItems(entry).map((item) => `<span>${escapeHTML(item.category)}${item.paymentMethod ? ` · ${escapeHTML(item.paymentMethod)}` : ""} ${money(item.amount)}</span>`).join("")}</div>` : ""}
          </div>
        `).join("") || `<p class="muted">ยังไม่มีข้อมูลการเงิน</p>`}
      </div>
    </div>
  `;
}

function renderSideIncome() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่มีข้อมูลรายได้เสริม", "ช่องทางรายได้เสริมจะว่างจนกว่าจะเพิ่มช่องทางเอง");
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
      }).join("") : renderGuestEmptyState("ยังไม่มีช่องทางรายได้เสริม", "เพิ่มช่องทางได้จากหน้า Settings เช่น ขายของออนไลน์ รับงานเสริม หรือคอนเทนต์ออนไลน์")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Side income experiment</p>
          <h2>บันทึกการทดลอง</h2>
        </div>
        <div class="button-row">
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

function cashflowBar(label, value, color) {
  const entries = entriesInRange("month");
  const maxValue = Math.max(
    sum(entries, "income") + sum(entries, "sideIncome"),
    entries.reduce((total, [, entry]) => total + expenseTotal(entry), 0),
    sum(entries, "debtPaid"),
    sum(entries, "saving") + sum(entries, "investment"),
    1
  );
  return `
    <div class="cashflow-row" style="--cashflow:${progressValue(value, maxValue)}%;--cashflow-color:${color}">
      <span>${label}</span>
      <div class="bar"><span></span></div>
      <strong>${money(value)} บาท</strong>
    </div>
  `;
}

function renderHealth() {
  const entry = getEntry();
  const week = entriesInRange("week");
  const cfg = settings();
  const goals = healthGoalsList();
  const valueForGoal = (goal) => goal.id === "exercise" ? sum(week, "exercise") : Number(entry[goal.field] || 0);
  return `
    <div class="grid four">
      ${goals.length ? goals.slice(0, 4).map((goal) => statCard(iconLabel(goal.id === "water" ? "health" : goal.id, goal.label), `${money(valueForGoal(goal))} ${goal.unit}`, `${goal.period} เป้า ${money(cfg[goal.targetKey])}`)).join("") : renderGuestEmptyState("ยังไม่ได้เลือกเป้าหมายสุขภาพ", "ไปที่ Settings > ตั้งค่าข้อมูล เพื่อเลือกสิ่งที่อยากติดตาม")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Health & Beauty rhythm</p>
          <h2>🔥 streak การดูแลตัวเอง</h2>
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-open-entry>บันทึกสุขภาพ</button>
        </div>
      </div>
      <div class="progress-list">
        ${goals.map((goal) => renderProgress({ name: goal.label, type: goal.period, progress: valueForGoal(goal), target: cfg[goal.targetKey] })).join("") || `<p class="muted">ยังไม่มีเป้าหมายสุขภาพที่เลือกไว้</p>`}
      </div>
    </div>
  `;
}

function renderSkills() {
  if (isGuestEmptyState()) {
    return renderGuestEmptyState("ยังไม่มีทักษะและภาษาที่ตั้งไว้", "guest จะเห็น skill และภาษาเป้าหมายหลังจากเพิ่มรายการเอง");
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
          <h2>แผนเติบโตทักษะตามอาชีพ</h2>
        </div>
        <div class="button-row">
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
          <h2>ฝึกภาษา</h2>
        </div>
        <div class="button-row">
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

function renderMembership() {
  const hadTrial = Boolean(state.meta?.trialStartedAt);
  const trial = trialInfo();
  if (!hadTrial) saveState();
  const status = trial.active ? `เหลือ ${trial.daysLeft} วัน` : "หมดช่วงใช้ฟรีแล้ว";
  return `
    <div class="card membership-hero">
      <div class="section-head">
        <div>
          <p class="eyebrow">Mood Support</p>
          <h2>Mood ช่วยค่ากาแฟ</h2>
          <p class="muted">ทดลองใช้ฟรี 7 วัน แล้วถ้าช่วยให้ชีวิตจัดระเบียบขึ้น ค่อยช่วยค่ากาแฟเดือนละ 99 บาท</p>
        </div>
        <div class="button-row">
          <button class="ghost-button" type="button" data-open-auth>สมัคร / เข้าสู่ระบบ</button>
          <a class="primary-button" href="${COFFEE_STRIPE_URL}" target="_blank" rel="noreferrer">อุดหนุนค่ากาแฟ</a>
        </div>
      </div>
      <div class="grid three">
        ${statCard("ทดลองใช้ฟรี", status, `ถึง ${dateLabel(toISO(trial.end), "medium")}`)}
        ${statCard("ค่ากาแฟ", "99 บาท", "ต่อเดือน หลัง trial")}
        ${statCard("สถานะบัญชี", currentUser ? currentUser.email : "ยังไม่ได้เข้าสู่ระบบ", currentUser ? "จัดเก็บข้อมูลในบัญชี" : "ข้อมูลอยู่ในเครื่องนี้")}
      </div>
    </div>
    <div class="plan-compare">
      ${renderPlanCard("ฟรี", "0 บาท", [
        "บันทึกข้อมูลชีวิตประจำวันในเครื่องนี้",
        "เปิด/ปิดฟีเจอร์ที่ใช้จริง",
        "ดู dashboard พื้นฐานและปฏิทินย้อนหลัง",
        "ทดลองทุกฟีเจอร์ครบ 7 วัน"
      ])}
      ${renderPlanCard("ช่วยค่ากาแฟ", "99 บาท / เดือน", [
        "ใช้ทุกฟีเจอร์ต่อหลังครบ trial",
        "จัดเก็บข้อมูลกับบัญชีของคุณ",
        "ปรับหมวดรายจ่ายและวิธีจ่ายเงินเอง",
        "จัดลำดับ section หน้าแรกให้เข้ากับ workflow",
        "อุดหนุนผู้พัฒนาเพื่อให้แอปเติบโตต่อ"
      ], true)}
    </div>
  `;
}

function renderPlanCard(title, price, items, featured = false) {
  return `
    <article class="plan-card ${featured ? "featured" : ""}">
      <div>
        <p class="eyebrow">${featured ? "Recommended" : "Start"}</p>
        <h2>${title}</h2>
        <strong class="plan-price">${price}</strong>
      </div>
      <ul>
        ${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function renderSettingsPage() {
  return `
    <div class="settings-layout">
      <div class="section-head">
        <div>
          <p class="eyebrow">Settings</p>
          <h2>ฟีเจอร์และเป้าหมาย</h2>
        </div>
        <button class="primary-button" type="submit" form="featureSettingsForm">บันทึกฟีเจอร์</button>
      </div>
      <form id="featureSettingsForm" class="feature-toggle-grid">
        ${DEFAULT_FEATURES.map(renderFeatureSettingCard).join("")}
      </form>
    </div>
  `;
}

function renderFeatureSettingCard(id) {
  const page = pages.find((item) => item.id === id);
  const enabled = isFeatureEnabled(id);
  return `
    <article class="feature-setting-card ${enabled ? "enabled" : ""}">
      <label class="feature-toggle">
        <input type="checkbox" name="enabledFeature" value="${id}" ${enabled ? "checked" : ""} />
        <span>
          <strong>${page?.label || id}</strong>
          <small>${enabled ? "เปิดใช้งาน" : "ปิดอยู่"}</small>
        </span>
      </label>
      ${enabled ? renderFeatureConfigPanel(id) : `<p class="muted setting-muted">เปิดเพื่อกำหนดข้อมูลและเป้าหมาย</p>`}
    </article>
  `;
}

function renderFeatureConfigPanel(id) {
  const groups = FEATURE_SETTING_GROUPS[id] || [];
  const summary = featureSettingSummary(id);
  return `
    <div class="feature-config-panel">
      <table class="settings-table">
        <tbody>
          ${summary.map((item) => `<tr><th>${escapeHTML(item.split(":")[0])}</th><td>${escapeHTML(item.includes(":") ? item.split(":").slice(1).join(":").trim() : item)}</td></tr>`).join("") || `<tr><th>ข้อมูล</th><td>ยังไม่มีข้อมูล</td></tr>`}
        </tbody>
      </table>
      <div class="settings-submenu">
        ${groups.map((item) => `<button class="settings-link" type="button" data-open-setting="${item.group}">${hugeIcon(item.icon)} ${item.label}</button>`).join("")}
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
      ${isFeatureEnabled("checkin") ? `<span class="pill">${iconLabel("mood", `อารมณ์ ${entry.mood || "-"}`)}</span>` : ""}
      ${isFeatureEnabled("health") ? `<span class="pill">${iconLabel("health", `น้ำ ${Number(entry.water || 0)} แก้ว`)}</span>` : ""}
      ${isFeatureEnabled("health") ? `<span class="pill">${iconLabel("exercise", `ออกกำลัง ${Number(entry.exercise || 0)} นาที`)}</span>` : ""}
      ${isFeatureEnabled("money") ? `<span class="pill">${iconLabel("income", `รายรับ ${money(entry.income)} บาท`)}</span>` : ""}
      ${isFeatureEnabled("money") ? `<span class="pill">${iconLabel("expense", `รายจ่าย ${money(expenseTotal(entry))} บาท`)}</span>` : ""}
      ${isFeatureEnabled("side") ? `<span class="pill">${iconLabel("side", `รายได้เสริม ${money(entry.sideIncome)} บาท`)}</span>` : ""}
      ${isFeatureEnabled("money") ? `<span class="pill">${iconLabel("debt", `จ่ายหนี้ ${money(entry.debtPaid)} บาท`)}</span>` : ""}
      ${isFeatureEnabled("skills") ? `<span class="pill">ภาษา ${languageTotal(entry)} นาที</span>` : ""}
    </div>
    ${isFeatureEnabled("money") && expenses.length ? `
      <div class="expense-list">
        ${expenses.map((item) => `
          <span>${escapeHTML(item.category)}${item.paymentMethod ? ` · ${escapeHTML(item.paymentMethod)}` : ""}<strong>${money(item.amount)} บาท</strong></span>
        `).join("")}
      </div>
    ` : ""}
    ${isFeatureEnabled("checkin") ? `<p style="margin:14px 0 0;"><strong>${iconLabel("win", "ชัยชนะเล็กๆ:")}</strong> ${entry.win || "ยังไม่ได้บันทึก"}</p>` : ""}
    ${isFeatureEnabled("skills") ? `<p class="muted" style="margin:8px 0 0;">${iconLabel("career", `ทักษะ: ${(entry.skills || []).join(", ") || "-"}`)}</p>` : ""}
    ${isFeatureEnabled("skills") ? `<p class="muted" style="margin:8px 0 0;">ภาษา: ${languagesList().map((language) => `${escapeHTML(language)} ${money(getLanguageMinutes(entry, language))} นาที`).join(" / ") || "-"} ${entry.languageFocus ? `(${entry.languageFocus})` : ""}</p>` : ""}
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
    return renderGuestEmptyState("ยังไม่มีภาษาเป้าหมาย", "ภาษาที่อยากเรียนจะยังว่างจนกว่าจะเพิ่มภาษาเอง");
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
          <button class="primary-button" type="button" data-open-entry data-modal="language">บันทึกภาษา</button>
        </div>
      </div>
      <div class="language-layout">
        <div class="language-orbit" style="--thai:${progressValue(primaryLanguage?.minutes || 0, total || cfg.languageWeeklyTarget)}%;--arabic:${progressValue(secondaryLanguage?.minutes || 0, total || cfg.languageWeeklyTarget)}%">
          <div class="language-core">
            <strong>${money(total)}</strong>
            <span>นาที</span>
          </div>
          <span class="language-badge thai">${escapeHTML(primaryLanguage?.language || "ภาษา")}</span>
          <span class="language-badge arabic">${escapeHTML(secondaryLanguage?.language || "เพิ่มภาษา")}</span>
        </div>
        <div class="language-progress">
          ${languageTotals.map((item, index) => languageProgress(escapeHTML(item.language), item.minutes, cfg.languageWeeklyTarget, index % 2 ? "#c6b2f2" : "#a9dcc5")).join("")}
          ${languageProgress("รวมสัปดาห์นี้", weekTotal, cfg.languageWeeklyTarget, "#f5a7c6")}
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
  const points = items.map((item, index) => radarPoint(index, items.length, clamp(item.score, 0, 100))).join(" ");
  const averageScore = average(items.map((item) => item.score));
  const grid = [100, 70, 40].map((score) => items.map((_, index) => radarPoint(index, items.length, score)).join(" "));
  return `
    <div class="life-radar">
      <div class="radar-panel" aria-label="กราฟแมงมุมพลังชีวิตเฉลี่ย ${averageScore} เปอร์เซ็นต์">
        <svg viewBox="0 0 320 320" role="img" aria-hidden="true">
          <polygon class="radar-grid" points="${grid[0]}" />
          <polygon class="radar-grid inner" points="${grid[1]}" />
          <polygon class="radar-grid inner faint" points="${grid[2]}" />
          ${items.map((_, index) => {
            const [x, y] = radarPoint(index, items.length, 100).split(",");
            return `<line class="radar-axis" x1="160" y1="160" x2="${x}" y2="${y}" />`;
          }).join("")}
          <polygon class="radar-area" points="${points}" />
          <polyline class="radar-line" points="${points} ${points.split(" ")[0]}" />
          ${items.map((item, index) => {
            const point = radarPoint(index, items.length, clamp(item.score, 0, 100));
            const [x, y] = point.split(",");
            return `<circle class="radar-point" cx="${x}" cy="${y}" r="7" style="--point-color:${item.color}" />`;
          }).join("")}
          ${items.map((item, index) => {
            const [x, y] = radarPoint(index, items.length, 118).split(",");
            return `<text class="radar-label" x="${x}" y="${y}">${item.label}</text>`;
          }).join("")}
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

function radarPoint(index, count, score) {
  const center = 160;
  const radius = 124 * (score / 100);
  const safeCount = Math.max(count, 3);
  const angle = ((-90 + (360 / safeCount) * index) * Math.PI) / 180;
  const x = Math.round(center + Math.cos(angle) * radius);
  const y = Math.round(center + Math.sin(angle) * radius);
  return `${x},${y}`;
}

function moneyMixChart(entries) {
  const categories = categoryTotals(entries);
  const categoryExpense = categories.reduce((amount, item) => amount + item.amount, 0);
  const items = [
    { key: "income", icon: "income", label: "รายรับหลัก", value: sum(entries, "income"), color: "#a9dcc5" },
    { key: "sideIncome", icon: "side", label: "รายได้เสริม", value: sum(entries, "sideIncome"), color: "#c6b2f2" },
    { key: "expense", icon: "expense", label: "รายจ่ายรวม", value: categoryExpense, color: "#ffc39d" },
    { key: "debt", icon: "debt", label: "จ่ายหนี้", value: sum(entries, "debtPaid"), color: "#f5a7c6" }
  ];
  const total = items.reduce((amount, item) => amount + item.value, 0);
  let cursor = 0;
  const stops = items.map((item) => {
    const start = cursor;
    const size = total ? (item.value / total) * 100 : 0;
    cursor += size;
    return `${item.color} ${start}% ${cursor}%`;
  }).join(", ");
  const incomeTotal = items[0].value + items[1].value;
  const outflowTotal = items[2].value + items[3].value + sum(entries, "saving") + sum(entries, "investment");
  const net = incomeTotal - outflowTotal;

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
          ${miniSummary(iconLabel("expense", "เงินออก"), `${money(outflowTotal)} บาท`)}
          ${miniSummary(iconLabel(net >= 0 ? "win" : "debt", net >= 0 ? "เหลือเก็บ" : "ติดลบ"), `${money(Math.abs(net))} บาท`)}
        </div>
        <div class="category-bars">
          ${categories.slice(0, 5).map((item) => `
            <div class="category-bar">
              <div class="progress-meta"><span>${escapeHTML(item.category)}</span><strong>${money(item.amount)} บาท</strong></div>
              <div class="bar"><span style="width:${progressValue(item.amount, Math.max(categories[0]?.amount || 1, 1))}%"></span></div>
            </div>
          `).join("") || `<p class="muted">ยังไม่มีรายจ่ายตามหมวด</p>`}
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
  document.querySelectorAll("[data-open-auth]").forEach((button) => {
    button.addEventListener("click", openAuthModal);
  });
  document.querySelectorAll("[data-jump-page]").forEach((button) => {
    button.addEventListener("click", () => {
      activePage = button.dataset.jumpPage;
      render();
    });
  });
  document.querySelectorAll("[data-move-section]").forEach((button) => {
    button.addEventListener("click", () => moveDashboardSection(button.dataset.moveSection, Number(button.dataset.direction || 0)));
  });
  document.querySelectorAll("[data-dashboard-manage]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.dashboardManage === "start") startDashboardManage();
      if (button.dataset.dashboardManage === "cancel") cancelDashboardManage();
      if (button.dataset.dashboardManage === "save") saveDashboardManage();
    });
  });
  const featureForm = $("#featureSettingsForm");
  if (featureForm) featureForm.addEventListener("submit", handleFeatureSettingsSubmit);
}

function handleFeatureSettingsSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  settings().enabledFeatures = data.getAll("enabledFeature").filter((id) => DEFAULT_FEATURES.includes(id));
  saveState();
  syncSettings();
  render();
}

function openEntryModal(category = activePage) {
  const modal = $("#entryModal");
  const form = $("#entryForm");
  modalCategory = activeEntryCategory(category);
  if (modalCategory === "goals" && !modal.open) selectedDate = toISO(new Date());
  const entry = getEntry();
  const config = modalConfigs[modalCategory];
  const fields = featureFields(config.fields);
  $("#modalDateLabel").textContent = dateLabel(selectedDate);
  const dateInput = $("#modalDateInput");
  if (dateInput) {
    dateInput.value = selectedDate;
    dateInput.onchange = () => {
      selectedDate = dateInput.value || toISO(new Date());
      openEntryModal(modalCategory);
    };
  }
  $("#modalTitle").textContent = config.title;
  $("#modalDescription").textContent = config.description;
  $("#modalFields").innerHTML = fields.length
    ? renderModalFields(fields)
    : `<p class="muted">ตอนนี้ยังไม่มี field ให้บันทึก เพราะฟีเจอร์ที่เกี่ยวข้องถูกปิดไว้ในหน้า Settings</p>`;
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
  if (!modal.open) modal.showModal();
}

function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const config = modalConfigs[modalCategory] || modalConfigs.checkin;
  const fields = featureFields(config.fields);
  const existing = getEntry();
  const nextEntry = { ...existing };
  let shouldSyncSettings = false;

  fields.forEach((field) => {
    if (field === "skills") {
      nextEntry.skills = data.getAll("skills");
      return;
    }
    if (field === "expenseRows") {
      const categories = data.getAll("expenseCategory");
      const amounts = data.getAll("expenseAmount");
      const paymentMethods = data.getAll("expensePaymentMethod");
      const previousCardDebt = cardDebtTotal(existing);
      const items = categories.map((category, index) => ({
        category: expenseCategoriesList().includes(category) ? category : "",
        amount: Number(amounts[index] || 0),
        paymentMethod: paymentMethodsList().includes(paymentMethods[index]) ? paymentMethods[index] : ""
      })).filter((item) => item.category && item.amount > 0);
      const totals = expenseTotals(items);
      nextEntry.expenseItems = items;
      nextEntry.essential = totals.essential;
      nextEntry.nonEssential = totals.nonEssential;
      nextEntry.sweetDrink = totals.sweetDrink;
      const nextCardDebt = cardDebtTotal(nextEntry);
      const debtDelta = nextCardDebt - previousCardDebt;
      if (debtDelta) {
        settings().debtTotal = Math.max(0, Number(settings().debtTotal || 0) + debtDelta);
        shouldSyncSettings = true;
      }
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
  if (shouldSyncSettings) syncSettings();
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
          <option value="">เลือกอารมณ์ (กรอกข้อมูล)</option>
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
    calories: textInput("calories", "แคลลอรี่", "numeric", "[0-9]*"),
    income: textInput("income", "รายรับ", "decimal"),
    expenseRows: renderExpenseRows(),
    debtPaid: textInput("debtPaid", "จ่ายหนี้วันนี้", "decimal"),
    saving: textInput("saving", "ออมเงินวันนี้", "decimal"),
    investment: textInput("investment", "ลงทุนวันนี้", "decimal"),
    sideIncome: textInput("sideIncome", "รายได้เสริม", "decimal"),
    languageMinutes: renderLanguageMinuteFields(),
    languageFocus: `
      <label>
        โฟกัสการฝึก
        <select name="languageFocus">
          <option value="">เลือกโฟกัส (กรอกข้อมูล)</option>
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
          <option value="">เลือกช่องทาง (กรอกข้อมูล)</option>
          ${sideChannelsList().map((channel) => `<option value="${escapeHTML(channel)}">${escapeHTML(channel)}</option>`).join("")}
        </select>
        ${sideChannelsList().length ? "" : `<span class="field-hint">ยังไม่มีช่องทาง เพิ่มได้จากหน้า Settings</span>`}
      </label>
    `,
    confidence: textInput("confidence", "ความมั่นใจ (1-10)", "numeric", "[0-9]*"),
    win: `
      <label class="wide-label">
        ชัยชนะเล็กๆ / note ของหมวดนี้
        <textarea name="win" rows="3" placeholder="เช่น ทำสิ่งสำคัญเสร็จ 1 อย่าง / เดิน 20 นาที / เก็บเงินได้ตามตั้งใจ"></textarea>
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
            <small>เพิ่มภาษาได้จากหน้า Settings</small>
          </div>
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
      </div>
      <div class="form-grid">
        ${languages.map((language) => `
          <label>
            ${escapeHTML(language)} (นาที)
            <input name="languageMinutes:${escapeHTML(language)}" type="text" inputmode="numeric" pattern="[0-9]*" value="${getLanguageMinutes(entry, language) || ""}" placeholder="กรอกข้อมูล" />
          </label>
        `).join("")}
      </div>
    </section>
  `;
}

function renderExpenseRows(items = getExpenseItems(getEntry())) {
  const rows = items.length ? items : [{ category: "", amount: "" }];
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

function renderExpenseRow(item = { category: "", amount: "" }) {
  return `
    <div class="expense-row">
      <label>
        หมวดหมู่
        <select name="expenseCategory">
          <option value="" ${item.category ? "" : "selected"}>เลือกหมวด (กรอกข้อมูล)</option>
          ${expenseCategoriesList().map((category) => `<option value="${escapeHTML(category)}" ${category === item.category ? "selected" : ""}>${escapeHTML(category)}</option>`).join("")}
        </select>
      </label>
      <label>
        วิธีจ่ายเงิน
        <select name="expensePaymentMethod">
          <option value="" ${item.paymentMethod ? "" : "selected"}>เลือกวิธีจ่าย (กรอกข้อมูล)</option>
          ${paymentMethodsList().map((method) => `<option value="${escapeHTML(method)}" ${method === item.paymentMethod ? "selected" : ""}>${escapeHTML(method)}${isDebtPaymentMethod(method) ? " • เพิ่มหนี้" : ""}</option>`).join("")}
        </select>
      </label>
      <label>
        จำนวนเงิน
        <input name="expenseAmount" type="text" inputmode="decimal" value="${Number(item.amount || 0) || ""}" placeholder="กรอกข้อมูล" />
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
      <input name="skillName" type="text" value="${escapeHTML(skill)}" placeholder="เช่น การสื่อสาร" />
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
          <small>เพิ่มภาษาเองได้ เช่น อังกฤษ ญี่ปุ่น จีน เกาหลี หรือภาษาอื่นๆ</small>
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

function renderExpenseCategoryEditor() {
  const categories = expenseCategoriesList();
  const rows = categories.length ? categories : [""];
  return `
    <section class="skill-editor wide-label">
      <div class="skill-editor-head">
        <div>
          <span>หมวดรายจ่าย</span>
          <small>เพิ่มหมวดเองได้ เช่น ค่าเรียน ค่าสกินแคร์ หรือค่าเดินทาง</small>
        </div>
        <button class="tiny-button" type="button" data-add-expense-category-row>เพิ่มหมวด</button>
      </div>
      <div class="skill-rows" data-expense-category-rows>
        ${rows.map((category) => renderExpenseCategoryRow(category)).join("")}
      </div>
    </section>
  `;
}

function renderExpenseCategoryRow(category = "") {
  return `
    <div class="skill-row">
      <input name="expenseCategoryName" type="text" value="${escapeHTML(category)}" placeholder="เช่น ค่าเรียน" />
      <button class="icon-button skill-remove" type="button" data-remove-expense-category-row aria-label="ลบหมวด">×</button>
    </div>
  `;
}

function renderPaymentMethodEditor() {
  const methods = paymentMethodsList();
  const rows = methods.length ? methods : [""];
  return `
    <section class="skill-editor wide-label">
      <div class="skill-editor-head">
        <div>
          <span>วิธีจ่ายเงิน</span>
          <small>ติ๊ก “เพิ่มยอดหนี้” สำหรับบัตรเครดิตหรือวิธีจ่ายที่ควรบวกเข้า debt total</small>
        </div>
        <button class="tiny-button" type="button" data-add-payment-method-row>เพิ่มวิธีจ่าย</button>
      </div>
      <div class="skill-rows" data-payment-method-rows>
        ${rows.map((method) => renderPaymentMethodRow(method)).join("")}
      </div>
    </section>
  `;
}

function renderPaymentMethodRow(method = "") {
  return `
    <div class="skill-row payment-method-row">
      <input name="paymentMethodName" type="text" value="${escapeHTML(method)}" placeholder="เช่น บัตรเครดิต KTC" />
      <label class="inline-check">
        <input type="checkbox" name="debtPaymentMethod" value="${escapeHTML(method)}" ${method && isDebtPaymentMethod(method) ? "checked" : ""} />
        เพิ่มยอดหนี้
      </label>
      <button class="icon-button skill-remove" type="button" data-remove-payment-method-row aria-label="ลบวิธีจ่าย">×</button>
    </div>
  `;
}

function renderGoalMasterEditor(type) {
  const goalOptions = type === "health" ? HEALTH_GOAL_MASTER : MONEY_GOAL_MASTER;
  const selected = new Set(type === "health" ? settings().healthGoalIds : settings().moneyGoalIds);
  const title = type === "health" ? "ตั้งค่าข้อมูลสุขภาพ" : "ตั้งค่าข้อมูลสุขภาพทางการเงิน";
  return `
    <section class="skill-editor wide-label">
      <div class="skill-editor-head">
        <div>
          <span>${title}</span>
          <small>เลือกเฉพาะข้อมูลที่อยากติดตาม ระบบจะใช้รายการนี้สร้างฟอร์มและกราฟ</small>
        </div>
      </div>
      <div class="master-goal-grid" role="table">
        ${goalOptions.map((goal) => `
          <div class="master-goal-card" role="row">
            <label class="master-check">
              <input type="checkbox" name="${type}GoalId" value="${goal.id}" ${selected.has(goal.id) ? "checked" : ""} />
              <span class="feature-icon">${hugeIcon(goal.icon)}</span>
              <strong>${goal.label}</strong>
              <small>${goal.period}</small>
            </label>
            <label class="master-target-field">
              เป้าหมาย
              <input name="${goal.targetKey}" type="text" inputmode="decimal" value="${settings()[goal.targetKey] ?? 0}" />
              <small>${goal.unit}</small>
            </label>
          </div>
        `).join("")}
      </div>
    </section>
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

function bindExpenseCategoryRows() {
  const rows = $("[data-expense-category-rows]");
  if (!rows) return;
  const syncRemoveButtons = () => {
    const buttons = [...rows.querySelectorAll("[data-remove-expense-category-row]")];
    buttons.forEach((button) => {
      button.disabled = buttons.length <= 1;
    });
  };

  const addButton = $("[data-add-expense-category-row]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      rows.insertAdjacentHTML("beforeend", renderExpenseCategoryRow());
      rows.querySelector(".skill-row:last-child input").focus();
      syncRemoveButtons();
    });
  }

  rows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-expense-category-row]");
    if (!button || rows.children.length <= 1) return;
    button.closest(".skill-row").remove();
    syncRemoveButtons();
  });

  syncRemoveButtons();
}

function bindPaymentMethodRows() {
  const rows = $("[data-payment-method-rows]");
  if (!rows) return;
  const syncRemoveButtons = () => {
    const buttons = [...rows.querySelectorAll("[data-remove-payment-method-row]")];
    buttons.forEach((button) => {
      button.disabled = buttons.length <= 1;
    });
  };

  const addButton = $("[data-add-payment-method-row]");
  if (addButton) {
    addButton.addEventListener("click", () => {
      rows.insertAdjacentHTML("beforeend", renderPaymentMethodRow());
      rows.querySelector(".skill-row:last-child input").focus();
      syncRemoveButtons();
    });
  }

  rows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-payment-method-row]");
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
      <input name="${name}" type="text" inputmode="${inputMode}" ${pattern ? `pattern="${pattern}"` : ""} placeholder="กรอกข้อมูล" />
    </label>
  `;
}

function visibleFieldsForSetting(config) {
  return config.fields.filter((field) => {
    if (["waterDailyTarget", "exerciseWeeklyTarget", "sleepTarget", "confidenceTarget", "calorieDailyTarget"].includes(field.key)) return isFeatureEnabled("health");
    if (["debtMonthlyTarget", "savingMonthlyTarget", "investmentMonthlyTarget"].includes(field.key)) return isFeatureEnabled("money");
    if (["sideIncomeMonthlyTarget", "sideIncomeWeeklyTarget", "sideIncomeYearlyTarget", "sideChannelMonthlyTarget"].includes(field.key)) return isFeatureEnabled("side");
    if (["careerTargetDays", "skillTargetDays", "languageDailyTarget", "languageWeeklyTarget"].includes(field.key)) return isFeatureEnabled("skills");
    return true;
  });
}

function openSettingModal(group = "debt") {
  const config = settingGroups[group] || settingGroups.debt;
  settingGroup = group;
  $("#settingTitle").textContent = config.title;
  $("#settingDescription").textContent = config.description;
  const visibleSettingFields = visibleFieldsForSetting(config);
  const useMasterTargetCards = ["health", "moneyGoals"].includes(group);
  const genericFields = useMasterTargetCards ? "" : visibleSettingFields.map((field) => `
    <label>
      ${field.label}
      <input name="${field.key}" type="text" inputmode="decimal" value="${settings()[field.key] ?? 0}" />
      <span class="field-hint">${field.suffix}</span>
    </label>
  `).join("");
  $("#settingFields").innerHTML = `${genericFields}${(group === "goals" || group === "health") && isFeatureEnabled("health") ? renderGoalMasterEditor("health") : ""}${(group === "goals" || group === "moneyGoals") && isFeatureEnabled("money") ? renderGoalMasterEditor("money") : ""}${group === "side" ? renderSideChannelEditor() : ""}${group === "skills" ? renderSkillEditor() : ""}${group === "language" ? renderLanguageEditor() : ""}${group === "financeOptions" ? `${renderExpenseCategoryEditor()}${renderPaymentMethodEditor()}` : ""}`;
  if (group === "side") bindSideChannelRows();
  if (group === "skills") bindSkillRows();
  if (group === "language") bindLanguageRows();
  if (group === "financeOptions") {
    bindExpenseCategoryRows();
    bindPaymentMethodRows();
  }
  $("#settingModal").showModal();
}

function handleSettingSubmit(event) {
  event.preventDefault();
  const config = settingGroups[settingGroup] || settingGroups.debt;
  const data = new FormData(event.currentTarget);
  visibleFieldsForSetting(config).forEach((field) => {
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
  if (settingGroup === "goals" || settingGroup === "health") {
    settings().healthGoalIds = data.getAll("healthGoalId").filter((id) => HEALTH_GOAL_MASTER.some((goal) => goal.id === id));
  }
  if (settingGroup === "goals" || settingGroup === "moneyGoals") {
    settings().moneyGoalIds = data.getAll("moneyGoalId").filter((id) => MONEY_GOAL_MASTER.some((goal) => goal.id === id));
  }
  if (settingGroup === "financeOptions") {
    const nextCategories = [...new Set(data.getAll("expenseCategoryName").map((category) => category.trim()).filter(Boolean))];
    const paymentRows = [...document.querySelectorAll("[data-payment-method-rows] .payment-method-row")];
    const nextMethods = [];
    const nextDebtMethods = [];
    paymentRows.forEach((row) => {
      const method = row.querySelector('input[name="paymentMethodName"]')?.value.trim();
      if (!method || nextMethods.includes(method)) return;
      nextMethods.push(method);
      if (row.querySelector('input[name="debtPaymentMethod"]')?.checked) nextDebtMethods.push(method);
    });
    settings().expenseCategoryNames = nextCategories;
    settings().paymentMethodNames = nextMethods;
    settings().debtPaymentMethods = nextDebtMethods;
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
  if (settingGroup === "financeOptions") {
    settings().expenseCategoryNames = [...DEFAULT_EXPENSE_CATEGORIES];
    settings().paymentMethodNames = [...DEFAULT_PAYMENT_METHODS];
    settings().debtPaymentMethods = [...DEFAULT_DEBT_PAYMENT_METHODS];
  }
  if (settingGroup === "goals" || settingGroup === "health") {
    settings().healthGoalIds = HEALTH_GOAL_MASTER.map((item) => item.id);
  }
  if (settingGroup === "goals" || settingGroup === "moneyGoals") {
    settings().moneyGoalIds = MONEY_GOAL_MASTER.map((item) => item.id);
  }
  saveState();
  syncSettings();
  $("#settingModal").close();
  render();
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
  const mockSkills = [...DEFAULT_SKILLS, "การอ่าน"];
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const sample = (items) => items[randomInt(0, items.length - 1)];
  const maybe = (chance) => Math.random() < chance;
  const randomAmount = (min, max, step = 5) => Math.round(randomInt(min, max) / step) * step;
  const mockDayCount = randomInt(18, 28);
  return Object.fromEntries(Array.from({ length: mockDayCount }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (mockDayCount - 1 - index));
    const iso = toISO(day);
    const sideIncome = maybe(0.38) ? randomAmount(120, 950, 10) : 0;
    const debtPaid = maybe(0.28) ? randomAmount(300, 1800, 100) : 0;
    const sweetDrink = maybe(0.42) ? randomAmount(25, 95, 5) : 0;
    const expenseItems = [
      { category: "ข้าวเที่ยง", amount: randomAmount(55, 120, 5) },
      { category: "ข้าวเย็น", amount: maybe(0.48) ? randomAmount(60, 140, 5) : 0 },
      { category: "ค่ารถ", amount: maybe(0.62) ? randomAmount(20, 80, 5) : 0 },
      { category: "ค่าใช้จ่ายภายในบ้าน", amount: maybe(0.18) ? randomAmount(120, 650, 10) : 0 },
      { category: "กาแฟ", amount: maybe(0.32) ? randomAmount(35, 95, 5) : 0 },
      { category: "ขนม7-11", amount: maybe(0.34) ? randomAmount(20, 120, 5) : 0 },
      { category: "น้ำหวาน", amount: sweetDrink }
    ].filter((item) => item.amount > 0).map((item) => ({
      ...item,
      paymentMethod: maybe(0.22) ? "บัตรเครดิต" : "เงินสด"
    }));
    const totals = expenseTotals(expenseItems);
    const practicedSkills = mockSkills.filter(() => maybe(0.24)).slice(0, randomInt(0, 2));
    const thaiMinutes = maybe(0.56) ? randomInt(10, 45) : 0;
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
      arabicMinutes: 0,
      languageMinutes: {},
      languageFocus: sample(mockFocuses),
      skills: practicedSkills,
      win: sample(mockWins)
    }];
  }));
}

function applyRandomMockData() {
  currentUser = null;
  isCloudLoading = false;
  state = normalizeState({
    entries: createMockEntries(),
    meta: { kind: "guest", mockData: true, generatedAt: new Date().toISOString() },
    settings: {
      ...DEFAULT_SETTINGS,
      skillNames: [...DEFAULT_SKILLS, "การอ่าน"],
      languageNames: ["อังกฤษ"],
      sideChannelNames: [...DEFAULT_SIDE_CHANNELS],
      enabledFeatures: [...DEFAULT_FEATURES],
      expenseCategoryNames: [...DEFAULT_EXPENSE_CATEGORIES],
      paymentMethodNames: [...DEFAULT_PAYMENT_METHODS],
      debtPaymentMethods: [...DEFAULT_DEBT_PAYMENT_METHODS]
    }
  }, DEFAULT_SETTINGS);
  selectedDate = toISO(new Date());
  calendarCursor = new Date();
  saveState();
  updateAuthUI();
  render();
}

function createMockData() {
  applyRandomMockData();
  if (supabaseClient) supabaseClient.auth.signOut().catch(() => {});
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


function openAuthModal() {
  setAuthMode("login");
  setAuthMessage(currentUser ? `กำลังเชื่อมกับ ${currentUser.email}` : "");
  if (currentUser) $("#authDescription").textContent = "บัญชีนี้กำลังจัดเก็บข้อมูลให้คุณ";
  $("#authModal").showModal();
}

function handleAuthButtonClick() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  const menu = $("#profileMenu");
  if (menu) menu.hidden = !menu.hidden;
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  if (authMode === "signup") {
    await signUpUser();
    return;
  }
  if (!supabaseClient) {
    setAuthMessage("ระบบบัญชียังไม่พร้อม", true);
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
  $("#authModal").close();
}

async function signUpUser() {
  if (!supabaseClient) {
    setAuthMessage("ระบบบัญชียังไม่พร้อม", true);
    return;
  }
  const form = $("#authForm");
  const data = new FormData(form);
  const name = (data.get("name") || "").trim();
  const email = (data.get("email") || "").trim();
  const password = data.get("password") || "";
  const confirmPassword = data.get("confirmPassword") || "";
  if (!name || !email || !password || !confirmPassword) {
    setAuthMessage("กรอก name, email, password และ confirm password ให้ครบก่อนสมัคร", true);
    return;
  }
  if (password !== confirmPassword) {
    setAuthMessage("password และ confirm password ไม่ตรงกัน", true);
    return;
  }
  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) {
    setAuthMessage(error.message, true);
    return;
  }
  state.meta = { ...(state.meta || {}), trialStartedAt: new Date().toISOString(), trialDays };
  settings().enabledFeatures = [...DEFAULT_FEATURES];
  saveState();
  syncSettings();
  $("#authModal").close();
}

async function signOutUser() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  state = loadGuestState();
  updateAuthUI();
  setAuthMessage("ออกจากระบบแล้ว ตอนนี้กำลังดูข้อมูล guest แยกจากบัญชีที่ login");
  if ($("#authModal").open) $("#authModal").close();
  render();
}

$("#entryForm").addEventListener("submit", handleSubmit);
$("#settingForm").addEventListener("submit", handleSettingSubmit);
$("#authForm").addEventListener("submit", handleAuthSubmit);
$("#authButton").addEventListener("click", handleAuthButtonClick);
$("#closeAuthButton").addEventListener("click", () => $("#authModal").close());
$("#signUpButton").addEventListener("click", () => setAuthMode(authMode === "signup" ? "login" : "signup"));
$("#signOutButton").addEventListener("click", signOutUser);
$("#profileLogoutButton")?.addEventListener("click", signOutUser);
$("#quickAddButton").addEventListener("click", () => openEntryModal(activeEntryCategory(activePage)));
$("#closeModalButton").addEventListener("click", () => $("#entryModal").close());
$("#closeSettingButton").addEventListener("click", () => $("#settingModal").close());
$("#cancelConfirmButton").addEventListener("click", () => $("#confirmModal").close());
$("#confirmActionButton").addEventListener("click", runPendingConfirmAction);
$("#resetSettingsButton").addEventListener("click", resetSettingGroup);
$("#clearDayButton").addEventListener("click", () => {
  const removedCardDebt = cardDebtTotal(getEntry(selectedDate));
  if (removedCardDebt) {
    settings().debtTotal = Math.max(0, Number(settings().debtTotal || 0) - removedCardDebt);
    syncSettings();
  }
  delete state.entries[selectedDate];
  saveState();
  deleteCloudEntry(selectedDate);
  $("#entryModal").close();
  render();
});
$("#clearTargetsButton")?.addEventListener("click", clearTargetValues);

render();
initSupabase();
