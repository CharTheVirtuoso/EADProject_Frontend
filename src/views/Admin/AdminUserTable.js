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
  Input,
} from "reactstrap";
import { FaSort, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddUser from "./AddUser";

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [sortOrder, setSortOrder] = useState({
    approvalStatus: null,
    activeStatus: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:15240/api/User/getAllUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleModal = () => setModal(!modal);

  const filteredUsers = users.filter(
    (user) =>
      user.role === "Customer" &&
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

            <CardBody style={{ paddingTop: "30px" }}>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Email Address</th>
                    <th
                      onClick={sortUsersByApprovalStatus}
                      style={{ cursor: "pointer" }}
                    >
                      Account Approval Status <FaSort />
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
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <AddUser />
      </Modal>
    </div>
  );
}

export default UserTables;
