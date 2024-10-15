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
  Alert,
} from "reactstrap";
import { FaSort, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddUser from "./AddUser";

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "Admin",
  });
  const [sortOrder, setSortOrder] = useState({
    approvalStatus: null,
    activeStatus: null,
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:15240/api/User/getAllUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleModal = () => setModal(!modal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:15240/api/User/admin/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setAlertMessage("User added successfully!");
        setAlertType("success");
        console.log("User added successfully");

        setNewUser({ email: "", password: "", role: "Admin" });
      } else {
        setAlertMessage("Failed to add the user. Please try again.");
        setAlertType("danger");
        console.error("Failed to add the user.");
      }
    } catch (error) {
      setAlertMessage("An error occurred while adding the user.");
      setAlertType("danger");
      console.error("Error adding user:", error);
    }

    toggleModal();
  };

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

  const filteredUsers = users
    .filter((user) => user.role === "Customer")
    .filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery) ||
        user.userStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.isActive ? "active" : "inactive").includes(
          searchQuery.toLowerCase()
        )
    );

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

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4">Customer Details</CardTitle>
                <div className="d-flex align-items-center">
                  <Input
                    type="text"
                    placeholder="Search Users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "230px", marginRight: "30px" }}
                  />
                  <FaUserPlus
                    size={28}
                    onClick={toggleModal}
                    style={{ cursor: "pointer", marginRight: "30px" }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div>
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
                      <th>Email</th>
                      <th
                        onClick={sortUsersByApprovalStatus}
                        style={{ cursor: "pointer" }}
                      >
                        Account Approval <FaSort />
                      </th>
                      <th
                        onClick={sortUsersByActiveStatus}
                        style={{ cursor: "pointer" }}
                      >
                        Account Active Status <FaSort />
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>
                          {String(
                            (currentPage - 1) * itemsPerPage + index + 1
                          ).padStart(3, "0")}
                        </td>
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
              </div>
              <div
                className="pagination-controls"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "15px",
                }}
              >
                <Button
                  color="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ marginRight: "5px" }}
                >
                  &lt;
                </Button>
                <span style={{ margin: "13px 10px" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  color="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalBody style={{ backgroundColor: "#2C3E50", color: "#ECF0F1" }}>
          <Form>
            <h5
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: "20px",
              }}
            >
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
                style={{
                  backgroundColor: "#34495E",
                  color: "#ECF0F1",
                  borderColor: "#ECF0F1",
                }}
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
                style={{
                  backgroundColor: "#34495E",
                  color: "#ECF0F1",
                  borderColor: "#ECF0F1",
                }}
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
                style={{
                  backgroundColor: "#34495E",
                  color: "#ECF0F1",
                  borderColor: "#ECF0F1",
                }}
              >
                <option value="Admin">Admin</option>
                <option value="CSR">CSR</option>
                <option value="Vendor">Vendor</option>
              </Input>
            </FormGroup>

            <div className="d-flex justify-content-end mt-4">
              <Button
                color="secondary"
                size="m"
                onClick={toggleModal}
                style={{ marginRight: "10px" }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                size="m"
                onClick={handleAddUser}
                style={{ backgroundColor: "#ff6219", borderColor: "#ff6219" }}
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
