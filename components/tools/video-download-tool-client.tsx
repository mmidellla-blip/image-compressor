"use client";

import { useState } from "react";

type VideoInfo = {
  title: string;
  videoUrl: string;
};

export function VideoDownloadToolClient() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const isM3U8 = videoInfo?.videoUrl.includes(".m3u8") ?? false;

  async function handleFind() {
    if (!input.trim()) return;
    setError(null);
    setVideoInfo(null);
    setLoading(true);

    try {
      const res = await fetch("/api/video-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "알 수 없는 오류가 발생했어요.");
        return;
      }

      setVideoInfo(data as VideoInfo);
    } catch {
      setError("네트워크 오류가 발생했어요. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleFind();
    }
  }

  const downloadHref = videoInfo
    ? `/api/video-download/proxy?url=${encodeURIComponent(videoInfo.videoUrl)}&title=${encodeURIComponent(videoInfo.title)}`
    : "#";

  return (
    <div className="vd-wrap">
      <div className="vd-notice">
        저작권자의 허락을 받은 콘텐츠 또는 본인이 업로드한 영상에만 사용해 주세요. 타인의 영상을
        무단으로 재배포하는 것은 저작권법 위반입니다.
      </div>

      <div className="vd-form">
        <label className="vd-label" htmlFor="vd-input">
          소홍서 링크 입력
        </label>
        <textarea
          id="vd-input"
          className="vd-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            "링크 또는 앱 공유 텍스트를 그대로 붙여넣기하세요\n예) https://www.xiaohongshu.com/explore/...\n예) https://xhslink.com/..."
          }
          rows={4}
          disabled={loading}
        />
        <button
          className="vd-btn"
          onClick={handleFind}
          disabled={loading || !input.trim()}
        >
          {loading ? "불러오는 중..." : "동영상 찾기"}
        </button>
        <p className="vd-hint">Ctrl+Enter로도 검색할 수 있어요.</p>
      </div>

      {error && <div className="vd-error" role="alert">{error}</div>}

      {videoInfo && (
        <div className="vd-result">
          <p className="vd-result-title">{videoInfo.title}</p>

          {isM3U8 ? (
            <div className="vd-m3u8-notice">
              이 영상은 HLS 스트림(.m3u8) 형식이에요. 아래 버튼으로 재생목록 파일을 받거나,
              브라우저 확장프로그램(Video DownloadHelper 등)을 사용해 저장하세요.
            </div>
          ) : null}

          <a className="vd-btn vd-btn--dl" href={downloadHref} download>
            {isM3U8 ? "재생목록(.m3u8) 다운로드" : "워터마크 없이 MP4 다운로드"}
          </a>
        </div>
      )}

      <style>{`
        .vd-wrap {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }
        .vd-notice {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          color: #92400e;
          line-height: 1.6;
        }
        .vd-form {
          display: grid;
          gap: 0.6rem;
        }
        .vd-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--fg);
        }
        .vd-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          font-size: 0.88rem;
          font-family: inherit;
          line-height: 1.6;
          resize: vertical;
          box-sizing: border-box;
          color: var(--fg);
          background: #fff;
        }
        .vd-textarea:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 2px #d1fae5;
        }
        .vd-textarea:disabled {
          background: #f8fafc;
          color: var(--muted);
        }
        .vd-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.72rem 1.2rem;
          background: #059669;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
          transition: background 0.15s;
        }
        .vd-btn:hover:not(:disabled) {
          background: #047857;
        }
        .vd-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        .vd-btn--dl {
          background: #2563eb;
        }
        .vd-btn--dl:hover {
          background: #1d4ed8;
        }
        .vd-hint {
          margin: 0;
          font-size: 0.75rem;
          color: var(--muted);
        }
        .vd-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          color: #991b1b;
          line-height: 1.55;
        }
        .vd-result {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 12px;
          padding: 1rem;
          display: grid;
          gap: 0.75rem;
        }
        .vd-result-title {
          margin: 0;
          font-size: 0.92rem;
          font-weight: 600;
          color: #0f172a;
          word-break: break-word;
        }
        .vd-m3u8-notice {
          background: #fefce8;
          border: 1px solid #fde047;
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          font-size: 0.82rem;
          color: #713f12;
          line-height: 1.55;
        }
      `}</style>
    </div>
  );
}
