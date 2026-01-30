import React, { useEffect, useMemo, useState } from "react";

export default function Images({ fileUrls }) {
  const [imageIndex, setImageIndex] = useState(0);

  // backend gives: fileUrls: [ "1738.png", "1739.jpg" ]
  // but if frontend accidentally passes JSON string, handle that too
  const urls = useMemo(() => {
    if (!fileUrls) return [];
    if (Array.isArray(fileUrls)) return fileUrls;

    if (typeof fileUrls === "string") {
      // If looks like JSON array, attempt to parse safely
      const trimmed = fileUrls.trim();
      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          // fall through to comma-separated handling
        }
      }

      // Fallback: handle comma-separated string of paths
      const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
      return parts;
    }

    return [];
  }, [fileUrls]);

  useEffect(() => {
    setImageIndex(0);
  }, [urls]);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

  if (!urls.length) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        No images found
      </div>
    );
  }

  const current = urls[imageIndex];

  return (
    <div className="flex flex-col w-full h-full p-1 overflow-hidden">
      <div className="w-full max-h-[calc(100%-45px)] overflow-hidden">
        <img
          src={`${SERVER_URL}/${current}`}
          className="block object-contain h-full mx-auto"
          alt="Parking"
          onError={(e) => {
            e.currentTarget.alt = "Image not found";
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-3 mt-2 overflow-hidden min-h-[40px]">
        <button
          type="button"
          className="px-2 py-1 text-white rounded bg-c3 active:scale-[0.95]"
          onClick={() =>
            setImageIndex((old) => (old === 0 ? urls.length - 1 : old - 1))
          }
        >
          Prev
        </button>

        <div>
          {imageIndex + 1} / {urls.length}
        </div>

        <button
          type="button"
          className="px-2 py-1 text-white rounded bg-c3 active:scale-[0.95]"
          onClick={() =>
            setImageIndex((old) => (old === urls.length - 1 ? 0 : old + 1))
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
