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
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  ModalHeader,
  Alert
} from "reactstrap";
import { FaSort, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddUser from "./AddUser";

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "Admin" }); // State for new user details
  const [sortOrder, setSortOrder] = useState({ approvalStatus: null, activeStatus: null });
  const [alertMessage, setAlertMessage] = useState(null); // State for success or error message
  const [alertType, setAlertType] = useState(""); // State for alert type (success or danger)
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:15240/api/User/getAllUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleModal = () => setModal(!modal);

  // Handle input changes for new user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle adding a new user (API call)
  const handleAddUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:15240/api/User/admin/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser), // Send the newUser object as the request body
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]); // Add new user to the existing users
        setAlertMessage("User added successfully!"); // Success message
        setAlertType("success");
        console.log("User added successfully");

        setNewUser({ email: "", password: "", role: "Admin" }); // Reset form fields after success
      } else {
        setAlertMessage("Failed to add the user. Please try again."); // Error message
        setAlertType("danger");
        console.error("Failed to add the user.");
      }
    } catch (error) {
      setAlertMessage("An error occurred while adding the user."); // Error message
      setAlertType("danger");
      console.error("Error adding user:", error);
    }

    toggleModal(); // Close modal after adding user
  };

  // Approve user action

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/user/admin/approve-user/${id}`,
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

  // Reject user action
  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/user/admin/reject-user/${id}`,
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

  // Filter only customers
  const filteredUsers = users.filter((user) => user.role === "Customer");

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
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4">Customer Details</CardTitle>
                {/* Container for Add User and Search input */}
                <div className="d-flex align-items-center">
                  {/* Search input box */}

                  <Input
                    type="text"
                    placeholder="Search Users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "230px", marginRight: "30px" }}
                  />
                  {/* Add User Icon (Clickable) */}
                  <FaUserPlus
                    size={28}
                    onClick={toggleModal}
                    style={{ cursor: "pointer", marginRight: "30px" }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {/* Display alert for success or error */}
              {alertMessage && (
                <Alert color={alertType} toggle={() => setAlertMessage(null)}>
                  {alertMessage}
                </Alert>
              )}
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Email Address</th>
                    <th onClick={sortUsersByApprovalStatus} style={{ cursor: "pointer" }}>
                      Account Approval Status <FaSort />
                    </th>
                    <th onClick={sortUsersByActiveStatus} style={{ cursor: "pointer" }}>
                      Account Active Status <FaSort />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td>
                      <td>{"CST" + user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.userStatus}</td>
                      <td>{user.isActive ? "Active" : "Inactive"}</td>
                      <td>
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => handleApprove(user.id)}
                          style={{ marginRight: "15px" }}
                        >
                          Approve
                        </Button>
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

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalBody style={{ backgroundColor: '#2C3E50', color: '#ECF0F1' }}> {/* Modal body inline background and text color */}
          <Form>
            {/* Increased font size for "Add New User" */}
            <h5 style={{ color: '#ffffff', textAlign: 'center', fontSize: '20px' }}>
              Add New User
            </h5>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={handleInputChange}
                required
                style={{ backgroundColor: '#34495E', color: '#ECF0F1', borderColor: '#ECF0F1' }} // Input inline background and text color
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                style={{ backgroundColor: '#34495E', color: '#ECF0F1', borderColor: '#ECF0F1' }} // Input inline background and text color
              />
            </FormGroup>

            <FormGroup>
              <Label for="role">Role</Label>
              <Input
                type="select"
                name="role"
                id="role"
                value={newUser.role}
                onChange={handleInputChange}
                style={{ backgroundColor: '#34495E', color: '#ECF0F1', borderColor: '#ECF0F1' }} // Select inline background and text color
              >
                <option value="Admin">Admin</option>
                <option value="CSR">CSR</option>
                <option value="Vendor">Vendor</option>
              </Input>
            </FormGroup>

            {/* Space between the role dropdown and the buttons */}
            <div className="d-flex justify-content-end mt-4">
              {/* Smaller Cancel button */}
              <Button 
                color="secondary" 
                size="m"  // Make button smaller
                onClick={toggleModal} 
                style={{ marginRight: '10px' }} // Add space between buttons
              >
                Cancel
              </Button>

              {/* Smaller Add User button */}
              <Button 
                color="primary" 
                size="m"  // Make button smaller
                onClick={handleAddUser} 
                style={{ backgroundColor: '#ff6219', borderColor: '#ff6219' }} // Fix background color
              >
                Add User
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default UserTables;
