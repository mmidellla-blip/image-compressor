import fs from "fs";
import path from "path";

const M = "<!-- moneygaebi-final-2 -->";
const P = `${M}<p>숫자·한도·요건은 법령 개정과 고시 변경에 따라 달라질 수 있습니다. 글 하단의 <a href="/editorial-policy">편집 기준</a>에 따라 정기적으로 관련 계산기와 함께 검토합니다.</p>`;

function textLen(html) {
  return html.replace(/<[^>]+>/g, "").trim().length;
}

for (const f of fs.readdirSync(path.join(process.cwd(), "articles")).filter((x) => x.endsWith(".json"))) {
  const p = path.join(process.cwd(), "articles", f);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  if (textLen(j.contentHtml) >= 2000 || j.contentHtml.includes(M)) continue;
  j.contentHtml += P;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  console.log(j.slug, textLen(j.contentHtml));
}
