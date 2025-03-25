import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../features/authSlice";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || credentials.username.length < 5) {
      toast.error("Username must be at least 5 characters long.");
      return;
    }
    if (!credentials.password || credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    const usernameRegex = /^[A-Za-z]+$/;
    if (!usernameRegex.test(credentials.username)) {
      toast.error("Username must contain only alphabets.");
      return;
    }

    // Validation: Username must not contain spaces
    if (credentials.username.includes(" ")) {
      toast.error("Username must not contain spaces.");
      return;
    }
    try {
      const token = await loginUser(credentials);
      console.log("Login token:", token);

      dispatch(loginSuccess(token));
      console.log("isAdmin", isAdmin);
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail); // Show the error message from the backend
      } else {
        toast.error("Invalid credentials.");
      }
    }
  };

  useEffect(() => {
    // Navigate based on isAdmin state after login
    if (accessToken) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [isAdmin, accessToken, navigate]); 

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          className="login-input" 
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} 
 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="login-input" 
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
           
        />
        <button type="submit" className="login-button">Login</button>
        <button type="button" className="register-button" onClick={()=>navigate("/register")}>Register</button>
      </form>
    </div>
  );
};

export default Login;
