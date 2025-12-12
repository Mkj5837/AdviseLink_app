import { Navbar, Nav, NavItem } from "reactstrap";
import logo from "../Images/AdviseLinkLogo.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/userSlice";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //retrieve the current user object:
  const currentUser = useSelector((state) => state.user.user);

  //dynamically determine the home path based on userType
  const homePath =
    currentUser?.userType === "student"
      ? "/student-dashboard" //route for students
      : currentUser?.userType === "advisor"
      ? "/dashboard" //route for advisors
      : "/"; //default to root (Login) if userType is undefined

  // Define handleLogout function
  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logout());
      unwrapResult(resultAction); //Unwrap the result. If the server returns 200, this succeeds.
      navigate("/");
    } catch (error) {
      console.error("Logout failed, redirecting anyway for UX:", error);
      navigate("/"); // Redirects to root URL even on network failure.
    }
  };

  return (
    <>
      <Navbar className="header">
        <Nav>
          <NavItem>
            <p>
              <img src={logo} className="logo" alt="AdviseLink Logo" />
            </p>
          </NavItem>

          {/*Use currentUser for conditional rendering */}
          {currentUser && (
            <>
              <NavItem>
                {/* call the function 'homepath' to determine what the homepage route is. */}
                <Link to={homePath}>Home</Link>
              </NavItem>

              <NavItem>
                <Link to="/profile">Profile</Link>
              </NavItem>

              <NavItem>
                <button
                  className="logout-btn"
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
