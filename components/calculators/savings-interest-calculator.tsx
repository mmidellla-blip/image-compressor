"use client";

import { useMemo, useState } from "react";
import { computeSavingsInterest } from "@/lib/calculators/savings-interest";

function formatWon(v: number): string {
  return Math.round(v).toLocaleString("ko-KR");
}

export function SavingsInterestCalculator() {
  const [monthlyDepositMan, setMonthlyDepositMan] = useState(30);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(3.5);

  const result = useMemo(
    () =>
      computeSavingsInterest({
        monthlyDeposit: monthlyDepositMan * 10_000,
        months,
        annualRatePercent: rate,
      }),
    [monthlyDepositMan, months, rate],
  );

  return (
    <div className="sav-calc">
      <div className="sav-form">
        <div className="sav-field">
          <label htmlFor="monthly-deposit">
            매달 납입액 <span className="sav-field-hint">(만원)</span>
          </label>
          <input
            id="monthly-deposit"
            type="number"
            inputMode="numeric"
            min={0}
            value={monthlyDepositMan}
            onChange={(e) => setMonthlyDepositMan(Number(e.target.value) || 0)}
          />
        </div>

        <div className="sav-field">
          <label htmlFor="months">
            적금 기간 <span className="sav-field-hint">(개월)</span>
          </label>
          <input
            id="months"
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 0)}
          />
        </div>

        <div className="sav-field">
          <label htmlFor="rate">
            연 이자율 <span className="sav-field-hint">(%, 세전 기준)</span>
          </label>
          <input
            id="rate"
            type="number"
            inputMode="decimal"
            min={0}
            max={20}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="sav-result" aria-live="polite">
        <p className="sav-total-label">만기 시 세후 수령액 비교</p>

        <div className="sav-compare">
          <div className="sav-compare-card">
            <span className="sav-compare-tag">단리</span>
            <strong>{formatWon(result.simpleTotalPostTax)}원</strong>
            <span className="sav-compare-sub">
              이자 {formatWon(result.simpleInterestPostTax)}원 (세전 {formatWon(result.simpleInterestPreTax)}원)
            </span>
          </div>
          <div className="sav-compare-card sav-compare-card--highlight">
            <span className="sav-compare-tag">복리(월복리)</span>
            <strong>{formatWon(result.compoundTotalPostTax)}원</strong>
            <span className="sav-compare-sub">
              이자 {formatWon(result.compoundInterestPostTax)}원 (세전 {formatWon(result.compoundInterestPreTax)}원)
            </span>
          </div>
        </div>

        <p className="sav-diff">
          복리가 단리보다{" "}
          <strong>
            {formatWon(result.compoundTotalPostTax - result.simpleTotalPostTax)}원
          </strong>{" "}
          더 많습니다. 적금은 매달 나눠 납입하는 구조라, 예금과 달리 단리·복리 차이가 크게
          벌어지지 않는 경우가 많습니다.
        </p>

        <p className="sav-disclaimer">
          이자소득세 15.4%(이자소득세 14% + 지방소득세 1.4%)를 반영한 세후 금액입니다.
          실제 상품은 우대금리 조건, 비과세·세금우대 여부에 따라 결과가 달라질 수 있습니다.
        </p>
      </div>

      <style jsx>{`
        .sav-calc {
          display: grid;
          gap: 1.25rem;
          margin: 1.25rem 0 1.75rem;
        }
        @media (min-width: 720px) {
          .sav-calc {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        .sav-form {
          display: grid;
          gap: 1rem;
          padding: 1.1rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
        }
        .sav-field {
          display: grid;
          gap: 0.4rem;
        }
        .sav-field label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }
        .sav-field-hint {
          font-weight: 500;
          color: var(--muted);
          font-size: 0.78rem;
        }
        .sav-field input {
          width: 100%;
          padding: 0.6rem 0.7rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }
        .sav-field input:focus {
          outline: 2px solid #d69e2e;
          outline-offset: 1px;
          border-color: #d69e2e;
        }
        .sav-result {
          padding: 1.25rem 1.1rem;
          background: linear-gradient(160deg, #0f1f3d 0%, #16244a 100%);
          border-radius: 16px;
          color: #fff;
        }
        .sav-total-label {
          margin: 0 0 0.75rem;
          font-size: 0.85rem;
          color: #cbd5e1;
        }
        .sav-compare {
          display: grid;
          gap: 0.7rem;
          margin-bottom: 1rem;
        }
        .sav-compare-card {
          display: grid;
          gap: 0.2rem;
          padding: 0.75rem 0.85rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .sav-compare-card--highlight {
          border-color: rgba(245, 195, 68, 0.5);
          background: rgba(245, 195, 68, 0.12);
        }
        .sav-compare-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #cbd5e1;
        }
        .sav-compare-card strong {
          font-size: 1.4rem;
          font-weight: 800;
          color: #f5c344;
        }
        .sav-compare-sub {
          font-size: 0.76rem;
          color: #94a3b8;
        }
        .sav-diff {
          margin: 0 0 1rem;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #e2e8f0;
        }
        .sav-diff strong {
          color: #f5c344;
        }
        .sav-disclaimer {
          margin: 0;
          font-size: 0.74rem;
          line-height: 1.6;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
