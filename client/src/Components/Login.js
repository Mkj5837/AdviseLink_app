import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Features/userSlice";
import "../css/Login.css";
import { Container } from "reactstrap";
import Register from "./Register";

const Login = () => {
  //the needed vars
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const isSuccess = useSelector((state) => state.user.isSuccess);
  const isError = useSelector((state) => state.user.isError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      const resultAction = await dispatch(login({ email, password }));
      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        if (user?.userType === "advisor") {
          navigate("/dashboard");
        } else if (user?.userType === "student") {
          navigate("/student-dashboard");
        }
      } else if (login.rejected.match(resultAction)) {
        setErrorMsg(resultAction.payload || 'Login failed. Please check your credentials.');
        setShowError(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('An unexpected error occurred. Please try again.');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation after successful login
  useEffect(() => {
    if (isSuccess && user) {
      if (user.userType === "advisor") {
        navigate("/dashboard");
      } else if (user.userType === "student") {
        navigate("/student-dashboard");
      }
    }
  }, [isSuccess, user, navigate]);

  return (
    <Container fluid>
      <div className="container">
        <div className="login-container">
          <h1>Advise Link</h1>
          <p className="subtitle">Connect With Your Advisor Easily.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Example@gmail.com"
                {...Register("email", {
                  onchange: (e) => setEmail(e.target.value),
                  required: true,
                  value: email,
                })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="********"
                  {...Register("password", {
                    onchange: (e) => setPassword(e.target.value),
                    required: true,
                    value: password,
                  })}
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
