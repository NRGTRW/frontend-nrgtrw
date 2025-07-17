import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as chatService from '../services/chatService';
import { io } from 'socket.io-client';

const ChatContext = createContext();

// Stub: get current user from localStorage (replace with real auth context)
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('profile')) || {};
  } catch {
    return {};
  }
}

export function ChatProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const user = getCurrentUser();

  // Fetch all requests (user or admin)
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chatService.getRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Select a request and fetch its messages
  const selectRequest = useCallback(async (request) => {
    setSelectedRequest(request);
    setMessagesLoading(true);
    try {
      const data = await chatService.getMessages(request.id);
      setMessages(data);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Send a message in the selected request
  const sendMessage = useCallback(async (content, type = 'text') => {
    if (!selectedRequest) return;
    const msg = await chatService.sendMessage(selectedRequest.id, { content, type });
    setMessages((prev) => [...prev, msg]);
  }, [selectedRequest]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const data = await chatService.getNotifications();
      setNotifications(data);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  // Mark notification as read
  const markNotificationRead = useCallback(async (id) => {
    await chatService.markNotificationRead(id);
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  // Real-time: connect to Socket.IO and handle events
  useEffect(() => {
    if (!user.id) return;
    const s = io('http://localhost:8088', {
      auth: { token: localStorage.getItem('authToken') },
      transports: ['websocket'],
    });
    setSocket(s);
    s.on('connect', () => {
      s.emit('join', { room: `user_${user.id}` });
    });
    s.on('new_request', (request) => {
      setRequests(prev => [request, ...prev]);
    });
    s.on('new_message', (message) => {
      // If message is for selected request, append
      if (selectedRequest && message.requestId === selectedRequest.id) {
        setMessages(prev => [...prev, message]);
      }
      // Optionally, update request preview/notifications
      fetchRequests();
      fetchNotifications();
    });
    s.on('status_update', ({ requestId, status }) => {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
      fetchNotifications();
    });
    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line
  }, [user.id, selectedRequest]);

  // Initial load
  useEffect(() => {
    fetchRequests();
    fetchNotifications();
  }, [fetchRequests, fetchNotifications]);

  return (
    <ChatContext.Provider value={{
      requests,
      selectedRequest,
      setSelectedRequest,
      selectRequest,
      messages,
      sendMessage,
      loading,
      messagesLoading,
      notifications,
      notificationsLoading,
      fetchRequests,
      fetchNotifications,
      markNotificationRead,
      user,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
} 