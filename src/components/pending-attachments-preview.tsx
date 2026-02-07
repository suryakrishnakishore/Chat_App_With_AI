"use client";

import Image from "next/image";
import { X } from "lucide-react";

export default function PendingAttachmentsPreview({
  files,
  removeFile,
}: {
  files: File[];
  removeFile: (index: number) => void;
}) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 p-3 bg-[hsl(var(--gray-secondary))] rounded-t-xl border border-gray-700">

      {files.map((file, index) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        const isPDF = file.type.includes("pdf");
        
        return (
          <div
            key={index}
            className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-500 bg-black/10"
          >
            {/* Remove button */}
            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
            >
              <X size={14} />
            </button>

            {/* Image Preview */}
            {isImage && (
              <Image
                src={URL.createObjectURL(file)}
                alt="preview"
                fill
                className="object-cover"
              />
            )}

            {/* Video Preview */}
            {isVideo && (
              <video
                src={URL.createObjectURL(file)}
                className="object-cover w-full h-full"
                muted
              />
            )}

            {/* PDF/doc preview */}
            {isPDF && (
              <div className="flex flex-col items-center justify-center w-full h-full text-sm text-white bg-red-500">
                <p>PDF</p>
                <p className="text-xs text-white/70 truncate px-1">{file.name}</p>
              </div>
            )}

            {!isImage && !isVideo && !isPDF && (
              <div className="flex items-center justify-center w-full h-full text-xs text-gray-200 bg-gray-600">
                {file.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
