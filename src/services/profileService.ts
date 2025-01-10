import api from "./api";

export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await api.post("/profile/upload-picture", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.filePath;
};
