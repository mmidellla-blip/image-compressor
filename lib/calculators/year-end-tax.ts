/**
 * 연말정산 예상 환급액 간이 계산기.
 *
 * 실제 연말정산은 훨씬 많은 공제 항목(보험료·의료비·기부금 등)을 반영합니다.
 * 이 계산기는 근로소득공제 → 인적공제·신용카드 소득공제 → 누진세율 → 근로소득세액공제·
 * 연금저축·월세 세액공제까지의 핵심 구조만 반영한 "간이 추정"이며, 실제 결정세액과
 * 다를 수 있습니다. 정확한 금액은 국세청 홈택스 연말정산 미리보기에서 확인해야 합니다.
 * 금액 단위는 모두 원(KRW)입니다.
 */

const MAN = 10_000;

function earnedIncomeDeduction(gross: number): number {
  if (gross <= 500 * MAN) return gross * 0.7;
  if (gross <= 1500 * MAN) return 350 * MAN + (gross - 500 * MAN) * 0.4;
  if (gross <= 4500 * MAN) return 750 * MAN + (gross - 1500 * MAN) * 0.15;
  if (gross <= 10000 * MAN) return 1200 * MAN + (gross - 4500 * MAN) * 0.05;
  return 1475 * MAN + (gross - 10000 * MAN) * 0.02;
}

/** 신용카드 등 사용액 소득공제 (간이화: 신용카드 기준 15%, 한도 300만원) */
function cardUsageDeduction(gross: number, cardUsage: number): number {
  const threshold = gross * 0.25;
  const excess = Math.max(0, cardUsage - threshold);
  return Math.min(excess * 0.15, 300 * MAN);
}

/** 종합소득세 누진세율표 (과세표준 → 산출세액) */
function progressiveIncomeTax(taxBase: number): number {
  if (taxBase <= 1400 * MAN) return taxBase * 0.06;
  if (taxBase <= 5000 * MAN) return taxBase * 0.15 - 126 * MAN;
  if (taxBase <= 8800 * MAN) return taxBase * 0.24 - 576 * MAN;
  if (taxBase <= 15000 * MAN) return taxBase * 0.35 - 1544 * MAN;
  if (taxBase <= 30000 * MAN) return taxBase * 0.38 - 1994 * MAN;
  if (taxBase <= 50000 * MAN) return taxBase * 0.4 - 2594 * MAN;
  if (taxBase <= 100000 * MAN) return taxBase * 0.42 - 3594 * MAN;
  return taxBase * 0.45 - 6594 * MAN;
}

/** 근로소득세액공제 (간이화된 구간별 한도 반영) */
function earnedIncomeTaxCredit(calculatedTax: number, gross: number): number {
  const raw =
    calculatedTax <= 130 * MAN
      ? calculatedTax * 0.55
      : 130 * MAN * 0.55 + (calculatedTax - 130 * MAN) * 0.3;

  let limit: number;
  if (gross <= 3300 * MAN) {
    limit = 74 * MAN;
  } else if (gross <= 7000 * MAN) {
    limit = Math.max(66 * MAN, 74 * MAN - (gross - 3300 * MAN) * 0.008);
  } else {
    limit = Math.max(50 * MAN, 66 * MAN - (gross - 7000 * MAN) * 0.5);
  }

  return Math.min(raw, limit);
}

/** 연금저축 세액공제 (한도 연 600만원, 총급여 5,500만원 이하 15%, 초과 12%) */
function pensionSavingsTaxCredit(gross: number, pensionContribution: number): number {
  const rate = gross <= 5500 * MAN ? 0.15 : 0.12;
  return Math.min(pensionContribution, 600 * MAN) * rate;
}

/** 월세 세액공제 (한도 연 750만원, 총급여 5,500만원 이하 15%, 7,000만원 이하 12%, 초과 0%) */
function rentTaxCredit(gross: number, annualRent: number): number {
  const capped = Math.min(annualRent, 750 * MAN);
  if (gross <= 5500 * MAN) return capped * 0.15;
  if (gross <= 7000 * MAN) return capped * 0.12;
  return 0;
}

export type YearEndTaxInput = {
  /** 연간 총급여 (원) */
  grossSalary: number;
  /** 기납부세액 (원천징수로 이미 낸 소득세, 원) */
  withheldTax: number;
  /** 본인 포함 부양가족 수 */
  dependents: number;
  /** 신용카드 등 연간 사용액 (원) */
  cardUsage: number;
  /** 연금저축·IRP 연간 납입액 (원) */
  pensionContribution: number;
  /** 연간 월세 총액 (원) */
  annualRent: number;
};

export type YearEndTaxResult = {
  earnedIncomeAmount: number;
  incomeDeductionTotal: number;
  taxBase: number;
  calculatedTax: number;
  taxCreditTotal: number;
  decidedTax: number;
  localIncomeTax: number;
  totalTaxBurden: number;
  /** 양수면 환급, 음수면 추가 납부 */
  refundOrDue: number;
};

export function computeYearEndTax(input: YearEndTaxInput): YearEndTaxResult {
  const gross = Math.max(0, input.grossSalary);

  const deduction = earnedIncomeDeduction(gross);
  const earnedIncomeAmount = Math.max(0, gross - deduction);

  const personalDeduction = Math.max(0, input.dependents) * 150 * MAN;
  const cardDeduction = cardUsageDeduction(gross, Math.max(0, input.cardUsage));
  const incomeDeductionTotal = personalDeduction + cardDeduction;

  const taxBase = Math.max(0, earnedIncomeAmount - incomeDeductionTotal);
  const calculatedTax = Math.max(0, progressiveIncomeTax(taxBase));

  const earnedCredit = earnedIncomeTaxCredit(calculatedTax, gross);
  const pensionCredit = pensionSavingsTaxCredit(gross, Math.max(0, input.pensionContribution));
  const rentCredit = rentTaxCredit(gross, Math.max(0, input.annualRent));
  const taxCreditTotal = earnedCredit + pensionCredit + rentCredit;

  const decidedTax = Math.max(0, calculatedTax - taxCreditTotal);
  const localIncomeTax = decidedTax * 0.1;
  const totalTaxBurden = decidedTax + localIncomeTax;

  const refundOrDue = Math.max(0, input.withheldTax) - totalTaxBurden;

  return {
    earnedIncomeAmount,
    incomeDeductionTotal,
    taxBase,
    calculatedTax,
    taxCreditTotal,
    decidedTax,
    localIncomeTax,
    totalTaxBurden,
    refundOrDue,
  };
}
