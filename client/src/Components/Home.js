import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import logo1 from "../Images/AdviseLinkLogo1.png";
import logo2 from "../Images/AdviseLinkLogo2.png";
import Logo from "./Logo";

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <Logo />
            <h1 className="display-4">Welcome to AdviseLink</h1>
            <p className="lead">
              Connect with advisors and get expert guidance for your academic
              journey.
            </p>
            <div className="mt-4">
              <Link to="/login">
                <Button color="primary" className="me-3">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button color="secondary">Register</Button>
              </Link>
            </div>
          </Col>
          <Col md={6}>
            <img
              src={logo1}
              alt="Academic Advising"
              className="img-fluid rounded"
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
