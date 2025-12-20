//Library:
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import ProtectedRoute from "./Components/ProtectedRoute";
import BookMeeting from "./Components/Student/BookMeeting";
import AddTask from "./Components/Student/AddTask";
import MeetingList from "./Components/Student/MeetingList";
import AdvisorTasks from "./Components/Advisor/AdvisorTasks";

const App = () => {
  //get the current user from Redux state
  const user = useSelector((state) => state.user.user);
  const email = useSelector((state) => state.user.user?.email);
  const userType = useSelector((state) => state.user.user?.userType);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    try {
      // Only auto-redirect when userType appears AND the user is at the root/login
      // This prevents forcing navigation away from nested child routes (e.g. /dashboard/profile)
      if (!userType) return;
      const atRoot =
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "";
      if (!atRoot) return;

      if (userType === "student") {
        navigate("/student-dashboard");
      } else if (userType === "advisor") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  }, [userType, navigate, location.pathname]);
  //end of useEffect

  return (
    <Container fluid>
      <div className="App">
        {/* protected route */}
        {email ? <Header /> : null}
        <Routes>
          {/* public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userType={"advisor"}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute userType={"student"}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-meeting"
            element={
              <ProtectedRoute userType={"student"}>
                <BookMeeting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute userType={"advisor"}>
                <AdvisorTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <MeetingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/advisees"
            element={
              <ProtectedRoute userType={"advisor"}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/userlist"
            element={
              <ProtectedRoute userType={"advisor"}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
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
