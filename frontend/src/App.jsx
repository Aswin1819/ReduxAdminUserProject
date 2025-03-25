import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import { ToastContainer } from "react-toastify";
import CounterComponent from "./CounterComponent"

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <ToastContainer theme="light" position="top-right" />
    </Router>
  );
}

export default App;
