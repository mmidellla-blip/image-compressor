import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "문의",
  description:
    "이미지 용량 줄이기 사이트에 대한 문의·제휴·오류 제보. 이메일 또는 메일 앱 연동 양식을 이용할 수 있습니다.",
  keywords: ["문의", "이미지 압축", "사이트 문의"],
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">문의</h1>
        <p className="legal-lead">
          서비스 이용, 콘텐츠 오류 제보, 저작권·개인정보·광고(쿠키) 관련 문의는 아래 양식을
          통해 메일을 보내 주세요. 답변 가능한 범위에서 순차적으로 회신드립니다. 공개
          심사·운영 전에는 실제 수신 가능한 이메일로{" "}
          <code className="inline-code">NEXT_PUBLIC_CONTACT_EMAIL</code> 을 설정하는 것을
          권장합니다.
        </p>

        <h2 className="legal-h2">연락 방법</h2>
        <p>
          기본적으로 이메일로 접수합니다. 스팸 방지를 위해 자동 전송 서버 대신, 사용자의
          메일 앱을 여는 방식(<code className="inline-code">mailto:</code>)을 사용합니다.
          모바일에서는 메일 앱 선택 화면이 나타날 수 있습니다.
        </p>

        <ContactForm />

        <p className="legal-muted">
          긴급한 보안 이슈(개인정보 유출 가능성 등)는 가능한 한 구체적인 재현 절차와 함께
          보내 주시면 조치에 도움이 됩니다.
        </p>

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
          margin: 0 0 0.75rem;
        }
        .legal-lead {
          font-size: 1rem;
          line-height: 1.75;
          margin: 0 0 1rem;
        }
        .inline-code {
          font-size: 0.88em;
          background: #f5f5f5;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
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
        .legal-muted {
          font-size: 0.88rem;
          color: var(--muted);
        }
        .legal-back {
          margin-top: 1.5rem;
        }
      `}</style>
    </SiteChrome>
  );
}
