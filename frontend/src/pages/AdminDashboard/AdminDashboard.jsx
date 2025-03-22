import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { fetchUsersThunk, deleteUserThunk, createUserThunk, updateUserThunk } from "../../features/adminSlice";
import { logout } from "../../features/authSlice"; // Import the logout action
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { users, loading } = useSelector((state) => state.admin);
  const { accessToken, refreshToken } = useSelector((state) => state.auth); // Retrieve both tokens

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    console.log("Access Token:", accessToken);
    if (accessToken && refreshToken) {
      dispatch(fetchUsersThunk({ token: accessToken, refreshToken }));
    }
  }, [dispatch, accessToken, refreshToken]);

  useEffect(() => {
    console.log("Users updated:", users); // Debugging log
  }, [users]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserThunk({ id, token: accessToken, refreshToken }));
    }
  };

  const openModal = (user = null) => {
    setEditUserId(user ? user.id : null);
    setFormData(user ? { username: user.username, email: user.email, password: "" } : { username: "", email: "", password: "" });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUserId) {
      dispatch(updateUserThunk({ id: editUserId, formData, token: accessToken, refreshToken }));
    } else {
      dispatch(createUserThunk({ formData, token: accessToken, refreshToken }));
    }
    setModalOpen(false);
  };

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout());

    // Navigate to the login page
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-dashboard">
    <h2 className="dashboard-title">Admin Dashboard</h2>
    <button className="logout-button" onClick={handleLogout}>Logout</button>
    
    <div className="dashboard-controls">
      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="add-user-button" onClick={() => openModal()}>Add User</button>
    </div>

    {loading ? (
      <p className="loading-text">Loading...</p>
    ) : (
      <table className="user-table">
        <thead>
          <tr>
            <th>No:</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(users?.results || [])
            .filter((user) => user.username.includes(search))
            .map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button className="edit-button" onClick={() => openModal(user)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )}

    {modalOpen && (
      <div className="modal-overlay">
        <div className="modal">
          <h3 className="modal-title">{editUserId ? "Edit User" : "Add User"}</h3>
          <form className="modal-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="modal-input"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <input
              type="email"
              className="modal-input"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              className="modal-input"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editUserId}
            />
            <div className="modal-buttons">
              <button type="submit" className="submit-button">{editUserId ? "Update" : "Create"}</button>
              <button type="button" className="cancel-button" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
};

export default AdminDashboard;
