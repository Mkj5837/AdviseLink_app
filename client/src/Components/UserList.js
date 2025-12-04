import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from "../Features/userSlice";
import { useNavigate } from "react-router-dom";
import "../UserList.css";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(id)).unwrap();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  const handleUpdate = (user) => {
    navigate(`/update/${user.email}/${user.firstName}/${user._id}`);
  };

  if (error) {
    console.log("Error fetching users:", error);
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>ID Number</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id || user.idNumber}>
                <td>{user.idNumber}</td>
                <td>
                  {user.firstName} {user.middleName} {user.lastName}
                </td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>
                  <button
                    onClick={() => handleUpdate(user)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;