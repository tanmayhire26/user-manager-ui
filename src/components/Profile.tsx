import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { BASE_URL } from '../constants';
import { decodeToken } from '../utils/auth';
import { toast } from 'react-toastify';

interface ProfileProps {
    show: boolean;
    onHide: () => void;
}

const Profile: React.FC<ProfileProps> = ({ show, onHide }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        const userData = decodeToken();
        if (userData) {
            setUsername(userData.username);
        }
    }, [show]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/users/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();
            
            if (response.ok) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                toast.success('Profile updated successfully');
                onHide();
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Profile Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Password (leave blank to keep current)</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group> */}

                    <Button variant="primary" type="submit">
                        Update Profile
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Profile; 