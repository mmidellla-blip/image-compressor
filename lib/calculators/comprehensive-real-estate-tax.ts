/**
 * 종합부동산세(종부세) 계산 로직.
 *
 * 2026년 8월 3일 발표된 세제개편안 기준이며, 세율·공제는 2026~2028년 단계적으로
 * 시행되는 내용입니다. 국회 통과 전 발표 단계 내용이 포함되어 있을 수 있어
 * 확정 시행령에 따라 수치가 달라질 수 있습니다.
 *
 * 단순화 사항:
 * - 다주택자 기본공제는 거주주택 비중에 따른 최대 5억 원 추가공제를 반영하지 않고
 *   4억 원으로 고정했습니다. 추가공제는 세무 전문가 확인이 필요합니다.
 * - 부부 공동명의는 공시가격을 50:50으로 나눠 각자 동일한 기본공제·세율을 적용한 뒤
 *   합산하는 방식으로 단순화했습니다. 실제로는 지분·특례 신청 여부에 따라 달라집니다.
 * - 세부담 상한(전년 대비 급증 방지)은 계산에 반영하지 않고 안내 문구로만 제공합니다.
 */

export type OwnershipType = "residentSingle" | "nonResidentSingle" | "multi";
export type FilingType = "single" | "joint";
export type ApplicableYear = 2026 | 2027 | 2028;

export const OWNERSHIP_LABELS: Record<OwnershipType, string> = {
  residentSingle: "실거주 1주택",
  nonResidentSingle: "비거주 1주택",
  multi: "다주택",
};

/** 기본공제 (2026년 기준) */
export const BASE_DEDUCTION: Record<OwnershipType, number> = {
  residentSingle: 1_400_000_000,
  nonResidentSingle: 900_000_000,
  multi: 400_000_000,
};

/**
 * 공정시장가액비율. 실거주 1주택은 2027년 70%로 인상 후 유지, 비거주 1주택·다주택은
 * 2028년 80%까지 단계적으로 인상될 예정(발표 기준, 확정 전 수치는 변경될 수 있음).
 */
export const FAIR_MARKET_RATIO: Record<OwnershipType, Record<ApplicableYear, number>> = {
  residentSingle: { 2026: 0.6, 2027: 0.7, 2028: 0.7 },
  nonResidentSingle: { 2026: 0.6, 2027: 0.7, 2028: 0.8 },
  multi: { 2026: 0.6, 2027: 0.7, 2028: 0.8 },
};

type TaxBracket = {
  upTo: number;
  rate: number;
  progressiveDeduction: number;
  label: string;
};

/** 누진세율표 (2028년 최종 적용 기준, 주택 수 무관 단일세율로 개편 예정) */
export const TAX_BRACKETS: TaxBracket[] = [
  { upTo: 300_000_000, rate: 0.005, progressiveDeduction: 0, label: "3억 원 이하" },
  { upTo: 600_000_000, rate: 0.007, progressiveDeduction: 600_000, label: "3억 초과~6억 이하" },
  { upTo: 1_200_000_000, rate: 0.013, progressiveDeduction: 4_200_000, label: "6억 초과~12억 이하" },
  { upTo: 2_500_000_000, rate: 0.02, progressiveDeduction: 12_600_000, label: "12억 초과~25억 이하" },
  { upTo: 5_000_000_000, rate: 0.03, progressiveDeduction: 37_600_000, label: "25억 초과~50억 이하" },
  { upTo: 9_400_000_000, rate: 0.04, progressiveDeduction: 87_600_000, label: "50억 초과~94억 이하" },
  { upTo: Infinity, rate: 0.05, progressiveDeduction: 187_600_000, label: "94억 원 초과" },
];

/** 과세표준 → 산출세액. 반드시 구간별로 나눠 합산(누진세율 방식)합니다. */
export function computeProgressiveTax(taxBase: number): number {
  if (taxBase <= 0) return 0;

  let tax = 0;
  let lowerBound = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxBase <= lowerBound) break;
    const taxableInBracket = Math.min(taxBase, bracket.upTo) - lowerBound;
    tax += taxableInBracket * bracket.rate;
    lowerBound = bracket.upTo;
  }
  return tax;
}

/** 과세표준이 속하는 세율 구간 라벨 */
export function findBracketLabel(taxBase: number): string {
  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.upTo) ?? TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return bracket.label;
}

/** 고령자 세액공제율 (60세 미만은 0%) */
export function computeElderlyCreditRate(age: number): number {
  if (age >= 70) return 0.4;
  if (age >= 65) return 0.3;
  if (age >= 60) return 0.2;
  return 0;
}

/** 장기보유 세액공제율 (5년 미만은 0%) */
export function computeLongTermCreditRate(holdingYears: number): number {
  if (holdingYears >= 15) return 0.5;
  if (holdingYears >= 10) return 0.4;
  if (holdingYears >= 5) return 0.2;
  return 0;
}

/** 고령자+장기보유 세액공제 합산 한도 */
export const MAX_COMBINED_CREDIT_RATE = 0.8;

export type ComprehensiveRealEstateTaxInput = {
  /** 공시가격 합계 (원) */
  publicPriceWon: number;
  ownershipType: OwnershipType;
  filingType: FilingType;
  applicableYear: ApplicableYear;
  /** 고령자 세액공제 계산용 (실거주 1주택자만 적용) */
  age: number;
  /** 장기보유 세액공제 계산용, 연 단위 (실거주 1주택자만 적용) */
  holdingYears: number;
};

export type OwnerBreakdown = {
  publicPriceShare: number;
  taxBase: number;
  calculatedTax: number;
};

export type ComprehensiveRealEstateTaxResult = {
  baseDeduction: number;
  fairMarketRatio: number;
  owners: OwnerBreakdown[];
  taxBaseTotal: number;
  topBracketLabel: string;
  /** 세액공제 적용 전 산출세액 합계 */
  calculatedTax: number;
  eligibleForCredit: boolean;
  elderlyCreditRate: number;
  longTermCreditRate: number;
  combinedCreditRate: number;
  creditAmount: number;
  /** 세액공제 적용 후 최종 예상 세액 */
  finalTax: number;
};

function computeOwnerBreakdown(
  publicPriceShare: number,
  deduction: number,
  ratio: number,
): OwnerBreakdown {
  const taxBase = Math.max(0, publicPriceShare - deduction) * ratio;
  const calculatedTax = computeProgressiveTax(taxBase);
  return { publicPriceShare, taxBase, calculatedTax };
}

export function computeComprehensiveRealEstateTax(
  input: ComprehensiveRealEstateTaxInput,
): ComprehensiveRealEstateTaxResult {
  const deduction = BASE_DEDUCTION[input.ownershipType];
  const ratio = FAIR_MARKET_RATIO[input.ownershipType][input.applicableYear];

  const owners: OwnerBreakdown[] =
    input.filingType === "joint"
      ? [
          computeOwnerBreakdown(input.publicPriceWon / 2, deduction, ratio),
          computeOwnerBreakdown(input.publicPriceWon / 2, deduction, ratio),
        ]
      : [computeOwnerBreakdown(input.publicPriceWon, deduction, ratio)];

  const taxBaseTotal = owners.reduce((sum, o) => sum + o.taxBase, 0);
  const calculatedTax = owners.reduce((sum, o) => sum + o.calculatedTax, 0);
  const topBracketLabel = findBracketLabel(Math.max(...owners.map((o) => o.taxBase)));

  const eligibleForCredit = input.ownershipType === "residentSingle";
  const elderlyCreditRate = eligibleForCredit ? computeElderlyCreditRate(input.age) : 0;
  const longTermCreditRate = eligibleForCredit ? computeLongTermCreditRate(input.holdingYears) : 0;
  const combinedCreditRate = Math.min(
    elderlyCreditRate + longTermCreditRate,
    MAX_COMBINED_CREDIT_RATE,
  );
  const creditAmount = calculatedTax * combinedCreditRate;
  const finalTax = calculatedTax - creditAmount;

  return {
    baseDeduction: deduction,
    fairMarketRatio: ratio,
    owners,
    taxBaseTotal,
    topBracketLabel,
    calculatedTax,
    eligibleForCredit,
    elderlyCreditRate,
    longTermCreditRate,
    combinedCreditRate,
    creditAmount,
    finalTax,
  };
}
