import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { AVAILABLE_PERMISSIONS, BASE_URL } from '../constants';

interface Role {
    _id: string;
    name: string;
    permissions: string[];
}

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const [name, setName] = useState('');
     const [showPermissionModal, setShowPermissionModal] = useState(false);
     const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
       []
     );
     const [currentRoleForPermissions, setCurrentRoleForPermissions] =
       useState<Role | null>(null);



    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const response = await fetch(`${BASE_URL}/roles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ name }),
            });
        } else {
            await fetch(`${BASE_URL}/roles`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ name }),
            });
        }
        fetchRoles();
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await fetch(`${BASE_URL}/roles/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchRoles();
    };

    const handleShowPermissions = (role: Role) => {
      setCurrentRoleForPermissions(role);
      setSelectedPermissions(role.permissions || []);
      setShowPermissionModal(true);
    };

    const handlePermissionChange = (permission: string) => {
      setSelectedPermissions((prev) =>
        prev.includes(permission)
          ? prev.filter((p) => p !== permission)
          : [...prev, permission]
      );
    };

    const handlePermissionSubmit = async () => {
      if (currentRoleForPermissions) {
        await fetch(
          `${BASE_URL}/roles/${currentRoleForPermissions._id}/permissions`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ permissions: selectedPermissions }),
          }
        );
        fetchRoles();
        setShowPermissionModal(false);
      }
    };

    return (
      <div>
        <h2>Role Management</h2>
        <Button variant="primary" onClick={() => handleShow()}>
          Add Role
        </Button>
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
                <td>{index + 1}</td>
                <td>{role.name}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShow(role)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(role._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleShowPermissions(role)}
                    className="me-2"
                  >
                    Manage Permissions
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{currentRole ? "Edit Role" : "Add Role"}</Modal.Title>
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
                {currentRole ? "Update" : "Add"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showPermissionModal}
          onHide={() => setShowPermissionModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Permissions for {currentRoleForPermissions?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <Form.Check
                  key={permission}
                  type="checkbox"
                  id={`permission-${permission}`}
                  label={permission}
                  checked={selectedPermissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                  className="mb-2"
                />
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPermissionModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handlePermissionSubmit}>
              Save Permissions
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
};

export default Roles;
