import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { BASE_URL } from '../constants';

interface Role {
    _id: string;
    name: string;
}

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const [name, setName] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const response = await fetch(`${BASE_URL}/roles`);
        const data = await response.json();
        setRoles(data);
    };

    const handleShow = (role?: Role) => {
        if (role) {
            setCurrentRole(role);
            setName(role.name);
        } else {
            setCurrentRole(null);
            setName('');
        }
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentRole(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (currentRole) {
            await fetch(`${BASE_URL}/roles/${currentRole._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
        } else {
            await fetch(`${BASE_URL}/roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
        }
        fetchRoles();
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await fetch(`${BASE_URL}/roles/${id}`, { method: 'DELETE' });
        fetchRoles();
    };

    return (
        <div>
            <h2>Role Management</h2>
            <Button variant="primary" onClick={() => handleShow()}>Add Role</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role, index) => (
                        <tr key={role._id}>
                            <td>{index+1}</td>
                            <td>{role.name}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShow(role)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(role._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentRole ? 'Edit Role' : 'Add Role'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formRoleName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter role name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {currentRole ? 'Update' : 'Add'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Roles;
