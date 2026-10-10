import Dexie, { type Table } from "dexie";
import { AIResponsePayload } from "../ai/schema";

export interface StoredConversation {
  id: string;          // UUID or timestamp-based ID
  title: string;       // Auto-generated title (first prompt snippet)
  createdAt: number;
  updatedAt: number;
}

export interface StoredMessage {
  id: string;
  conversationId: string;
  role: "user" | "model";
  content: string;
  responsePayload?: AIResponsePayload; // Preserves complete feeling and action data
  createdAt: number;
}

export class PortfolioChatDatabase extends Dexie {
  conversations!: Table<StoredConversation, string>;
  messages!: Table<StoredMessage, string>;

  constructor() {
    super("KshitijPortfolioChatDB");
    this.version(1).stores({
      conversations: "id, createdAt, updatedAt",
      messages: "id, conversationId, role, createdAt",
    });
  }
}

export const chatDb = new PortfolioChatDatabase();
