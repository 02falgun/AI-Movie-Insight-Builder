import { MovieData } from "@/types/movie";

interface OmdbApiResponse {
  Response: "True" | "False";
  Error?: string;
  imdbID: string;
  Title: string;
  Poster: string;
  Actors: string;
  Year: string;
  imdbRating: string;
  Plot: string;
}

export async function fetchMovieByImdbId(imdbId: string): Promise<MovieData> {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error("OMDB_API_KEY is missing in environment variables.");
  }

  const response = await fetch(
    `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}&plot=short`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to reach OMDb service.");
  }

  const data = (await response.json()) as OmdbApiResponse;

  if (data.Response === "False") {
    throw new Error(data.Error ?? "Movie not found in OMDb.");
  }

  return {
    imdbID: data.imdbID,
    title: data.Title,
    poster: data.Poster,
    cast: data.Actors?.split(",").map((name) => name.trim()) ?? [],
    year: data.Year,
    imdbRating: data.imdbRating,
    plot: data.Plot,
  };
}

export function getSimulatedAudienceReviews(movie: MovieData): string[] {
  return [
    `"${movie.title}" has strong performances and keeps the pace engaging.`,
    `Many viewers say the story is memorable, though some feel parts are predictable.`,
    `Audience reactions often mention ${movie.cast[0] ?? "the lead cast"} as a highlight.`
  ];
}
