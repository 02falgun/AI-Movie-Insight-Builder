"use client";

import { useState } from "react";
import InputForm from "@/components/InputForm";
import MovieDetails from "@/components/MovieDetails";
import SentimentCard from "@/components/SentimentCard";
import { fetchMovieInsight } from "@/lib/apiClient";
import { MovieApiResponse } from "@/types/movie";

export default function HomePage() {
  const [result, setResult] = useState<MovieApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (imdbId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMovieInsight(imdbId);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Failed to fetch movie details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            AI Movie Insight Builder
          </h1>
          <p className="text-sm text-slate-600 sm:text-base">
            Enter an IMDb ID to view key movie details and an AI-generated audience sentiment summary.
          </p>
        </header>

        <InputForm onSubmit={handleSearch} isLoading={isLoading} />

        {error ? (
          <div className="w-full rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 transition">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="w-full rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm transition">
            Fetching movie data and generating sentiment insight...
          </div>
        ) : null}

        {result ? (
          <div className="w-full space-y-4">
            <MovieDetails movie={result.movie} />
            <SentimentCard sentiment={result.sentiment} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
