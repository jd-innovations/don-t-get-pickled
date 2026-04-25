import { createServerFn } from "@tanstack/react-start";

interface PickPayload {
  name: string;
  phase: string;
  reasons: string[];
}

interface NoteInput {
  focus: string;
  fitnessLevel: string | null;
  injuries: string[];
  goals: string[];
  picks: PickPayload[];
}

export const generateWarmupNote = createServerFn({ method: "POST" })
  .inputValidator((data: NoteInput) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        note: "Tailored to your focus today — move steady and breathe.",
        error: null as string | null,
      };
    }

    const profileBits: string[] = [];
    if (data.fitnessLevel) profileBits.push(`level ${data.fitnessLevel}`);
    if (data.injuries.length)
      profileBits.push(`injuries: ${data.injuries.join(", ")}`);
    if (data.goals.length) profileBits.push(`goals: ${data.goals.join(", ")}`);

    const exerciseList = data.picks
      .map(
        (p, i) =>
          `${i + 1}. ${p.name} (${p.phase})${
            p.reasons.length ? ` — ${p.reasons.join("; ")}` : ""
          }`,
      )
      .join("\n");

    const prompt = `Today's focus: ${data.focus}.
Player: ${profileBits.join("; ") || "no profile data"}.

Six-exercise warm-up:
${exerciseList}

Write a short coaching note (2-3 sentences, ~50 words) in second person. Explain why this set fits today's focus. Encouraging, plain language. No lists, no markdown headings, no emojis.`;

    try {
      const res = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content:
                  "You are a concise pickleball warm-up coach. Always respond with 2-3 plain sentences.",
              },
              { role: "user", content: prompt },
            ],
          }),
        },
      );

      if (res.status === 429) {
        return {
          note: "Tailored to your focus today — move steady and breathe.",
          error: "Rate limited — please try again in a moment.",
        };
      }
      if (res.status === 402) {
        return {
          note: "Tailored to your focus today — move steady and breathe.",
          error: "AI credits exhausted — add funds to keep coaching notes on.",
        };
      }
      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error:", res.status, text);
        return {
          note: "Tailored to your focus today — move steady and breathe.",
          error: `Coaching note unavailable (${res.status}).`,
        };
      }
      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const note =
        json.choices?.[0]?.message?.content?.trim() ||
        "Tailored to your focus today — move steady and breathe.";
      return { note, error: null };
    } catch (err) {
      console.error("generateWarmupNote failed:", err);
      return {
        note: "Tailored to your focus today — move steady and breathe.",
        error: "Coaching note service unavailable.",
      };
    }
  });
