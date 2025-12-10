//Library:
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

//Components
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import StudentDashboard from "./Components/StudentDashboard";
import Register from "./Components/Register";
import About from "./Components/About";
import UserList from "./Components/UserList";
import UpdateUser from "./Components/UpdateUser";
import { Router } from "express";

const App = () => {
  // Get the current user from Redux state
  const user = useSelector((state) => state.user.user);
  const email = useSelector((state) => state.user.user?.email);
  const userType = useSelector((state) => state.user.user?.userType);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Redirect based on userType
      if (userType === "student") {
        navigate("/student-dashboard");
      } else if (userType === "advisor") {
        navigate("/dashboard");
      }
      [userType, navigate];
    } catch (error) {
      console.log(error);
    }
  });
  //end of useEffect

  return (
    <Container fluid>
      <div className="App">
        <Router>
          {/* protected route */}
          {email ? <Header /> : null}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/userlist" element={<UserList />} />
            <Route
              path="/update/:email/:name/:password"
              element={<UpdateUser />}
            />
          </Routes>
          {/* protected route */}
          {email ? <Footer /> : null}
        </Router>
      </div>
    </Container>
  );
};

export default App;
