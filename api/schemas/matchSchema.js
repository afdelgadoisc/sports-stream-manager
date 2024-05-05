import z from "zod";

const matchSchema = z.object({
  home_team: z.string(),
  away_team: z.string(),
  home_score: z.number().min(0),
  away_score: z.number().min(0),
  active: z.boolean(),
  period: z.number().min(1).default(1),
  start_time: z.string().nullable(),
  home_shield: z.string().url(),
  away_shield: z.string().url(),
  result: z.string(),
});

export function validateMatch(input) {
  return matchSchema.safeParse(input);
}

export function validatePartialMatch(input) {
  return matchSchema.partial().safeParse(input);
}
