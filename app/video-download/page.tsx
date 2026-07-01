import { VideoDownloadToolClient } from "@/components/tools/video-download-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("video-download");

export default function VideoDownloadPage() {
  return (
    <ToolLayout slug="video-download">
      <VideoDownloadToolClient />
    </ToolLayout>
  );
}
