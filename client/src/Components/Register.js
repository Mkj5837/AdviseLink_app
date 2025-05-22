import React from "react";
import "../Register.css";
import { useNavigate } from "react-router-dom";
import { userSchemaValidation } from "../Validation/UserValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../Features/userSlice";

const Register = () => {
  // Retrieve the current value of the state and assign it to a variable.
  const userList = useSelector((state) => state.user.value);

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
    try {
      const userData = {
        idNumber: data.idNumber,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        age: data.age,
        gender: data.gender,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        userType: data.userType,
      };
      console.log("Form submitted:", data);
      alert("Validation all good.");
      dispatch(registerUser(userData));
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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

          <div className="form-group">
            <input type="number" {...register("age")} placeholder="Age" />
            {errors.age && <span className="error">{errors.age.message}</span>}
          </div>

          <div className="form-group gender-group">
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
          </div>

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
