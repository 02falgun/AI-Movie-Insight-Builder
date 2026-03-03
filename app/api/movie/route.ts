import { NextRequest, NextResponse } from "next/server";
import { analyzeSentiment } from "@/lib/analyzeSentiment";
import { fetchMovieByImdbId, getSimulatedAudienceReviews } from "@/lib/fetchMovie";
import { rateLimitByKey } from "@/lib/rateLimit";
import { isValidImdbId } from "@/lib/validateImdbId";

const RATE_LIMIT_PER_MINUTE = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();
  return ip || "anonymous";
}

export async function GET(request: NextRequest) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const clientKey = getClientKey(request);
  const imdbId = request.nextUrl.searchParams.get("imdbId") ?? "";

  const rateLimitResult = rateLimitByKey(
    clientKey,
    RATE_LIMIT_PER_MINUTE,
    RATE_LIMIT_WINDOW_MS
  );

  if (!rateLimitResult.allowed) {
    console.warn("rate_limit_exceeded", {
      requestId,
      clientKey,
      imdbId,
      retryAfterSeconds: rateLimitResult.retryAfterSeconds,
    });

    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "x-request-id": requestId,
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      }
    );
  }

  if (!isValidImdbId(imdbId)) {
    const response = NextResponse.json(
      { error: "Invalid IMDb ID. Use format like tt0133093." },
      { status: 400 }
    );

    response.headers.set("x-request-id", requestId);

    console.info("movie_lookup_invalid_id", {
      requestId,
      clientKey,
      imdbId,
      durationMs: Date.now() - startedAt,
    });

    return response;
  }

  try {
    const movie = await fetchMovieByImdbId(imdbId);
    const reviews = getSimulatedAudienceReviews(movie);
    const sentiment = await analyzeSentiment(movie.title, movie.imdbRating, reviews);

    const response = NextResponse.json({ movie, sentiment }, { status: 200 });
    response.headers.set("x-request-id", requestId);

    console.info("movie_lookup_success", {
      requestId,
      clientKey,
      imdbId,
      durationMs: Date.now() - startedAt,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";

    console.error("movie_lookup_failed", {
      requestId,
      clientKey,
      imdbId,
      message,
      durationMs: Date.now() - startedAt,
    });

    const response = NextResponse.json(
      { error: `Could not fetch movie insight: ${message}` },
      { status: 502 }
    );

    response.headers.set("x-request-id", requestId);

    return response;
  }
}
