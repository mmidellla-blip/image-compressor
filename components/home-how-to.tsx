/** 홈: 도구 아래에 두는 사용 방법(3단계) */
export function HomeHowTo() {
  return (
    <section className="howto" aria-labelledby="howto-heading">
      <h2 id="howto-heading" className="howto-h2">
        사용 방법
      </h2>
      <ol className="howto-ol">
        <li>
          <strong>파일 선택:</strong> JPG·PNG 등 이미지를 고릅니다. 스마트폰에서 찍은 큰
          원본도 그대로 올릴 수 있습니다.
        </li>
        <li>
          <strong>형식 선택 후 실행:</strong> JPEG 또는 WebP를 고른 뒤{" "}
          <strong>용량 줄이기</strong>를 누릅니다. 처리가 끝나면 결과 파일만 받습니다.
        </li>
        <li>
          <strong>확인 후 저장:</strong> 원본·결과 용량과 감소율을 보고, 화면에서 선명도를
          확인한 다음 다운로드합니다.
        </li>
      </ol>
      <style>{`
        .howto {
          margin-top: 0.75rem;
          margin-bottom: 0;
          line-height: 1.75;
        }
        @media (min-width: 640px) {
          .howto {
            margin-top: 1rem;
          }
        }
        .howto-h2 {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.65rem;
        }
        .howto-ol {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.93rem;
        }
        .howto-ol li {
          margin-bottom: 0.45rem;
        }
      `}</style>
    </section>
  );
}
