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
  const [typingUsers, setTypingUsers] = useState(new Set()); // Track who's typing
  const [messageStatus, setMessageStatus] = useState(new Map()); // Track message status
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
      // Mark messages as read when selecting a request
      if (data.length > 0) {
        markMessagesAsRead(request.id, data.map(msg => msg.id));
      }
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Send a message in the selected request
  const sendMessage = useCallback(async (content, type = 'text') => {
    if (!selectedRequest) return;
    
    // Create optimistic message
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content,
      type,
      senderId: user.id,
      requestId: selectedRequest.id,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageStatus(prev => new Map(prev).set(optimisticMessage.id, 'sending'));
    
    try {
      const msg = await chatService.sendMessage(selectedRequest.id, { content, type });
      
      // Replace optimistic message with real one
      setMessages((prev) => prev.map(m => m.id === optimisticMessage.id ? { ...msg, status: 'sent' } : m));
      setMessageStatus(prev => new Map(prev).set(msg.id, 'sent'));
      
      // Emit typing stop
      if (socket) {
        socket.emit('stop_typing', { requestId: selectedRequest.id, userId: user.id });
      }
      
      return msg;
    } catch (error) {
      // Mark as failed
      setMessages((prev) => prev.map(m => m.id === optimisticMessage.id ? { ...m, status: 'failed' } : m));
      setMessageStatus(prev => new Map(prev).set(optimisticMessage.id, 'failed'));
      throw error;
    }
  }, [selectedRequest, user.id, socket]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async (requestId, messageIds) => {
    try {
      await chatService.markMessagesAsRead(requestId, messageIds);
      setMessages(prev => prev.map(msg => 
        messageIds.includes(msg.id) ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, []);

  // Handle typing events
  const startTyping = useCallback(() => {
    if (socket && selectedRequest) {
      socket.emit('start_typing', { requestId: selectedRequest.id, userId: user.id });
    }
  }, [socket, selectedRequest, user.id]);

  const stopTyping = useCallback(() => {
    if (socket && selectedRequest) {
      socket.emit('stop_typing', { requestId: selectedRequest.id, userId: user.id });
    }
  }, [socket, selectedRequest, user.id]);

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
        setMessages(prev => [...prev, { ...message, status: 'received' }]);
        setMessageStatus(prev => new Map(prev).set(message.id, 'received'));
        
        // Mark as read if request is selected
        markMessagesAsRead(selectedRequest.id, [message.id]);
      }
      // Optionally, update request preview/notifications
      fetchRequests();
      fetchNotifications();
    });
    
    s.on('status_update', ({ requestId, status }) => {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
      fetchNotifications();
    });
    
    // Typing indicators
    s.on('user_typing', ({ requestId, userId, userName }) => {
      if (selectedRequest && requestId === selectedRequest.id && userId !== user.id) {
        setTypingUsers(prev => new Set(prev).add(userName || 'Someone'));
      }
    });
    
    s.on('user_stopped_typing', ({ requestId, userId, userName }) => {
      if (selectedRequest && requestId === selectedRequest.id && userId !== user.id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userName || 'Someone');
          return newSet;
        });
      }
    });
    
    // Message status updates
    s.on('message_delivered', ({ messageId }) => {
      setMessageStatus(prev => new Map(prev).set(messageId, 'delivered'));
    });
    
    s.on('message_read', ({ messageId }) => {
      setMessageStatus(prev => new Map(prev).set(messageId, 'read'));
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    });
    
    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line
  }, [user.id, selectedRequest]);

  // Clear typing indicators when changing requests
  useEffect(() => {
    setTypingUsers(new Set());
  }, [selectedRequest]);

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
      typingUsers,
      messageStatus,
      startTyping,
      stopTyping,
      markMessagesAsRead,
      user,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
} 