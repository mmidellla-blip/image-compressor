import { ComingSoonPanel } from "@/components/tools/coming-soon-panel";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("background-remove");

export default function BackgroundRemovePage() {
  return (
    <ToolLayout slug="background-remove">
      <ComingSoonPanel slug="background-remove" />
    </ToolLayout>
  );
}
