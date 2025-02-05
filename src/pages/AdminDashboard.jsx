import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { authToken, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const assignAdmin = async (userId) => {
    await axios.put("/admin/assign", { userId }, { headers: { Authorization: `Bearer ${authToken}` } });
    fetchUsers();
  };

  const removeAdmin = async (userId) => {
    await axios.put("/admin/remove", { userId }, { headers: { Authorization: `Bearer ${authToken}` } });
    fetchUsers();
  };

  return (
    <div>
      {user.role === "ROOT_ADMIN" && (
        <>
          <h2>Manage Users</h2>
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.name} - {u.role} 
                {u.role !== "ROOT_ADMIN" && (
                  <>
                    <button onClick={() => assignAdmin(u.id)}>Promote to Admin</button>
                    <button onClick={() => removeAdmin(u.id)}>Remove Admin</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Manage Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
            <button>Edit</button>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
