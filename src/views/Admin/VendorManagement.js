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
} from "reactstrap";
import { FaSort } from "react-icons/fa"; // Import the sort icon
import { useNavigate } from "react-router-dom";

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility
  const [sortOrder, setSortOrder] = useState({ field: null, order: null }); // Track sorting

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

  // Filter only vendors
  const filteredUsers = users.filter((user) => user.role === "Vendor");

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
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                      #
                      <FaSort />
                    </th>
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
                      <td>{String(index + 1).padStart(3, "0")}</td> {/* Auto-incrementing ID with padding */}
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
