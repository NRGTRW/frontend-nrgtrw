import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../assets/styles/profilePage.css"; // Ensure this is the correct path to your CSS

const ProfilePage = () => {
  const { authToken, user, logOut } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [pendingSave, setPendingSave] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProfile(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          address: response.data.address || "",
          phone: response.data.phone || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error.response?.data || error.message);
        alert("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [authToken]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPendingSave(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/profile`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(response.data);
      setPendingSave(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };

  const handleProfilePictureUpload = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/profile/upload`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
      alert("Profile picture updated successfully.");
    } catch (error) {
      console.error("Failed to upload profile picture:", error.response?.data || error.message);
      alert("Failed to upload profile picture.");
    }
  };

  if (isLoading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-header">Your Profile</h1>
        {/* <p className="profile-subtitle">Manage your personal information and settings.</p> */}
        <div
          className="profile-image-container"
          onClick={() => document.getElementById("profile-image-upload").click()}
        >
          <input
            type="file"
            accept="image/*"
            id="profile-image-upload"
            style={{ display: "none" }}
            onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
          />
          <img
            src={profile?.profilePicture || "/default-profile.webp"}
            alt="Profile"
            className="profile-image"
          />
        </div>
        <form className="profile-form" onSubmit={handleSave}>
          <div className="profile-field">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              disabled
            />
          </div>
          <div className="profile-field">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Optional"
            />
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Optional"
            />
          </div>
          <div className="button-container">
            <button
              className={`save-button ${pendingSave ? "active" : ""}`}
              type="submit"
              disabled={!pendingSave}
            >
              Save Changes
            </button>
            <button
              className="logout-button"
              type="button"
              onClick={logOut}
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;


// import React, { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import "../assets/styles/profilePage.css";

// const ProfilePage = () => {
//   const { user, logOut } = useContext(AuthContext);
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     address: "",
//     phone: "",
//   });
//   const [pendingSave, setPendingSave] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         console.log("Profile fetched:", data); // Debugging
//         setProfile(data);
//       } catch (error) {
//         console.error("Failed to load profile:", error.response?.data || error.message);
//         alert("Failed to load profile.");
//       }
//     };
//     fetchProfile();
//   }, [user]);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setPendingSave(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.put("/api/profile", formData, {
//         headers: { Authorization: `Bearer ${user?.authToken}` },
//       });
//       setProfile(data);
//       setPendingSave(false);
//       alert("Profile updated successfully.");
//     } catch (error) {
//       console.error("Failed to update profile:", error.response?.data || error.message);
//       alert("Failed to update profile.");
//     }
//   };

//   const handleProfilePictureUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("profilePicture", file);

//     try {
//       const { data } = await axios.post("/api/profile/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${user?.authToken}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       setProfile((prev) => ({ ...prev, profilePicture: data.profilePicture }));
//       alert("Profile picture updated successfully.");
//     } catch (error) {
//       console.error("Failed to upload profile picture:", error.response?.data || error.message);
//       alert("Failed to upload profile picture.");
//     }
//   };

//   if (isLoading) {
//     return <div className="profile-page">Loading profile...</div>;
//   }

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <h1 className="profile-header">Your Profile</h1>
//         <p className="profile-subtitle">Manage your personal information and settings.</p>
//         <div
//           className="profile-image-container"
//           onClick={() => document.getElementById("profile-image-upload").click()}
//         >
//           <input
//             type="file"
//             accept="image/*"
//             id="profile-image-upload"
//             style={{ display: "none" }}
//             onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
//           />
//           <img
//             src={profile?.profilePicture || "/default-profile.webp"}
//             alt="Profile"
//             className="profile-image"
//           />
//         </div>
//         <form className="profile-form" onSubmit={handleSave}>
//           <div className="profile-field">
//             <label>Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleFormChange}
//             />
//           </div>
//           <div className="profile-field">
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleFormChange}
//               disabled // Email is usually not editable
//             />
//           </div>
//           <div className="profile-field">
//             <label>Address:</label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleFormChange}
//               placeholder="Optional"
//             />
//           </div>
//           <div className="profile-field">
//             <label>Phone:</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleFormChange}
//               placeholder="Optional"
//             />
//           </div>
//           <div className="button-container">
//             <button
//               className={`save-button ${pendingSave ? "active" : ""}`}
//               type="submit"
//               disabled={!pendingSave}
//             >
//               Save Changes
//             </button>
//             <button
//               className="logout-button"
//               type="button"
//               onClick={logOut}
//             >
//               Log Out
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
