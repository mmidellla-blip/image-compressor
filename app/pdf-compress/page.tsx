import { ComingSoonPanel } from "@/components/tools/coming-soon-panel";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("pdf-compress");

export default function PdfCompressPage() {
  return (
    <ToolLayout slug="pdf-compress">
      <ComingSoonPanel slug="pdf-compress" />
    </ToolLayout>
  );
}
