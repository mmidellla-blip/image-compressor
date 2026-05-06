"use client";

import { formatBytes, reductionPercent } from "@/lib/format-bytes";

type ResultSummaryProps = {
  originalBytes: number | null;
  resultBytes: number | null;
  loading?: boolean;
  error?: string | null;
  downloadUrl?: string | null;
  downloadName?: string;
  downloadLabel?: string;
};

export function ResultSummary({
  originalBytes,
  resultBytes,
  loading,
  error,
  downloadUrl,
  downloadName = "result.bin",
  downloadLabel = "결과 다운로드",
}: ResultSummaryProps) {
  const reduction =
    originalBytes !== null && resultBytes !== null
      ? reductionPercent(originalBytes, resultBytes)
      : null;

  return (
    <div className="rs">
      {loading ? <p className="rs-loading">처리 중…</p> : null}
      {error ? <p className="rs-error">{error}</p> : null}

      {originalBytes !== null && (
        <dl className="rs-stats">
          <div>
            <dt>원본 크기</dt>
            <dd>{formatBytes(originalBytes)}</dd>
          </div>
          {resultBytes !== null && (
            <div>
              <dt>결과 크기</dt>
              <dd>{formatBytes(resultBytes)}</dd>
            </div>
          )}
          {reduction !== null && resultBytes !== null && (
            <div>
              <dt>감소율</dt>
              <dd className="rs-highlight">{reduction}%</dd>
            </div>
          )}
        </dl>
      )}

      {downloadUrl ? (
        <p className="rs-download-wrap">
          <a className="rs-download" href={downloadUrl} download={downloadName}>
            {downloadLabel}
          </a>
        </p>
      ) : null}

      <style jsx>{`
        .rs {
          margin-top: 1rem;
        }
        .rs-loading {
          margin: 0 0 0.75rem;
          font-weight: 600;
          color: var(--muted);
        }
        .rs-error {
          margin: 0 0 0.75rem;
          color: #b91c1c;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .rs-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
          gap: 0.75rem;
          margin: 0;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 10px;
        }
        .rs-stats dt {
          font-size: 0.72rem;
          color: var(--muted);
          margin: 0;
        }
        .rs-stats dd {
          margin: 0.2rem 0 0;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .rs-highlight {
          color: var(--accent);
        }
        .rs-download-wrap {
          margin: 1rem 0 0;
          text-align: center;
        }
        .rs-download {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0.65rem 1.2rem;
          font-weight: 700;
          font-size: 1.05rem;
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
          color: #fff !important;
          border-radius: 10px;
          text-decoration: none;
          width: 100%;
          max-width: 100%;
        }
        .rs-download:hover {
          filter: brightness(0.95);
        }
      `}</style>
    </div>
  );
}
