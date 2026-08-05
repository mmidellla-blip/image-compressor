"use client";

import { useMemo, useState } from "react";
import {
  MAX_COMBINED_CREDIT_RATE,
  OWNERSHIP_LABELS,
  computeComprehensiveRealEstateTax,
  type ApplicableYear,
  type FilingType,
  type OwnershipType,
} from "@/lib/calculators/comprehensive-real-estate-tax";

const EOK = 100_000_000;

function formatMan(won: number): string {
  return Math.round(won / 10_000).toLocaleString("ko-KR");
}

function formatWon(won: number): string {
  return Math.round(won).toLocaleString("ko-KR");
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1).replace(/\.0$/, "")}%`;
}

export function ComprehensiveRealEstateTaxCalculator() {
  const [publicPriceEok, setPublicPriceEok] = useState(20);
  const [ownershipType, setOwnershipType] = useState<OwnershipType>("residentSingle");
  const [houseCount, setHouseCount] = useState<"2" | "3plus">("2");
  const [applicableYear, setApplicableYear] = useState<ApplicableYear>(2026);

  const [filingType, setFilingType] = useState<FilingType>("single");
  const [age, setAge] = useState(55);
  const [holdingYears, setHoldingYears] = useState(3);

  const result = useMemo(
    () =>
      computeComprehensiveRealEstateTax({
        publicPriceWon: Math.max(0, publicPriceEok) * EOK,
        ownershipType,
        filingType,
        applicableYear,
        age,
        holdingYears,
      }),
    [publicPriceEok, ownershipType, filingType, applicableYear, age, holdingYears],
  );

  return (
    <div className="jbs-calc">
      <div className="jbs-form">
        <div className="jbs-field">
          <label htmlFor="public-price">
            공시가격 합계 <span className="jbs-field-hint">(억 원)</span>
          </label>
          <input
            id="public-price"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.1}
            value={publicPriceEok}
            onChange={(e) => setPublicPriceEok(Number(e.target.value) || 0)}
          />
        </div>

        <div className="jbs-field">
          <label htmlFor="ownership-type">실거주 여부</label>
          <select
            id="ownership-type"
            value={ownershipType}
            onChange={(e) => setOwnershipType(e.target.value as OwnershipType)}
          >
            {Object.entries(OWNERSHIP_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {ownershipType === "multi" && (
          <div className="jbs-field">
            <label htmlFor="house-count">
              주택 수 <span className="jbs-field-hint">(참고용, 세율에는 영향 없음)</span>
            </label>
            <select
              id="house-count"
              value={houseCount}
              onChange={(e) => setHouseCount(e.target.value as "2" | "3plus")}
            >
              <option value="2">2채</option>
              <option value="3plus">3채 이상</option>
            </select>
          </div>
        )}

        <div className="jbs-field">
          <label htmlFor="applicable-year">
            적용 연도 <span className="jbs-field-hint">(공정시장가액비율 단계적 인상)</span>
          </label>
          <select
            id="applicable-year"
            value={applicableYear}
            onChange={(e) => setApplicableYear(Number(e.target.value) as ApplicableYear)}
          >
            <option value={2026}>2026년</option>
            <option value={2027}>2027년</option>
            <option value={2028}>2028년</option>
          </select>
        </div>

        <details className="jbs-details">
          <summary>고령자·장기보유 세액공제 계산해보기</summary>
          <div className="jbs-details-body">
            <p className="jbs-details-note">
              아래 공제는 <strong>실거주 1주택자</strong>에게만 적용됩니다.
            </p>

            <div className="jbs-field">
              <label htmlFor="filing-type">부부 공동명의 여부</label>
              <select
                id="filing-type"
                value={filingType}
                onChange={(e) => setFilingType(e.target.value as FilingType)}
              >
                <option value="single">단독명의</option>
                <option value="joint">공동명의</option>
              </select>
            </div>

            <div className="jbs-field">
              <label htmlFor="age">
                연령 <span className="jbs-field-hint">(만 나이, 60세 이상부터 공제)</span>
              </label>
              <input
                id="age"
                type="number"
                inputMode="numeric"
                min={0}
                max={120}
                disabled={ownershipType !== "residentSingle"}
                value={age}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
              />
            </div>

            <div className="jbs-field">
              <label htmlFor="holding-years">
                보유기간 <span className="jbs-field-hint">(년, 5년 이상부터 공제)</span>
              </label>
              <input
                id="holding-years"
                type="number"
                inputMode="numeric"
                min={0}
                max={60}
                disabled={ownershipType !== "residentSingle"}
                value={holdingYears}
                onChange={(e) => setHoldingYears(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </details>
      </div>

      <div className="jbs-result" aria-live="polite">
        <p className="jbs-total-label">예상 종부세액</p>
        <p className="jbs-total">
          <strong>{formatMan(result.finalTax)}</strong>
          <span>만 원</span>
        </p>

        <ul className="jbs-breakdown">
          <li>
            <span className="jbs-breakdown-label">기본공제</span>
            <span className="jbs-breakdown-value">{formatMan(result.baseDeduction)}만 원</span>
          </li>
          <li>
            <span className="jbs-breakdown-label">공정시장가액비율</span>
            <span className="jbs-breakdown-value">{formatPercent(result.fairMarketRatio)}</span>
          </li>
          <li>
            <span className="jbs-breakdown-label">과세표준</span>
            <span className="jbs-breakdown-value">{formatMan(result.taxBaseTotal)}만 원</span>
          </li>
          <li>
            <span className="jbs-breakdown-label">적용 세율 구간</span>
            <span className="jbs-breakdown-value">{result.topBracketLabel}</span>
          </li>
          <li>
            <span className="jbs-breakdown-label">산출세액</span>
            <span className="jbs-breakdown-value">{formatMan(result.calculatedTax)}만 원</span>
          </li>
          {result.eligibleForCredit && (
            <li>
              <span className="jbs-breakdown-label">
                세액공제 ({formatPercent(result.combinedCreditRate)})
              </span>
              <span className="jbs-breakdown-value">−{formatMan(result.creditAmount)}만 원</span>
            </li>
          )}
        </ul>

        <details className="jbs-steps">
          <summary>계산 과정 펼쳐보기</summary>
          <ol className="jbs-steps-list">
            <li>
              과세표준 = (공시가격 − 기본공제) × 공정시장가액비율 ={" "}
              <strong>{formatWon(result.taxBaseTotal)}원</strong>
              {result.owners.length === 2 && " (공동명의, 두 명 합산)"}
            </li>
            <li>
              해당 구간: <strong>{result.topBracketLabel}</strong> 세율 구간
            </li>
            <li>
              산출세액 = <strong>{formatWon(result.calculatedTax)}원</strong>
            </li>
            <li>
              세액공제 적용 후 ={" "}
              <strong>{formatWon(result.finalTax)}원</strong>
              {result.eligibleForCredit && result.combinedCreditRate > 0
                ? ` (공제율 ${formatPercent(result.combinedCreditRate)} 적용)`
                : " (해당 없음)"}
            </li>
          </ol>
        </details>

        {result.combinedCreditRate >= MAX_COMBINED_CREDIT_RATE && (
          <p className="jbs-note">
            고령자·장기보유 세액공제는 합산 최대 {formatPercent(MAX_COMBINED_CREDIT_RATE)}까지만
            적용됩니다.
          </p>
        )}

        <p className="jbs-disclaimer">
          이 계산기는 2026년 8월 발표된 세제개편안의 핵심 공제 구조만 반영한 간이 추정치이며
          실제 세액과 다를 수 있습니다. 다주택자 거주주택 비중에 따른 추가공제(최대 5억 원)는
          반영되지 않았으니 세무 전문가 확인이 필요하며, 국회 통과 과정에서 세율·공제 기준이
          변경될 수 있습니다. 전년 대비 세부담 급증을 막는 세부담 상한 제도도 별도로 적용되니,
          정확한 금액은 국세청 홈택스 또는 세무사 상담을 통해 확인하세요.
        </p>
      </div>

      <style jsx>{`
        .jbs-calc {
          display: grid;
          gap: 1.25rem;
          margin: 1.25rem 0 1.75rem;
        }
        @media (min-width: 720px) {
          .jbs-calc {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
        .jbs-form {
          display: grid;
          gap: 1rem;
          padding: 1.1rem;
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          align-content: start;
        }
        .jbs-field {
          display: grid;
          gap: 0.4rem;
        }
        .jbs-field label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }
        .jbs-field-hint {
          font-weight: 500;
          color: var(--muted);
          font-size: 0.78rem;
        }
        .jbs-field input,
        .jbs-field select {
          width: 100%;
          padding: 0.6rem 0.7rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 0.95rem;
          box-sizing: border-box;
          background: #fff;
        }
        .jbs-field input:focus,
        .jbs-field select:focus {
          outline: 2px solid #d69e2e;
          outline-offset: 1px;
          border-color: #d69e2e;
        }
        .jbs-field input:disabled {
          background: #f5f5f5;
          color: var(--muted);
        }
        .jbs-details {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.75rem 0.9rem;
        }
        .jbs-details summary {
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 700;
          color: #0f172a;
        }
        .jbs-details-body {
          display: grid;
          gap: 0.9rem;
          margin-top: 0.9rem;
        }
        .jbs-details-note {
          margin: 0;
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.6;
        }
        .jbs-result {
          padding: 1.25rem 1.1rem;
          background: linear-gradient(160deg, #0f1f3d 0%, #16244a 100%);
          border-radius: 16px;
          color: #fff;
        }
        .jbs-total-label {
          margin: 0 0 0.25rem;
          font-size: 0.85rem;
          color: #cbd5e1;
        }
        .jbs-total {
          margin: 0 0 1rem;
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .jbs-total strong {
          font-size: 2rem;
          font-weight: 800;
          color: #f5c344;
          line-height: 1;
        }
        .jbs-total span {
          font-size: 1rem;
          color: #cbd5e1;
        }
        .jbs-breakdown {
          list-style: none;
          margin: 0 0 1rem;
          padding: 0;
          display: grid;
          gap: 0.5rem;
        }
        .jbs-breakdown li {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 0.85rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
        .jbs-breakdown-label {
          color: #cbd5e1;
        }
        .jbs-breakdown-value {
          font-weight: 700;
          white-space: nowrap;
          text-align: right;
        }
        .jbs-steps {
          margin-bottom: 1rem;
          padding: 0.75rem 0.9rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
        }
        .jbs-steps summary {
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 700;
          color: #f5c344;
        }
        .jbs-steps-list {
          margin: 0.75rem 0 0;
          padding-left: 1.1rem;
          font-size: 0.8rem;
          line-height: 1.7;
          color: #e2e8f0;
        }
        .jbs-steps-list li {
          margin-bottom: 0.4rem;
        }
        .jbs-note {
          margin: 0 0 0.9rem;
          font-size: 0.78rem;
          line-height: 1.6;
          color: #e2e8f0;
        }
        .jbs-disclaimer {
          margin: 0;
          font-size: 0.74rem;
          line-height: 1.6;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
