import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../Features/userSlice";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, name, password } = useParams();

  // Split name into first, middle, last
  const [firstName, middleName = "", lastName = ""] = name.split(" ");

  const [form, setForm] = useState({
    email: email || "",
    firstName: firstName || "",
    middleName: middleName || "",
    lastName: lastName || "",
    password: password || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const userdata= {email: form.email,
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        password: form.password,
    }
    dispatch(
      updateUser(userdata)
    );
    // navigate("/userlist");
  };

  return (
    <div className="update-user-container">
      <h2>Update User</h2>
      <form onSubmit={handleUpdate} className="update-user-form">
        <div>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label>First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Middle Name</label>
          <input
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="update-btn">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
