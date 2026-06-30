import { BackgroundRemoveToolClient } from "@/components/tools/background-remove-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("background-remove");

export default function BackgroundRemovePage() {
  return (
    <ToolLayout slug="background-remove">
      <BackgroundRemoveToolClient />
    </ToolLayout>
  );
}
