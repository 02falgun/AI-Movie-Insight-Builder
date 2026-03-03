# AI Movie Insight Builder

A production-ready internship assignment built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- Search by IMDb ID (example: `tt0133093`)
- Displays movie title, poster, cast, release year, IMDb rating, and short plot
- AI-generated audience sentiment summary
- Overall sentiment classification: Positive, Mixed, or Negative
- Input validation, loading state, and error handling
- Lightweight API rate limiting (per client IP)
- Request tracing via `x-request-id` response header

## Tech Stack

- **Next.js (App Router)**: Full-stack framework with API routes and Vercel-native deployment
- **TypeScript**: Strong typing and cleaner contracts between frontend/backend
- **Tailwind CSS**: Fast, consistent UI styling with minimal overhead
- **OMDb API**: Movie metadata source
- **OpenAI API**: Sentiment summary + classification generation
- **Jest**: Basic unit testing for validation utility

## Project Structure

```txt
/app
  /api/movie/route.ts
  /layout.tsx
  /page.tsx
/components
  InputForm.tsx
  MovieDetails.tsx
  SentimentCard.tsx
/lib
  analyzeSentiment.ts
  apiClient.ts
  fetchMovie.ts
  validateImdbId.ts
/types
  movie.ts
/__tests__
  validateImdbId.test.ts
```

## Environment Variables

Create `.env.local` in the project root:

```bash
OMDB_API_KEY=your_omdb_key
OPENAI_API_KEY=your_openai_key
```

Do not commit secrets.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
```

## Assumptions

- Review data is intentionally simulated with a few concise snippets in `lib/fetchMovie.ts` to keep scope realistic for a 5–6 hour assignment.
- If OpenAI fails or `OPENAI_API_KEY` is missing, sentiment falls back to a deterministic summary based on IMDb rating.
- API route expects IMDb IDs in format `tt` + 7 or 8 digits.
- API rate limit is intentionally simple in-memory throttling suitable for assignment scope (for high-scale production, move to Redis/Upstash).

## API Response Shape

`GET /api/movie?imdbId=tt0133093`

```json
{
  "movie": {
    "imdbID": "tt0133093",
    "title": "The Matrix",
    "poster": "https://...",
    "cast": ["Keanu Reeves", "..."],
    "year": "1999",
    "imdbRating": "8.7",
    "plot": "..."
  },
  "sentiment": {
    "summary": "...",
    "classification": "Positive"
  }
}
```

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add environment variables in Vercel Project Settings:
   - `OMDB_API_KEY`
   - `OPENAI_API_KEY`
4. Deploy.

No custom server is required.
