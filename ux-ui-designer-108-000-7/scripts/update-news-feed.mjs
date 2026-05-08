import { writeFile } from "node:fs/promises";

const sources = [
  { pageId: "dashboard", icon: "health", category: "habit productivity wellness นิสัย ผลิตภาพ สุขภาพ", query: "พัฒนาตัวเอง สุขภาพ ผลิตภาพ นิสัย คนทำงาน" },
  { pageId: "goals", icon: "calendar", category: "goal planning weekly review เป้าหมาย วางแผน", query: "ตั้งเป้าหมาย วางแผนรายสัปดาห์ habit tracking" },
  { pageId: "checkin", icon: "mood", category: "journaling mood reflection mindfulness บันทึก อารมณ์", query: "journaling บันทึกอารมณ์ mindfulness สุขภาพใจ" },
  { pageId: "money", icon: "money", category: "debt budget saving spending หนี้ ออมเงิน การเงิน", query: "การเงินส่วนบุคคล ปิดหนี้ ออมเงิน วางแผนการเงิน" },
  { pageId: "side", icon: "side", category: "creator affiliate youtube tiktok resale รายได้เสริม", query: "รายได้เสริม creator economy affiliate TikTok YouTube ขายของออนไลน์" },
  { pageId: "health", icon: "sleep", category: "sleep hydration fitness skincare นอน ออกกำลังกาย ความงาม", query: "สุขภาพ การนอน ออกกำลังกาย skincare ผู้หญิง" },
  { pageId: "skills", icon: "career", category: "ux ui design system ai tools portfolio english ทักษะ อาชีพ", query: "UX UI design system AI tools portfolio ภาษาอังกฤษ อาชีพดีไซเนอร์" }
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
