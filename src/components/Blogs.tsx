import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {username: string};
  createdAt: string;
}

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/blog`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log("data of blogs after fetchibng", data)
      
      if (response.ok) {
        setBlogs(Array.isArray(data) ? data : []);
      } else {
        toast.error(data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load blogs');
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isEditing
      ? `${BASE_URL}/blog/${currentBlog._id}`
      : `${BASE_URL}/blog`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(currentBlog),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        await fetchBlogs();
        setCurrentBlog({});
        toast.success(`Blog ${isEditing ? 'updated' : 'created'} successfully`);
      } else {
        toast.error(data.message || `Failed to ${isEditing ? 'update' : 'create'} blog`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save blog');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`${BASE_URL}/blog/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          await fetchBlogs();
          toast.success('Blog deleted successfully');
        } else {
          toast.error(data.message || 'Failed to delete blog');
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete blog');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Blogs</h2>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => {
          setIsEditing(false);
          setCurrentBlog({});
          setShowModal(true);
        }}
      >
        Add New Blog
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs && blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <tr key={blog._id}>
                <td>{index + 1}</td>
                <td>{blog.title || 'N/A'}</td>
                <td>{blog.author?.username|| 'N/A'}</td>
                <td>
                  {blog.createdAt 
                    ? new Date(blog.createdAt).toLocaleDateString() 
                    : 'N/A'}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setCurrentBlog(blog);
                      setIsEditing(true);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No blogs found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setCurrentBlog({});
        setIsEditing(false);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Blog" : "Add New Blog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentBlog.title || ""}
                onChange={(e) =>
                  setCurrentBlog({ ...currentBlog, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentBlog.content || ""}
                onChange={(e) =>
                  setCurrentBlog({ ...currentBlog, content: e.target.value })
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Blogs;
