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
import { FaSort } from "react-icons/fa"; // Import the sort icon
import { useNavigate } from "react-router-dom";
import AddUser from "./AddUser"; // Import the AddUser component

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility
  const [sortOrder, setSortOrder] = useState({ approvalStatus: null, activeStatus: null }); // Track the sort order

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

  // Filter only customers
  const filteredUsers = users.filter((user) => user.role === "Customer");

  // Function to handle approve/reject actions
  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5069/api/user/admin/approve-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log(`User with ID ${id} approved successfully`);
        const updatedUsers = users.map((user) =>
          user.id === id ? { ...user, userStatus: "Approved" } : user
        );
        setUsers(updatedUsers);
      } else {
        console.error("Failed to approve the user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5069/api/user/admin/reject-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log(`User with ID ${id} rejected successfully`);
        const updatedUsers = users.map((user) =>
          user.id === id ? { ...user, userStatus: "Rejected" } : user
        );
        setUsers(updatedUsers);
      } else {
        console.error("Failed to reject the user.");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  // Sorting functions
  const sortUsersByApprovalStatus = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortOrder.approvalStatus === "asc") {
        return a.userStatus.localeCompare(b.userStatus);
      }
      return b.userStatus.localeCompare(a.userStatus);
    });
    setSortOrder((prevOrder) => ({
      ...prevOrder,
      approvalStatus: prevOrder.approvalStatus === "asc" ? "desc" : "asc",
    }));
    setUsers(sortedUsers);
  };

  const sortUsersByActiveStatus = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      const aStatus = a.isActive ? "Active" : "Inactive";
      const bStatus = b.isActive ? "Active" : "Inactive";
      if (sortOrder.activeStatus === "asc") {
        return aStatus.localeCompare(bStatus);
      }
      return bStatus.localeCompare(aStatus);
    });
    setSortOrder((prevOrder) => ({
      ...prevOrder,
      activeStatus: prevOrder.activeStatus === "asc" ? "desc" : "asc",
    }));
    setUsers(sortedUsers);
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Customer Details</CardTitle>
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
                    <th onClick={sortUsersByApprovalStatus} style={{ cursor: "pointer" }}>
                      Account Approval Status <FaSort /> {/* Sort icon added here */}
                    </th>
                    <th onClick={sortUsersByActiveStatus} style={{ cursor: "pointer" }}>
                      Account Active Status <FaSort /> {/* Sort icon added here */}
                    </th>
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
                          onClick={() => handleApprove(user.id)}
                        >
                          Approve
                        </Button>{" "}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleReject(user.id)}
                        >
                          Reject
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

export default UserTables;
