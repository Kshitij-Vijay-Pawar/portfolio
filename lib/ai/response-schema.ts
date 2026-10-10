/**
 * Gemini JSON Schema for structured response generation.
 * Enforces the exact output shape and feelings enum.
 */
export const geminiResponseSchema = {
  type: "OBJECT",
  properties: {
    output: {
      type: "OBJECT",
      properties: {
        message: {
          type: "STRING",
          description: "Conversational answer representing Kshitij, direct, witty, and grounded.",
        },
        feeling: {
          type: "STRING",
          enum: ["Happy", "Feisty", "Surprise", "Double Blink"],
          description: "Mascot emotion representing the response mood.",
        },
      },
      required: ["message", "feeling"],
    },
    actions: {
      type: "ARRAY",
      description: "Optional declarative actions suggested to the user.",
      items: {
        type: "OBJECT",
        properties: {
          type: {
            type: "STRING",
            enum: ["navigate", "show_project", "download_resume", "open_url", "none"],
          },
          label: {
            type: "STRING",
            description: "Concise button label for the action.",
          },
          target: {
            type: "STRING",
            description: "Destination route, verified project slug, resume path, or approved external URL.",
          },
          description: {
            type: "STRING",
            description: "Optional brief description of what this action does.",
          },
        },
        required: ["type", "label", "target"],
      },
    },
  },
  required: ["output", "actions"],
};
