import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap"; //import the Reactstrap Components
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./Components/Login";
import { Navigate } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import StudentDashboard from "./Components/StudentDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Register from "./Components/Register";
import About from "./Components/About";
import Home from "./Components/Home";

const App = () => {
  return (
    <Container fluid>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />

          {/* Protected routes with Layout
        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <Home>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/student-dashboard"
                  element={<StudentDashboard />}
                />
                <Route path="/about" element={<About />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Home>
            // </ProtectedRoute>
          }
        /> */}
        </Routes>
        <Footer />
      </Router>
    </Container>
  );
};

export default App;
