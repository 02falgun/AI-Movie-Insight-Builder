import Image from "next/image";
import { MovieData } from "@/types/movie";

interface MovieDetailsProps {
  movie: MovieData;
}

export default function MovieDetails({ movie }: MovieDetailsProps) {
  return (
    <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition sm:grid-cols-[180px_1fr]">
      <div className="relative mx-auto h-[260px] w-[180px] overflow-hidden rounded-md bg-slate-100">
        {movie.poster !== "N/A" ? (
          <Image src={movie.poster} alt={`${movie.title} poster`} fill sizes="180px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-sm text-slate-500">
            Poster unavailable
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{movie.title}</h2>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Release year:</span> {movie.year}
          </p>
          <p>
            <span className="font-medium text-slate-800">IMDb rating:</span> {movie.imdbRating}
          </p>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Cast</p>
          <ul className="list-inside list-disc text-sm text-slate-700">
            {movie.cast.map((actor) => (
              <li key={actor}>{actor}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-800">Plot</p>
          <p className="text-sm leading-relaxed text-slate-700">{movie.plot}</p>
        </div>
      </div>
    </section>
  );
}
