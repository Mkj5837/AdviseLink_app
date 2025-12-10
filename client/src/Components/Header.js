import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import logo from "../Images/AdviseLinkLogo.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/userSlice";

const Header = () => {
  const dispatch = useDispatch(); // Declare dispatch
  const navigate = useNavigate(); // Declare navigate

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
            <Link to="/">Home</Link>
          </NavItem>

          <NavItem>
            <Link to="#">Profile</Link>
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
