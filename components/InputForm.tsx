"use client";

import { FormEvent, useState } from "react";
import { IMDB_ID_REGEX } from "@/lib/validateImdbId";

interface InputFormProps {
  onSubmit: (imdbId: string) => Promise<void>;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [imdbId, setImdbId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = imdbId.trim();

    if (!IMDB_ID_REGEX.test(trimmed)) {
      setValidationError("Enter a valid IMDb ID (example: tt0133093).");
      return;
    }

    setValidationError(null);
    await onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-3">
      <div className="flex gap-3">
        <input
          type="text"
          value={imdbId}
          onChange={(event) => setImdbId(event.target.value)}
          placeholder="Enter IMDb ID (e.g., tt0133093)"
          className="h-11 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-sm shadow-sm outline-none transition focus:border-slate-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Analyze"}
        </button>
      </div>
      {validationError ? <p className="text-sm text-rose-600">{validationError}</p> : null}
    </form>
  );
}
