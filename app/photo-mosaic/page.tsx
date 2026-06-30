import { PhotoMosaicToolClient } from "@/components/tools/photo-mosaic-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("photo-mosaic");

export default function PhotoMosaicPage() {
  return (
    <ToolLayout slug="photo-mosaic">
      <PhotoMosaicToolClient />
    </ToolLayout>
  );
}
