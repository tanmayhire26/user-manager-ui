import React from 'react';
import { Route,BrowserRouter as Router, Routes } from 'react-router-dom';
import NavigationBar from './common/Navbar';
import Users from './components/Users';
import Roles from './components/Roles';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';

const App: React.FC = () => {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/users" element={<Users />} />
                <Route path="/roles" element={<Roles />} />
            </Routes>
        </Router>
    );
};

export default App;