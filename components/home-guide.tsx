import Link from "next/link";

/** 홈 상단 가이드 (약 400~800 단어 분량의 한국어 설명 콘텐츠) */
export function HomeGuide() {
  return (
    <section className="guide" aria-labelledby="guide-heading">
      <h2 id="guide-heading" className="guide-h2">
        이미지 압축이 무엇이고, 왜 이미지 용량 줄이기가 중요한가요?
      </h2>
      <p>
        이미지 파일은 사진·그래픽의 픽셀 정보를 담은 데이터 묶음입니다. 같은 화면으로
        보이더라도, 픽셀 수가 많거나 인코딩 방식이 비효율적이면 파일 크기(MB)가 커집니다.
        이미지 압축은 이 데이터를 목적에 맞게 더 작게 표현하는 과정입니다. 원본을 그대로
        두는 무손실 방식도 있고, 사람의 시각에 덜 민감한 정보를 줄이는 손실 압축도
        있습니다. 웹·문서·메신저처럼 화면 출력이 목적이라면, 불필요하게 큰 파일을 그대로
        올리는 일은 사용자 시간과 네트워크 비용을 낭비하는 경우가 많습니다.
      </p>
      <p>
        특히{" "}
        <strong className="guide-strong">이미지 용량 줄이기</strong>는 검색엔진 최적화(
        SEO)와도 연결됩니다. 페이지가 빠르게 열리면 방문자가 글을 읽거나 상품을 확인할
        시간이 길어지고, 모바일 사용자에게는 더 큰 차이로 나타납니다. 무거운 이미지는
        게시글의 첫인상을 느리게 만들고, 지원 시스템에서는 업로드 제한에 걸려 업무가
        멈추기도 합니다. 반대로 적절히 줄인 이미지는 저장 공간과 클라우드 동기화 비용을
        아끼고, 메일·메신저 전송도 매끄러워집니다.
      </p>
      <p>
        <strong className="guide-strong">JPG 용량 줄이기</strong>는 사진형 이미지에서
        특히 자주 필요합니다. JPEG(JPG)는 손실 압축이라 품질 수치를 조절하면 용량을 크게
        줄일 수 있지만, 반복 저장하거나 지나치게 낮은 품질을 선택하면 디테일이 무너질 수
        있습니다. PNG는 투명 배경이 필요할 때 유리하지만, 사진 전체를 PNG로 저장하면
        같은 화면에서 용량이 불리해지는 경우가 많습니다. 요약하면 포맷 선택부터가 이미지
        용량 줄이기의 첫 단축입니다.
      </p>

      <h2 className="guide-h2">이 사이트 도구로 하는 방법 (3단계)</h2>
      <ol className="guide-ol">
        <li>
          <strong>파일 선택:</strong> JPG·PNG 등 이미지를 업로드합니다. 카메라 원본이 크더라도
          브라우저에서 처리합니다.
        </li>
        <li>
          <strong>형식 선택 후 압축:</strong> JPEG 또는 WebP 중 하나를 고르고{" "}
          <strong>용량 줄이기</strong>를 누릅니다. 서버에서 인코딩되어 결과 파일이 생성됩니다.
        </li>
        <li>
          <strong>결과 확인·다운로드:</strong> 원본과 결과 용량, 감소율을 비교한 뒤,
          문제가 없으면 다운로드합니다. 용도에 맞게 화면에서 선명도를 한 번 더 확인하세요.
        </li>
      </ol>
      <p>
        보다 자세한 배경지식은{" "}
        <Link href="/blog">블로그</Link>의{" "}
        <Link href="/blog/이미지-압축-방법">이미지 압축 방법</Link>,{" "}
        <Link href="/blog/jpg-용량-줄이기">JPG 용량 줄이기</Link>,{" "}
        <Link href="/blog/사진-용량-줄이는-법">사진 용량 줄이는 법</Link> 글을 참고하면
        흐름이 잡힙니다. 운영 목적·문의는 <Link href="/about">소개</Link>와{" "}
        <Link href="/contact">문의</Link> 페이지를 이용해 주세요.
      </p>

      <style>{`
        .guide {
          margin-bottom: 2rem;
          line-height: 1.8;
          color: var(--fg);
        }
        .guide-h2 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 1.75rem 0 0.75rem;
          line-height: 1.35;
        }
        .guide-h2:first-child {
          margin-top: 0;
        }
        .guide p {
          margin: 0 0 1rem;
          font-size: 0.95rem;
        }
        .guide-strong {
          font-weight: 700;
          color: var(--fg);
        }
        .guide-ol {
          margin: 0 0 1rem;
          padding-left: 1.25rem;
        }
        .guide-ol li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </section>
  );
}
