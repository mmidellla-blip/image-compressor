"use client";

type FileDropzoneProps = {
  id: string;
  label?: string;
  accept: string;
  disabled?: boolean;
  onFile: (file: File | null) => void;
};

export function FileDropzone({
  id,
  label = "파일 선택",
  accept,
  disabled,
  onFile,
}: FileDropzoneProps) {
  return (
    <div className="fdz">
      <label className="fdz-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="fdz-input"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          onFile(f);
          e.target.value = "";
        }}
      />
      <style jsx>{`
        .fdz {
          margin-bottom: 0.75rem;
        }
        .fdz-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.45rem;
        }
        .fdz-input {
          width: 100%;
          padding: 0.55rem 0;
          font-size: 1rem;
          min-height: 44px;
        }
      `}</style>
    </div>
  );
}
