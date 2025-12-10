import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import StudentDashboard from "./Components/StudentDashboard";
import { useSelector } from "react-redux";
import Register from "./Components/Register";
import About from "./Components/About";
import Home from "./Components/Home";
import UserList from "./Components/UserList";
import UpdateUser from "./Components/UpdateUser";
import { useEffect } from "react";

const App = () => {
  // Get the current user from Redux state
  const user = useSelector((state) => state.user.user);
  const email = useSelector((state) => state.user.user?.email);
  const userType = useSelector((state) => state.user.user?.userType);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on userType
    if (userType === "student") {
      navigate("/student-dashboard");
    } else if (userType === "advisor") {
      navigate("/dashboard");
    }
    // You can add more userType checks if needed
  }, [userType, navigate]);

  return (
    <div className="App">
      {email ? <Header /> : null}
      <main className="content-area">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
      </main>
      {email ? <Footer /> : null}
    </div>
  );
};

export default App;
