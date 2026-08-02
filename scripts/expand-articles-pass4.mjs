import fs from "fs";
import path from "path";

const ARTICLES_DIR = path.join(process.cwd(), "articles");
const MARKER4 = "<!-- moneygaebi-supplement-4 -->";

const MORE = `${MARKER4}<h2>함께 보면 좋은 공식 안내</h2><p>청약·주택 관련은 <a href="https://www.applyhome.co.kr" target="_blank" rel="noopener noreferrer">청약홈</a>과 국토교통부 보도자료, 연말정산·세금은 <a href="https://www.hometax.go.kr" target="_blank" rel="noopener noreferrer">국세청 홈택스</a> 연말정산 안내, 예금·대출·DSR은 <a href="https://www.fss.or.kr" target="_blank" rel="noopener noreferrer">금융감독원</a> 금융소비자 정보를 우선 참고하세요. 머니깨비 계산기는 이러한 공식 구조를 단순화해 보여 주는 도구이며, 법령 개정 시 업데이트가 지연될 수 있습니다.</p><p>같은 주제의 <a href="/articles">다른 아티클</a>과 <a href="/glossary">용어사전</a>을 연결해 읽으면 개념이 더 오래 남습니다. 궁금한 점은 <a href="/contact">문의 페이지</a>로 보내 주세요.</p>`;

function textLen(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().length;
}

let n = 0;
for (const file of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"))) {
  const p = path.join(ARTICLES_DIR, file);
  const article = JSON.parse(fs.readFileSync(p, "utf8"));
  if (textLen(article.contentHtml) >= 2000) continue;
  if (article.contentHtml.includes(MARKER4)) continue;
  article.contentHtml += MORE;
  fs.writeFileSync(p, JSON.stringify(article, null, 2) + "\n", "utf8");
  n++;
  console.log(article.slug, textLen(article.contentHtml));
}
console.log("pass4:", n);
