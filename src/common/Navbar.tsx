import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface NavigationBarProps {
    onLoginClick: () => void; // Prop to handle login click
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onLoginClick }) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">User Manage</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link  onClick={onLoginClick}>Login</Nav.Link>
                    <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                    {localStorage.getItem('token') && (<><Nav.Link as={Link} to="/users">Users</Nav.Link>
                    <Nav.Link as={Link} to="/roles">Roles</Nav.Link></>)}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
