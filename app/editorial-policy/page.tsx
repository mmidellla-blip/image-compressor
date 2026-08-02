import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { OFFICIAL_SOURCES } from "@/lib/official-sources";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";
import { SITE_BRAND } from "@/lib/site-brand";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "편집 기준 및 출처 정책",
  description:
    "머니깨비 아티클·용어사전·계산기의 작성 기준, 공식 출처 확인 방법, 갱신·면책 정책을 안내합니다.",
  path: "/editorial-policy",
  keywords: ["편집 기준", "머니깨비", "출처", "면책", "YMYL"],
});

export default function EditorialPolicyPage() {
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">편집 기준 및 출처 정책</h1>
        <p className="legal-updated">최종 수정일: {SITE_INFO_LAST_UPDATED}</p>

        <p className="legal-lead">
          {SITE_BRAND}는 경제·세금·청약·신용 정보를 <strong>사회초년생도 이해할 수 있는
          수준</strong>으로 풀어 쓰되, 숫자와 제도 설명은 공식 자료를 우선합니다. 본 페이지는
          콘텐츠 작성·검토·갱신 원칙을 투명하게 공개합니다.
        </p>

        <h2 className="legal-h2">1. 작성·검토 원칙</h2>
        <ul className="legal-ul">
          <li>
            청약 가점·연말정산·적금 이자 등 <strong>계산 가능한 항목</strong>은 관련 법령·고시·
            국세청·청약홈 안내의 계산 구조를 반영합니다.
          </li>
          <li>
            신용점수 시뮬레이터 등 <strong>비공개 알고리즘</strong> 항목은 &quot;참고용
            범위&quot;임을 명시하고, 확정 수치가 아님을 반복 안내합니다.
          </li>
          <li>
            아티클·용어사전은 단순 키워드 나열이 아니라, <strong>왜 중요한지·내 경우엔 어떻게
            적용되는지</strong>를 예시와 함께 설명합니다.
          </li>
          <li>
            제도·세율·한도가 바뀌면 관련 계산기·글·용어 설명을 순차적으로 검토·수정합니다.
          </li>
        </ul>

        <h2 className="legal-h2">2. 주요 공식 출처</h2>
        <p>아래 기관·사이트 자료를 우선 참고합니다. 링크는 작성 시점 기준이며, 최종 확인은 각
          공식 채널에서 하시기 바랍니다.</p>
        <ul className="legal-ul">
          {OFFICIAL_SOURCES.map((s) => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
              {" — "}
              {s.description}
            </li>
          ))}
        </ul>

        <h2 className="legal-h2">3. 작성자 표기</h2>
        <p>
          아티클에는 <strong>머니깨비 편집팀</strong> 또는 해당 분야 담당 편집자명을 표기합니다.
          개인 자문·투자 권유가 아닌 정보 제공 목적의 콘텐츠이며, 전문 자격을 대리하는 표현은
          사용하지 않습니다.
        </p>

        <h2 className="legal-h2">4. AI·자동 생성 콘텐츠</h2>
        <p>
          초안 작성에 AI 도구를 활용할 수 있으나, <strong>최종 게시 전에는 편집팀이 공식 출처와
          계산기 결과를 대조해 검수</strong>합니다. 검수 없이 자동 생성된 내용만 게시하지
          않습니다.
        </p>

        <h2 className="legal-h2">5. 면책 (YMYL)</h2>
        <p>
          본 사이트의 계산기·아티클·용어사전은 <strong>투자·세무·법률·대출 자문이 아닙니다</strong>.
          실제 청약 접수·연말정산 신고·대출 실행·투자 결정 전에는 청약홈·국세청 홈택스·금융회사·
          세무 전문가 등에게 최종 확인하시기 바랍니다.
        </p>

        <h2 className="legal-h2">6. 오류 제보</h2>
        <p>
          사실 관계 오류·계산기 불일치· outdated 정보를 발견하시면{" "}
          <Link href="/contact">문의 페이지</Link>로 알려 주세요. 확인 후 수정·갱신일을
          반영합니다.
        </p>

        <p className="legal-back">
          <Link href="/about">소개</Link>
          {" · "}
          <Link href="/">홈</Link>
        </p>
      </article>

      <style>{`
        .legal-main { max-width: 42rem; }
        .legal-h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 0.35rem; }
        .legal-updated { font-size: 0.88rem; color: var(--muted); margin: 0 0 1.25rem; }
        .legal-lead { font-size: 1rem; line-height: 1.75; margin: 0 0 1rem; }
        .legal-h2 { font-size: 1.1rem; font-weight: 800; margin: 1.75rem 0 0.6rem; }
        .legal-main p { margin: 0 0 1rem; line-height: 1.75; font-size: 0.95rem; }
        .legal-ul { margin: 0 0 1rem 1.1rem; padding: 0; line-height: 1.75; font-size: 0.95rem; }
        .legal-ul li { margin-bottom: 0.35rem; }
        .legal-ul a { color: #d69e2e; }
        .legal-back { margin-top: 2rem; }
      `}</style>
    </SiteChrome>
  );
}
