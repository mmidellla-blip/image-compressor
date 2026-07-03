/**
 * 적금 이자 계산기 (단리 vs 복리 비교).
 * 매달 같은 금액을 납입하는 정기적금을 가정합니다. 금액 단위는 원(KRW).
 */

export const INTEREST_INCOME_TAX_RATE = 0.154; // 이자소득세 14% + 지방소득세 1.4%

export type SavingsInterestInput = {
  monthlyDeposit: number;
  months: number;
  annualRatePercent: number;
};

export type SavingsInterestResult = {
  principal: number;
  simpleInterestPreTax: number;
  simpleInterestPostTax: number;
  compoundInterestPreTax: number;
  compoundInterestPostTax: number;
  simpleTotalPostTax: number;
  compoundTotalPostTax: number;
};

/** 단리: 각 회차 납입액이 만기까지 남은 개월 수만큼만 단순 이자를 받는 방식 */
function computeSimpleInterest(monthlyDeposit: number, months: number, annualRate: number): number {
  const n = Math.max(0, Math.floor(months));
  // 각 회차가 남은 개월 수(months, months-1, ..., 1)만큼 이자를 받으므로 등차수열 합 n(n+1)/2 사용
  return monthlyDeposit * annualRate * (n * (n + 1)) / 2 / 12;
}

/** 복리(월복리): 매달 납입액이 남은 기간 동안 월 단위로 재투자되는 방식 */
function computeCompoundInterest(monthlyDeposit: number, months: number, annualRate: number): number {
  const n = Math.max(0, Math.floor(months));
  const monthlyRate = annualRate / 12;

  if (monthlyRate === 0) {
    return 0;
  }

  // 단리와 동일한 타이밍 규약(각 회차가 남은 개월 수만큼 이자를 받음)에 맞추기 위해
  // (1+monthlyRate) 배를 곱해 마지막 회차도 최소 1개월치 복리가 적용되도록 함
  const futureValue =
    monthlyDeposit * (1 + monthlyRate) * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
  return futureValue - monthlyDeposit * n;
}

export function computeSavingsInterest(input: SavingsInterestInput): SavingsInterestResult {
  const monthlyDeposit = Math.max(0, input.monthlyDeposit);
  const months = Math.max(0, Math.floor(input.months));
  const annualRate = Math.max(0, input.annualRatePercent) / 100;

  const principal = monthlyDeposit * months;

  const simpleInterestPreTax = computeSimpleInterest(monthlyDeposit, months, annualRate);
  const compoundInterestPreTax = computeCompoundInterest(monthlyDeposit, months, annualRate);

  const simpleInterestPostTax = simpleInterestPreTax * (1 - INTEREST_INCOME_TAX_RATE);
  const compoundInterestPostTax = compoundInterestPreTax * (1 - INTEREST_INCOME_TAX_RATE);

  return {
    principal,
    simpleInterestPreTax,
    simpleInterestPostTax,
    compoundInterestPreTax,
    compoundInterestPostTax,
    simpleTotalPostTax: principal + simpleInterestPostTax,
    compoundTotalPostTax: principal + compoundInterestPostTax,
  };
}
