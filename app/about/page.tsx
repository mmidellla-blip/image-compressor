import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "소개 — 운영 목적과 제공 가치",
  description:
    "이미지 용량 줄이기 사이트의 운영 목적, 독자에게 제공하는 가치, 콘텐츠 방향을 설명합니다.",
  keywords: ["이미지 용량 줄이기", "사이트 소개", "이미지 압축"],
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">소개</h1>
        <p className="legal-lead">
          이 웹사이트는 <strong>이미지 용량 줄이기</strong>와{" "}
          <strong>이미지 압축</strong>에 필요한 실무 지식을 정리하고, 누구나 브라우저에서
          바로 써 볼 수 있는 무료 도구를 제공하는 것을 목적으로 운영됩니다.
        </p>

        <h2 className="legal-h2">누가 운영하나요?</h2>
        <p>
          본 사이트는 독립적으로 콘텐츠를 기획·편집하는 운영자에 의해 관리됩니다. 특정
          기업이나 공공기관을 대표하지 않으며, 상표·서비스명은 해당 권리자에 속합니다.
          문의는 <Link href="/contact">문의 페이지</Link>를 통해 접수합니다.
        </p>

        <h2 className="legal-h2">무엇을 제공하나요?</h2>
        <ul className="legal-ul">
          <li>
            <strong>무료 이미지 압축 도구:</strong> JPG·PNG 등 이미지를 JPEG 또는 WebP로
            변환·압축하고 용량 변화를 확인할 수 있습니다.
          </li>
          <li>
            <strong>블로그 글:</strong> 이미지 용량 줄이기, JPG 용량 줄이기, 사진 용량
            줄이는 법 등 실생활·업무 상황에 맞춘 긴 형식의 가이드를 제공합니다.
          </li>
          <li>
            <strong>정책 페이지:</strong> 개인정보처리방침·이용약관을 통해 서비스 이용과
            데이터 처리 원칙을 투명하게 안내합니다.
          </li>
        </ul>

        <h2 className="legal-h2">콘텐츠 방향</h2>
        <p>
          글과 도구 설명은 검색 유입을 위한 낚시 문구보다, 독자가 실제로 적용할 수 있는
          순서와 기준을 우선합니다. 이미지 최적화는 단순히 용량 숫자만 줄이는 일이 아니라,
          목적지(웹·문서·메신저)에 맞는 균형을 찾는 일입니다. 본 사이트는 그 균형을 잡는 데
          필요한 사고방식과 도구 사용법을 함께 다룹니다.
        </p>

        <h2 className="legal-h2">면책 안내</h2>
        <p>
          도구는 편의를 위해 제공되며, 결과물의 최종 사용 책임은 사용자에게 있습니다.
          중요한 원본 데이터는 반드시 별도로 보관하고, 민감 정보가 포함된 이미지는 정책에
          따라 오프라인 처리나 내부 시스템을 검토하시기 바랍니다. 자세한 범위는{" "}
          <Link href="/terms">이용약관</Link>을 참고해 주세요.
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
          margin: 0 0 0.75rem;
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
