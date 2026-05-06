import { ResizeToolClient } from "@/components/tools/resize-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("resize");

export default function ResizePage() {
  return (
    <ToolLayout slug="resize">
      <ResizeToolClient />
    </ToolLayout>
  );
}
