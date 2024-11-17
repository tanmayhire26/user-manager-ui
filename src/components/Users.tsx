import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { BASE_URL } from '../constants';

interface User {
    _id: string;
    username: string;
    roles: string[];
}
interface Role {
  _id: string;
  name: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

     const [showRoleModal, setShowRoleModal] = useState(false);
     const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
     const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
     const [currentUserForRoles, setCurrentUserForRoles] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
        fetchAvailableRoles();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch(`${BASE_URL}/users`);
        const data = await response.json();
        setUsers(data);
    };

    const handleShow = (user?: User) => {
        if (user) {
            setCurrentUser(user);
            setName(user.username);
            // setEmail(user.email);
        } else {
            setCurrentUser(null);
            setName('');
            setEmail('');
        }
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentUser(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (currentUser) {
            await fetch(`${BASE_URL}/users/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, password }),
            });
        } else {
            await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
        }
        fetchUsers();
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
        fetchUsers();
    };

    

    

     const fetchAvailableRoles = async () => {
       try {
         const response = await fetch(`${BASE_URL}/roles`);
         const data = await response.json();
         setAvailableRoles(data);
       } catch (error) {
         console.error("Error fetching roles:", error);
       }
     };

     const handleShowRoles = (user: User) => {
       setCurrentUserForRoles(user);
       setSelectedRoles(user.roles || []);
       setShowRoleModal(true);
     };

     const handleRoleChange = (roleId: string) => {
       setSelectedRoles((prev) =>
         prev.includes(roleId)
           ? prev.filter((id) => id !== roleId)
           : [...prev, roleId]
       );
     };

     const handleRoleSubmit = async () => {
       if (currentUserForRoles) {
         try {
           await fetch(`${BASE_URL}/users/${currentUserForRoles._id}/roles`, {
             method: "PUT",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`,
             },
             body: JSON.stringify({ roles: selectedRoles }),
           });
           fetchUsers();
           setShowRoleModal(false);
         } catch (error) {
           console.error("Error updating user roles:", error);
         }
       }
     };

    return (
      <div>
        <h2>User Management</h2>
        <Button variant="primary" onClick={() => handleShow()}>
          Add User
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              {/* <th>Email</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                {/* <td>{user.email}</td> */}
                <td>
                  <Button variant="warning" onClick={() => handleShow(user)}>
                    Edit
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleShowRoles(user)}
                    className="me-2"
                  >
                    Manage Roles
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{currentUser ? "Edit User" : "Add User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUserName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={password}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={username}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* <Form.Group controlId="formUserEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </Form.Group> */}

              <Button variant="primary" type="submit">
                {currentUser ? "Update" : "Add"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Roles for {currentUserForRoles?.username}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {availableRoles.map((role) => (
                <Form.Check
                  key={role._id}
                  type="checkbox"
                  id={`role-${role._id}`}
                  label={role.name}
                  checked={selectedRoles.includes(role._id)}
                  onChange={() => handleRoleChange(role._id)}
                  className="mb-2"
                />
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleRoleSubmit}>
              Save Roles
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
};

export default Users;
