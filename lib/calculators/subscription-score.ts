/**
 * 주택청약 가점제 산정 기준 (주택공급에 관한 규칙 별표1 기준)
 * 무주택기간 32점 + 부양가족수 35점 + 청약통장 가입기간 17점 = 총 84점 만점
 */

export const NO_HOUSE_MAX_SCORE = 32;
export const DEPENDENTS_MAX_SCORE = 35;
export const ACCOUNT_MAX_SCORE = 17;
export const TOTAL_MAX_SCORE =
  NO_HOUSE_MAX_SCORE + DEPENDENTS_MAX_SCORE + ACCOUNT_MAX_SCORE;

/** 무주택기간(년) → 점수. 1년 미만 2점부터 시작해 1년마다 2점씩, 15년 이상 32점(만점). */
export function computeNoHouseScore(years: number): number {
  const y = Math.max(0, Math.floor(years));
  return 2 * Math.min(y, 15) + 2;
}

/** 부양가족수(본인 제외) → 점수. 0명 5점부터 1명당 5점씩, 6명 이상 35점(만점). */
export function computeDependentsScore(dependents: number): number {
  const d = Math.max(0, Math.floor(dependents));
  return 5 * Math.min(d, 6) + 5;
}

/**
 * 청약통장 가입기간(년/개월) → 점수.
 * 6개월 미만 1점, 6개월~1년 미만 2점, 이후 1년마다 1점씩 추가, 15년 이상 17점(만점).
 */
export function computeAccountScore(years: number, months: number): number {
  const totalMonths =
    Math.max(0, Math.floor(years)) * 12 + Math.max(0, Math.floor(months));

  if (totalMonths < 6) return 1;
  if (totalMonths < 12) return 2;

  const fullYears = Math.min(Math.floor(totalMonths / 12), 15);
  return fullYears + 2;
}

export type SubscriptionScoreInput = {
  noHouseYears: number;
  dependents: number;
  accountYears: number;
  accountMonths: number;
};

export type SubscriptionScoreResult = {
  noHouseScore: number;
  dependentsScore: number;
  accountScore: number;
  totalScore: number;
};

export function computeSubscriptionScore(
  input: SubscriptionScoreInput,
): SubscriptionScoreResult {
  const noHouseScore = computeNoHouseScore(input.noHouseYears);
  const dependentsScore = computeDependentsScore(input.dependents);
  const accountScore = computeAccountScore(
    input.accountYears,
    input.accountMonths,
  );

  return {
    noHouseScore,
    dependentsScore,
    accountScore,
    totalScore: noHouseScore + dependentsScore + accountScore,
  };
}

export type ScoreLevel = {
  label: string;
  message: string;
};

/** 총점 구간별 참고용 해석. 실제 당첨 커트라인은 지역·시기·공급물량에 따라 다름. */
export function interpretScore(totalScore: number): ScoreLevel {
  if (totalScore >= 70) {
    return {
      label: "매우 높은 편",
      message:
        "수도권 인기 단지의 가점제 당첨 커트라인이 60~70점대에서 형성되는 경우가 많다고 알려져 있어, 인기 지역 청약도 도전해볼 만한 점수대입니다.",
    };
  }
  if (totalScore >= 50) {
    return {
      label: "높은 편",
      message:
        "가점제 평균보다 높은 편에 속합니다. 지역·단지에 따라 당첨권에 들 가능성이 있습니다.",
    };
  }
  if (totalScore >= 30) {
    return {
      label: "중간 정도",
      message:
        "인기 지역·단지는 경쟁이 있을 수 있어, 상대적으로 경쟁이 덜한 지역이나 특별공급 요건도 함께 확인해보는 것이 좋습니다.",
    };
  }
  return {
    label: "낮은 편",
    message:
      "가점제만으로는 당첨이 쉽지 않을 수 있어, 추첨제 물량이나 특별공급(신혼부부·생애최초 등) 요건을 함께 확인해보는 것을 권합니다.",
  };
}
