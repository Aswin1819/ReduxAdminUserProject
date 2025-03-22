import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../features/authSlice";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginUser(credentials);
      console.log("Login token:", token);

      dispatch(loginSuccess(token));
      console.log("isAdmin", isAdmin);
    } catch (error) {
      console.error("Login failed:", error);
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
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="login-input" 
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
          required 
        />
        <button type="submit" className="login-button">Login</button>
        <button type="button" className="register-button" onClick={()=>navigate("/register")}>Register</button>
      </form>
    </div>
  );
};

export default Login;
