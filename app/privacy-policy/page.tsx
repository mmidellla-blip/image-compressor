import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { getPublicContactEmail, SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "개인정보처리방침",
  description:
    "머니깨비 계산기·아티클·용어사전과 이미지 툴의 개인정보 처리, 업로드 파일 비저장 원칙, 브라우저 처리, 쿠키·Google 애드센스·Google 애널리틱스 가능성, 문의처 안내.",
  path: "/privacy-policy",
  keywords: [
    "개인정보처리방침",
    "머니깨비",
    "파일 저장",
    "쿠키",
    "Google 애드센스",
    "Google Analytics",
  ],
});

export default function PrivacyPolicyPage() {
  const updated = SITE_INFO_LAST_UPDATED;
  const inquiryEmail = getPublicContactEmail();

  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">개인정보처리방침</h1>
        <p className="legal-updated">최종 수정일: {updated}</p>

        <p className="legal-lead">
          머니깨비(이하 &quot;사이트&quot;)는 이용자가 회원가입 없이 계산기·아티클·용어사전과
          이미지 툴을 쓸 수 있도록 설계하였습니다. 개인정보 보호법 등 관련 법령을 준수하며,
          아래와 같이 개인정보 및 이용자 데이터를 처리합니다.
        </p>

        <h2 className="legal-h2">1. 수집·처리할 수 있는 정보의 종류</h2>
        <ul className="legal-ul">
          <li>
            <strong>계산기 입력값:</strong> 청약 가점·신용점수·연말정산·적금 계산기에 입력한
            숫자는 서버로 전송되지 않고 이용자 브라우저 안에서만 계산·표시됩니다.
          </li>
          <li>
            <strong>도구 이용 시 이미지·파일:</strong> 원칙적으로 이용자 단말의 브라우저 메모리에서만
            처리하며, 운영 정책상 회사 서버에 업로드 파일을 저장하거나 데이터베이스에 보관하지
            않습니다. 결과 파일은 이용자가 다운로드버튼으로 기기에 저장할 때만 해당 기기에
            기록됩니다.
          </li>
          <li>
            <strong>문의 시 제공 정보:</strong> 문의 과정에서 이용자가 자발적으로 입력하는 이름(또는
            닉네임), 이메일 주소, 문의 내용 등.
          </li>
          <li>
            <strong>자동으로 생성될 수 있는 정보:</strong> 접속 시 서버·호스팅·보안 장비 등을 통해 IP
            주소, 브라우저 종류, 접속 일시, 오류 로그 등이 일시적으로 생성될 수 있습니다.
          </li>
          <li>
            <strong>쿠키 및 유사 기술:</strong> 현재 필수 쿠키만 사용하지 않을 수 있으며, 향후
            Google 애드센스·Google 애널리틱스(이하 GA4 등) 연동 시 광고·분석 목적의 쿠키 또는
            식별자가 사용될 수 있습니다. 도입 시 본 방침과 쿠키 안내를 업데이트합니다.
          </li>
        </ul>

        <h2 className="legal-h2">2. 업로드 파일의 저장 여부</h2>
        <p>
          이용자가 도구에서 선택하는 이미지·파일은 <strong>서버 디스크에 영구 저장하지 않습니다</strong>
          를 원칙으로 합니다. 처리는 이용자 브라우저가 제공하는 Canvas·파일 API 등 웹 표준 기능을
          활용합니다. 다만 향후 특정 기능에서 서버 연산을 도입할 경우, 해당 화면에 목적·보관
          기간을 별도로 표시하고 본 방침을 개정합니다.
        </p>

        <h2 className="legal-h2">3. 브라우저 기반 처리 방식</h2>
        <p>
          대부분의 도구는 페이지가 열린 동안 브라우저 메모리에서만 데이터가 처리됩니다. 탭을
          닫거나 새로고침하면 메모리 상의 원본·중간 데이터는 소멸되는 것이 일반적입니다. 공용 PC를
          이용한 경우 민감한 이미지 처리 후에는 브라우저 기록·다운로드 폴더를 확인하는 것이
          바람직합니다.
        </p>

        <h2 className="legal-h2">4. 처리 목적</h2>
        <ul className="legal-ul">
          <li>계산기·아티클·용어사전·이미지 툴 기능 제공·품질 개선·오류 대응</li>
          <li>문의 접수 및 회신</li>
          <li>부정 이용 방지, 보안 사고 대응</li>
          <li>
            향후 Google 애드센스를 통한 맞춤·비맞춤 광고 게재 및 수익 창출(도입 시 본 조항이
            활성화되며, 거부·설정 방법 안내)
          </li>
          <li>
            향후 Google 애널리틱스(GA4 등)를 통한 방문 통계·페이지 이용 분석(도입 시 익명·집계
            형태 우선)
          </li>
          <li>법령에 따른 의무 이행</li>
        </ul>

        <h2 className="legal-h2">5. Google 애드센스에 관한 안내</h2>
        <p>
          사이트 운영비 일부를 충당하기 위해{" "}
          <strong>Google LLC 등이 제공하는 Google 애드센스</strong> 광고를 게재할 수 있습니다. 애드센스는
          이용자의 방문 정보 등을 바탕으로 맞춤 광고를 제공할 수 있으며, 이 과정에서{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 정책
          </a>
          에 따라 쿠키가 사용될 수 있습니다. 맞춤 광고는{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 설정
          </a>
          에서 조정하거나 끌 수 있습니다. 애드센스 도입 전까지는 광고 스크립트를 로드하지 않을 수
          있습니다.
        </p>

        <h2 className="legal-h2">6. Google Analytics에 관한 안내</h2>
        <p>
          서비스 이용 현황 파악을 위해 <strong>Google 애널리틱스(GA4 등)</strong>를 도입할 수 있습니다.
          분석 목적의 정보는 쿠키·식별자를 통해 수집될 수 있으며, 브라우저 부가 기능이나 Google
          제공 옵아웃 등으로 일부 제한이 가능합니다. 도입 시 데이터 보관 기간·수집 항목을 본
          방침에 반영합니다.
        </p>

        <h2 className="legal-h2">7. 쿠키 및 저장소</h2>
        <p>
          사이트는 이용 편의·통계·광고를 위해 쿠키 또는 로컬 스토리지를 사용할 수 있습니다. 브라우저
          설정에서 쿠키를 거부할 수 있으나, 일부 기능이나 광고 표시 방식이 달라질 수 있습니다.
        </p>

        <h2 className="legal-h2">8. 이용자 데이터 처리 방식 요약</h2>
        <ul className="legal-ul">
          <li>도구 입력 파일: 브라우저 처리 원칙, 서버 비저장.</li>
          <li>문의 메일: 회신 목적으로만 사용하며, 스팸 방지를 위해 불필요한 수집을 지양합니다.</li>
          <li>
            로그·분석·광고: 도입 시점에 맞춰 최소한의 범위에서 처리하며, 관련 제3자 정책을
            준수합니다.
          </li>
        </ul>

        <h2 className="legal-h2">9. 보관 및 파기</h2>
        <p>
          수집 목적이 달성되면 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한 경우 해당
          기간 동안 보관할 수 있습니다.
        </p>

        <h2 className="legal-h2">10. 이용자의 권리</h2>
        <p>
          개인정보 열람·정정·삭제·처리 정지 등을 요청할 수 있으며, 문의 채널을 통해 접수합니다.
        </p>

        <h2 className="legal-h2">11. 개인정보 문의 및 연락처</h2>
        <p>
          개인정보 관련 문의는 전자우편 <a href={`mailto:${inquiryEmail}`}>{inquiryEmail}</a> 또는{" "}
          <Link href="/contact">문의 페이지</Link>를 이용해 주세요. 운영 가능한 범위에서 성실히
          답변합니다.
        </p>

        <h2 className="legal-h2">12. 방침의 변경</h2>
        <p>
          법령·서비스 변경에 따라 본 방침을 수정할 수 있으며, 중요한 변경은 사이트를 통해 공지합니다.
        </p>

        <p className="legal-back">
          <Link href="/terms">이용약관</Link>
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
