import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import logo from "../Images/AdviseLinkLogo.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/userSlice";
import { useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  // Define handleLogout function
  const handleLogout = () => {
    try{dispatch(logout());
    console.log("handleLogout has been dispatched");
    navigate("/");// Redirect to login page after logout
    }catch(error){
      console.log(error);
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
          {user && (
            <>
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
            </>
          )}
          {/* end of logic */}
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
