import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Input, // Import Input component for the search box
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import AddUser from "./AddUser"; // Import the AddUser component

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility
  const [searchQuery, setSearchQuery] = useState(""); // State to track search query

  const navigate = useNavigate();

  // Fetch the user data from the backend API
  useEffect(() => {
    fetch("http://127.0.0.1:15240/api/user/getAllUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // Toggle modal visibility
  const toggleModal = () => setModal(!modal);

  // Filter only vendors and apply search filter
  const filteredUsers = users.filter(
    (user) =>
      user.role === "Vendor" &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Filter by name
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by email
  );

  // Function to handle approve/reject actions
  const handleApprove = (id) => {
    console.log(`User with ID ${id} approved`);
    // Add logic to call your API to approve the user
  };

  const handleReject = (id) => {
    console.log(`User with ID ${id} rejected`);
    // Add logic to call your API to reject the user
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Vendor Details</CardTitle>
              {/* Search input box */}
              <Input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px", marginRight: "50px" }} // Adjust width as needed
              />
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Account Approval Status</th>
                    <th>Account Active Status</th>
                    <th>Rankings</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.userStatus}</td>
                      <td>{user.isActive ? "Active" : "Inactive"}</td>
                      <td>{user.rankings}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default UserTables;
