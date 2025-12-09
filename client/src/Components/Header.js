import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import logo from "../Images/AdviseLinkLogo.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Define handleLogout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login page after logout
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
          <NavItem>
            <Link to="/login">Home</Link>
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
              onClick={handleLogout} // Event handler calls handleLogout
            >
              Logout
            </button>
          </NavItem>
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
