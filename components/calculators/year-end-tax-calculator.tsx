"use client";

import { useMemo, useState } from "react";
import { computeYearEndTax } from "@/lib/calculators/year-end-tax";

const MAN = 10_000;

function formatWon(v: number): string {
  return Math.round(v).toLocaleString("ko-KR");
}

export function YearEndTaxCalculator() {
  const [grossSalaryMan, setGrossSalaryMan] = useState(4000);
  const [withheldTaxMan, setWithheldTaxMan] = useState(150);
  const [dependents, setDependents] = useState(1);
  const [cardUsageMan, setCardUsageMan] = useState(1500);
  const [pensionMan, setPensionMan] = useState(0);
  const [rentMan, setRentMan] = useState(0);

  const result = useMemo(
    () =>
      computeYearEndTax({
        grossSalary: grossSalaryMan * MAN,
        withheldTax: withheldTaxMan * MAN,
        dependents,
        cardUsage: cardUsageMan * MAN,
        pensionContribution: pensionMan * MAN,
        annualRent: rentMan * MAN,
      }),
    [grossSalaryMan, withheldTaxMan, dependents, cardUsageMan, pensionMan, rentMan],
  );

  const isRefund = result.refundOrDue >= 0;

  return (
    <div className="tax-calc">
      <div className="tax-form">
        <div className="tax-field">
          <label htmlFor="gross-salary">
            연간 총급여 <span className="tax-field-hint">(만원)</span>
          </label>
          <input
            id="gross-salary"
            type="number"
            inputMode="numeric"
            min={0}
            value={grossSalaryMan}
            onChange={(e) => setGrossSalaryMan(Number(e.target.value) || 0)}
          />
        </div>

        <div className="tax-field">
          <label htmlFor="withheld-tax">
            기납부세액 <span className="tax-field-hint">(만원, 급여명세서 합계)</span>
          </label>
          <input
            id="withheld-tax"
            type="number"
            inputMode="numeric"
            min={0}
            value={withheldTaxMan}
            onChange={(e) => setWithheldTaxMan(Number(e.target.value) || 0)}
          />
        </div>

        <div className="tax-field">
          <label htmlFor="dependents">
            부양가족 수 <span className="tax-field-hint">(본인 포함)</span>
          </label>
          <input
            id="dependents"
            type="number"
            inputMode="numeric"
            min={1}
            max={10}
            value={dependents}
            onChange={(e) => setDependents(Number(e.target.value) || 1)}
          />
        </div>

        <div className="tax-field">
          <label htmlFor="card-usage">
            신용카드 등 연간 사용액 <span className="tax-field-hint">(만원)</span>
          </label>
          <input
            id="card-usage"
            type="number"
            inputMode="numeric"
            min={0}
            value={cardUsageMan}
            onChange={(e) => setCardUsageMan(Number(e.target.value) || 0)}
          />
        </div>

        <div className="tax-field">
          <label htmlFor="pension">
            연금저축·IRP 연간 납입액 <span className="tax-field-hint">(만원)</span>
          </label>
          <input
            id="pension"
            type="number"
            inputMode="numeric"
            min={0}
            value={pensionMan}
            onChange={(e) => setPensionMan(Number(e.target.value) || 0)}
          />
        </div>

        <div className="tax-field">
          <label htmlFor="rent">
            연간 월세 총액 <span className="tax-field-hint">(만원, 해당 시)</span>
          </label>
          <input
            id="rent"
            type="number"
            inputMode="numeric"
            min={0}
            value={rentMan}
            onChange={(e) => setRentMan(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="tax-result" aria-live="polite">
        <p className="tax-total-label">{isRefund ? "예상 환급액" : "예상 추가 납부액"}</p>
        <p className="tax-total">
          <strong>{formatWon(Math.abs(result.refundOrDue))}</strong>
          <span>원</span>
        </p>

        <ul className="tax-breakdown">
          <li>
            <span className="tax-breakdown-label">근로소득금액</span>
            <span className="tax-breakdown-value">{formatWon(result.earnedIncomeAmount)}원</span>
          </li>
          <li>
            <span className="tax-breakdown-label">소득공제 합계</span>
            <span className="tax-breakdown-value">{formatWon(result.incomeDeductionTotal)}원</span>
          </li>
          <li>
            <span className="tax-breakdown-label">과세표준</span>
            <span className="tax-breakdown-value">{formatWon(result.taxBase)}원</span>
          </li>
          <li>
            <span className="tax-breakdown-label">산출세액</span>
            <span className="tax-breakdown-value">{formatWon(result.calculatedTax)}원</span>
          </li>
          <li>
            <span className="tax-breakdown-label">세액공제 합계</span>
            <span className="tax-breakdown-value">{formatWon(result.taxCreditTotal)}원</span>
          </li>
          <li>
            <span className="tax-breakdown-label">결정세액 + 지방소득세</span>
            <span className="tax-breakdown-value">{formatWon(result.totalTaxBurden)}원</span>
          </li>
        </ul>

        <p className="tax-disclaimer">
          이 계산기는 근로소득공제·인적공제·신용카드 소득공제·누진세율·근로소득세액공제·
          연금저축·월세 세액공제의 핵심 구조만 반영한 간이 추정치입니다. 보험료·의료비·
          기부금 등 다른 공제 항목은 반영되지 않았으며, 실제 결정세액과 다를 수 있습니다.
          정확한 금액은 국세청 홈택스 연말정산 미리보기에서 확인하세요.
        </p>
      </div>

      <style jsx>{`
        .tax-calc {
          display: grid;
          gap: 1.25rem;
          margin: 1.25rem 0 1.75rem;
        }
        @media (min-width: 720px) {
          .tax-calc {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        .tax-form {
          display: grid;
          gap: 1rem;
          padding: 1.1rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
        }
        .tax-field {
          display: grid;
          gap: 0.4rem;
        }
        .tax-field label {
          font-size: 0.86rem;
          font-weight: 700;
          color: #0f172a;
        }
        .tax-field-hint {
          font-weight: 500;
          color: var(--muted);
          font-size: 0.76rem;
        }
        .tax-field input {
          width: 100%;
          padding: 0.6rem 0.7rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }
        .tax-field input:focus {
          outline: 2px solid #d69e2e;
          outline-offset: 1px;
          border-color: #d69e2e;
        }
        .tax-result {
          padding: 1.25rem 1.1rem;
          background: linear-gradient(160deg, #0f1f3d 0%, #16244a 100%);
          border-radius: 16px;
          color: #fff;
        }
        .tax-total-label {
          margin: 0 0 0.25rem;
          font-size: 0.85rem;
          color: #cbd5e1;
        }
        .tax-total {
          margin: 0 0 1rem;
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .tax-total strong {
          font-size: 1.9rem;
          font-weight: 800;
          color: #f5c344;
          line-height: 1;
        }
        .tax-total span {
          font-size: 1rem;
          color: #cbd5e1;
        }
        .tax-breakdown {
          list-style: none;
          margin: 0 0 1.1rem;
          padding: 0;
          display: grid;
          gap: 0.5rem;
        }
        .tax-breakdown li {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 0.85rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        .tax-breakdown-label {
          color: #cbd5e1;
        }
        .tax-breakdown-value {
          font-weight: 700;
          white-space: nowrap;
        }
        .tax-disclaimer {
          margin: 0;
          font-size: 0.74rem;
          line-height: 1.6;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
