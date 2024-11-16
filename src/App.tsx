import React, { useEffect, useState } from 'react';
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom';
import NavigationBar from './common/Navbar';
import Users from './components/Users';
import Roles from './components/Roles';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';
import { Modal } from 'react-bootstrap';

const App: React.FC = () => {

   const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setShowLoginModal(true); // Show login modal if not authenticated
        }
    }, []);

    const handleLoginModalClose = () => setShowLoginModal(false);
    
    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('token', token); // Store token in localStorage
        setIsAuthenticated(true);
        handleLoginModalClose();
    };
    return (
        <Router>
            <NavigationBar onLoginClick={() => setShowLoginModal(true)} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/users" element={<Users />} />
                <Route path="/roles" element={<Roles />} />
            </Routes>

            <Modal show={showLoginModal} onHide={handleLoginModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                </Modal.Body>
            </Modal>
        </Router>
    );
};

export default App;