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
  Input,
  Spinner, 
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import AddUser from "../Admin/AddUser";
import { FaUserPlus, FaSort } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function CSRUserTable() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const navigate = useNavigate();

  const MySwal = withReactContent(Swal.mixin({
    customClass: {
      popup: 'swal-custom-bg',
    },
  }));

  useEffect(() => {
    fetch("http://127.0.0.1:15240/api/user/getAllUsers")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false); 
      });
  }, []);

  const toggleModal = () => setModal(!modal);

  const filteredUsers = users
    .filter((user) => !user.isActive && user.userStatus !== "Pending")
    .filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleReactivate = async (id) => {
    const confirmed = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to reactivate this user account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reactivate!",
      cancelButtonText: "No, cancel",
      customClass: {
        popup: 'swal-custom-bg',
      },
      didOpen: () => {
        const swalPopup = document.querySelector('.swal-custom-bg');
        if (swalPopup) {
          swalPopup.style.backgroundColor = '#2C3E50';
          swalPopup.style.color = '#ffffff';
        }
      },
    });

    if (confirmed.isConfirmed) {
      try {
        const response = await fetch(
          `http://127.0.0.1:15240/api/user/${id}/reactivateUser`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          MySwal.fire({
            title: "Success",
            text: "User account has been reactivated.",
            icon: "success",
            customClass: {
              popup: 'swal-custom-bg',
            },
            didOpen: () => {
              const swalPopup = document.querySelector('.swal-custom-bg');
              if (swalPopup) {
                swalPopup.style.backgroundColor = '#2C3E50';
                swalPopup.style.color = '#ffffff';
              }
            },
          });
          const updatedUsers = users.map((user) =>
            user.id === id ? { ...user, isActive: true } : user
          );
          setUsers(updatedUsers);
        } else if (response.status === 403) {
          MySwal.fire({
            title: "Error",
            text: "Only CSR can reactivate accounts.",
            icon: "error",
            customClass: {
              popup: 'swal-custom-bg',
            },
            didOpen: () => {
              const swalPopup = document.querySelector('.swal-custom-bg');
              if (swalPopup) {
                swalPopup.style.backgroundColor = '#2C3E50';
                swalPopup.style.color = '#ffffff';
              }
            },
          });
        } else {
          MySwal.fire({
            title: "Error",
            text: "Failed to reactivate the user.",
            icon: "error",
            customClass: {
              popup: 'swal-custom-bg',
            },
            didOpen: () => {
              const swalPopup = document.querySelector('.swal-custom-bg');
              if (swalPopup) {
                swalPopup.style.backgroundColor = '#2C3E50';
                swalPopup.style.color = '#ffffff';
              }
            },
          });
        }
      } catch (error) {
        MySwal.fire({
          title: "Error",
          text: "Error reactivating user.",
          icon: "error",
          customClass: {
            popup: 'swal-custom-bg',
          },
          didOpen: () => {
            const swalPopup = document.querySelector('.swal-custom-bg');
            if (swalPopup) {
              swalPopup.style.backgroundColor = '#2C3E50';
              swalPopup.style.color = '#ffffff';
            }
          },
        });
      }
    }
  };

  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setUsers(sortedUsers);
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Users with Inactive Accounts</CardTitle>
              <div className="d-flex align-items-center">
                <Input
                  type="text"
                  placeholder="Search Users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "230px", marginRight: "30px" }}
                />
                <FaUserPlus
                  size={28}
                  onClick={toggleModal}
                  style={{ cursor: "pointer", marginRight: "30px" }}
                />
              </div>
            </CardHeader>
            <CardBody style={{ paddingTop: "30px" }}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner color="primary" />
                </div>
              ) : (
                <>
                  {filteredUsers.length === 0 ? (
                    <div className="text-center">No inactive users found.</div>
                  ) : (
                    <Table className="tablesorter" responsive>
                      <thead className="text-primary">
                        <tr>
                          <th onClick={() => sortData('#')} style={{ cursor: 'pointer' }}>
                            # <FaSort />
                          </th>
                          <th>ID</th>
                          <th onClick={() => sortData('email')} style={{ cursor: 'pointer' }}>
                            Email Address <FaSort />
                          </th>
                          <th onClick={() => sortData('userStatus')} style={{ cursor: 'pointer' }}>
                            Account Approval Status <FaSort />
                          </th>
                          <th onClick={() => sortData('isActive')} style={{ cursor: 'pointer' }}>
                            Account Active Status <FaSort />
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => (
                          <tr key={user.id}>
                            <td>{String(index + 1).padStart(3, "0")}</td>
                            <td>{user.id}</td>
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
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <AddUser />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default CSRUserTable;
