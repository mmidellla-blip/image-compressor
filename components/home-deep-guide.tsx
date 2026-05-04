/** 홈: 도구·사용법 아래에 두는 긴 설명(키워드 유지, 문장 자연스럽게) */
export function HomeDeepGuide() {
  return (
    <section className="deep" aria-labelledby="deep-heading">
      <h2 id="deep-heading" className="deep-h2">
        이미지 압축과 이미지 용량 줄이기, 왜 신경 쓸까요?
      </h2>
      <p>
        사진·그래픽 파일은 픽셀 정보를 담은 데이터입니다. 화면에 비슷하게 보여도 픽셀이
        많거나 저장 방식이 비효율적이면 용량(MB)이 커집니다. 이미지 압축은 그 데이터를
        용도에 맞게 더 작게 만드는 과정이고, 무손실·손실 방식 등 여러 접근이 있습니다.
        웹·문서·메신저처럼 화면으로 보여 줄 목적이라면, 굳이 큰 원본을 그대로 두는 것은
        시간과 데이터를 낭비하는 경우가 많습니다.
      </p>
      <p>
        페이지 속도와 사용자 경험 측면에서도 이미지 용량 줄이기는 의미가 있습니다. 글이
        빨리 열려도 이미지가 늦게 뜨면 전체가 느리게 느껴지고, 모바일에서는 그 차이가 더
        큽니다. 동시에 메일 첨부나 신청 양식처럼 용량 제한이 있는 곳에서는 JPG 용량
        줄이기나 포맷 선택이 곧바로 통과 여부로 이어집니다.
      </p>
      <p>
        사진 위주 작업이라면 JPEG(JPG)가 자주 쓰이며, 품질 조절로 용량을 줄일 수 있습니다.
        다만 같은 JPG를 반복해서 저장하면 품질이 누적 손상될 수 있으니, 중요한 원본은 따로
        두는 습관이 좋습니다. 투명 배경이 필요하면 PNG가 유리하고, 채널이 허용한다면 WebP도
        비교해 볼 만합니다. 포맷을 어디에 맞출지 정하는 것부터가 사진 용량 줄이기의 출발점입니다.
      </p>
      <style>{`
        .deep {
          margin-top: 1.75rem;
          padding-top: 1.5rem;
          padding-bottom: 0.25rem;
          border-top: 1px solid var(--border);
          line-height: 1.8;
          color: var(--fg);
        }
        .deep-h2 {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0 0 0.65rem;
          line-height: 1.35;
        }
        .deep p {
          margin: 0 0 1rem;
          font-size: 0.93rem;
        }
      `}</style>
    </section>
  );
}
