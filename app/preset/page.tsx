import { PresetToolClient } from "@/components/tools/preset-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("preset");

export default function PresetPage() {
  return (
    <ToolLayout slug="preset">
      <PresetToolClient />
    </ToolLayout>
  );
}
