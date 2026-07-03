/** 경제 계산기 목록. 계산기를 추가할 때마다 여기에 등록하면 /calculators 목록·sitemap에 자동 반영됩니다. */
export type CalculatorEntry = {
  slug: string;
  path: string;
  title: string;
  description: string;
};

export const CALCULATORS: CalculatorEntry[] = [
  {
    slug: "credit-score",
    path: "/calculators/credit-score",
    title: "신용점수 시뮬레이터",
    description: "연체·대출 추가 등 시나리오별 예상 신용점수 변화 범위를 확인합니다.",
  },
  {
    slug: "subscription-score",
    path: "/calculators/subscription-score",
    title: "청약 가점 계산기",
    description: "무주택기간·부양가족수·통장 가입기간으로 84점 만점 청약 가점을 자동 계산합니다.",
  },
  {
    slug: "year-end-tax",
    path: "/calculators/year-end-tax",
    title: "연말정산 환급액 계산기",
    description: "총급여·공제 항목을 입력하면 예상 환급액(또는 추가 납부액)을 계산합니다.",
  },
  {
    slug: "savings-interest",
    path: "/calculators/savings-interest",
    title: "적금 이자 계산기",
    description: "단리·복리 방식의 만기 세후 수령액을 비교합니다.",
  },
];

export const CALCULATOR_PATHS: string[] = CALCULATORS.map((c) => c.path);
