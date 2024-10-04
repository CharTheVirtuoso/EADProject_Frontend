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
} from "reactstrap";
import { FaSort } from "react-icons/fa"; // Import the sort icon
import { useNavigate } from "react-router-dom";

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility
  const [sortOrder, setSortOrder] = useState({ field: null, order: null }); // Track sorting
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

  // Function to handle sorting
  const handleSort = (field) => {
    const isAsc = sortOrder.field === field && sortOrder.order === "asc";
    const newOrder = isAsc ? "desc" : "asc";

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (field === "isActive") {
        // Special sorting for boolean field (active status)
        return newOrder === "asc"
          ? a[field] - b[field]
          : b[field] - a[field];
      } else if (a[field] < b[field]) {
        return newOrder === "asc" ? -1 : 1;
      } else if (a[field] > b[field]) {
        return newOrder === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });

    setUsers(sortedUsers);
    setSortOrder({ field, order: newOrder });
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
                    <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                      #
                      <FaSort />
                    </th>
                    <th>ID</th>
                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                      Name
                      <FaSort />
                    </th>
                    <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                      Email Address
                      <FaSort />
                    </th>
                    <th
                      onClick={() => handleSort("userStatus")}
                      style={{ cursor: "pointer" }}
                    >
                      Account Approval Status
                      <FaSort />
                    </th>
                    <th
                      onClick={() => handleSort("isActive")}
                      style={{ cursor: "pointer" }}
                    >
                      Account Active Status
                      <FaSort />
                    </th>
                    <th>Rankings</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td>
                      <td>{"VND" + user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.userStatus}</td>
                      <td>{user.isActive ? "Active" : "Inactive"}</td>
                      <td>{4.0}</td>
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
