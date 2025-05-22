import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Features/userSlice";
import "../Login.css";
import { Container } from "reactstrap";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isError = useSelector((state) => state.user.isError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard"); // or your desired route
    }
    if (isError) {
      setErrorMsg("Login failed. Please check your credentials.");
    }
  }, [isSuccess, isError, navigate]);

  return (
    <Container fluid>
      <div className="container">
        <div className="login-container">
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
            <button type="submit" className="sign-in-button">
              Sign-in
            </button>
            {errorMsg && <div className="error">{errorMsg}</div>}
            <p className="create-account">
              Don't have an account yet? <a href="/register">Sign-Up</a>
            </p>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Login;
