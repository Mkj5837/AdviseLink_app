import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addUser, deleteUser } from "../Features/userSlice";
import { Link } from "react-router-dom";

const UserList = () => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.user.value);

  const handleDelete = (email) => {
    dispatch(deleteUser(email));
  };

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      <table className="user-list-table">
        <thead>
          <tr>
            <th>ID Number</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList && userList.length > 0 ? (
            userList.map((user, idx) => (
              <tr key={idx}>
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
                    onClick={() => handleDelete(user.email)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update/${user.email}/${user.firstName} ${user.middleName} ${user.lastName}/${user.password}`}
                    style={{ marginLeft: "8px" }}
                  >
                    <button className="update-btn">Update User</button>
                  </Link>
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
