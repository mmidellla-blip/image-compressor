import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { SiteChrome } from "@/components/site-chrome";
import { getPublicContactEmail, SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "문의 · 오류 제보 · 기능 제안",
  description:
    "무료 이미지 툴 운영자에게 연락하는 방법. 오류 재현, 기능 제안, 광고·제휴 문의. 메일 앱 연동 폼.",
  path: "/contact",
  keywords: ["문의", "무료 이미지 툴", "이메일", "개인정보", "오류 제보"],
});

export default function ContactPage() {
  const email = getPublicContactEmail();

  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">문의</h1>
        <p className="legal-updated">안내 갱신: {SITE_INFO_LAST_UPDATED}</p>

        <p className="legal-lead">
          이 페이지는 <strong>실제로 운영자에게 연락</strong>하기 위해 두었습니다. 서비스 오류,
          콘텐츠 정정, 저작권·개인정보 관련 요청을 받습니다. 자동 서버 전송 대신{" "}
          <code className="inline-code">mailto:</code>로 기본 메일 앱을 여는 방식이라 유지비와 스팸
          노출을 줄였습니다.
        </p>

        <section className="contact-email-box" aria-labelledby="email-h">
          <h2 id="email-h" className="sr-only">
            문의 이메일
          </h2>
          <p className="contact-email-label">운영·개인정보·제휴 관련 문의 이메일</p>
          <p className="contact-email-value">
            <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p className="contact-email-note">
            배포 시{" "}
            <code className="inline-code">NEXT_PUBLIC_CONTACT_EMAIL</code> 환경 변수로 실제 수신함으로
            바꿀 수 있습니다.
          </p>
        </section>

        <h2 className="legal-h2">이렇게 보내 주시면 빠릅니다</h2>
        <ul className="legal-ul">
          <li>
            <strong>오류 제보:</strong> 어떤 도구(`/compress` 등)·브라우저·OS·재현 순서(파일 선택 →
            버튼 클릭 등)·화면 메시지.
          </li>
          <li>
            <strong>기능 제안:</strong> 어떤 상황에서 어떤 결과를 기대했는지, 가능하면 예시 파일 특성(대략
            해상도·용량)만 설명.
          </li>
          <li>
            <strong>광고·제휴:</strong> 업체명·목적(배너·스폰서십 등)·희망 기간. 애드센스 승인 전후
            정책을 검토해 회신합니다.
          </li>
        </ul>

        <p className="legal-muted">
          개인 독립 운영이라 <strong>회신까지 며칠 걸릴 수 있습니다</strong>. 긴급 보안 이슈는 재현
          절차와 발생 시각을 함께 적어 주세요.
        </p>

        <h2 className="legal-h2">문의 폼</h2>
        <p>
          아래를 채운 뒤 &quot;메일 앱으로 보내기&quot;를 누르면 메일 작성 화면이 열립니다. 모바일에서는
          메일 앱 선택이 나올 수 있습니다.
        </p>

        <ContactForm contactEmail={email} />

        <p className="legal-back">
          <Link href="/privacy-policy">개인정보처리방침</Link>
          {" · "}
          <Link href="/">홈</Link>
        </p>
      </article>

      <style>{`
        .legal-main {
          max-width: 42rem;
        }
        .legal-h1 {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0 0 0.35rem;
        }
        .legal-updated {
          font-size: 0.88rem;
          color: var(--muted);
          margin: 0 0 1rem;
        }
        .legal-lead {
          font-size: 1rem;
          line-height: 1.75;
          margin: 0 0 1.25rem;
        }
        .inline-code {
          font-size: 0.88em;
          background: #f5f5f5;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }
        .contact-email-box {
          margin: 1.25rem 0 1.5rem;
          padding: 1.1rem 1.15rem;
          background: #f8fafc;
          border: 1px solid var(--border);
          border-radius: 14px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .contact-email-label {
          margin: 0 0 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--muted);
        }
        .contact-email-value {
          margin: 0 0 0.5rem;
          font-size: 1.15rem;
          font-weight: 800;
          word-break: break-all;
        }
        .contact-email-value a {
          text-decoration: none;
          color: var(--accent);
        }
        .contact-email-value a:hover {
          text-decoration: underline;
        }
        .contact-email-note {
          margin: 0;
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.55;
        }
        .legal-h2 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 1.5rem 0 0.65rem;
        }
        .legal-main p {
          margin: 0 0 1rem;
          line-height: 1.75;
          font-size: 0.95rem;
        }
        .legal-ul {
          margin: 0 0 1rem 1.1rem;
          padding: 0;
          line-height: 1.75;
          font-size: 0.95rem;
        }
        .legal-muted {
          font-size: 0.88rem;
          color: var(--muted);
          margin: 0 0 1rem;
          line-height: 1.65;
        }
        .legal-back {
          margin-top: 1.5rem;
        }
      `}</style>
    </SiteChrome>
  );
}
