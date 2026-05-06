import { PdfConvertLazy } from "@/components/tools/pdf-convert-lazy";
import { ToolLayout } from "@/components/tools/tool-layout";
import { buildToolMetadata } from "@/lib/tools/metadata";

export const metadata = buildToolMetadata("pdf-convert");

export default function PdfConvertPage() {
  return (
    <ToolLayout slug="pdf-convert">
      <PdfConvertLazy />
    </ToolLayout>
  );
}
