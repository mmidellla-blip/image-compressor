import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { SITE_INFO_LAST_UPDATED } from "@/lib/site-config";
import { buildStaticPageMetadata } from "@/lib/seo/static-metadata";

export const metadata: Metadata = buildStaticPageMetadata({
  title: "이용약관",
  description:
    "머니깨비 이용약관 — 계산기·아티클·용어사전 서비스 범위, 면책, 저작권, 광고, 준거법.",
  path: "/terms",
  keywords: ["이용약관", "머니깨비", "면책"],
});

export default function TermsPage() {
  const updated = SITE_INFO_LAST_UPDATED;
  return (
    <SiteChrome mainClassName="legal-main">
      <article>
        <h1 className="legal-h1">이용약관</h1>
        <p className="legal-updated">최종 수정일: {updated}</p>

        <h2 className="legal-h2">제1조 (목적)</h2>
        <p>
          본 약관은 본 웹사이트(이하 &quot;사이트&quot;)가 제공하는 콘텐츠·도구 이용과 관련하여
          사이트 운영자와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
        </p>

        <h2 className="legal-h2">제2조 (용어의 정의)</h2>
        <ul className="legal-ul">
          <li>
            &quot;서비스&quot;라 함은 사이트에서 제공하는 경제 계산기·아티클·용어사전 등 정보성
            콘텐츠 일체를 말합니다.
          </li>
          <li>
            &quot;이용자&quot;라 함은 사이트에 접속하여 서비스를 이용하는 자를 말합니다.
          </li>
        </ul>

        <h2 className="legal-h2">제3조 (약관의 효력 및 변경)</h2>
        <p>
          사이트는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 사이트에 게시함으로써
          효력이 발생합니다. 중요한 변경은 이용자가 인지할 수 있는 방법으로 고지합니다.
        </p>

        <h2 className="legal-h2">제4조 (서비스의 제공)</h2>
        <p>
          사이트는 경제 계산기·아티클·용어사전 기능을 제공합니다. 서비스의 구성·기능·UI는
          운영상·기술상·정책상의 이유로 예고 없이 변경되거나 일시 중단될 수 있습니다. 이에 대해
          별도의 손해배상 의무를 지지 않으며(법령상 의무가 있는 경우 제외), 중요한 변경은 사이트
          공지 등 이용자가 확인할 수 있는 방법으로 고지하는 것을 원칙으로 합니다.
        </p>

        <h2 className="legal-h2">제5조 (이용자의 의무)</h2>
        <ul className="legal-ul">
          <li>법령 및 본 약관을 준수해야 합니다.</li>
          <li>
            타인의 권리를 침해하는 콘텐츠를 업로드하거나 배포해서는 안 됩니다.
          </li>
          <li>
            서비스의 안정적 운영을 방해하는 행위(비정상적인 트래픽 유발, 악성 코드 유포 등)를
            해서는 안 됩니다.
          </li>
        </ul>

        <h2 className="legal-h2">제6조 (저작권)</h2>
        <p>
          사이트의 텍스트·디자인 등은 저작권법의 보호를 받을 수 있습니다. 이용자는 사전 허용
          범위를 넘는 무단 복제·배포를 해서는 안 됩니다.
        </p>

        <h2 className="legal-h2">제7조 (면책)</h2>
        <p>
          사이트는 제공되는 정보와 도구 결과의 완전성·정확성·적합성을 보증하지 않습니다.
          이용자는 결과물을 사용하기 전에 목적에 맞는지 스스로 검증해야 합니다. 불가항력,
          제3자 행위, 이용자 귀책으로 인한 손해에 대해 사이트는 책임을 지지 않을 수 있습니다.
        </p>

        <h2 className="legal-h2">제8조 (분쟁 해결 및 준거법)</h2>
        <p>
          본 약관은 대한민국 법령을 준거법으로 합니다. 분쟁이 발생할 경우 관할 법원은
          민사소송법 등 관련 법령에 따릅니다.
        </p>

        <h2 className="legal-h2">제9조 (광고 및 제3자 서비스)</h2>
        <p>
          사이트에는 향후 Google 애드센스 등 제3자가 제공하는 광고가 표시될 수 있습니다.
          광고의 내용·진실성·적법성은 각 광고주 또는 광고 네트워크의 책임이며, 사이트 운영자는
          제3자 광고의 내용을 보증하지 않습니다. 광고·쿠키 등 데이터 처리에 대해서는{" "}
          <Link href="/privacy-policy">개인정보처리방침</Link>을 따릅니다.
        </p>

        <h2 className="legal-h2">제10조 (문의)</h2>
        <p>
          본 약관·광고·개인정보와 관련된 문의는 <Link href="/contact">문의 페이지</Link>를
          이용해 주세요.
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
          margin: 0 0 0.35rem;
        }
        .legal-updated {
          font-size: 0.88rem;
          color: var(--muted);
          margin: 0 0 1.25rem;
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
