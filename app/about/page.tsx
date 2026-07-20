import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { SITE_BRAND } from "@/lib/site-brand";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "소개 — 머니깨비는 어떤 사이트인가요",
  description:
    "청약 가점·신용점수·연말정산처럼 매일 마주치지만 막상 알아보려면 어려운 돈 이야기를, 계산기와 쉬운 설명으로 정리하는 이유를 소개합니다.",
  path: "/about",
  keywords: [
    "머니깨비 소개",
    "경제 초보",
    "청약 가점 계산기",
    "신용점수 계산기",
    "경제 용어사전",
  ],
});

export default function AboutPage() {
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">소개</h1>
        <p className="legal-updated">최종 수정일: {SITE_INFO_LAST_UPDATED}</p>

        <p className="legal-lead">
          청약 가점표를 몇 번을 다시 봐도 헷갈리고, 신용점수가 왜 떨어졌는지 은행 앱 설명만
          봐서는 감이 안 오고, 연말정산 환급인지 추징인지도 매번 헷갈렸던 경험에서{" "}
          {SITE_BRAND}가 시작됐습니다. <strong>경제 완전 초보도 숫자만 넣으면 바로 확인할 수
          있는 계산기</strong>와, <strong>어려운 용어를 쉬운 말로 풀어 쓴 글</strong>을 한곳에
          모으고 있습니다.
        </p>

        <h2 className="legal-h2">이 사이트를 만든 이유</h2>
        <p>
          청약·신용점수·연말정산 관련 정보는 인터넷에 이미 많습니다. 하지만 법령 문구를 그대로
          옮기거나, 광고만 가득하고 정작 &quot;내 경우엔 몇 점인지&quot; &quot;내 통장엔 얼마가
          찍히는지&quot;는 알려주지 않는 페이지가 대부분이었습니다. 그래서{" "}
          <strong>공식 기준을 그대로 반영한 계산기</strong>와,{" "}
          <strong>사회초년생 눈높이에서 다시 쓴 설명 글</strong>을 함께 두었습니다.
        </p>

        <h2 className="legal-h2">누구를 위한 사이트인가요?</h2>
        <ul className="legal-ul">
          <li>
            내 <strong>청약 가점</strong>이 대략 몇 점인지 미리 확인하고 싶은 무주택자
          </li>
          <li>
            연체·카드 발급 후 <strong>신용점수</strong>가 왜 오르내리는지 궁금한 사회초년생
          </li>
          <li>
            <strong>연말정산 환급·추징</strong> 갈리는 이유, 소득공제와 세액공제 차이가 헷갈리는 분
          </li>
          <li>
            첫 <strong>적금</strong>을 고르면서 단리·복리 차이, 이자 계산법이 궁금한 분
          </li>
        </ul>

        <h2 className="legal-h2">회원가입 없이, 왜 무료인가요?</h2>
        <p>
          계산기와 글 모두 회원가입 없이 무료로 제공합니다. 운영에는 도메인·호스팅 비용이
          들어가므로, <strong>제3자 광고</strong>가 일부 페이지에 표시될 수 있습니다. 다만
          광고는 계산기·본문보다 앞서지 않도록 배치하며, 이용자 경험을 해치지 않는 방식으로
          운영합니다.
        </p>

        <h2 className="legal-h2">계산기·글 작성 기준</h2>
        <p>
          청약 가점 계산기는 주택공급에 관한 규칙의 가점제 기준(무주택기간 32점·부양가족수
          35점·청약통장 가입기간 17점)을, 신용점수·연말정산·적금 계산기는 각 항목의 공식 산정
          방식과 세율 구간을 그대로 반영해서 만들었습니다. 다만 모든 계산기는{" "}
          <strong>참고용 추정치</strong>이며, 실제 접수·신고 시 최종 수치는 청약홈·국세청 홈택스
          등 공식 채널에서 다시 확인해야 합니다. 제도와 세율은 매년 바뀔 수 있어 관련 내용이
          바뀌면 계산기와 글을 순차적으로 검토해 갱신합니다.
        </p>
        <p>
          아티클과 용어사전은 뉴스에서 자주 나오지만 설명이 없어 넘어가기 쉬운 개념(뱅크런,
          지급준비율, 신용창조 등)을 계산기와 연결해서 풀어 씁니다. 오류 제보나 개선 제안은{" "}
          <Link href="/contact">문의 페이지</Link>로 보내 주시면 확인 후 반영합니다.
        </p>

        <h2 className="legal-h2">면책</h2>
        <p>
          이 사이트의 계산기와 글은 투자·세무·법률 자문이 아니라 이해를 돕기 위한 참고 자료입니다.
          실제 신청·신고·거래 전에는 반드시 공식 기관의 최신 기준을 확인하시고, 중요한 의사결정은
          전문가와 상담하시기 바랍니다.
        </p>

        <p className="legal-back">
          <Link href="/">← 홈으로</Link>
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
          margin: 0 0 1.5rem;
        }
        .legal-h2 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 1.75rem 0 0.65rem;
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
          margin-bottom: 0.5rem;
        }
        .legal-back {
          margin-top: 2rem;
        }
      `}</style>
    </SiteChrome>
  );
}
