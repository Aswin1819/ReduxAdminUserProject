import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.username || userData.username.length < 5) {
      toast.error("Username must be at least 5 characters long.");
      return;
    }

    const usernameRegex = /^[A-Za-z]+$/;
    if (!usernameRegex.test(userData.username)) {
      toast.error("Username must contain only alphabets.");
      return;
    }

    if (userData.username.includes(" ")) {
      toast.error("Username must not contain spaces.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!userData.password || userData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="register-input"
          placeholder="Username"
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          
        />
        <input
          type="email"
          className="register-input"
          placeholder="Email"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="register-input"
          placeholder="Password"
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          
        />
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
