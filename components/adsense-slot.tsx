"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdsenseSlotProps = {
  slot: string;
  className?: string;
};

export function AdsenseSlot({ slot, className }: AdsenseSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const pushed = useRef(false);

  useEffect(() => {
    if (!client || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* Ad block or load race */
    }
  }, [client]);

  if (!client) {
    return (
      <div
        className={`flex min-h-[100px] items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white/60 px-4 py-8 text-center text-sm text-neutral-500 ${className ?? ""}`}
        role="note"
      >
        광고 영역 · 배포 시 NEXT_PUBLIC_ADSENSE_CLIENT 를 설정하세요
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
