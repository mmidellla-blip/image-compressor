import { ComingSoonPanel } from "@/components/tools/coming-soon-panel";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("heic-to-jpg");

export default function HeicToJpgPage() {
  return (
    <ToolLayout slug="heic-to-jpg">
      <ComingSoonPanel slug="heic-to-jpg" />
    </ToolLayout>
  );
}
