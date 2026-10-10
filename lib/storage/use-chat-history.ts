"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { chatDb, StoredConversation, StoredMessage } from "./chat-db";
import { AIResponsePayload } from "../ai/schema";
import { ChatBubbleMessage } from "@/app/(main)/ai/components/ChatMessageBubble";

export const INITIAL_GREETING_MESSAGE: ChatBubbleMessage = {
  id: "initial-ai",
  sender: "ai",
  text: "Hey! I'm Kshitij's digital AI Companion and live Mascot avatar. I react dynamically to conversations and emotions.\n\nAsk me anything about Kshitij's engineering, projects, download his resume, or pick a starter below!",
  feeling: "Happy",
  actions: [
    {
      type: "navigate",
      label: "Explore Projects",
      target: "/projects",
    },
    {
      type: "download_resume",
      label: "Download CV",
      target: "/resume/Kshitij_Resume.pdf",
    },
  ],
  timestamp: "Just now",
};

export function useChatHistory() {
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatBubbleMessage[]>([INITIAL_GREETING_MESSAGE]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);

  const activeConvoIdRef = useRef<string>("");
  activeConvoIdRef.current = activeConversationId;

  // 1. Initial Load: Rehydrate the latest conversation on page visit
  useEffect(() => {
    let isMounted = true;

    async function loadLatestConversation() {
      try {
        // Query latest conversation by updatedAt descending
        const latestConvo = await chatDb.conversations.orderBy("updatedAt").reverse().first();

        if (!isMounted) return;

        if (latestConvo) {
          setActiveConversationId(latestConvo.id);

          // Load all messages for this conversation sorted by createdAt ascending
          const storedMsgs = await chatDb.messages
            .where("conversationId")
            .equals(latestConvo.id)
            .sortBy("createdAt");

          if (!isMounted) return;

          if (storedMsgs.length > 0) {
            const mappedMessages: ChatBubbleMessage[] = storedMsgs.map((sm) => ({
              id: sm.id,
              sender: sm.role === "model" ? "ai" : "user",
              text: sm.content,
              feeling: sm.responsePayload?.output.feeling,
              actions: sm.responsePayload?.actions,
              timestamp: new Date(sm.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));

            setMessages(mappedMessages);
          } else {
            setMessages([INITIAL_GREETING_MESSAGE]);
          }
        } else {
          // No conversations in IndexedDB yet: create fresh first conversation
          const newId = `convo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
          const now = Date.now();
          await chatDb.conversations.add({
            id: newId,
            title: "New Conversation",
            createdAt: now,
            updatedAt: now,
          });

          if (!isMounted) return;
          setActiveConversationId(newId);
          setMessages([INITIAL_GREETING_MESSAGE]);
        }
      } catch (err) {
        console.warn("IndexedDB storage unavailable or restricted, running in memory:", err);
        setIsStorageAvailable(false);
        const fallbackId = `convo-mem-${Date.now()}`;
        setActiveConversationId(fallbackId);
        setMessages([INITIAL_GREETING_MESSAGE]);
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    }

    loadLatestConversation();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Start a fresh conversation session WITHOUT deleting any past conversations
  const startNewConversation = useCallback(async () => {
    const newId = `convo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();

    if (isStorageAvailable) {
      try {
        await chatDb.conversations.add({
          id: newId,
          title: "New Conversation",
          createdAt: now,
          updatedAt: now,
        });
      } catch (err) {
        console.warn("Could not save new conversation to IndexedDB:", err);
      }
    }

    setActiveConversationId(newId);
    setMessages([
      {
        ...INITIAL_GREETING_MESSAGE,
        id: `initial-ai-${now}`,
        timestamp: "Just now",
      },
    ]);
  }, [isStorageAvailable]);

  // 3. Persist user message to IndexedDB
  const persistUserMessage = useCallback(
    async (userMsg: ChatBubbleMessage) => {
      const currentConvoId = activeConvoIdRef.current;
      if (!currentConvoId || !isStorageAvailable) return;

      const now = Date.now();
      try {
        const stored: StoredMessage = {
          id: userMsg.id,
          conversationId: currentConvoId,
          role: "user",
          content: userMsg.text,
          createdAt: now,
        };

        await chatDb.messages.add(stored);

        // Update conversation title (if still default) and updatedAt
        const convo = await chatDb.conversations.get(currentConvoId);
        if (convo) {
          const updateData: Partial<StoredConversation> = { updatedAt: now };
          if (convo.title === "New Conversation") {
            updateData.title = userMsg.text.slice(0, 36) + (userMsg.text.length > 36 ? "..." : "");
          }
          await chatDb.conversations.update(currentConvoId, updateData);
        }
      } catch (err) {
        console.warn("Failed to persist user message in IndexedDB:", err);
      }
    },
    [isStorageAvailable]
  );

  // 4. Persist assistant response to IndexedDB
  const persistAssistantResponse = useCallback(
    async (messageId: string, payload: AIResponsePayload) => {
      const currentConvoId = activeConvoIdRef.current;
      if (!currentConvoId || !isStorageAvailable) return;

      const now = Date.now();
      try {
        const stored: StoredMessage = {
          id: messageId,
          conversationId: currentConvoId,
          role: "model",
          content: payload.output.message,
          responsePayload: payload,
          createdAt: now,
        };

        await chatDb.messages.add(stored);
        await chatDb.conversations.update(currentConvoId, { updatedAt: now });
      } catch (err) {
        console.warn("Failed to persist assistant message in IndexedDB:", err);
      }
    },
    [isStorageAvailable]
  );

  return {
    activeConversationId,
    messages,
    setMessages,
    isLoadingHistory,
    isStorageAvailable,
    startNewConversation,
    persistUserMessage,
    persistAssistantResponse,
  };
}
