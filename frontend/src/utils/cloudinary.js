import axios from "axios";
const cloudName = "dklqydpyf"; // Replace with your Cloudinary Cloud Name
const uploadPreset = "ReduxProject"; // Replace with your Upload Preset Name
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = uploadPreset;

export const uploadImageToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Append the image file
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Append the upload preset

    // Make the request to Cloudinary
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the secure URL of the uploaded image
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
};