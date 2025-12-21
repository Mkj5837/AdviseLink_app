import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Features/userSlice";
import "../css/Login.css";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchemaValidation } from "../Validations/LoginValidation";
import { unwrapResult } from "@reduxjs/toolkit";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, error } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchemaValidation),
  });

  //State for visual feedback of password visibility
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      //Dispatch the thunk
      const resultAction = dispatch(login(data));

      //unwrapResult handles success (returns payload) or rejection (throws error)
      const userPayload = unwrapResult(resultAction);

      //if login successful: redirect based on userType
      if (userPayload?.userType === "advisor") {
        navigate("/dashboard");
      } else if (userPayload?.userType === "student") {
        navigate("/student-dashboard");
      }
    } catch (rejectedValue) {
      console.error("Login failed:", rejectedValue);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.userType === "advisor") {
        navigate("/dashboard");
      } else if (user.userType === "student") {
        navigate("/student-dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <Container fluid>
      <div className="container">
        <div className="login-container">
          <h1>Advise Link</h1>
          <p className="subtitle">Connect With Your Advisor Easily.</p>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Example@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="********"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </div>
            {error && <div className="error">{error}</div>}

            <button
              type="submit"
              className="sign-in-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign-in"}
            </button>

            <p className="create-account">
              Don't have an account yet? <Link to="/register">Sign-Up</Link>
            </p>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Login;
