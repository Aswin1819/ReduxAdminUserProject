import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile, uploadProfileImage } from "../../services/authService";
import { logout, updateUserProfile } from "../../features/authSlice"; // Import the updateUserProfile action
import { uploadImageToCloudinary } from "../../utils/cloudinary"; // Import the utility function
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, refreshToken, user } = useSelector((state) => state.auth); // Get user from Redux state
  const [error, setError] = useState(null); // Add error state for better debugging
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!accessToken || !refreshToken) {
          throw new Error("No tokens available");
        }
        const profile = await getProfile(accessToken, refreshToken);
        dispatch(updateUserProfile(profile)); // Update the Redux state with the fetched profile
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);

        // Log the user out and redirect to login
        dispatch(logout());
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [accessToken, refreshToken, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]); // Set the selected image
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      // Upload the image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(selectedImage);

      // Update the backend database with the new image URL
      const updatedUser = await uploadProfileImage(accessToken, { profile_image: imageUrl });

      // Update the Redux state with the new profile image
      console.log("Updated user:", updatedUser);
      dispatch(updateUserProfile(updatedUser));

      alert("Profile image updated successfully!");
    } catch (err) {
      console.error("Error uploading profile image:", err);
      alert("Failed to upload profile image.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>; // Display error message if any
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      {user ? (
        <div className="profile-content">
          <p className="profile-text"><strong>Username:</strong> {user.username || "N/A"}</p>
          <p className="profile-text"><strong>Email:</strong> {user.email || "N/A"}</p>
          <img
            src={user.profile_image}
            alt="Profile"
            className="profile-image"
          />
          <div className="upload-section">
            <input type="file" className="file-input" onChange={handleImageChange} />
            <button className="upload-button" onClick={handleImageUpload}>Upload Image</button>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p className="loading-message">Loading...</p>
      )}
    </div>
  );
};

export default Profile;
