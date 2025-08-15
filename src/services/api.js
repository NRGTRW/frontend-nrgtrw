import axios from "axios";
import { getToken } from "../context/tokenUtils";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Validate environment variable
if (!import.meta.env.VITE_API_URL) {
  console.warn("⚠️ VITE_API_URL not found in environment variables. Using fallback URL.");
}

console.log("🔍 API Base URL:", baseURL);

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------- Admin Endpoints -----------------
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new Error("Failed to fetch users.");
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error.message);
    throw new Error("Failed to update user role.");
  }
};

// ----------------- Checkout Endpoints -----------------
/**
 * Creates a Stripe Checkout session.
 * @param {Object} payload - Should include:
 *   - userId: Number (or retrieve from auth context)
 *   - items: Array of objects, e.g. [{ productId, quantity }]
 */
export const createCheckoutSession = async (payload) => {
  try {
    const response = await api.post("/checkout/create-checkout-session", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    throw new Error("Failed to create checkout session.");
  }
};

// ----------------- Fitness Endpoints -----------------
export const fetchFitnessPrograms = async () => {
  try {
    const response = await api.get("/fitness/programs");
    return response.data;
  } catch (error) {
    console.error("Error fetching fitness programs:", error.message);
    throw new Error("Failed to fetch fitness programs.");
  }
};

export const checkUserAccess = async () => {
  try {
    const response = await api.get("/fitness/user-access");
    return response.data;
  } catch (error) {
    console.error("Error checking user access:", error.message);
    throw new Error("Failed to check user access.");
  }
};

export const recordFitnessPurchase = async (purchaseData) => {
  try {
    const response = await api.post("/fitness/purchase", purchaseData);
    return response.data;
  } catch (error) {
    console.error("Error recording fitness purchase:", error.message);
    throw new Error("Failed to record fitness purchase.");
  }
};

export const recordFitnessSubscription = async (subscriptionData) => {
  try {
    const response = await api.post("/fitness/subscription", subscriptionData);
    return response.data;
  } catch (error) {
    console.error("Error recording fitness subscription:", error.message);
    throw new Error("Failed to record fitness subscription.");
  }
};

// ----------------- Fitness Admin Endpoints -----------------
export const fetchAllFitnessPrograms = async () => {
  try {
    const response = await api.get("/fitness/admin/programs");
    return response.data;
  } catch (error) {
    console.error("Error fetching all fitness programs:", error.message);
    throw new Error("Failed to fetch all fitness programs.");
  }
};

export const createFitnessProgram = async (programData) => {
  try {
    const response = await api.post("/fitness/admin/programs", programData);
    return response.data;
  } catch (error) {
    console.error("Error creating fitness program:", error.message);
    throw new Error("Failed to create fitness program.");
  }
};

export const updateFitnessProgram = async (programId, programData) => {
  try {
    const response = await api.put(`/fitness/admin/programs/${programId}`, programData);
    return response.data;
  } catch (error) {
    console.error("Error updating fitness program:", error.message);
    throw new Error("Failed to update fitness program.");
  }
};

export const toggleFitnessProgram = async (programId) => {
  try {
    const response = await api.patch(`/fitness/admin/programs/${programId}/toggle`);
    return response.data;
  } catch (error) {
    console.error("Error toggling fitness program:", error.message);
    throw new Error("Failed to toggle fitness program.");
  }
};

export const deleteFitnessProgram = async (programId) => {
  try {
    const response = await api.delete(`/fitness/admin/programs/${programId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting fitness program:", error.message);
    throw new Error("Failed to delete fitness program.");
  }
};

// ----------------- Fitness Admin Analytics Endpoints -----------------
export const fetchFitnessAnalytics = async () => {
  try {
    const response = await api.get("/fitness/admin/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching fitness analytics:", error.message);
    throw new Error("Failed to fetch fitness analytics.");
  }
};

export const fetchFitnessSubscriptions = async () => {
  try {
    const response = await api.get("/fitness/admin/subscriptions");
    return response.data;
  } catch (error) {
    console.error("Error fetching fitness subscriptions:", error.message);
    throw new Error("Failed to fetch fitness subscriptions.");
  }
};

export const cancelFitnessSubscription = async (subscriptionId) => {
  try {
    const response = await api.patch(`/fitness/admin/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling fitness subscription:", error.message);
    throw new Error("Failed to cancel fitness subscription.");
  }
};

export const fetchProgramStats = async (programId) => {
  try {
    const response = await api.get(`/fitness/admin/programs/${programId}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching program stats:", error.message);
    throw new Error("Failed to fetch program statistics.");
  }
};

export const bulkToggleFitnessPrograms = async (programIds, isActive) => {
  try {
    const response = await api.post("/fitness/admin/programs/bulk-toggle", {
      programIds,
      isActive
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk toggling fitness programs:", error.message);
    throw new Error("Failed to bulk toggle fitness programs.");
  }
};

export const exportFitnessPurchases = async () => {
  try {
    const response = await api.get("/fitness/admin/export/purchases", {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting fitness purchases:", error.message);
    throw new Error("Failed to export fitness purchases.");
  }
};

export const exportFitnessSubscriptions = async () => {
  try {
    const response = await api.get("/fitness/admin/export/subscriptions", {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting fitness subscriptions:", error.message);
    throw new Error("Failed to export fitness subscriptions.");
  }
};

// ----------------- Waitlist Endpoints -----------------
export const joinWaitlist = async (waitlistData) => {
  try {
    const response = await api.post("/waitlist/join", waitlistData);
    return response.data;
  } catch (error) {
    console.error("Error joining waitlist:", error.message);
    throw new Error("Failed to join waitlist.");
  }
};

export const checkWaitlistStatus = async (email, programId = null) => {
  try {
    const params = new URLSearchParams({ email });
    if (programId) params.append('programId', programId);
    const response = await api.get(`/waitlist/check?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error checking waitlist status:", error.message);
    throw new Error("Failed to check waitlist status.");
  }
};

export const getUserWaitlistStatus = async () => {
  try {
    const response = await api.get("/waitlist/status");
    return response.data;
  } catch (error) {
    console.error("Error fetching user waitlist status:", error.message);
    throw new Error("Failed to fetch waitlist status.");
  }
};

// ----------------- Waitlist Admin Endpoints -----------------
export const fetchWaitlistEntries = async (params = {}) => {
  try {
    const response = await api.get(`/waitlist/admin?${new URLSearchParams(params)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching waitlist entries:", error.message);
    throw new Error("Failed to fetch waitlist entries.");
  }
};

export const updateWaitlistEntry = async (entryId, updateData) => {
  try {
    const response = await api.patch(`/waitlist/admin/${entryId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating waitlist entry:", error.message);
    throw new Error("Failed to update waitlist entry.");
  }
};

export const deleteWaitlistEntry = async (entryId) => {
  try {
    const response = await api.delete(`/waitlist/admin/${entryId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting waitlist entry:", error.message);
    throw new Error("Failed to delete waitlist entry.");
  }
};

export const fetchWaitlistStats = async () => {
  try {
    const response = await api.get("/waitlist/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching waitlist stats:", error.message);
    throw new Error("Failed to fetch waitlist statistics.");
  }
};

// ----------------- Clothing Vote Endpoints -----------------
export const joinClothingVote = async (voteData) => {
  try {
    const response = await api.post("/clothing-vote/join", voteData);
    return response.data;
  } catch (error) {
    console.error("Error joining clothing vote:", error.message);
    throw new Error("Failed to submit clothing vote.");
  }
};

export const checkClothingVoteStatus = async (email, categoryId) => {
  try {
    const params = new URLSearchParams({ email, categoryId });
    const response = await api.get(`/clothing-vote/check?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error checking clothing vote status:", error.message);
    throw new Error("Failed to check clothing vote status.");
  }
};

export const fetchClothingVoteStats = async () => {
  try {
    const response = await api.get("/clothing-vote/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching clothing vote stats:", error.message);
    throw new Error("Failed to fetch clothing vote statistics.");
  }
};

// ----------------- Clothing Vote Admin Endpoints -----------------
export const fetchClothingVotes = async (params = {}) => {
  try {
    const response = await api.get(`/clothing-vote/admin?${new URLSearchParams(params)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothing votes:", error.message);
    throw new Error("Failed to fetch clothing votes.");
  }
};

export const updateClothingVote = async (voteId, updateData) => {
  try {
    const response = await api.patch(`/clothing-vote/admin/${voteId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating clothing vote:", error.message);
    throw new Error("Failed to update clothing vote.");
  }
};

export const deleteClothingVote = async (voteId) => {
  try {
    const response = await api.delete(`/clothing-vote/admin/${voteId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting clothing vote:", error.message);
    throw new Error("Failed to delete clothing vote.");
  }
};

export default api;
