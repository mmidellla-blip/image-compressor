/** 아티클·계산기 페이지에서 인용하는 공식 출처 */
export const OFFICIAL_SOURCES = [
  {
    name: "국세청 홈택스",
    url: "https://www.hometax.go.kr",
    description: "연말정산·소득공제·세액공제·원천징수 안내",
  },
  {
    name: "청약홈",
    url: "https://www.applyhome.co.kr",
    description: "청약 가점·무주택기간·청약통장·당첨 안내",
  },
  {
    name: "금융감독원",
    url: "https://www.fss.or.kr",
    description: "예금자보호·금융소비자 정보·DSR 등",
  },
  {
    name: "한국은행",
    url: "https://www.bok.or.kr",
    description: "기준금리·지급준비율·통화정책",
  },
  {
    name: "예금보험공사",
    url: "https://www.kdic.or.kr",
    description: "예금자보호 한도·적용 대상",
  },
] as const;

export const DEFAULT_ARTICLE_AUTHOR = "머니깨비 편집팀";

export const YMYL_DISCLAIMER_HTML =
  '<p class="ymyl-disclaimer"><strong>안내:</strong> 본 글은 이해를 돕기 위한 참고 자료이며, 투자·세무·법률·대출 자문이 아닙니다. 최종 확인은 <a href="https://www.hometax.go.kr" target="_blank" rel="noopener noreferrer">국세청 홈택스</a>, <a href="https://www.applyhome.co.kr" target="_blank" rel="noopener noreferrer">청약홈</a>, <a href="https://www.fss.or.kr" target="_blank" rel="noopener noreferrer">금융감독원</a> 등 공식 채널에서 하시기 바랍니다. <a href="/editorial-policy">편집 기준</a>도 함께 참고해 주세요.</p>';
