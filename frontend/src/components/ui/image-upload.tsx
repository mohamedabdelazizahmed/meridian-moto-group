"use client";

import { useState, useRef, ChangeEvent } from "react";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setValidationError("Invalid file type. Allowed: JPG, PNG, WEBP.");
      onChange(null);
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setValidationError("File is too large. Maximum size is 2MB.");
      onChange(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-moto-border bg-moto-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg border border-dashed border-moto-border flex items-center justify-center text-moto-muted text-xs font-mono">
            No Image
          </div>
        )}
        <div className="space-y-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload-input"
          />
          <label htmlFor="image-upload-input">
            <span className="inline-block bg-moto-surface border border-moto-border text-moto-text hover:bg-moto-border/50 text-xs font-mono px-3 py-1.5 rounded cursor-pointer transition-colors">
              Choose Image
            </span>
          </label>
          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="block text-xs font-mono text-moto-apex hover:underline mt-1"
            >
              Remove image
            </button>
          )}
          <p className="text-[11px] text-moto-muted font-mono">JPG, PNG, WEBP up to 2MB</p>
        </div>
      </div>
      {(validationError || error) && (
        <p className="text-xs text-moto-apex font-mono">{validationError || error}</p>
      )}
    </div>
  );
}
