export type MascotFeeling = "Happy" | "Feisty" | "Surprise" | "Double Blink";

export type AIActionType =
  | "navigate"         // Internal static route
  | "show_project"     // Dynamic project detail route (/projects/:id)
  | "download_resume"  // Fixed verified resume download (/resume/Kshitij_Resume.pdf)
  | "open_url"         // Verified external URL with approved hostname
  | "none";            // Normal conversational response without actions

export interface AIAction {
  type: AIActionType;
  label: string;
  target: string;      // Resolved, verified destination
  description?: string;
}

export interface AIResponsePayload {
  input: string;       // Attached server-side from original request
  output: {
    message: string;
    feeling: MascotFeeling;
  };
  actions: AIAction[];
}

export interface AIErrorPayload {
  error: string;
  code: "RATE_LIMITED" | "API_TIMEOUT" | "QUOTA_EXCEEDED" | "INVALID_INPUT" | "SERVICE_ERROR";
}

export interface ClientChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}
