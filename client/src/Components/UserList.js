import React from "react";
import { useSelector } from "react-redux";

const UserList = () => {
  const users = useSelector((state) => state.user.users); // Adjust according to your state

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
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.idNumber}>
                <td>{user.idNumber}</td>
                <td>
                  {user.firstName} {user.middleName} {user.lastName}
                </td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
