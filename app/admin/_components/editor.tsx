"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useRef } from "react";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "업로드 실패");
  return data.url;
}

export function TiptapEditor({ content, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.isEmpty && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  async function handleImageFile(file: File) {
    if (!editor) return;
    if (!file.type.startsWith("image/")) return;
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(String(err));
    }
  }

  async function handleImageButton() {
    fileInputRef.current?.click();
  }

  if (!editor) return null;

  function tb(label: string, action: () => void, active?: boolean) {
    return (
      <button
        key={label}
        type="button"
        onClick={action}
        style={{
          padding: "0.3rem 0.55rem",
          background: active ? "#3b82f6" : "white",
          color: active ? "white" : "#374151",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.825rem",
          fontWeight: active ? 700 : 400,
          lineHeight: 1,
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleImageFile(file);
          e.target.value = "";
        }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.3rem",
          padding: "0.5rem",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {tb("굵게", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {tb("기울임", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {tb("취소선", () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"))}
        <span style={{ width: "1px", background: "#e2e8f0", margin: "0 0.1rem" }} />
        {tb("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {tb("H3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
        <span style={{ width: "1px", background: "#e2e8f0", margin: "0 0.1rem" }} />
        {tb("• 목록", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {tb("1. 목록", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {tb("인용", () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
        {tb("코드", () => editor.chain().focus().toggleCode().run(), editor.isActive("code"))}
        <span style={{ width: "1px", background: "#e2e8f0", margin: "0 0.1rem" }} />
        {tb("🖼 이미지", handleImageButton)}
        <span style={{ width: "1px", background: "#e2e8f0", margin: "0 0.1rem" }} />
        {tb("↩ 되돌리기", () => editor.chain().focus().undo().run())}
        {tb("↪ 다시하기", () => editor.chain().focus().redo().run())}
      </div>

      <EditorContent
        editor={editor}
        style={{ minHeight: "420px", padding: "1rem" }}
        onDrop={async (e) => {
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith("image/")) {
            e.preventDefault();
            await handleImageFile(file);
          }
        }}
        onPaste={async (e) => {
          const file = Array.from(e.clipboardData.items)
            .find((i) => i.type.startsWith("image/"))
            ?.getAsFile();
          if (file) {
            e.preventDefault();
            await handleImageFile(file);
          }
        }}
      />

      <style>{`
        .tiptap { outline: none; }
        .tiptap p { margin: 0 0 0.75rem; line-height: 1.8; font-size: 0.96rem; }
        .tiptap h2 { font-size: 1.2rem; font-weight: 800; margin: 1.25rem 0 0.5rem; }
        .tiptap h3 { font-size: 1.05rem; font-weight: 700; margin: 1rem 0 0.4rem; }
        .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin: 0 0 0.75rem; }
        .tiptap li { margin-bottom: 0.3rem; line-height: 1.7; }
        .tiptap blockquote { border-left: 3px solid #3b82f6; padding-left: 1rem; color: #64748b; margin: 0.75rem 0; font-style: italic; }
        .tiptap code { background: #f1f5f9; padding: 0.15rem 0.35rem; border-radius: 4px; font-family: monospace; font-size: 0.88em; }
        .tiptap strong { font-weight: 700; }
        .tiptap em { font-style: italic; }
        .tiptap img { max-width: 100%; height: auto; border-radius: 6px; margin: 0.75rem 0; display: block; }
        .tiptap img.ProseMirror-selectednode { outline: 2px solid #3b82f6; }
      `}</style>
    </div>
  );
}
