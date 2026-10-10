import { z } from "zod";
import { AIResponsePayload, MascotFeeling } from "./schema";
import { resolveActions } from "./action-resolver";

const MascotFeelingSchema = z.enum(["Happy", "Feisty", "Surprise", "Double Blink"]);

const RawActionSchema = z.object({
  type: z.string(),
  label: z.string().optional(),
  target: z.string().optional(),
  description: z.string().optional(),
});

const RawModelOutputSchema = z.object({
  output: z.object({
    message: z.string(),
    feeling: MascotFeelingSchema.catch("Happy"),
  }),
  actions: z.array(RawActionSchema).optional().default([]),
});

/**
 * Creates a safe fallback response if model generation or JSON parsing fails.
 */
export function createSafeFallbackResponse(userInput: string, customMessage?: string): AIResponsePayload {
  return {
    input: userInput,
    output: {
      message:
        customMessage ||
        "I'm here! My creative synapses had a brief hiccup parsing that, but I'm ready. What would you like to explore about Kshitij's work?",
      feeling: "Happy",
    },
    actions: [
      {
        type: "navigate",
        label: "Explore Projects",
        target: "/projects",
      },
    ],
  };
}

/**
 * Validates and transforms raw model output into a verified AIResponsePayload.
 * Attaches the verified user input directly server-side to prevent tampering.
 */
export function validateAndFormatResponse(
  rawJson: unknown,
  verifiedUserInput: string
): AIResponsePayload {
  const parseResult = RawModelOutputSchema.safeParse(rawJson);

  if (!parseResult.success) {
    console.warn("Model output failed schema validation:", parseResult.error);
    return createSafeFallbackResponse(verifiedUserInput);
  }

  const data = parseResult.data;
  const resolvedActions = resolveActions(data.actions);

  return {
    input: verifiedUserInput,
    output: {
      message: data.output.message.trim(),
      feeling: data.output.feeling as MascotFeeling,
    },
    actions: resolvedActions,
  };
}
