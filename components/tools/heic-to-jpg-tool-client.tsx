"use client";

import { useCallback, useMemo, useState } from "react";
import { BrowserNotice } from "@/components/tools/browser-notice";
import { validateSingleImageFile } from "@/lib/validate-upload";

type ConvertedItem = {
  id: string;
  name: string;
  originalBytes: number;
  resultBytes: number;
  url: string;
};

export function HeicToJpgToolClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ConvertedItem[]>([]);

  const revokeAll = useCallback((list: ConvertedItem[]) => {
    for (const x of list) URL.revokeObjectURL(x.url);
  }, []);

  const resetItems = useCallback(() => {
    setItems((prev) => {
      revokeAll(prev);
      return [];
    });
  }, [revokeAll]);

  const totalOriginal = useMemo(
    () => items.reduce((sum, x) => sum + x.originalBytes, 0),
    [items],
  );
  const totalResult = useMemo(
    () => items.reduce((sum, x) => sum + x.resultBytes, 0),
    [items],
  );

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    setLoading(true);
    setError(null);
    resetItems();

    try {
      const next: ConvertedItem[] = [];

      for (const f of files) {
        const sizeErr = validateSingleImageFile(f);
        if (sizeErr) throw new Error(`${f.name}: ${sizeErr}`);

        const isHeicLike =
          /heic|heif/i.test(f.type) || /\.(heic|heif)$/i.test(f.name);
        if (!isHeicLike) {
          throw new Error(
            `${f.name}: HEIC/HEIF 파일만 변환할 수 있습니다. 아이폰 원본 파일을 선택해 주세요.`,
          );
        }

        const { default: heic2any } = await import("heic2any");
        const output = await heic2any({
          blob: f,
          toType: "image/jpeg",
          quality: 0.9,
        });
        const blob = Array.isArray(output) ? output[0] : output;
        const url = URL.createObjectURL(blob);
        const base = f.name.replace(/\.[^.]+$/, "") || "iphone-photo";

        next.push({
          id: `${f.name}-${f.size}-${f.lastModified}`,
          name: `${base}.jpg`,
          originalBytes: f.size,
          resultBytes: blob.size,
          url,
        });
      }

      setItems(next);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "HEIC 변환에 실패했습니다. 파일을 다시 선택해 주세요.",
      );
    } finally {
      setLoading(false);
      input.value = "";
    }
  };

  return (
    <section className="tool-ui" aria-label="HEIC JPG 변환">
      <BrowserNotice />
      <div className="tool-card-wrap">
        <label className="lbl" htmlFor="heic-files">
          HEIC 파일 선택 (여러 장 가능)
        </label>
        <input
          id="heic-files"
          type="file"
          accept=".heic,.heif,image/heic,image/heif"
          multiple
          className="file-in"
          onChange={(e) => void onPick(e)}
          disabled={loading}
        />
        <p className="hint">
          HEIC 파일이 업로드되지 않을 때 JPG로 바꾼 뒤 다시 업로드해 보세요. 사람인·잡코리아
          등 JPG만 받는 화면에서 특히 유용합니다.
        </p>

        {loading ? <p className="msg">변환 중…</p> : null}
        {error ? <p className="msg err">{error}</p> : null}

        {items.length > 0 ? (
          <>
            <p className="summary">
              총 {items.length}장 변환 완료 · 원본{" "}
              {Math.round((totalOriginal / (1024 * 1024)) * 100) / 100}MB → 결과{" "}
              {Math.round((totalResult / (1024 * 1024)) * 100) / 100}MB
            </p>
            <ul className="result-list">
              {items.map((x) => (
                <li key={x.id} className="result-item">
                  <span className="name">{x.name}</span>
                  <span className="meta">
                    {Math.round((x.originalBytes / 1024) * 10) / 10}KB →{" "}
                    {Math.round((x.resultBytes / 1024) * 10) / 10}KB
                  </span>
                  <a href={x.url} download={x.name} className="dl">
                    JPG 다운로드
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <style jsx>{`
        .tool-ui {
          margin-top: 0.5rem;
        }
        .tool-card-wrap {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.15rem 1rem 1.25rem;
        }
        .lbl {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.45rem;
        }
        .file-in {
          width: 100%;
          min-height: 48px;
          font-size: 1rem;
        }
        .hint {
          margin: 0.65rem 0 0;
          font-size: 0.83rem;
          color: var(--muted);
          line-height: 1.55;
        }
        .msg {
          margin: 0.8rem 0 0;
          font-size: 0.87rem;
        }
        .err {
          color: #b91c1c;
          font-weight: 600;
        }
        .summary {
          margin: 0.9rem 0 0;
          font-size: 0.84rem;
          color: var(--muted);
        }
        .result-list {
          margin: 0.7rem 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.55rem;
        }
        .result-item {
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.65rem 0.7rem;
          display: grid;
          gap: 0.2rem;
          background: #fff;
        }
        .name {
          font-size: 0.88rem;
          font-weight: 700;
        }
        .meta {
          font-size: 0.78rem;
          color: var(--muted);
        }
        .dl {
          margin-top: 0.15rem;
          display: inline-flex;
          width: fit-content;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 700;
          color: #065f46;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 8px;
          padding: 0.35rem 0.55rem;
        }
      `}</style>
    </section>
  );
}
