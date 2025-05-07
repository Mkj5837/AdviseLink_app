import React, { useState } from "react";
import "../Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idNumber: "",
    firstName: "",
    lastName: "",
    middleName: "",
    age: "",
    gender: "",
    address: "",
    email: "",
    userType: "", // New field for user type
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here
    try {
      // Add your API call here
      console.log("Form submitted:", formData);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container">
      <div className="register-container">
        <div className="logo-container">
          <div className="logo">
            <i className="fas fa-graduation-cap"></i>
          </div>
        </div>

        <h1>Registration Form</h1>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="ID number"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Middle Name"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
          </div>

          <div className="form-group gender-group">
            <label>Gender</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                Female
              </label>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group user-type-group">
            <label>Type of User</label>
            <div className="user-type-options">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={formData.userType === "student"}
                  onChange={handleChange}
                />{" "}
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="advisor"
                  checked={formData.userType === "advisor"}
                  onChange={handleChange}
                />{" "}
                Advisor
              </label>
            </div>
          </div>

          <p className="privacy-notice">
            By clicking Register, you agree to our Privacy Policy
          </p>

          <button type="submit" className="register-button">
            Register
          </button>

          <p className="login-link">
            <a href="/login">Back to Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
