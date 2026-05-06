import { JpgToPngToolClient } from "@/components/tools/jpg-to-png-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("jpg-to-png");

export default function JpgToPngPage() {
  return (
    <ToolLayout slug="jpg-to-png">
      <JpgToPngToolClient />
    </ToolLayout>
  );
}
