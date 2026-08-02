/** 2차 확장: 2,000자 미만 아티클에 추가 본문 삽입 */
import fs from "fs";
import path from "path";

const ARTICLES_DIR = path.join(process.cwd(), "articles");
const MARKER2 = "<!-- moneygaebi-supplement-2 -->";

const EXTRA = {
  청약: `${MARKER2}<h2>자주 받는 질문 정리</h2><p><strong>Q. 청약통장 잔액이 많으면 가점이 오르나요?</strong> A. 가입기간 점수는 통장 잔액과 무관하고, 가입한 기간만 인정됩니다. 잔액은 납입 의무(월 납입액 등)와 이자 수령에 영향을 줍니다.</p><p><strong>Q. 부모와 따로 살아도 부양가족에 포함되나요?</strong> A. 같은 세대별 주민등록표 등재, 소득·주택 요건 등을 모두 충족해야 합니다. 단순히 경제적 부양만으로는 인정되지 않을 수 있습니다.</p><h2>다음에 읽으면 좋은 글</h2><p><a href="/articles/청약-가점제-완전정복">청약 가점제 완전정복</a>, <a href="/articles/무주택기간-계산법-총정리">무주택기간 계산법</a>, <a href="/glossary/청약-가점제">청약 가점제 용어</a>를 이어서 읽어 보세요.</p>`,
  신용점수: `${MARKER2}<h2>자주 받는 질문 정리</h2><p><strong>Q. 점수 올리는 데 얼마나 걸리나요?</strong> A. 연체·다중 대출 후 회복은 보통 수개월~1년 이상 성실 거래가 필요하다고 알려져 있습니다. 단기간 급상승을 기대하기 어렵습니다.</p><p><strong>Q. 카드 해지하면 점수가 오르나요?</strong> A. 사용 이력이 사라지면 오히려 불리할 수 있습니다. 한도만 줄이고 사용률을 낮추는 편이 나을 때가 많습니다.</p><h2>관련 도구</h2><p><a href="/calculators/credit-score">신용점수 시뮬레이터</a>, <a href="/glossary/신용점수">신용점수 용어</a>, <a href="/glossary/연체">연체 용어</a>도 함께 참고하세요.</p>`,
  연말정산: `${MARKER2}<h2>자주 받는 질문 정리</h2><p><strong>Q. 회사에서 이미 연말정산했는데 홈택스에서 또 해야 하나요?</strong> A. 근로자는 회사가 원천징수·연말정산을 대행합니다. 다만 의료비·기부금·누락 공제 등 추가 신고가 필요하면 5월 종합소득세 신고 기간에 정정·추가 신고할 수 있습니다.</p><p><strong>Q. 부모님 의료비를 공제받을 수 있나요?</strong> A. 부양가족 요건을 충족하고 실제 부담한 의료비라면 세액공제 대상이 될 수 있습니다. 간소화에 없으면 영수증을 챙기세요.</p><h2>관련 도구</h2><p><a href="/calculators/year-end-tax">연말정산 환급액 계산기</a>, <a href="/glossary/소득공제">소득공제</a>, <a href="/glossary/세액공제">세액공제</a> 용어 페이지를 확인하세요.</p>`,
  적금: `${MARKER2}<h2>자주 받는 질문 정리</h2><p><strong>Q. 우대금리 조건을 못 맞추면?</strong> A. 약정 금리보다 낮은 금리가 적용될 수 있습니다. 카드 실적·급여 이체 등 조건을 약관에서 확인하고, 맞추기 어렵다면 조건 없는 상품과 비교하세요.</p><p><strong>Q. 예금자보호 5,000만 원은 이자 포함인가요?</strong> A. 원금과 약정 이자를 합산한 금액 기준입니다. <a href="/articles/예금자보호-5000만원-무슨-뜻">예금자보호 글</a>을 참고하세요.</p><h2>관련 도구</h2><p><a href="/calculators/savings-interest">적금 이자 계산기</a>, <a href="/glossary/단리">단리</a>, <a href="/glossary/복리">복리</a> 용어를 함께 보세요.</p>`,
  경제용어: `${MARKER2}<h2>자주 받는 질문 정리</h2><p><strong>Q. 경제 용어를 외워야 하나요?</strong> A. 정의 암기보다 &quot;뉴스에서 이 단어가 나오면 무엇을 의심해야 하는지&quot;를 아는 것이 중요합니다. 예: 기준금리 인상 → 변동금리 대출 부담 증가.</p><p><strong>Q. 유튜브·블로그 설명만 믿어도 되나요?</strong> A. 2차 출처는 <a href="/editorial-policy">편집 기준</a>에 따라 공식 자료와 대조해 검수합니다. 중요한 결정은 반드시 공식 채널을 확인하세요.</p><h2>용어사전 더 보기</h2><p><a href="/glossary">머니깨비 용어사전</a>에서 18개 경제 용어를 개별 페이지로 확인할 수 있습니다.</p>`,
};

function textLen(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().length;
}

for (const file of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"))) {
  const p = path.join(ARTICLES_DIR, file);
  const article = JSON.parse(fs.readFileSync(p, "utf8"));
  const len = textLen(article.contentHtml);
  if (len >= 2000) {
    console.log("ok", article.slug, len);
    continue;
  }
  if (article.contentHtml.includes(MARKER2)) continue;
  const extra = EXTRA[article.category];
  if (!extra) continue;
  article.contentHtml += extra;
  fs.writeFileSync(p, JSON.stringify(article, null, 2) + "\n", "utf8");
  console.log("extra", article.slug, "->", textLen(article.contentHtml));
}
