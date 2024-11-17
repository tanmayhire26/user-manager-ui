import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Profile from '../components/Profile';
import { decodeToken } from '../utils/auth';

interface NavigationBarProps {
    onLoginClick: () => void; // Prop to handle login click
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onLoginClick }) => {

    const [showProfile, setShowProfile] = useState(false);
    const userData = decodeToken();
    return (
        <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          User Manage
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link onClick={onLoginClick}>Login</Nav.Link>
            <Nav.Link as={Link} to="/logout">
              Logout
            </Nav.Link>
            {localStorage.getItem("token") && (
              <>
                <Nav.Link as={Link} to="/users">
                  Users
                </Nav.Link>
                <Nav.Link as={Link} to="/roles">
                  Roles
                </Nav.Link>
                <Nav.Link as={Link} to="/blogs">
                  Blogs
                </Nav.Link>
              </>
            )}
          </Nav>

          {localStorage.getItem("token") && (
            <Nav>
              <NavDropdown
                title={userData?.username || "Profile"}
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => setShowProfile(true)}>
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/logout">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
       <Profile 
                show={showProfile} 
                onHide={() => setShowProfile(false)} 
            />
            </>
    );
};

export default NavigationBar;
