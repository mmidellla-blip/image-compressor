import fs from "fs";
import path from "path";

const M = "<!-- moneygaebi-final -->";
const P = `${M}<p>본 글은 2026년 기준으로 작성·검수되었으며, 개인 상황(소득·주택 보유·세대·금융사 정책)에 따라 적용 결과가 달라질 수 있습니다. 중요한 금융·세무 결정은 전문가 상담과 공식 기관 확인을 병행하세요. 머니깨비 <a href="/about">소개</a>·<a href="/editorial-policy">편집 기준</a>에서 콘텐츠 작성 원칙을 확인할 수 있습니다.</p>`;

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
