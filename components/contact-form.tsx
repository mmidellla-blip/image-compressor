"use client";

import { useMemo, useState } from "react";

const defaultEmail = "contact@your-domain.com";

export function ContactForm() {
  const configured =
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || defaultEmail;

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`[문의] ${name || "이름 미입력"}`);
    const body = encodeURIComponent(
      `보내는 사람: ${from || "(이메일 미입력)"}\n\n${message}`,
    );
    return `mailto:${configured}?subject=${subject}&body=${body}`;
  }, [configured, name, from, message]);

  return (
    <div className="cf">
      <p className="cf-note">
        아래 정보를 입력한 뒤 버튼을 누르면 기본 메일 앱이 열립니다. 메일이 열리지
        않으면 <strong>{configured}</strong> 로 직접 보내 주세요. 실제 운영 시{" "}
        <code className="cf-code">NEXT_PUBLIC_CONTACT_EMAIL</code> 환경 변수로 수신
        주소를 교체할 수 있습니다.
      </p>
      <div className="cf-fields">
        <label className="cf-label" htmlFor="c-name">
          이름 또는 닉네임
        </label>
        <input
          id="c-name"
          className="cf-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <label className="cf-label" htmlFor="c-from">
          회신 받을 이메일
        </label>
        <input
          id="c-from"
          className="cf-input"
          type="email"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <label className="cf-label" htmlFor="c-msg">
          문의 내용
        </label>
        <textarea
          id="c-msg"
          className="cf-textarea"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="문의 사항을 자세히 적어 주세요."
        />
      </div>
      <a className="cf-submit" href={mailto}>
        메일 앱으로 보내기
      </a>

      <style jsx>{`
        .cf {
          margin-top: 1rem;
        }
        .cf-note {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.65;
          margin: 0 0 1rem;
        }
        .cf-code {
          font-size: 0.85em;
          background: #f5f5f5;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }
        .cf-fields {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .cf-label {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .cf-input,
        .cf-textarea {
          width: 100%;
          padding: 0.55rem 0.65rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font: inherit;
        }
        .cf-submit {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 0.65rem 1rem;
          font-weight: 700;
          background: var(--accent);
          color: #fff !important;
          border-radius: 8px;
          text-decoration: none;
        }
        .cf-submit:hover {
          background: var(--accent-hover);
        }
      `}</style>
    </div>
  );
}
