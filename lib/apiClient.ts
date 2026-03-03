import { MovieApiResponse } from "@/types/movie";

export async function fetchMovieInsight(imdbId: string): Promise<MovieApiResponse> {
  const response = await fetch(`/api/movie?imdbId=${encodeURIComponent(imdbId)}`);
  const data = (await response.json()) as MovieApiResponse & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }

  return data;
}
