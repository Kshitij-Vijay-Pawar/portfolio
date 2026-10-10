"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { chatDb, StoredConversation, StoredMessage } from "@/lib/storage/chat-db";
import { MascotFeeling, AIResponsePayload, AIErrorPayload } from "@/lib/ai/schema";
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

interface ChatContextType {
  // State
  messages: ChatBubbleMessage[];
  activeConversationId: string;
  isThinking: boolean;
  activeFeeling: MascotFeeling;
  isLoadingHistory: boolean;
  isStorageAvailable: boolean;
  inputValue: string;

  // Actions
  setInputValue: (val: string) => void;
  sendMessage: (textToSend?: string) => Promise<void>;
  stopGeneration: () => void;
  startNewConversation: () => Promise<void>;
  triggerFeeling: (feeling: MascotFeeling) => void;
  registerMascotFeelingHandler: (handler: (feeling: MascotFeeling) => void) => () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [messages, setMessages] = useState<ChatBubbleMessage[]>([INITIAL_GREETING_MESSAGE]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [activeFeeling, setActiveFeeling] = useState<MascotFeeling>("Happy");
  const [inputValue, setInputValue] = useState<string>("");

  // Refs for tracking mutable request lifecycle safely
  const activeConvoIdRef = useRef<string>("");
  activeConvoIdRef.current = activeConversationId;

  const currentRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAssistantMsgIdRef = useRef<string | null>(null);
  const pendingUserPromptRef = useRef<string>("");

  // Registered listeners for feeling changes (e.g., Mascot component refs in floating chat or page)
  const feelingHandlersRef = useRef<Set<(feeling: MascotFeeling) => void>>(new Set());

  const triggerFeeling = useCallback((feeling: MascotFeeling) => {
    setActiveFeeling(feeling);
    feelingHandlersRef.current.forEach((handler) => {
      try {
        handler(feeling);
      } catch (err) {
        console.error("Error in mascot feeling handler:", err);
      }
    });
  }, []);

  const registerMascotFeelingHandler = useCallback((handler: (feeling: MascotFeeling) => void) => {
    feelingHandlersRef.current.add(handler);
    return () => {
      feelingHandlersRef.current.delete(handler);
    };
  }, []);

  // 1. Initial Load: Rehydrate latest conversation from IndexedDB
  useEffect(() => {
    let isMounted = true;

    async function loadLatestConversation() {
      try {
        const latestConvo = await chatDb.conversations.orderBy("updatedAt").reverse().first();

        if (!isMounted) return;

        if (latestConvo) {
          setActiveConversationId(latestConvo.id);

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
          // First visit: create initial conversation record
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
        console.warn("IndexedDB storage unavailable, falling back to memory:", err);
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

  // Idle mascot emotion cycle when not thinking
  useEffect(() => {
    const idleFeelings: MascotFeeling[] = ["Happy", "Double Blink", "Surprise"];
    const interval = setInterval(() => {
      if (!isThinking) {
        const next = idleFeelings[Math.floor(Math.random() * idleFeelings.length)];
        triggerFeeling(next);
      }
    }, 9000);

    return () => clearInterval(interval);
  }, [isThinking, triggerFeeling]);

  // Persist user message to IndexedDB
  const persistUserMessage = useCallback(
    async (convoId: string, userMsg: ChatBubbleMessage) => {
      if (!convoId || !isStorageAvailable) return;

      const now = Date.now();
      try {
        const stored: StoredMessage = {
          id: userMsg.id,
          conversationId: convoId,
          role: "user",
          content: userMsg.text,
          createdAt: now,
        };

        await chatDb.messages.add(stored);

        const convo = await chatDb.conversations.get(convoId);
        if (convo) {
          const updateData: Partial<StoredConversation> = { updatedAt: now };
          if (convo.title === "New Conversation") {
            updateData.title = userMsg.text.slice(0, 36) + (userMsg.text.length > 36 ? "..." : "");
          }
          await chatDb.conversations.update(convoId, updateData);
        }
      } catch (err) {
        console.warn("Failed to persist user message in IndexedDB:", err);
      }
    },
    [isStorageAvailable]
  );

  // Persist assistant message to IndexedDB
  const persistAssistantResponse = useCallback(
    async (convoId: string, messageId: string, payload: AIResponsePayload) => {
      if (!convoId || !isStorageAvailable) return;

      const now = Date.now();
      try {
        const stored: StoredMessage = {
          id: messageId,
          conversationId: convoId,
          role: "model",
          content: payload.output.message,
          responsePayload: payload,
          createdAt: now,
        };

        await chatDb.messages.add(stored);
        await chatDb.conversations.update(convoId, { updatedAt: now });
      } catch (err) {
        console.warn("Failed to persist assistant message in IndexedDB:", err);
      }
    },
    [isStorageAvailable]
  );

  // Stop current in-flight generation (network request + typewriter animation)
  const stopGeneration = useCallback(() => {
    // 1. Invalidate request ID
    currentRequestIdRef.current += 1;

    // 2. Abort network request if pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 3. Clear running typewriter interval
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    // 4. Remove uncompleted assistant placeholder if one was added
    const pendingMsgId = pendingAssistantMsgIdRef.current;
    if (pendingMsgId) {
      setMessages((prev) => prev.filter((m) => m.id !== pendingMsgId));
      pendingAssistantMsgIdRef.current = null;
    }

    // 5. Restore user input prompt if present
    if (pendingUserPromptRef.current) {
      setInputValue(pendingUserPromptRef.current);
      pendingUserPromptRef.current = "";
    }

    // 6. Reset status & feelings
    setIsThinking(false);
    triggerFeeling("Happy");
  }, [triggerFeeling]);

  // Start new conversation session without deleting past ones
  const startNewConversation = useCallback(async () => {
    // Stop any active generation immediately
    stopGeneration();

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
    setInputValue("");
  }, [isStorageAvailable, stopGeneration]);

  // Client-side typewriter animation with stale request & abort guards
  const animateTypewriter = useCallback(
    (
      requestId: number,
      targetConvoId: string,
      messageId: string,
      fullText: string,
      targetFeeling: MascotFeeling,
      rawPayload: AIResponsePayload
    ) => {
      let currentIndex = 0;
      const chunkSize = 3;

      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }

      animationIntervalRef.current = setInterval(() => {
        // If request ID changed (cancelled or new request started), halt
        if (currentRequestIdRef.current !== requestId) {
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }
          return;
        }

        currentIndex += chunkSize;

        if (currentIndex >= fullText.length) {
          if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
            animationIntervalRef.current = null;
          }

          // Check if conversation ID still matches
          if (activeConvoIdRef.current !== targetConvoId) {
            return;
          }

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    text: fullText,
                    isStreaming: false,
                    feeling: targetFeeling,
                    actions: rawPayload.actions || [],
                  }
                : msg
            )
          );

          pendingAssistantMsgIdRef.current = null;
          pendingUserPromptRef.current = "";
          triggerFeeling(targetFeeling);
          persistAssistantResponse(targetConvoId, messageId, rawPayload);
        } else {
          const currentSub = fullText.slice(0, currentIndex);
          setMessages((prev) =>
            prev.map((msg) => (msg.id === messageId ? { ...msg, text: currentSub } : msg))
          );
        }
      }, 15);
    },
    [triggerFeeling, persistAssistantResponse]
  );

  // Send message to /api/ai
  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend ?? inputValue).trim();
      if (!text || isThinking) return;

      const targetConvoId = activeConvoIdRef.current;
      if (!targetConvoId) return;

      // Increment request ID and create AbortController
      const requestId = currentRequestIdRef.current + 1;
      currentRequestIdRef.current = requestId;

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      pendingUserPromptRef.current = text;

      const userMsgId = `user-${Date.now()}`;
      const userMsg: ChatBubbleMessage = {
        id: userMsgId,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const contextWindow = messages.slice(-10).map((m) => ({
        role: m.sender === "ai" ? "model" : "user",
        text: m.text,
      }));

      // Immediately append user message to UI and persist
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsThinking(true);
      persistUserMessage(targetConvoId, userMsg);
      triggerFeeling("Surprise");

      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: contextWindow,
          }),
          signal: abortController.signal,
        });

        // Guard against cancelled or superseded request
        if (currentRequestIdRef.current !== requestId) return;
        if (activeConvoIdRef.current !== targetConvoId) return;

        if (!response.ok) {
          let errorData: AIErrorPayload = {
            error: "Unable to reach AI companion at this moment.",
            code: "SERVICE_ERROR",
          };
          try {
            errorData = await response.json();
          } catch {}

          if (currentRequestIdRef.current !== requestId) return;

          setIsThinking(false);
          abortControllerRef.current = null;
          pendingUserPromptRef.current = "";
          triggerFeeling("Feisty");

          const errorMsgId = `ai-err-${Date.now()}`;
          setMessages((prev) => [
            ...prev,
            {
              id: errorMsgId,
              sender: "ai",
              text: `⚠️ ${errorData.error}`,
              isError: true,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              onRetry: () => sendMessage(text),
            },
          ]);
          return;
        }

        const data: AIResponsePayload = await response.json();

        // Stale check after json parsing
        if (currentRequestIdRef.current !== requestId) return;
        if (activeConvoIdRef.current !== targetConvoId) return;

        setIsThinking(false);
        abortControllerRef.current = null;

        const aiMsgId = `ai-${Date.now()}`;
        pendingAssistantMsgIdRef.current = aiMsgId;

        const placeholderMsg: ChatBubbleMessage = {
          id: aiMsgId,
          sender: "ai",
          text: "",
          feeling: data.output.feeling,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isStreaming: true,
        };

        setMessages((prev) => [...prev, placeholderMsg]);

        animateTypewriter(
          requestId,
          targetConvoId,
          aiMsgId,
          data.output.message,
          data.output.feeling,
          data
        );
      } catch (err: unknown) {
        // If aborted by user, clean exit
        if (
          (err instanceof DOMException && err.name === "AbortError") ||
          (err as { name?: string })?.name === "AbortError"
        ) {
          return;
        }

        // Stale check
        if (currentRequestIdRef.current !== requestId) return;
        if (activeConvoIdRef.current !== targetConvoId) return;

        setIsThinking(false);
        abortControllerRef.current = null;
        pendingUserPromptRef.current = "";
        triggerFeeling("Feisty");

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: "ai",
            text: "⚠️ Network disconnected. Please verify connection and retry.",
            isError: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            onRetry: () => sendMessage(text),
          },
        ]);
      }
    },
    [
      inputValue,
      isThinking,
      messages,
      persistUserMessage,
      triggerFeeling,
      animateTypewriter,
    ]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        activeConversationId,
        isThinking,
        activeFeeling,
        isLoadingHistory,
        isStorageAvailable,
        inputValue,
        setInputValue,
        sendMessage,
        stopGeneration,
        startNewConversation,
        triggerFeeling,
        registerMascotFeelingHandler,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
