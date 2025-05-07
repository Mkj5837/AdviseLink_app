import { Navbar, Nav, NavItem, NavLink } from "reactstrap";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <Navbar className="header">
        <Nav>
          <NavItem>
            <p>image.</p>
          </NavItem>
          <NavItem>
            <Link to="/">Home</Link>
          </NavItem>

          <NavItem>
            <Link to="#">Profile</Link>
          </NavItem>

          <NavItem>
            <NavLink href="#">Logout</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
