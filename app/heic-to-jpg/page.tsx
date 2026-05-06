import { HeicToJpgToolClient } from "@/components/tools/heic-to-jpg-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("heic-to-jpg");

export default function HeicToJpgPage() {
  return (
    <ToolLayout slug="heic-to-jpg">
      <HeicToJpgToolClient />
    </ToolLayout>
  );
}
