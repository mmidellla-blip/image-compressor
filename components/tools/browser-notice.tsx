/** 모든 도구 상단에 표시하는 공통 안내(비저장·브라우저 처리). */
export function BrowserNotice() {
  return (
    <p className="browser-notice">
      선택한 파일은 가능한 한 브라우저에서 처리되며 서버에 저장되지 않습니다.
    </p>
  );
}
