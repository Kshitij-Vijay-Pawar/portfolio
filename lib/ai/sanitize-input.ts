/**
 * Sanitize and enforce strict input length guards for incoming user messages.
 */

export interface SanitizedInputResult {
  isValid: boolean;
  sanitized: string;
  errorMessage?: string;
}

const MAX_INPUT_LENGTH = 400;

/**
 * Strips zero-width characters, collapses repetitive control whitespace,
 * and caps maximum input length to 400 characters.
 */
export function sanitizeInput(raw: unknown): SanitizedInputResult {
  if (typeof raw !== "string") {
    return {
      isValid: false,
      sanitized: "",
      errorMessage: "Input must be a valid text string.",
    };
  }

  // Remove zero-width spaces, invisible formatting, null bytes, and non-printable control characters
  let cleaned = raw
    .replace(/[\u200B-\u200D\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    // Normalize excessive multiple whitespace/newlines
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleaned) {
    return {
      isValid: false,
      sanitized: "",
      errorMessage: "Message cannot be empty.",
    };
  }

  if (cleaned.length > MAX_INPUT_LENGTH) {
    return {
      isValid: false,
      sanitized: cleaned,
      errorMessage: `Message exceeds maximum allowed length of ${MAX_INPUT_LENGTH} characters.`,
    };
  }

  return {
    isValid: true,
    sanitized: cleaned,
  };
}
