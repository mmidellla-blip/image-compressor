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
  const updated = "2026년 5월 6일";
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">개인정보처리방침</h1>
        <p className="legal-updated">최종 수정일: {updated}</p>

        <p className="legal-lead">
          본 웹사이트(이하 &quot;사이트&quot;)는 이용자의 개인정보를 소중히 다루며, 관련 법령을
          준수하기 위해 개인정보처리방침을 공개합니다. 방침은 서비스 변경에 따라 업데이트될
          수 있으며, 중요한 변경 시 사이트 공지를 통해 안내합니다. 애드센스 등 광고 연동 시{" "}
          <Link href="/terms">이용약관</Link> 및 본 방침을 함께 적용합니다.
        </p>

        <h2 className="legal-h2">1. 처리하는 개인정보 항목</h2>
        <p>
          사이트는 원칙적으로 회원가입 절차 없이 콘텐츠와 도구를 제공합니다. 다만 문의
          과정에서 이용자가 자발적으로 이메일 주소·이름(또는 닉네임)·문의 내용을 제공할 수
          있습니다. 또한 서버 로그·분석 도구를 통해 IP 주소, 브라우저 유형, 접속 시간, 참조
          페이지(URL) 등 비식별·기술 정보가 생성·저장될 수 있습니다. 광고 서비스가 활성화된
          경우 Google 등 제3자가 쿠키·모바일 광고 식별자 등을 통해 관심사 기반 광고를
          제공하기 위한 정보를 처리할 수 있습니다(이용자 단말 및 계정 설정에 따라 범위가
          달라질 수 있음).
        </p>

        <h2 className="legal-h2">2. 개인정보의 처리 목적</h2>
        <ul className="legal-ul">
          <li>문의 접수 및 회신</li>
          <li>부정 이용 방지, 보안 사고 대응</li>
          <li>서비스 품질 개선을 위한 통계 분석(가능한 범위에서 비식별 형태)</li>
          <li>
            맞춤형 또는 비맞춤형 광고의 게재·측정·사기 방지(제휴 광고 네트워크 정책에 따름)
          </li>
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
          사이트는 이용 편의·통계·광고 서비스를 위해 쿠키 또는 이와 유사한 기술(웹 스토리지
          등)을 사용할 수 있습니다. 광고 파트너는 방문 정보를 바탕으로 반복 노출 방지·관심사
          추정 등에 활용할 수 있습니다. 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수
          있으나, 일부 기능·광고 표시 방식이 달라지거나 제한될 수 있습니다.
        </p>

        <h2 className="legal-h2" id="adsense">
          5. Google AdSense 및 제3자 광고
        </h2>
        <p>
          사이트는 Google LLC 등 제3자 광고 공급자와 협력하여 광고를 게재할 수 있습니다. 이
          과정에서 방문·클릭 기록 등이 광고 선택·성과 측정·부정 방지 목적으로 처리될 수
          있습니다. Google은{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 기술 관련 정책
          </a>
          ,{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 개인정보처리방침
          </a>
          ,{" "}
          <a
            href="https://business.safety.google/adscollect/"
            target="_blank"
            rel="noopener noreferrer"
          >
            광고로 인한 정보 수집 안내
          </a>
          에 따라 정보를 처리할 수 있습니다. 다른 광고 네트워크가 연결되는 경우 해당
          사업자의 정책이 추가로 적용될 수 있습니다. 제3자 공급사 목록은{" "}
          <a
            href="https://business.safety.google/adscollect/#1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 파트너 정보
          </a>
          등을 참고할 수 있습니다.
        </p>
        <p>
          이용자는{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 광고 설정
          </a>
          에서 맞춤 광고를 조정하거나 비활성화할 수 있으며, 브라우저의 &quot;추적 금지&quot; 등
          설정을 활용할 수 있습니다(지원 여부는 브라우저·기기에 따라 다름).
        </p>

        <h2 className="legal-h2">6. 개인정보의 보관 및 파기</h2>
        <p>
          수집 목적이 달성되면 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한 경우
          해당 기간 동안 보관할 수 있습니다.
        </p>

        <h2 className="legal-h2">7. 이용자의 권리</h2>
        <p>
          이용자는 개인정보 열람·정정·삭제·처리 정지 등을 요청할 수 있습니다. 요청은 문의
          채널을 통해 접수하며, 본인 확인이 필요할 수 있습니다. EU·영국 등 일부 지역
          이용자에게는 현지 법령에 따른 추가 권리(이의 제기, 데이터 이동 등)가 부여될 수
          있으며, Google을 통한 광고 관련 설정은 위 광고 설정 링크에서 병행할 수 있습니다.
        </p>

        <h2 className="legal-h2">8. 국제 이용자 및 국외 이전</h2>
        <p>
          본 사이트는 대한민국에서 운영될 수 있으나, Google 등 해외 사업자의 서버·처리
          시설을 통해 정보가 국외에서 처리될 수 있습니다. 해당 사업자는 자체 정책 및 적용
          법령에 따라 적법한 보호조치를 적용합니다. 이용에 동의하거나 서비스를 계속 이용하는
          경우 이러한 처리에 동의한 것으로 간주될 수 있는 범위는 관련 법령에 따릅니다.
        </p>

        <h2 className="legal-h2">9. 아동의 개인정보 보호</h2>
        <p>
          사이트는 만 14세 미만 아동을 주된 이용 대상으로 설계하지 않았으며, 고의로 아동
          개인정보를 수집하려 하지 않습니다. 법정대리인이 아동 관련 처리에 대해 문의하려면{" "}
          <Link href="/contact">문의 페이지</Link>를 이용해 주세요.
        </p>

        <h2 className="legal-h2">10. 안전성 확보 조치</h2>
        <p>
          운영자는 개인정보가 분실·도난·유출·변조되지 않도록 접근 제한, 전송 구간 보호(HTTPS
          등), 보안 패치 등 관리적·기술적 조치를 하기 위해 노력합니다. 다만 인터넷상의
          전송·저장은 100% 안전을 보장할 수 없으므로 이용자도 계정·단말 보안에 유의해 주시기
          바랍니다.
        </p>

        <h2 className="legal-h2">11. 개인정보 보호책임자 및 문의</h2>
        <p>
          개인정보 및 광고·쿠키 관련 문의는 <Link href="/contact">문의 페이지</Link>를
          이용해 주세요. 운영 가능한 범위에서 신속히 답변합니다.
        </p>

        <p className="legal-back">
          <Link href="/terms">이용약관</Link>
          {" · "}
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
