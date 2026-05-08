import { writeFile } from "node:fs/promises";

const sources = [
  { pageId: "dashboard", queryId: "energy-habit", icon: "health", category: "habit hydration routine พลังงาน นิสัย สุขภาพ", query: "นิสัยสุขภาพ ดื่มน้ำ พลังงาน คนทำงาน" },
  { pageId: "dashboard", queryId: "money-system", icon: "money", category: "money system debt spending การเงิน หนี้ รายจ่าย", query: "จัดการเงินส่วนบุคคล ลดรายจ่าย ปิดหนี้" },
  { pageId: "goals", queryId: "weekly-planning", icon: "calendar", category: "weekly planning goals วางแผน เป้าหมาย", query: "วางแผนรายสัปดาห์ ตั้งเป้าหมาย เทคนิคทำตามเป้า" },
  { pageId: "goals", queryId: "short-workout", icon: "exercise", category: "short workout fitness exercise ออกกำลังกายสั้น", query: "ออกกำลังกายสั้น 10 นาที คนทำงาน" },
  { pageId: "checkin", queryId: "mood-journaling", icon: "mood", category: "journaling mood reflection บันทึกอารมณ์ สุขภาพใจ", query: "บันทึกอารมณ์ journaling สุขภาพใจ reflection" },
  { pageId: "checkin", queryId: "small-wins", icon: "win", category: "small wins motivation ชัยชนะเล็กๆ แรงจูงใจ", query: "แรงจูงใจ ชัยชนะเล็กๆ พัฒนาตัวเอง" },
  { pageId: "money", queryId: "impulse-spending", icon: "sweet", category: "impulse spending sugar budget น้ำหวาน รายจ่ายไม่จำเป็น", query: "ลดรายจ่ายไม่จำเป็น น้ำหวาน งบประมาณ การเงินส่วนบุคคล" },
  { pageId: "money", queryId: "debt-payoff", icon: "debt", category: "debt payoff หนี้ ปิดหนี้ วางแผนการเงิน", query: "ปิดหนี้ วางแผนชำระหนี้ การเงินส่วนบุคคล" },
  { pageId: "side", queryId: "side-experiment", icon: "side", category: "side income experiment รายได้เสริม ทดลองขาย", query: "รายได้เสริม ขายของออนไลน์ ทดลองธุรกิจเล็ก" },
  { pageId: "side", queryId: "content-monetization", icon: "income", category: "creator affiliate youtube tiktok monetization", query: "creator economy affiliate TikTok YouTube รายได้เสริม" },
  { pageId: "health", queryId: "sleep-hygiene", icon: "sleep", category: "sleep hygiene recovery นอน สุขภาพ", query: "การนอน sleep hygiene สุขภาพ คนทำงาน" },
  { pageId: "health", queryId: "confidence-care", icon: "confidence", category: "confidence skincare self care ความมั่นใจ ดูแลตัวเอง", query: "ดูแลตัวเอง skincare ความมั่นใจ ผู้หญิง" },
  { pageId: "skills", queryId: "ux-case-study", icon: "career", category: "ux ui case study portfolio design system", query: "UX UI case study portfolio design system ไทย" },
  { pageId: "skills", queryId: "language-practice", icon: "language", category: "english arabic language learning ภาษาอังกฤษ ภาษาอาหรับ", query: "ฝึกภาษาอังกฤษ ภาษาอาหรับ เรียนภาษา คนทำงาน" }
];

function decodeEntities(value = "") {
  return value
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function stripTags(value = "") {
  return decodeEntities(value.replace(/<[^>]+>/g, " "));
}

function readTag(item, tag) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripTags(match[1]) : "";
}

function readLink(item) {
  const link = readTag(item, "link");
  if (link) return link;
  const href = item.match(/<link[^>]+href=["']([^"']+)["']/i);
  return href ? decodeEntities(href[1]) : "";
}

function readSourceUrl(item) {
  const source = item.match(/<source[^>]+url=["']([^"']+)["']/i);
  return source ? decodeEntities(source[1]) : "";
}

async function fetchSource(source) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(source.query)}&hl=th&gl=TH&ceid=TH:th`;
  const response = await fetch(url, {
    headers: { "user-agent": "BloomUXLifeTracker/1.0" }
  });
  if (!response.ok) throw new Error(`Failed ${response.status} ${source.query}`);
  const xml = await response.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 6).map((match) => {
    const item = match[1];
    const sourceUrl = readSourceUrl(item);
    return {
      pageId: source.pageId,
      queryId: source.queryId,
      icon: source.icon,
      category: source.category,
      tags: source.category.split(" "),
      title: readTag(item, "title"),
      url: readLink(item),
      source: readTag(item, "source") || "Google News",
      sourceUrl,
      publishedAt: readTag(item, "pubDate"),
      reason: `อัปเดตสำหรับ ${source.category}`
    };
  }).filter((item) => item.title && item.url);
}

const results = await Promise.allSettled(sources.map(fetchSource));
const items = results.flatMap((result) => result.status === "fulfilled" ? result.value : []);
const uniqueItems = items.filter((item, index, array) => (
  array.findIndex((candidate) => candidate.url === item.url) === index
));

await writeFile("assets/daily-feed.json", `${JSON.stringify({
  updatedAt: new Date().toISOString(),
  timezone: "Asia/Bangkok",
  schedule: "Daily at 09:00 Asia/Bangkok",
  items: uniqueItems
}, null, 2)}\n`);
