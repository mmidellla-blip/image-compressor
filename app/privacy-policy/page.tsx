import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "이미지 용량 줄이기 사이트의 개인정보 처리방침, 쿠키, Google AdSense 관련 안내.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const updated = "2026년 5월 4일";
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">개인정보처리방침</h1>
        <p className="legal-updated">최종 수정일: {updated}</p>

        <p className="legal-lead">
          본 웹사이트(이하 &quot;사이트&quot;)는 이용자의 개인정보를 소중히 다루며, 관련 법령을
          준수하기 위해 개인정보처리방침을 공개합니다. 방침은 서비스 변경에 따라 업데이트될
          수 있으며, 중요한 변경 시 사이트 공지를 통해 안내합니다.
        </p>

        <h2 className="legal-h2">1. 처리하는 개인정보 항목</h2>
        <p>
          사이트는 원칙적으로 회원가입 절차 없이 콘텐츠와 도구를 제공합니다. 다만 문의
          과정에서 이용자가 자발적으로 이메일 주소·이름·문의 내용을 제공할 수 있습니다. 또한
          서버 로그·분석 도구를 통해 IP 주소, 브라우저 유형, 접속 시간 등 비식별·기술 정보가
          생성·저장될 수 있습니다.
        </p>

        <h2 className="legal-h2">2. 개인정보의 처리 목적</h2>
        <ul className="legal-ul">
          <li>문의 접수 및 회신</li>
          <li>부정 이용 방지, 보안 사고 대응</li>
          <li>서비스 품질 개선을 위한 통계 분석(가능한 범위에서 비식별 형태)</li>
          <li>법령에 따른 의무 이행</li>
        </ul>

        <h2 className="legal-h2">3. 이미지 파일 처리에 관한 안내</h2>
        <p>
          이미지 압축 기능은 이용자가 업로드한 파일을 서버에서 처리할 수 있습니다. 서비스
          운영 목적상 일시적으로 처리될 수 있으며, 운영 정책에 따라 보관 기간을 최소화하고
          삭제하기 위해 노력합니다. 다만 네트워크·시스템 특성상 완전한 삭제 시점을 특정하기
          어려울 수 있으므로, 고도로 민감한 정보가 포함된 이미지는 업로드하지 않는 것을
          권장합니다.
        </p>

        <h2 className="legal-h2">4. 쿠키(Cookie) 및 로컬 저장소</h2>
        <p>
          사이트는 이용 편의·통계·광고 서비스를 위해 쿠키 또는 이와 유사한 기술을 사용할 수
          있습니다. 브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 일부 기능이 제한될 수
          있습니다.
        </p>

        <h2 className="legal-h2">5. Google AdSense 및 제3자 광고</h2>
        <p>
          사이트는 Google 등 제3자 광고 공급자와 협력하여 광고를 게재할 수 있습니다. 이 과정에서
          방문자의 방문 기록 등의 정보가 광고 맞춤을 위해 사용될 수 있으며, Google은{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 정책
          </a>
          에 따라 쿠키를 사용할 수 있습니다. 이용자는{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 설정
          </a>
          에서 맞춤 광고를 조정하거나 비활성화할 수 있습니다.
        </p>

        <h2 className="legal-h2">6. 개인정보의 보관 및 파기</h2>
        <p>
          수집 목적이 달성되면 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한 경우
          해당 기간 동안 보관할 수 있습니다.
        </p>

        <h2 className="legal-h2">7. 이용자의 권리</h2>
        <p>
          이용자는 개인정보 열람·정정·삭제·처리 정지 등을 요청할 수 있습니다. 요청은 문의
          채널을 통해 접수하며, 본인 확인이 필요할 수 있습니다.
        </p>

        <h2 className="legal-h2">8. 개인정보 보호책임자 및 문의</h2>
        <p>
          개인정보 관련 문의는 <Link href="/contact">문의 페이지</Link>를 이용해 주세요.
          운영 가능한 범위에서 신속히 답변합니다.
        </p>

        <p className="legal-back">
          <Link href="/">홈으로</Link>
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
          margin: 0 0 1.25rem;
        }
        .legal-lead {
          font-size: 1rem;
          line-height: 1.75;
          margin: 0 0 1rem;
        }
        .legal-h2 {
          font-size: 1.1rem;
          font-weight: 800;
          margin: 1.75rem 0 0.6rem;
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
        .legal-ul li {
          margin-bottom: 0.35rem;
        }
        .legal-back {
          margin-top: 2rem;
        }
      `}</style>
    </SiteChrome>
  );
}
