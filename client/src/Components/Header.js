import { Navbar, Nav, NavItem, NavbarBrand } from "reactstrap";
import logo from "../Images/AdviseLinkLogo.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/userSlice";
import { persistor } from "../store/store";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import "../css/Profile.css";

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
      // Clear persisted store so logged-out user is not rehydrated
      try {
        await persistor.purge();
      } catch (e) {
        console.warn("Failed to purge persisted store:", e);
      }
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed, redirecting anyway for UX:", error);
      navigate("/", { replace: true }); // Redirects to root URL even on network failure.
    }
  };

  return (
    <>
      <Navbar color="light" light expand="md">
        <NavbarBrand tag={Link} to={homePath}>
          <img src={logo} className="logo" alt="AdviseLink Logo" />
        </NavbarBrand>
        <Nav>
          {/*Use currentUser for conditional rendering */}
          {currentUser && (
            <>
              <NavItem>
                <Link to={homePath} className="nav-link">
                  Home
                </Link>
              </NavItem>

              <NavItem>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </NavItem>

              <NavItem>
                <button
                  type="button"
                  className="header-logout-btn"
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
