/**
 * 신용점수 시뮬레이터 계산 로직.
 *
 * 주의: NICE·KCB 등 신용평가사의 실제 산정 알고리즘은 공개되어 있지 않습니다.
 * 이 시뮬레이터는 "일반적으로 알려진 경향"을 참고해 시나리오별 예상 변화 폭을
 * 범위(최소~최대)로 보여주는 참고용 도구이며, 정확한 점수 변화를 보장하지 않습니다.
 */

export const CREDIT_SCORE_MIN = 0;
export const CREDIT_SCORE_MAX = 1000;

export type DelinquencyScenario = "none" | "shortPaid" | "shortUnpaid" | "long";
export type NewCreditScenario = "none" | "oneLoan" | "multiple";
export type UtilizationScenario = "low" | "mid" | "high";

const DELINQUENCY_IMPACT: Record<DelinquencyScenario, { min: number; max: number; label: string }> = {
  none: { min: 0, max: 0, label: "연체 없음" },
  shortPaid: {
    min: 0,
    max: 0,
    label: "며칠 내 상환한 단기 연체 (등록 기준 이전)",
  },
  shortUnpaid: {
    min: -70,
    max: -20,
    label: "단기 연체 (10만원 이상, 5일~1개월 지속)",
  },
  long: { min: -200, max: -70, label: "장기 연체 (수개월 이상 지속)" },
};

const NEW_CREDIT_IMPACT: Record<NewCreditScenario, { min: number; max: number; label: string }> = {
  none: { min: 0, max: 0, label: "신규 대출·카드 없음" },
  oneLoan: { min: -30, max: -5, label: "신용대출 1건 추가" },
  multiple: {
    min: -60,
    max: -15,
    label: "단기간 여러 건 신규 대출·카드 개설 또는 조회",
  },
};

const UTILIZATION_IMPACT: Record<UtilizationScenario, { min: number; max: number; label: string }> = {
  low: { min: 0, max: 10, label: "카드 한도 사용률 30% 미만" },
  mid: { min: -10, max: 0, label: "카드 한도 사용률 30~70%" },
  high: { min: -40, max: -10, label: "카드 한도 사용률 70% 이상" },
};

export const DELINQUENCY_OPTIONS = DELINQUENCY_IMPACT;
export const NEW_CREDIT_OPTIONS = NEW_CREDIT_IMPACT;
export const UTILIZATION_OPTIONS = UTILIZATION_IMPACT;

export type CreditScoreSimInput = {
  baseScore: number;
  delinquency: DelinquencyScenario;
  newCredit: NewCreditScenario;
  utilization: UtilizationScenario;
};

export type CreditScoreSimResult = {
  minScore: number;
  maxScore: number;
  minDelta: number;
  maxDelta: number;
};

function clampScore(v: number): number {
  return Math.max(CREDIT_SCORE_MIN, Math.min(CREDIT_SCORE_MAX, Math.round(v)));
}

export function simulateCreditScore(input: CreditScoreSimInput): CreditScoreSimResult {
  const d = DELINQUENCY_IMPACT[input.delinquency];
  const n = NEW_CREDIT_IMPACT[input.newCredit];
  const u = UTILIZATION_IMPACT[input.utilization];

  const minDelta = d.min + n.min + u.min;
  const maxDelta = d.max + n.max + u.max;

  const minScore = clampScore(input.baseScore + minDelta);
  const maxScore = clampScore(input.baseScore + maxDelta);

  return {
    minScore: Math.min(minScore, maxScore),
    maxScore: Math.max(minScore, maxScore),
    minDelta,
    maxDelta,
  };
}

export type CreditScoreBand = { label: string; description: string };

/** 참고용 대략적 구간. 신용평가사·금융사마다 기준이 달라 실제 대출 심사 결과와 다를 수 있음. */
export function describeCreditScoreBand(score: number): CreditScoreBand {
  if (score >= 900) {
    return { label: "매우 우수", description: "대체로 우량 등급으로 분류되는 구간으로 알려져 있습니다." };
  }
  if (score >= 800) {
    return { label: "우수", description: "안정적인 신용 이력을 가진 구간으로 알려져 있습니다." };
  }
  if (score >= 700) {
    return { label: "양호", description: "무난한 구간이지만 금융사별 우대 조건은 다를 수 있습니다." };
  }
  if (score >= 600) {
    return { label: "보통", description: "대출·카드 심사에서 조건이 다소 불리해질 수 있는 구간입니다." };
  }
  if (score >= 500) {
    return { label: "주의", description: "심사 시 한도·금리에서 불리하게 작용할 가능성이 있는 구간입니다." };
  }
  return { label: "위험", description: "신용 거래에 상당한 제약이 있을 수 있는 구간입니다." };
}
