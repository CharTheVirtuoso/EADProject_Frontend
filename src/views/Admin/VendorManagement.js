import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Input,
  Button,
} from "reactstrap";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserTables() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [sortOrder, setSortOrder] = useState({ field: null, order: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 6; // Set items per page

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:15240/api/user/getAllUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleModal = () => setModal(!modal);

  const filteredUsers = users
    .filter((user) => user.role === "Vendor")
    .filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toString().includes(searchQuery)
    );

  const handleSort = (field) => {
    const isAsc = sortOrder.field === field && sortOrder.order === "asc";
    const newOrder = isAsc ? "desc" : "asc";

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (field === "isActive") {
        return newOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
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

  // Pagination logic
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
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Vendor Details</CardTitle>
              <Input
                type="text"
                placeholder="Search Vendors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px", marginRight: "50px" }}
              />
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                      # <FaSort />
                    </th>
                    <th>ID</th>
                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                      Name <FaSort />
                    </th>
                    <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                      Email Address <FaSort />
                    </th>
                    <th onClick={() => handleSort("userStatus")} style={{ cursor: "pointer" }}>
                      Account Approval Status <FaSort />
                    </th>
                    <th onClick={() => handleSort("isActive")} style={{ cursor: "pointer" }}>
                      Account Active Status <FaSort />
                    </th>
                    <th>Rankings</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{String((currentPage - 1) * itemsPerPage + index + 1).padStart(3, "0")}</td>
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
              {/* Pagination controls */}
              <div className="pagination-controls" style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
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
    </div>
  );
}

export default UserTables;
