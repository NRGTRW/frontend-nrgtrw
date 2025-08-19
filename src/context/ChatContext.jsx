import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as chatService from "../services/chatService";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user } = useAuth(); // Use the real auth context
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set()); // Track who's typing
  const [messageStatus, setMessageStatus] = useState(new Map()); // Track message status

  // Only fetch data if user is authenticated
  const isAuthenticated = !!user;

  // Fetch all requests (user or admin)
  const fetchRequests = useCallback(async () => {
    if (!isAuthenticated) {
      setRequests([]);
      return;
    }

    setLoading(true);
    try {
      const data = await chatService.getRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Select a request and fetch its messages
  const selectRequest = useCallback(
    async (request) => {
      if (!isAuthenticated) return;

      setSelectedRequest(request);
      setMessagesLoading(true);
      try {
        const data = await chatService.getMessages(request.id);
        setMessages(data);
        // Mark messages as read when selecting a request
        if (data.length > 0) {
          markMessagesAsRead(
            request.id,
            data.map((msg) => msg.id),
          );
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    },
    [isAuthenticated],
  );

  // Send a message in the selected request
  const sendMessage = useCallback(
    async (content, type = "text") => {
      if (!selectedRequest || !isAuthenticated) return;

      // Create optimistic message
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content,
        type,
        senderId: user.id,
        requestId: selectedRequest.id,
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setMessageStatus((prev) =>
        new Map(prev).set(optimisticMessage.id, "sending"),
      );

      try {
        const msg = await chatService.sendMessage(selectedRequest.id, {
          content,
          type,
        });

        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMessage.id ? { ...msg, status: "sent" } : m,
          ),
        );
        setMessageStatus((prev) => new Map(prev).set(msg.id, "sent"));

        // Emit typing stop
        if (socket) {
          socket.emit("stop_typing", {
            requestId: selectedRequest.id,
            userId: user.id,
          });
        }

        return msg;
      } catch (error) {
        // Mark as failed
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMessage.id ? { ...m, status: "failed" } : m,
          ),
        );
        setMessageStatus((prev) =>
          new Map(prev).set(optimisticMessage.id, "failed"),
        );
        throw error;
      }
    },
    [selectedRequest, user?.id, socket, isAuthenticated],
  );

  // Mark messages as read
  const markMessagesAsRead = useCallback(
    async (requestId, messageIds) => {
      if (!isAuthenticated) return;

      try {
        await chatService.markMessagesAsRead(requestId, messageIds);
        setMessages((prev) =>
          prev.map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, read: true } : msg,
          ),
        );
      } catch (error) {
        console.error("Failed to mark messages as read:", error);
      }
    },
    [isAuthenticated],
  );

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    setNotificationsLoading(true);
    try {
      const data = await chatService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markNotificationRead = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      try {
        await chatService.markNotificationRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [isAuthenticated],
  );

  // Create a new request
  const createRequest = useCallback(
    async (requestData) => {
      if (!isAuthenticated) throw new Error("User not authenticated");

      try {
        const request = await chatService.createRequest(requestData);
        setRequests((prev) => [request, ...prev]);
        return request;
      } catch (error) {
        console.error("Failed to create request:", error);
        throw error;
      }
    },
    [isAuthenticated],
  );

  // Update request status (admin only)
  const updateRequestStatus = useCallback(
    async (requestId, status) => {
      if (!isAuthenticated) return;

      try {
        await chatService.adminUpdateRequestStatus(requestId, status);
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status } : r)),
        );
        fetchNotifications();
      } catch (error) {
        console.error("Failed to update request status:", error);
      }
    },
    [isAuthenticated, fetchNotifications],
  );

  // Socket.IO connection
  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      auth: {
        token: localStorage.getItem("authToken"),
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      newSocket.emit("join", { userId: user.id });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    newSocket.on("new_message", (message) => {
      if (message.requestId === selectedRequest?.id) {
        setMessages((prev) => [...prev, message]);
      }
      fetchNotifications();
    });

    newSocket.on("typing_start", ({ requestId, userId }) => {
      if (requestId === selectedRequest?.id) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    });

    newSocket.on("typing_stop", ({ requestId, userId }) => {
      if (requestId === selectedRequest?.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user?.id, selectedRequest?.id, fetchNotifications]);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
      fetchNotifications();
    } else {
      // Clear data when user logs out
      setRequests([]);
      setNotifications([]);
      setSelectedRequest(null);
      setMessages([]);
    }
  }, [isAuthenticated, fetchRequests, fetchNotifications]);

  // Clear typing indicators when changing requests
  useEffect(() => {
    setTypingUsers(new Set());
  }, [selectedRequest]);

  // Refresh data periodically when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchRequests();
      fetchNotifications();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchRequests, fetchNotifications]);

  const value = {
    // State
    requests,
    selectedRequest,
    messages,
    notifications,
    loading,
    messagesLoading,
    notificationsLoading,
    typingUsers,
    messageStatus,
    isAuthenticated,

    // Actions
    fetchRequests,
    selectRequest,
    sendMessage,
    markMessagesAsRead,
    fetchNotifications,
    markNotificationRead,
    createRequest,
    updateRequestStatus,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
