import React, { useState } from "react";
import axios from "axios";
import "../Login.css";
import { Container } from "reactstrap";
import logoimg from "../Images/AdviseLinkLogo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Store user data including type
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      // Redirect based on user type
      if (response.data.user.type === "student") {
        window.location.href = "/student-dashboard";
      } else if (response.data.user.type === "advisor") {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error.response.data);
      // Handle login error
    }
  };

  return (
    <Container fluid>
      <div className="container">
        <div className="login-container">
          <div className="logo-container">
            {/* <div className="logo">
              <i className="graduation-cap"></i>
            </div> */}
          </div>
          {/* <img src={logoimg}></img> */}
          <h1>Advise Link</h1>
          <p className="subtitle">Connect With Your Advisor Easily.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <p className="sign-in-text">Sign in with email</p>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@gmail.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
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
            </div>

            <a href="/forgot-password" className="forgot-password">
              Forgot password ?
            </a>

            <button type="submit" className="sign-in-button">
              Sign-in
            </button>

            <p className="create-account">
              Don't have an account yet? <a href="/register">Sign-Up</a>
            </p>
          </form>
        </div>
        {/* //end of "login-container" div */}
      </div>{" "}
      //end of container divs
    </Container>
  );
};

export default Login;
