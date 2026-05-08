const STORAGE_KEY = "bloom-ux-life-tracker-v2";
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
  nonEssentialLimit: 6000,
  sweetDrinkLimit: 1200,
  trendExerciseTarget: 45,
  trendNonEssentialLimit: 500
};

const pages = [
  { id: "dashboard", label: "หน้าแรก", icon: "⌂", title: "แดชบอร์ด", cover: "assets/dashboard.svg", kicker: "ภาพรวมวันนี้", quote: "ทุกบันทึกเล็กๆ คือหลักฐานว่าเรากำลังดูแลอนาคตของตัวเอง" },
  { id: "goals", label: "เป้าหมาย", icon: "◎", title: "เป้าหมาย", cover: "assets/goals.svg", kicker: "ออกแบบชีวิตแบบมี milestone", quote: "เป้าหมายที่ดีไม่กดดันเรา แต่มันชวนเราเดินต่ออย่างชัดเจน" },
  { id: "checkin", label: "เช็คอินวันนี้", icon: "✓", title: "เช็คอินวันนี้", cover: "assets/checkin.svg", kicker: "บันทึกตัวเองอย่างอ่อนโยน", quote: "วันนี้ไม่ต้องสมบูรณ์แบบ แค่ซื่อสัตย์กับตัวเองก็พอ" },
  { id: "money", label: "เงิน & หนี้", icon: "฿", title: "เงิน & หนี้", cover: "assets/money.svg", kicker: "ปิดหนี้ 108,000 บาท", quote: "เงินทุกบาทที่เห็นชัด จะเริ่มมีทิศทางและมีพลังมากขึ้น" },
  { id: "side", label: "รายได้เสริม", icon: "↗", title: "รายได้เสริม", cover: "assets/side.svg", kicker: "ทดลอง สร้าง วัดผล", quote: "รายได้เสริมเริ่มจากรอบทดลองเล็กๆ ที่ทำซ้ำได้" },
  { id: "health", label: "สุขภาพ & ความสวย", icon: "♡", title: "สุขภาพ & ความสวย", cover: "assets/health.svg", kicker: "ดูแลร่างกายเหมือนดูแลระบบสำคัญ", quote: "ความมั่นใจโตจากการดูแลตัวเองแบบไม่ทอดทิ้งกัน" },
  { id: "skills", label: "ทักษะ & อาชีพ", icon: "▧", title: "ทักษะ & อาชีพ", cover: "assets/skills.svg", kicker: "UX/UI Designer growth map", quote: "งานที่ดีขึ้นมาจากทักษะที่ค่อยๆ คมขึ้นทีละวัน" }
];

const skillNames = ["UX Research", "UI Design", "Design System", "AI Tools", "Portfolio", "Case Study"];
const channels = ["AI Kids Song YouTube", "ร้านเสื้อผ้ามือสอง", "TikTok Cat Affiliate"];
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
    title: "แก้ไขค่า dashboard",
    description: "ค่า fix สำหรับวงแหวนและกราฟแนวโน้ม ไม่ใช่ยอดที่บันทึกประจำวัน",
    fields: [
      { key: "nonEssentialLimit", label: "เพดานรายจ่ายไม่จำเป็นต่อช่วง", suffix: "บาท" },
      { key: "sweetDrinkLimit", label: "เพดานค่าน้ำหวานต่อช่วง", suffix: "บาท" },
      { key: "trendExerciseTarget", label: "เป้ากราฟออกกำลังต่อวัน", suffix: "นาที" },
      { key: "trendNonEssentialLimit", label: "เพดานกราฟรายจ่ายไม่จำเป็นต่อวัน", suffix: "บาท" }
    ]
  },
  side: {
    title: "แก้ไขเป้ารายได้เสริม",
    description: "ใช้กับ score รายได้เสริมและ progress ของแต่ละช่องทาง",
    fields: [
      { key: "sideIncomeWeeklyTarget", label: "เป้ารายสัปดาห์", suffix: "บาท" },
      { key: "sideIncomeMonthlyTarget", label: "เป้ารายเดือน", suffix: "บาท" },
      { key: "sideIncomeYearlyTarget", label: "เป้ารายปี", suffix: "บาท" },
      { key: "sideChannelMonthlyTarget", label: "เป้าแต่ละช่องทางต่อเดือน", suffix: "บาท" }
    ]
  },
  skills: {
    title: "แก้ไขเป้าทักษะ",
    description: "ใช้กับ progress ของ skill UX/UI แต่ละหมวด",
    fields: [{ key: "skillTargetDays", label: "เป้าจำนวนวันต่อทักษะ", suffix: "วัน" }]
  }
};

let state = loadState();
let activePage = "dashboard";
let selectedDate = toISO(new Date());
let filter = "month";
let calendarCursor = new Date();
let modalCategory = "checkin";
let settingGroup = "debt";
let pendingConfirmAction = null;
let supabaseClient = null;
let currentUser = null;
let isCloudLoading = false;

const $ = (selector) => document.querySelector(selector);
const money = (value) => Number(value || 0).toLocaleString("th-TH");
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const numericFields = ["water", "exercise", "sleep", "income", "essential", "nonEssential", "sweetDrink", "debtPaid", "sideIncome", "confidence"];

const modalConfigs = {
  dashboard: {
    title: "บันทึกภาพรวมวันนี้",
    description: "รวมข้อมูลสำคัญของวันเดียวในฟอร์มเดียว เหมาะกับการอัปเดตเร็วจาก dashboard",
    fields: ["mood", "water", "exercise", "income", "essential", "debtPaid", "sideIncome", "win"]
  },
  goals: {
    title: "อัปเดตเป้าหมาย",
    description: "กรอกเฉพาะตัวเลขที่ส่งผลต่อ progress bar รายวัน/สัปดาห์/เดือน/ระยะยาว",
    fields: ["water", "exercise", "debtPaid", "sideIncome", "skills", "win"]
  },
  checkin: {
    title: "เช็คอินชีวิตวันนี้",
    description: "บันทึกความรู้สึก ค่าใช้จ่าย สุขภาพ ชัยชนะเล็กๆ และ streak ของวันนี้",
    fields: ["mood", "water", "exercise", "sleep", "income", "essential", "nonEssential", "sweetDrink", "debtPaid", "sideIncome", "sideChannel", "confidence", "skills", "win"]
  },
  money: {
    title: "บันทึกเงิน & หนี้",
    description: "แยกรายรับ รายจ่ายจำเป็น/ไม่จำเป็น ค่าน้ำหวาน และเงินที่จ่ายหนี้",
    fields: ["income", "essential", "nonEssential", "sweetDrink", "debtPaid", "win"]
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
  }
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return normalizeState(saved);
  } catch {
    return normalizeState();
  }
}

function normalizeState(saved = {}) {
  return {
    entries: saved && saved.entries ? saved.entries : {},
    settings: { ...DEFAULT_SETTINGS, ...(saved?.settings || {}) },
    createdAt: saved?.createdAt || new Date().toISOString()
  };
}

function settings() {
  state.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
  return state.settings;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setAuthMessage(message, isError = false) {
  const authMessage = $("#authMessage");
  if (!authMessage) return;
  authMessage.textContent = message || "";
  authMessage.style.color = isError ? "#b94b62" : "";
}

function updateAuthUI() {
  const authButton = $("#authButton");
  if (!authButton) return;
  if (isCloudLoading) {
    authButton.textContent = "กำลัง sync...";
    return;
  }
  authButton.textContent = currentUser ? `DB: ${currentUser.email}` : "เชื่อม DB";
}

async function initSupabase() {
  if (!window.supabase?.createClient) {
    setAuthMessage("โหลด Supabase client ไม่สำเร็จ ใช้ localStorage ชั่วคราว", true);
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthUI();
  if (currentUser) await loadCloudState();
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
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

function sum(entries, key) {
  return entries.reduce((total, [, entry]) => total + Number(entry[key] || 0), 0);
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

  $("#pageContent").innerHTML = content;
  bindPageEvents();
}

function renderDashboard() {
  const entries = entriesInRange();
  const today = getEntry();
  const cfg = settings();
  const debtPaid = sum(Object.entries(state.entries), "debtPaid");
  const sideIncome = sum(entries, "sideIncome");
  const debtLeft = Math.max(0, cfg.debtTotal - debtPaid);
  const weekEntries = lastDays(7);
  const hasRangeData = entries.length > 0;
  const healthScore = average([
    progressValue(Number(today.water || 0), cfg.waterDailyTarget),
    progressValue(Number(today.exercise || 0), cfg.exerciseDailyTarget),
    progressValue(Number(today.sleep || 0), cfg.sleepTarget),
    progressValue(Number(today.confidence || 0), cfg.confidenceTarget)
  ]);
  const moneyScore = hasRangeData ? average([
    progressValue(debtPaid, cfg.debtTotal),
    inverseProgress(sum(entries, "nonEssential"), cfg.nonEssentialLimit),
    inverseProgress(sum(entries, "sweetDrink"), cfg.sweetDrinkLimit)
  ]) : 0;
  const sideScore = progressValue(sideIncome, filter === "week" ? cfg.sideIncomeWeeklyTarget : filter === "year" ? cfg.sideIncomeYearlyTarget : cfg.sideIncomeMonthlyTarget);
  const careerScore = progressValue(skillNames.reduce((total, skill) => total + countSkillDays(skill), 0), skillNames.length * cfg.skillTargetDays);
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
          <button class="tiny-button" type="button" data-open-setting="dashboard">แก้เป้าหมาย</button>
        </div>
        <div class="balance-grid">
          ${balanceRing("สุขภาพ", healthScore, "น้ำ นอน ออกกำลัง")}
          ${balanceRing("เงิน", moneyScore, "หนี้ + ค่าใช้จ่าย")}
          ${balanceRing("รายได้เสริม", sideScore, `${money(sideIncome)} บาท`)}
          ${balanceRing("อาชีพ", careerScore, "skill days")}
        </div>
      </div>

      <div class="card debt-visual-card">
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
      </div>
    </div>

    <div class="grid two">
      ${renderCalendar()}
      <div class="card">
        <div class="section-head">
          <div>
            <p class="eyebrow">${dateLabel(selectedDate)}</p>
            <h2>ข้อมูลย้อนหลัง</h2>
          </div>
          <button class="tiny-button" type="button" data-open-entry>แก้ไข</button>
        </div>
        ${renderDayDetail(selectedDate)}
      </div>
    </div>

    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">7-day trend</p>
          <h2>แนวโน้ม 7 วันล่าสุด</h2>
        </div>
        <span class="pill">visual summary</span>
      </div>
      <div class="trend-grid">
        ${trendChart("น้ำ", "water", weekEntries, cfg.waterDailyTarget, "แก้ว")}
        ${trendChart("ออกกำลังกาย", "exercise", weekEntries, cfg.trendExerciseTarget, "นาที")}
        ${trendChart("รายจ่ายไม่จำเป็น", "nonEssential", weekEntries, cfg.trendNonEssentialLimit, "บาท", true)}
      </div>
    </div>

    <div class="summary-band visual-summary">
      ${miniSummary("รายรับ", `${money(sum(entries, "income"))} บาท`)}
      ${miniSummary("รายจ่ายจำเป็น", `${money(sum(entries, "essential"))} บาท`)}
      ${miniSummary("ไม่จำเป็น", `${money(sum(entries, "nonEssential"))} บาท`)}
      ${miniSummary("น้ำหวาน", `${money(sum(entries, "sweetDrink"))} บาท`)}
      ${miniSummary("รายได้เสริม", `${money(sideIncome)} บาท`)}
    </div>
  `;
}

function renderGoals() {
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
        <h2>โฟกัสสัปดาห์นี้</h2>
        <div class="timeline">
          <div class="timeline-item"><strong>สุขภาพ:</strong> น้ำ ${money(cfg.waterDailyTarget)} แก้ว + เดินอย่างน้อย ${money(cfg.exerciseDailyTarget)} นาที</div>
          <div class="timeline-item"><strong>เงิน:</strong> แยกจำเป็น/ไม่จำเป็นก่อนจ่ายทุกครั้ง</div>
          <div class="timeline-item"><strong>อาชีพ:</strong> เติม portfolio หรือ case study อย่างน้อย 3 วัน</div>
          <div class="timeline-item"><strong>รายได้เสริม:</strong> วัดผล 1 ช่องทางที่ทำต่อได้จริง</div>
        </div>
      </div>
    </div>
  `;
}

function renderCheckin() {
  return `
    <div class="grid three">
      ${statCard("เช็คอินต่อเนื่อง", `${currentStreak()} วัน`, "นับจากวันที่มีบันทึก")}
      ${statCard("skincare streak", `${currentStreak((entry) => Number(entry?.confidence || 0) >= 6)} วัน`, "ใช้ความมั่นใจเป็น proxy")}
      ${statCard("ชัยชนะวันนี้", getEntry().win || "ยังรอชัยชนะเล็กๆ", "คลิกบันทึกเพื่อเติมเรื่องดีๆ")}
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
          ${miniSummary("รายจ่ายไม่จำเป็น", `${money(sum(entries, "nonEssential"))} บาท`)}
          ${miniSummary("ค่าน้ำหวาน", `${money(sum(entries, "sweetDrink"))} บาท`)}
        </div>
      </div>
    </div>
    <div class="card">
      <h2>บันทึกล่าสุด</h2>
      <div class="timeline">
        ${all.slice(-8).reverse().map(([iso, entry]) => `
          <div class="timeline-item">
            <strong>${dateLabel(iso, "medium")}</strong> รายรับ ${money(entry.income)} / จำเป็น ${money(entry.essential)} / ไม่จำเป็น ${money(entry.nonEssential)} / น้ำหวาน ${money(entry.sweetDrink)} / จ่ายหนี้ ${money(entry.debtPaid)}
          </div>
        `).join("") || `<p class="muted">ยังไม่มีข้อมูลการเงิน</p>`}
      </div>
    </div>
  `;
}

function renderSideIncome() {
  const entries = entriesInRange("month");
  const cfg = settings();
  return `
    <div class="grid three">
      ${channels.map((channel) => {
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
      }).join("")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Side income experiment</p>
          <h2>บันทึกการทดลอง</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="side">แก้เป้ารายได้</button>
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
      ${statCard("น้ำวันนี้", `${Number(entry.water || 0)}/${money(cfg.waterDailyTarget)}`, "แก้ว")}
      ${statCard("นอน", `${Number(entry.sleep || 0)} ชม.`, `เป้าหมาย ${money(cfg.sleepTarget)} ชม.`)}
      ${statCard("ออกกำลังกายสัปดาห์นี้", `${sum(week, "exercise")} นาที`, `เป้าหมาย ${money(cfg.exerciseWeeklyTarget)} นาที`)}
      ${statCard("ความมั่นใจ", `${Number(entry.confidence || 0)}/${money(cfg.confidenceTarget)}`, "เช็คอินภาพรวมใจ")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Health & Beauty rhythm</p>
          <h2>streak การดูแลตัวเอง</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="goals">แก้เป้าสุขภาพ</button>
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
  const cfg = settings();
  return `
    <div class="grid three">
      ${skillNames.map((skill) => statCard(skill, `${countSkillDays(skill)} วัน`, "จำนวนวันที่ฝึกทั้งหมด")).join("")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <p class="eyebrow">Career growth</p>
          <h2>แผนพัฒนาทักษะ UX/UI</h2>
        </div>
        <div class="button-row">
          <button class="tiny-button" type="button" data-open-setting="skills">แก้เป้าทักษะ</button>
          <button class="primary-button" type="button" data-open-entry>บันทึกทักษะวันนี้</button>
        </div>
      </div>
      <div class="progress-list">
        ${skillNames.map((skill) => renderProgress({ name: skill, type: `เป้าหมาย ${money(cfg.skillTargetDays)} วัน`, progress: countSkillDays(skill), target: cfg.skillTargetDays })).join("")}
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
  if (!Object.keys(entry).length) return `<p class="muted">ยังไม่มีข้อมูลของวันที่นี้ กดบันทึกเพื่อเพิ่มย้อนหลังได้</p>`;
  return `
    <div class="day-detail">
      <span class="pill">อารมณ์ ${entry.mood || "-"}</span>
      <span class="pill">น้ำ ${Number(entry.water || 0)} แก้ว</span>
      <span class="pill">ออกกำลัง ${Number(entry.exercise || 0)} นาที</span>
      <span class="pill">รายรับ ${money(entry.income)} บาท</span>
      <span class="pill">รายได้เสริม ${money(entry.sideIncome)} บาท</span>
      <span class="pill">จ่ายหนี้ ${money(entry.debtPaid)} บาท</span>
    </div>
    <p style="margin:14px 0 0;"><strong>ชัยชนะเล็กๆ:</strong> ${entry.win || "ยังไม่ได้บันทึก"}</p>
    <p class="muted" style="margin:8px 0 0;">ทักษะ: ${(entry.skills || []).join(", ") || "-"}</p>
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

function balanceRing(label, percent, note) {
  return `
    <div class="balance-ring-card">
      <div class="balance-ring" style="--ring:${percent}%">
        <strong>${Math.round(percent)}%</strong>
      </div>
      <div>
        <h3>${label}</h3>
        <p class="muted">${note}</p>
      </div>
    </div>
  `;
}

function trendChart(label, key, entries, target, unit, inverse = false) {
  const maxValue = Math.max(target, ...entries.map(([, entry]) => Number(entry[key] || 0)));
  const bars = entries.map(([iso, entry]) => {
    const raw = Number(entry[key] || 0);
    const height = clamp((raw / Math.max(maxValue, 1)) * 100, raw > 0 ? 8 : 3, 100);
    const day = new Intl.DateTimeFormat("th-TH", { weekday: "short" }).format(new Date(`${iso}T00:00:00`));
    return `
      <div class="trend-bar-item" title="${dateLabel(iso, "medium")}: ${money(raw)} ${unit}">
        <span class="trend-bar ${inverse ? "inverse" : ""}" style="height:${height}%"></span>
        <small>${day}</small>
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
      <div class="trend-bars">${bars}</div>
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
  form.reset();
  Object.entries(entry).forEach(([key, value]) => {
    if (key === "skills") return;
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
    .filter((field) => !["win", "skills"].includes(field))
    .map(renderField)
    .join("");
  const winHTML = fields.includes("win") ? renderField("win") : "";
  const skillsHTML = fields.includes("skills") ? renderField("skills") : "";
  return `
    ${fieldHTML ? `<div class="form-grid">${fieldHTML}</div>` : ""}
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
    essential: textInput("essential", "รายจ่ายจำเป็น", "decimal"),
    nonEssential: textInput("nonEssential", "รายจ่ายไม่จำเป็น", "decimal"),
    sweetDrink: textInput("sweetDrink", "ค่าน้ำหวาน", "decimal"),
    debtPaid: textInput("debtPaid", "จ่ายหนี้วันนี้", "decimal"),
    sideIncome: textInput("sideIncome", "รายได้เสริม", "decimal"),
    sideChannel: `
      <label>
        ช่องทางรายได้เสริม
        <select name="sideChannel">
          <option value="AI Kids Song YouTube">AI Kids Song YouTube</option>
          <option value="ร้านเสื้อผ้ามือสอง">ร้านเสื้อผ้ามือสอง</option>
          <option value="TikTok Cat Affiliate">TikTok Cat Affiliate</option>
        </select>
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
        ${skillNames.map((skill) => `<label><input type="checkbox" name="skills" value="${skill}" /> ${skill}</label>`).join("")}
      </div>
    `
  };
  return fields[field] || "";
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
  $("#settingFields").innerHTML = config.fields.map((field) => `
    <label>
      ${field.label}
      <input name="${field.key}" type="text" inputmode="decimal" value="${settings()[field.key] ?? 0}" />
      <span class="field-hint">${field.suffix}</span>
    </label>
  `).join("");
  $("#settingModal").showModal();
}

function handleSettingSubmit(event) {
  event.preventDefault();
  const config = settingGroups[settingGroup] || settingGroups.debt;
  const data = new FormData(event.currentTarget);
  config.fields.forEach((field) => {
    settings()[field.key] = Number(data.get(field.key) || 0);
  });
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
  updateAuthUI();
  setAuthMessage("ออกจากระบบแล้ว ข้อมูลใหม่จะบันทึกในเครื่องนี้");
  $("#authModal").close();
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
$("#exportButton").addEventListener("click", exportData);

render();
initSupabase();
