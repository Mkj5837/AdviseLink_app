//Library:
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Container } from "reactstrap";

//Components
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Dashboard from "./Components/Advisor/Dashboard";
import StudentDashboard from "./Components/Student/StudentDashboard";
import Register from "./Components/Register";
import About from "./Components/About";
import UserList from "./Components/UserList";
import UpdateUser from "./Components/UpdateUser";
import Profile from "./Components/Profile";

const App = () => {
  //get the current user from Redux state
  const user = useSelector((state) => state.user.user);
  const email = useSelector((state) => state.user.user?.email);
  const userType = useSelector((state) => state.user.user?.userType);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      //redirect based on userType
      if (userType === "student") {
        navigate("/student-dashboard");
      } else if (userType === "advisor") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  }, [userType, navigate]);
  //end of useEffect

  return (
    <Container fluid>
      <div className="App">
        {/* protected route */}
        {email ? <Header /> : null}
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route
            path="/update/:email/:name/:password"
            element={<UpdateUser />}
          /> */}
        </Routes>
        {/* Public/unprotected  route */}
        <Footer />
      </div>
    </Container>
  );
};

export default App;
