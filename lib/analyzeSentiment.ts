import OpenAI from "openai";
import { SentimentClassification, SentimentData } from "@/types/movie";

function fallbackSentiment(imdbRating: string): SentimentData {
  const numericRating = Number(imdbRating);

  if (!Number.isNaN(numericRating)) {
    if (numericRating >= 7.0) {
      return {
        summary: "Audience feedback appears largely favorable with recurring appreciation for the performances and overall storytelling.",
        classification: "Positive",
      };
    }

    if (numericRating >= 5.5) {
      return {
        summary: "Audience sentiment seems split, with noticeable praise but also recurring critiques around pacing or narrative choices.",
        classification: "Mixed",
      };
    }
  }

  return {
    summary: "Audience feedback appears more critical overall, with only occasional positive notes.",
    classification: "Negative",
  };
}

export async function analyzeSentiment(
  movieTitle: string,
  imdbRating: string,
  reviews: string[]
): Promise<SentimentData> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackSentiment(imdbRating);
  }

  try {
    const client = new OpenAI({ apiKey });

    const prompt = `You are analyzing movie audience sentiment.
Return only valid JSON with this shape:
{
  "summary": "2-3 concise lines",
  "classification": "Positive" | "Mixed" | "Negative"
}

Movie: ${movieTitle}
IMDb rating: ${imdbRating}
Audience review snippets:
${reviews.map((review, index) => `${index + 1}. ${review}`).join("\n")}

Keep the response concise.`;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.3,
    });

    const outputText = completion.output_text?.trim();

    if (!outputText) {
      return fallbackSentiment(imdbRating);
    }

    const parsed = JSON.parse(outputText) as {
      summary?: string;
      classification?: SentimentClassification;
    };

    if (
      !parsed.summary ||
      !parsed.classification ||
      !["Positive", "Mixed", "Negative"].includes(parsed.classification)
    ) {
      return fallbackSentiment(imdbRating);
    }

    return {
      summary: parsed.summary,
      classification: parsed.classification,
    };
  } catch {
    return fallbackSentiment(imdbRating);
  }
}
