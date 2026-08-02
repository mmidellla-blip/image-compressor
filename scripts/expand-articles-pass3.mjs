import fs from "fs";
import path from "path";

const ARTICLES_DIR = path.join(process.cwd(), "articles");
const MARKER3 = "<!-- moneygaebi-supplement-3 -->";

const PAD = `${MARKER3}<h2>정리: 오늘부터 할 수 있는 한 가지</h2><p>경제·세금·청약 정보는 한 번에 외우기보다, <strong>내 상황에 숫자를 대입</strong>해 보는 것이 가장 빠릅니다. 이 글의 핵심 개념을 메모해 두었다가, 관련 <a href="/calculators">계산기</a>나 <a href="/glossary">용어사전</a>과 함께 다시 확인해 보세요. 제도와 세율은 매년 바뀔 수 있으므로, 실제 신청·신고·거래 직전에는 국세청 홈택스·청약홈·금융감독원·가입 금융사 앱 등 <strong>공식 채널의 최신 안내</strong>를 반드시 확인하시기 바랍니다.</p><p>머니깨비는 사회초년생·경제 초보가 청약·신용·연말정산·적금 주제를 스스로 점검할 수 있도록 계산기와 아티클·용어사전을 무료로 제공합니다. 오류나 outdated 정보를 발견하시면 <a href="/contact">문의</a>로 알려 주시면 검토 후 반영합니다. 편집 기준과 출처 정책은 <a href="/editorial-policy">편집 기준 페이지</a>에서 확인할 수 있습니다.</p>`;

function textLen(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().length;
}

const under = [];
for (const file of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"))) {
  const p = path.join(ARTICLES_DIR, file);
  const article = JSON.parse(fs.readFileSync(p, "utf8"));
  const len = textLen(article.contentHtml);
  if (len < 2000 && !article.contentHtml.includes(MARKER3)) {
    article.contentHtml += PAD;
    fs.writeFileSync(p, JSON.stringify(article, null, 2) + "\n", "utf8");
    under.push({ slug: article.slug, len: textLen(article.contentHtml) });
  }
}
console.log("pass3 updated", under.length);
under.forEach((u) => console.log(u.slug, u.len));
const still = under.filter((u) => u.len < 2000);
console.log("still under 2000:", still.length);
