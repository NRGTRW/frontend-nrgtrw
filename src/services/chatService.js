// Chat/Request API service
const API = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      throw new Error('Authentication failed. Please log in again.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function createRequest({ title, description }) {
  try {
    const res = await fetch(`${API}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, description }),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to create request:', error);
    throw error;
  }
}

export async function getRequests() {
  try {
    const res = await fetch(`${API}/requests`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to get requests:', error);
    throw error;
  }
}

export async function sendMessage(requestId, { content, type }) {
  try {
    const res = await fetch(`${API}/requests/${requestId}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, type }),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

export async function getMessages(requestId) {
  try {
    const res = await fetch(`${API}/requests/${requestId}/messages`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to get messages:', error);
    throw error;
  }
}

export async function getNotifications() {
  try {
    const res = await fetch(`${API}/notifications`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to get notifications:', error);
    throw error;
  }
}

export async function markNotificationRead(id) {
  try {
    const res = await fetch(`${API}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
}

export async function markMessagesAsRead(requestId, messageIds) {
  try {
    const res = await fetch(`${API}/requests/${requestId}/messages/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ messageIds }),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
    throw error;
  }
}

export async function adminUpdateRequestStatus(requestId, status) {
  try {
    const res = await fetch(`${API}/requests/${requestId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to update request status:', error);
    throw error;
  }
}

export async function getUsers() {
  try {
    const res = await fetch(`${API}/users`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to get users:', error);
    throw error;
  }
}

export async function adminBlockUser(userId, status) {
  try {
    const res = await fetch(`${API}/users/${userId}/block`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to block user:', error);
    throw error;
  }
}

export async function adminDeleteRequest(requestId) {
  try {
    const res = await fetch(`${API}/requests/${requestId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  } catch (error) {
    console.error('Failed to delete request:', error);
    throw error;
  }
} 