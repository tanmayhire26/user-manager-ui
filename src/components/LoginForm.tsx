import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BASE_URL } from '../constants';

interface LoginFormProps {
    onLoginSuccess: (token: string) => void; // Prop to handle successful login
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // Simulate an API call to authenticate user and get a token
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to login');
            }

            const data = await response.json();
            console.log("data..........after login call...", data)
            onLoginSuccess(data.access_token); // Call the success handler with the token
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="text"
                    placeholder="Enter username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
};

export default LoginForm;
