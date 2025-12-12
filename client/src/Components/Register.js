import React from "react";
import "../css/Register.css";
import { useNavigate } from "react-router-dom";
import { userSchemaValidation } from "../Validations/UserValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../Features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit"; // Helper for checking thunk result

const Register = () => {
  const { isLoading, error } = useSelector((state) => state.user || {});

  // Create the navigate and dispatch function hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const onSubmit = async (data) => {
    //Prepare data: confirmPassword is client-side only, exclude it from the final payload
    const { confirmPassword, ...userData } = data;
    try {
      console.log("Form submitted: Data passed client-side validation.");
      const resultAction = await dispatch(registerUser(userData));
      // Unwraps the action payload; throws an error if the thunk was rejected
      unwrapResult(resultAction);
      navigate("/");
    } catch (rejectedValueOrError) {
      console.error("Registration FAILED:", rejectedValueOrError);
    }
  };

  return (
    <div className="container">
      <div className="register-container">
        <div className="logo-container"></div>

        <h1>Registration Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group">
            <input
              type="text"
              {...register("idNumber")}
              placeholder="Student/Employee ID"
            />
            {errors.idNumber && (
              <span className="error">{errors.idNumber.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              {...register("firstName")}
              placeholder="First Name"
            />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              {...register("middleName")}
              placeholder="Middle Name"
            />
            {errors.middleName && (
              <span className="error">{errors.middleName.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              {...register("lastName")}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </div>

          {/* <div className="form-group gender-group">
            <label>Gender</label>
            <div className="gender-options">
              <label>
                <input type="radio" value="male" {...register("gender")} />
                Male
              </label>
              <label>
                <input type="radio" value="female" {...register("gender")} />
                Female
              </label>
            </div>
            {errors.gender && (
              <span className="error">{errors.gender.message}</span>
            )}
          </div> */}

          <div className="form-group">
            <input type="email" {...register("email")} placeholder="Email" />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Display Loading and Server Error Feedback */}
          {isLoading && (
            <p className="status-message">Registering user... please wait.</p>
          )}
          {error && <p className="server-error-message">Error: {error}</p>}

          <div className="form-group user-type-group">
            <label>Type of User</label>
            <div className="user-type-options">
              <label>
                <input type="radio" value="student" {...register("userType")} />
                Student
              </label>
              <label>
                <input type="radio" value="advisor" {...register("userType")} />
                Advisor
              </label>
            </div>
            {errors.userType && (
              <span className="error">{errors.userType.message}</span>
            )}
          </div>

          <p className="privacy-notice">
            By clicking Register, you agree to our Privacy Policy
          </p>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Register"}
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
