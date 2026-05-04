import Link from "next/link";

const tips = [
  {
    title: "목적지 픽셀을 먼저 정합니다",
    body: "블로그 본문·지원서 첨부·쇼핑몰 상세처럼 ‘보여질 최대 크기’가 다릅니다. 표시보다 훨씬 큰 해상도를 유지하면 용량만 커집니다.",
  },
  {
    title: "원본과 배포본 폴더를 분리합니다",
    body: "편집·인쇄용 원본은 보존하고, 웹·제출용은 별도 사본으로 줄이면 실수로 원본을 덮어쓰는 사고를 줄일 수 있습니다.",
  },
  {
    title: "텍스트가 있는 이미지는 확대 확인",
    body: "작은 글씨가 포함된 스크린샷·캡처는 압축 후 가독성이 급격히 떨어질 수 있습니다. 배포 직전에 반드시 확인하세요.",
  },
  {
    title: "같은 JPG를 반복 저장하지 않기",
    body: "손실 압축을 거듭하면 품질이 누적 손상될 수 있습니다. 가능하면 원본에 가까운 파일에서 다시 내보내세요.",
  },
  {
    title: "WebP는 후보로 두고 비교",
    body: "채널이 허용한다면 WebP가 더 작은 경우가 많습니다. 본 사이트 도구에서 JPEG와 결과를 비교해 보세요.",
  },
  {
    title: "이미지 최적화는 페이지 신뢰로 이어집니다",
    body: "특히 블로그·쇼핑몰에서는 로딩이 곧 경험입니다. 관련해서 이미지 최적화 SEO 관점은 블로그 글에서 더 깊게 다룹니다.",
  },
];

export function HomeTips() {
  return (
    <section className="tips" aria-labelledby="tips-heading">
      <h2 id="tips-heading" className="tips-title">
        이미지 최적화 팁 (실무에서 통하는 기준)
      </h2>
      <ul className="tips-list">
        {tips.map((t) => (
          <li key={t.title} className="tips-item">
            <h3 className="tips-h3">{t.title}</h3>
            <p className="tips-p">{t.body}</p>
          </li>
        ))}
      </ul>
      <p className="tips-more">
        더 읽을거리: <Link href="/blog/웹사이트-이미지-최적화">웹사이트 이미지 최적화</Link>
        , <Link href="/blog/이미지-최적화-seo">이미지 최적화 SEO</Link>
      </p>
      <style>{`
        .tips {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
        .tips-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0 0 1rem;
        }
        .tips-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 1rem;
        }
        .tips-item {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1rem 1.1rem;
        }
        .tips-h3 {
          font-size: 0.95rem;
          font-weight: 700;
          margin: 0 0 0.35rem;
        }
        .tips-p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.65;
        }
        .tips-more {
          margin: 1.25rem 0 0;
          font-size: 0.9rem;
          color: var(--muted);
        }
      `}</style>
    </section>
  );
}
