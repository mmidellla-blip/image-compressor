"use client";

import { useMemo, useState } from "react";
import {
  CREDIT_SCORE_MAX,
  CREDIT_SCORE_MIN,
  DELINQUENCY_OPTIONS,
  NEW_CREDIT_OPTIONS,
  UTILIZATION_OPTIONS,
  describeCreditScoreBand,
  simulateCreditScore,
  type DelinquencyScenario,
  type NewCreditScenario,
  type UtilizationScenario,
} from "@/lib/calculators/credit-score";

export function CreditScoreSimulator() {
  const [baseScore, setBaseScore] = useState(700);
  const [delinquency, setDelinquency] = useState<DelinquencyScenario>("none");
  const [newCredit, setNewCredit] = useState<NewCreditScenario>("none");
  const [utilization, setUtilization] = useState<UtilizationScenario>("low");

  const result = useMemo(
    () => simulateCreditScore({ baseScore, delinquency, newCredit, utilization }),
    [baseScore, delinquency, newCredit, utilization],
  );

  const minBand = useMemo(() => describeCreditScoreBand(result.minScore), [result.minScore]);
  const maxBand = useMemo(() => describeCreditScoreBand(result.maxScore), [result.maxScore]);

  return (
    <div className="score-calc">
      <div className="score-form">
        <div className="score-field">
          <label htmlFor="base-score">
            현재(또는 가정) 신용점수 <span className="score-field-hint">(0~1000)</span>
          </label>
          <input
            id="base-score"
            type="number"
            inputMode="numeric"
            min={CREDIT_SCORE_MIN}
            max={CREDIT_SCORE_MAX}
            value={baseScore}
            onChange={(e) => setBaseScore(Number(e.target.value) || 0)}
          />
        </div>

        <div className="score-field">
          <label htmlFor="delinquency">연체 시나리오</label>
          <select
            id="delinquency"
            value={delinquency}
            onChange={(e) => setDelinquency(e.target.value as DelinquencyScenario)}
          >
            {Object.entries(DELINQUENCY_OPTIONS).map(([key, v]) => (
              <option key={key} value={key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="score-field">
          <label htmlFor="new-credit">신규 대출·카드 시나리오</label>
          <select
            id="new-credit"
            value={newCredit}
            onChange={(e) => setNewCredit(e.target.value as NewCreditScenario)}
          >
            {Object.entries(NEW_CREDIT_OPTIONS).map(([key, v]) => (
              <option key={key} value={key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div className="score-field">
          <label htmlFor="utilization">카드 한도 사용률</label>
          <select
            id="utilization"
            value={utilization}
            onChange={(e) => setUtilization(e.target.value as UtilizationScenario)}
          >
            {Object.entries(UTILIZATION_OPTIONS).map(([key, v]) => (
              <option key={key} value={key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="score-result" aria-live="polite">
        <p className="score-total-label">시나리오 적용 후 예상 점수 범위</p>
        <p className="score-total">
          <strong>
            {result.minScore}~{result.maxScore}
          </strong>
          <span> / {CREDIT_SCORE_MAX}점</span>
        </p>

        <ul className="score-breakdown">
          <li>
            <span className="score-breakdown-label">예상 변화폭</span>
            <span className="score-breakdown-value">
              {result.minDelta}~{result.maxDelta}점
            </span>
          </li>
          <li>
            <span className="score-breakdown-label">최저 시나리오 구간</span>
            <span className="score-breakdown-value">{minBand.label}</span>
          </li>
          <li>
            <span className="score-breakdown-label">최고 시나리오 구간</span>
            <span className="score-breakdown-value">{maxBand.label}</span>
          </li>
        </ul>

        <p className="score-disclaimer">
          신용평가사(NICE·KCB 등)의 실제 산정 알고리즘은 공개되어 있지 않습니다. 위 범위는
          일반적으로 알려진 경향을 참고한 예시일 뿐, 실제 점수 변화와 다를 수 있습니다. 정확한
          신용점수는 각 신용평가사·은행 앱에서 무료로 조회할 수 있습니다.
        </p>
      </div>

      <style jsx>{`
        .score-calc {
          display: grid;
          gap: 1.25rem;
          margin: 1.25rem 0 1.75rem;
        }
        @media (min-width: 720px) {
          .score-calc {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        .score-form {
          display: grid;
          gap: 1rem;
          padding: 1.1rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
        }
        .score-field {
          display: grid;
          gap: 0.4rem;
        }
        .score-field label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }
        .score-field-hint {
          font-weight: 500;
          color: var(--muted);
          font-size: 0.78rem;
        }
        .score-field input,
        .score-field select {
          width: 100%;
          padding: 0.6rem 0.7rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 0.95rem;
          box-sizing: border-box;
          background: #fff;
        }
        .score-field input:focus,
        .score-field select:focus {
          outline: 2px solid #d69e2e;
          outline-offset: 1px;
          border-color: #d69e2e;
        }
        .score-result {
          padding: 1.25rem 1.1rem;
          background: linear-gradient(160deg, #0f1f3d 0%, #16244a 100%);
          border-radius: 16px;
          color: #fff;
        }
        .score-total-label {
          margin: 0 0 0.25rem;
          font-size: 0.85rem;
          color: #cbd5e1;
        }
        .score-total {
          margin: 0 0 1rem;
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .score-total strong {
          font-size: 2rem;
          font-weight: 800;
          color: #f5c344;
          line-height: 1;
        }
        .score-total span {
          font-size: 1rem;
          color: #cbd5e1;
        }
        .score-breakdown {
          list-style: none;
          margin: 0 0 1.1rem;
          padding: 0;
          display: grid;
          gap: 0.5rem;
        }
        .score-breakdown li {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        .score-breakdown-label {
          color: #cbd5e1;
        }
        .score-breakdown-value {
          font-weight: 700;
        }
        .score-disclaimer {
          margin: 0;
          font-size: 0.74rem;
          line-height: 1.6;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
