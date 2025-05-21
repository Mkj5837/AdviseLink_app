import React from "react";
import "../Register.css";
import { useNavigate } from "react-router-dom";
import { userSchemaValidation } from "../Validation/UserValidation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addUser } from "../Features/userSlice";

const Register = () => {
  //Retrieve the current value of the state and assign it to a variable.
  const userList = useSelector((state) => state.user.value);

  //Create the state variables
  const [idNumber, setIdNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");

  //Create the navigate dispatch function hooks
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
      // Add your API call here
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
      dispatch(addUser(userData)); //use the useDispatch hook to dispatch an action, passing as parameter the userData
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container">
      <div className="register-container">
        <div className="logo-container">
          {/* <div className="logo">
            <i className="fas fa-graduation-cap"></i>
          </div> */}
        </div>

        <h1>Registration Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group">
            <input
              type="text"
              {...register("idNumber", {
                value: idNumber,
                onChange: (e) => setIdNumber(e.target.value),
              })}
              placeholder="Student/Employee ID"
            />
            {errors.idNumber && (
              <span className="error">{errors.idNumber.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              {...register("firstName", {
                value: firstName,
                onChange: (e) => setFirstName(e.target.value),
              })}
              placeholder="First Name"
            />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              {...register("middleName", {
                value: middleName,
                onChange: (e) => setMiddleName(e.target.value),
              })}
              placeholder="Middle Name"
            />
            {errors.middleName && (
              <span className="error">{errors.middleName.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              {...register("lastName", {
                value: lastName,
                onChange: (e) => setLastName(e.target.value),
              })}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="number"
              {...register("age", {
                value: age,
                onChange: (e) => setAge(e.target.value),
              })}
              placeholder="Age"
            />
            {errors.age && <span className="error">{errors.age.message}</span>}
          </div>

          <div className="form-group gender-group">
            <label>Gender</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  value="male"
                  {...register("gender", {
                    value: gender,
                    onChange: (e) => setGender(e.target.value),
                  })}
                  checked={gender === "male"}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  value="female"
                  {...register("gender", {
                    value: gender,
                    onChange: (e) => setGender(e.target.value),
                  })}
                  checked={gender === "female"}
                />
                Female
              </label>
            </div>
            {errors.gender && (
              <span className="error">{errors.gender.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              {...register("email", {
                value: email,
                onChange: (e) => setEmail(e.target.value),
              })}
              placeholder="Email"
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              {...register("password", {
                value: password,
                onChange: (e) => setPassword(e.target.value),
              })}
              placeholder="Password"
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              {...register("confirmPassword", {
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
              })}
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
                <input
                  type="radio"
                  value="student"
                  {...register("userType", {
                    value: userType,
                    onChange: (e) => setUserType(e.target.value),
                  })}
                  checked={userType === "student"}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  value="advisor"
                  {...register("userType", {
                    value: userType,
                    onChange: (e) => setUserType(e.target.value),
                  })}
                  checked={userType === "advisor"}
                />{" "}
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
