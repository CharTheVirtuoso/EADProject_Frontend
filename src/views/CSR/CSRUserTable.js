import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import AddUser from "../Admin/AddUser"; // Import the AddUser component

function CSRUserTable() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility

  const navigate = useNavigate();

  // Fetch the user data from the backend API
  useEffect(() => {
    fetch("http://localhost:5069/api/user/getAllUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // Toggle modal visibility
  const toggleModal = () => setModal(!modal);

  // Filter users whose account is not activated
  const filteredUsers = users.filter(
    (user) => !user.isActive && user.userStatus != "Pending"
  );

  // Function to handle reactivation of users
  const handleReactivate = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5069/api/user/${id}/reactivateUser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log(`User with ID ${id} reactivated successfully.`);
        // Optionally update the UI or refresh the user list after reactivation
        const updatedUsers = users.map((user) =>
          user.id === id ? { ...user, isActive: true } : user
        );
        setUsers(updatedUsers);
      } else if (response.status === 403) {
        console.error("Only CSR can reactivate deactivated accounts.");
      } else {
        console.error("Failed to reactivate the user.");
      }
    } catch (error) {
      console.error("Error reactivating user:", error);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Users with Inactive Accounts</CardTitle>
              {/* +Add Users Button */}
              <Button color="primary" onClick={toggleModal}>
                + Add User
              </Button>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>Email Address</th>
                    <th>Account Approval Status</th>
                    <th>Account Active Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td>{" "}
                      {/* Auto-incrementing ID with padding */}
                      <td>{user.email}</td>
                      <td>{user.userStatus}</td>
                      <td>{user.isActive ? "Active" : "Inactive"}</td>
                      <td>
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => handleReactivate(user.id)}
                        >
                          Reactivate
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal for adding a user */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <AddUser /> {/* AddUser form inside the modal */}
      </Modal>
    </div>
  );
}

export default CSRUserTable;
