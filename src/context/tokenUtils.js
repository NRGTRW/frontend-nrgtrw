export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken"); // ✅ Fixed key
};

export const removeToken = () => {
  localStorage.removeItem("authToken"); // ✅ Fixed key
};
