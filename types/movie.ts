export type SentimentClassification = "Positive" | "Mixed" | "Negative";

export interface MovieData {
  imdbID: string;
  title: string;
  poster: string;
  cast: string[];
  year: string;
  imdbRating: string;
  plot: string;
}

export interface SentimentData {
  summary: string;
  classification: SentimentClassification;
}

export interface MovieApiResponse {
  movie: MovieData;
  sentiment: SentimentData;
}
