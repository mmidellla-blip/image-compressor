"use client";

import { useMemo, useState } from "react";

type ContactFormProps = {
  /** 배포 시 NEXT_PUBLIC_CONTACT_EMAIL 과 동일한 표시용 주소 */
  contactEmail: string;
};

/**
 * 메일 클라이언트 연동 문의 폼. 서버 전송 API 없이 mailto 로 동작합니다.
 */
export function ContactForm({ contactEmail }: ContactFormProps) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`[무료 이미지 툴 문의] ${name || "이름 미입력"}`);
    const body = encodeURIComponent(
      `회신 받을 이메일: ${from || "(미입력)"}\n\n문의 내용:\n${message}`,
    );
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }, [contactEmail, name, from, message]);

  return (
    <div className="cf">
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
          placeholder="표시할 이름"
        />
        <label className="cf-label" htmlFor="c-from">
          회신 받을 이메일 (필수에 가깝게)
        </label>
        <input
          id="c-from"
          className="cf-input"
          type="email"
          inputMode="email"
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
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="오류 재현 순서, 브라우저 종류, 개인정보 관련 요청 등 구체적으로 적어 주세요."
        />
      </div>
      <a
        className="cf-submit"
        href={mailto}
        aria-label="기본 메일 앱으로 문의 메일 작성 열기"
      >
        메일 앱으로 보내기
      </a>

      <style jsx>{`
        .cf {
          margin-top: 0.5rem;
        }
        .cf-fields {
          display: grid;
          gap: 0.85rem;
          margin-bottom: 1rem;
        }
        .cf-label {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .cf-input,
        .cf-textarea {
          width: 100%;
          padding: 0.65rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          font: inherit;
          font-size: 1rem;
          min-height: 48px;
        }
        .cf-textarea {
          min-height: 140px;
          resize: vertical;
        }
        .cf-submit {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 52px;
          padding: 0.75rem 1rem;
          font-weight: 800;
          font-size: 1.05rem;
          background: var(--accent);
          color: #fff !important;
          border-radius: 12px;
          text-decoration: none;
          box-sizing: border-box;
        }
        .cf-submit:hover {
          background: var(--accent-hover);
        }
      `}</style>
    </div>
  );
}
