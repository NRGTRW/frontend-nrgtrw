// Chat/Request API service
const API = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function createRequest({ title, description }) {
  const res = await fetch(`${API}/requests`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, description }),
  });
  return res.json();
}

export async function getRequests() {
  const res = await fetch(`${API}/requests`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function sendMessage(requestId, { content, type }) {
  const res = await fetch(`${API}/requests/${requestId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content, type }),
  });
  return res.json();
}

export async function getMessages(requestId) {
  const res = await fetch(`${API}/requests/${requestId}/messages`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function getNotifications() {
  const res = await fetch(`${API}/notifications`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function adminUpdateRequestStatus(requestId, status) {
  const res = await fetch(`${API}/requests/${requestId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API}/users`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function adminBlockUser(userId, status) {
  const res = await fetch(`${API}/users/${userId}/block`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
} 