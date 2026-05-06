import { PassportPhotoToolClient } from "@/components/tools/passport-photo-tool-client";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("passport-photo");

export default function PassportPhotoPage() {
  return (
    <ToolLayout slug="passport-photo">
      <PassportPhotoToolClient />
    </ToolLayout>
  );
}
