"use client";

import { useMemo, useState } from "react";
import {
  ACCOUNT_MAX_SCORE,
  DEPENDENTS_MAX_SCORE,
  NO_HOUSE_MAX_SCORE,
  TOTAL_MAX_SCORE,
  computeSubscriptionScore,
  interpretScore,
} from "@/lib/calculators/subscription-score";

export function SubscriptionScoreCalculator() {
  const [noHouseYears, setNoHouseYears] = useState(5);
  const [dependents, setDependents] = useState(1);
  const [accountYears, setAccountYears] = useState(5);
  const [accountMonths, setAccountMonths] = useState(0);

  const result = useMemo(
    () =>
      computeSubscriptionScore({
        noHouseYears,
        dependents,
        accountYears,
        accountMonths,
      }),
    [noHouseYears, dependents, accountYears, accountMonths],
  );

  const level = useMemo(() => interpretScore(result.totalScore), [result.totalScore]);

  return (
    <div className="score-calc">
      <div className="score-form">
        <div className="score-field">
          <label htmlFor="no-house-years">
            무주택기간 <span className="score-field-hint">(년, 만 나이 기준)</span>
          </label>
          <input
            id="no-house-years"
            type="number"
            inputMode="numeric"
            min={0}
            max={30}
            value={noHouseYears}
            onChange={(e) => setNoHouseYears(Number(e.target.value) || 0)}
          />
        </div>

        <div className="score-field">
          <label htmlFor="dependents">
            부양가족 수 <span className="score-field-hint">(본인 제외)</span>
          </label>
          <input
            id="dependents"
            type="number"
            inputMode="numeric"
            min={0}
            max={10}
            value={dependents}
            onChange={(e) => setDependents(Number(e.target.value) || 0)}
          />
        </div>

        <div className="score-field">
          <label htmlFor="account-years">청약통장 가입기간</label>
          <div className="score-field-row">
            <div className="score-field-sub">
              <input
                id="account-years"
                type="number"
                inputMode="numeric"
                min={0}
                max={30}
                value={accountYears}
                onChange={(e) => setAccountYears(Number(e.target.value) || 0)}
              />
              <span>년</span>
            </div>
            <div className="score-field-sub">
              <input
                id="account-months"
                type="number"
                inputMode="numeric"
                min={0}
                max={11}
                value={accountMonths}
                onChange={(e) => setAccountMonths(Number(e.target.value) || 0)}
              />
              <span>개월</span>
            </div>
          </div>
        </div>
      </div>

      <div className="score-result" aria-live="polite">
        <p className="score-total-label">예상 청약 가점</p>
        <p className="score-total">
          <strong>{result.totalScore}</strong>
          <span> / {TOTAL_MAX_SCORE}점</span>
        </p>

        <ul className="score-breakdown">
          <li>
            <span className="score-breakdown-label">무주택기간</span>
            <span className="score-breakdown-value">
              {result.noHouseScore} / {NO_HOUSE_MAX_SCORE}점
            </span>
          </li>
          <li>
            <span className="score-breakdown-label">부양가족수</span>
            <span className="score-breakdown-value">
              {result.dependentsScore} / {DEPENDENTS_MAX_SCORE}점
            </span>
          </li>
          <li>
            <span className="score-breakdown-label">청약통장 가입기간</span>
            <span className="score-breakdown-value">
              {result.accountScore} / {ACCOUNT_MAX_SCORE}점
            </span>
          </li>
        </ul>

        <div className="score-level">
          <p className="score-level-label">
            이 점수는 <strong>{level.label}</strong>입니다
          </p>
          <p className="score-level-message">{level.message}</p>
        </div>

        <p className="score-disclaimer">
          이 계산기는 주택공급에 관한 규칙상 가점제 산정 기준을 참고해 만들었습니다.
          실제 청약 접수 시스템(청약홈)의 산정 결과와 다를 수 있으니, 청약 신청 전에는
          반드시 청약홈에서 공식 가점을 다시 확인하세요. 위 해석 문구는 참고용이며 실제
          당첨 커트라인은 지역·단지·시기·공급 물량에 따라 달라집니다.
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
        .score-field input {
          width: 100%;
          padding: 0.6rem 0.7rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 1rem;
          box-sizing: border-box;
        }
        .score-field input:focus {
          outline: 2px solid #d69e2e;
          outline-offset: 1px;
          border-color: #d69e2e;
        }
        .score-field-row {
          display: flex;
          gap: 0.6rem;
        }
        .score-field-sub {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .score-field-sub input {
          width: 100%;
        }
        .score-field-sub span {
          font-size: 0.85rem;
          color: var(--muted);
          white-space: nowrap;
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
        }
        .score-total strong {
          font-size: 2.4rem;
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
        .score-level {
          padding: 0.85rem 0.9rem;
          background: rgba(245, 195, 68, 0.12);
          border: 1px solid rgba(245, 195, 68, 0.35);
          border-radius: 12px;
          margin-bottom: 0.9rem;
        }
        .score-level-label {
          margin: 0 0 0.35rem;
          font-size: 0.92rem;
        }
        .score-level-label strong {
          color: #f5c344;
        }
        .score-level-message {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.6;
          color: #e2e8f0;
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
