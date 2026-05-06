import { ComingSoonPanel } from "@/components/tools/coming-soon-panel";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("photo-mosaic");

export default function PhotoMosaicPage() {
  return (
    <ToolLayout slug="photo-mosaic">
      <ComingSoonPanel slug="photo-mosaic" />
    </ToolLayout>
  );
}
