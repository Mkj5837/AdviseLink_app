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
import UserList from "./Components/Advisor/UserList";
import Profile from "./Components/Profile";
import ProtectedRoute from "./Components/ProtectedRoute";
import BookMeeting from "./Components/Student/BookMeeting";
import AddTask from "./Components/Student/AddTask";
import MeetingList from "./Components/Student/MeetingList";
import MainLayout from "./Components/MainLayout";

const App = () => {
  //get the current user from Redux state
  const user = useSelector((state) => state.user.user);
  const email = useSelector((state) => state.user.user?.email);
  const userType = useSelector((state) => state.user.user?.userType);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    try {
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
    <Container fluid className="p-0">
      <div className="App">
        {/*Global header*/}
        {email && <Header />}

        <Routes>
          {/*Public Routes*/}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*NESTED LAYOUT: shared by all users*/}
          <Route element={<MainLayout />}>
            {/*student routes*/}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute userType="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-meeting"
              element={
                <ProtectedRoute userType="student">
                  <BookMeeting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <ProtectedRoute userType={["student", "advisor"]}>
                  <MeetingList />
                </ProtectedRoute>
              }
            />

            {/*Advisor routes*/}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute userType="advisor">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-task"
              element={
                <ProtectedRoute userType="advisor">
                  <AddTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userlist"
              element={
                <ProtectedRoute userType="advisor">
                  <UserList />
                </ProtectedRoute>
              }
            />
            {/*more shared routes/content */}
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Container>
  );
};

export default App;
