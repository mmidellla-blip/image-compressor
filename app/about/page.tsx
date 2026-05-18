import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "소개 — 왜 이 무료 이미지 툴을 만들었나요",
  description:
    "취업·제출용 이미지 용량 때문에 다시 편집했던 경험에서 출발한 이 프로젝트. 회원가입 없이 브라우저에서 돌아가는 무료 도구와 로드맵을 소개합니다.",
  path: "/about",
  keywords: [
    "무료 이미지 툴",
    "이미지 용량 줄이기",
    "사이트 소개",
    "개인정보 보호",
    "온라인 이미지 변환",
  ],
});

export default function AboutPage() {
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">소개</h1>
        <p className="legal-updated">최종 수정일: {SITE_INFO_LAST_UPDATED}</p>

        <p className="legal-lead">
          저 역시 취업 사진이나 제출용 이미지를 올릴 때 &quot;용량 제한을 초과했습니다&quot; 같은
          문구를 보고, 포토샵 없는 PC에서 다시 줄이느라 시간을 쓴 적이 많았습니다. 그래서{" "}
          <strong>누구나 빠르게 쓸 수 있는 무료 이미지 툴</strong>을 한곳에 모으고, 회원가입·설치
          없이 브라우저에서 돌아가게 만들었습니다.
        </p>

        <h2 className="legal-h2">이 사이트를 만든 이유</h2>
        <p>
          검색하면 비슷한 도구는 많습니다. 하지만 광고만 가득하고 설명은 없는 페이지, 처리 후
          파일이 어디로 가는지 불분명한 서비스도 적지 않았습니다. 그래서{" "}
          <strong>실제로 따라 할 수 있는 사용 방법</strong>과{" "}
          <strong>개인정보·파일 처리 방식을 분명히 적은 정책</strong>을 함께 두었습니다.
        </p>

        <h2 className="legal-h2">누구를 위한 사이트인가요?</h2>
        <ul className="legal-ul">
          <li>
            사람인·잡코리아 등에 <strong>이력서·증명사진</strong>을 올리기 전 이미지 용량 줄이기가
            필요한 분
          </li>
          <li>
            공공기관·학교 과제 시스템에 <strong>스캔·사진을 PDF로 제출</strong>해야 하는 분
          </li>
          <li>
            블로그·쇼핑몰에 올릴 사진을 <strong>가볍게 만들고 싶은</strong> 크리에이터·자영업자
          </li>
          <li>설치형 프로그램 대신 <strong>브라우저만으로</strong> JPG·PNG·WebP를 다루고 싶은 분</li>
        </ul>

        <h2 className="legal-h2">회원가입 없이, 왜 무료인가요?</h2>
        <p>
          도구 자체는 무료로 두고, 블로그 글로 이미지 최적화·제출 팁을 길게 남깁니다. 운영에는
          도메인·호스팅 비용이 들어가므로, <strong>제3자 광고</strong>가 일부 페이지에 표시될 수
          있습니다. 다만 광고는 도구와 본문보다 앞서지 않도록 배치하며, 이용자 경험을 해치지 않는
          방식으로 운영합니다.
        </p>

        <h2 className="legal-h2">파일은 서버에 저장하지 않습니다</h2>
        <p>
          선택한 이미지는 <strong>가능한 한 사용자 브라우저 안에서만 처리</strong>하고, 서버에
          파일을 저장하지 않는 것을 원칙으로 합니다. 민감한 서류는 공용 PC에서 다루지 말고, 처리 후
          다운로드 폴더를 확인하는 습관을 권합니다. 자세한 내용은{" "}
          <Link href="/privacy-policy">개인정보처리방침</Link>,{" "}
          <Link href="/terms">이용약관</Link>의 파일 처리 안내를 참고해 주세요.
        </p>

        <h2 className="legal-h2">앞으로 더하고 싶은 것</h2>
        <ul className="legal-ul">
          <li>
            <strong>HEIC → JPG</strong>, <strong>PDF 용량 줄이기</strong>, 사진{" "}
            <strong>모자이크</strong>, <strong>배경 제거</strong> 같은 기능은 브라우저에서 안전하게
            돌릴 수 있는지 검토한 뒤 순차적으로 올릴 예정입니다. 각각 준비 중 페이지와 대체 도구
            링크를 열어 두었습니다.
          </li>
          <li>
            블로그는 채용·공공 제출·메신저·플랫폼별로 읽을 만한 글을 꾸준히 보강합니다.
          </li>
        </ul>

        <h2 className="legal-h2">운영에 대해</h2>
        <p>
          CompressDeck은 이미지 최적화·웹 개발에 관심 있는 개인 운영자가 직접 기획·개발·편집합니다.
          채용·공공 서류 제출 과정에서 반복적으로 겪은 용량 문제를 해결하려는 실사용 경험에서
          출발했습니다. 블로그 글은 실제 도구 사용 경험과 공개 기술 문서를 바탕으로 작성하며,
          정기적으로 검토·수정합니다.
        </p>
        <p>
          오류 제보·제안은{" "}
          <Link href="/contact">문의 페이지</Link>로 보내 주시면 순차적으로 확인합니다. 재현 순서와
          브라우저·OS 정보를 함께 적어 주시면 빠른 처리에 도움이 됩니다.
        </p>

        <h2 className="legal-h2">면책</h2>
        <p>
          도구와 글은 참고용이며, 제출 규격·저작권·최종 결과물의 책임은 이용자에게 있습니다.
          중요한 원본은 항상 별도로 보관해 주세요.
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
