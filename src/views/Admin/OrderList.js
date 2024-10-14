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
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function Orders() {
  const [orders, setOrders] = useState([]);
  const { categoryName } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortOrder, setSortOrder] = useState({ field: null, order: null });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:15240/api/order/getOrdersByStatus/${categoryName}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [categoryName]);

  const handleSort = (field) => {
    const isAsc = sortOrder.field === field && sortOrder.order === "asc";
    const newOrder = isAsc ? "desc" : "asc";

    const sortedOrders = [...orders].sort((a, b) => {
      if (field === "totalAmount") {
        return newOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
      } else if (field === "shippingAddress" || field === "orderDate") {
        return newOrder === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      } else if (field === "vendors") {
        const vendorA = a.items[0]?.vendorId || "";
        const vendorB = b.items[0]?.vendorId || "";
        return newOrder === "asc"
          ? vendorA.localeCompare(vendorB)
          : vendorB.localeCompare(vendorA);
      }
      return 0;
    });

    setOrders(sortedOrders);
    setSortOrder({ field, order: newOrder });
  };

  const cancelOrderWithNote = async (orderId, cancellationNote) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/order/${orderId}/updateStatus/canceled`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        await fetch(
          `http://127.0.0.1:15240/api/order/${orderId}/updateCancellationNote`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ cancellationNote }),
          }
        );

        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        Swal.fire({
          title: "Success!",
          text: "Order canceled and note added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/order/${orderId}/updateStatus/delivered`,
        {
          method: "PUT",
        }
      );
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Delivered" } : order
          )
        );
        Swal.fire({
          title: "Success!",
          text: "Order marked as Delivered successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  const confirmRemoveProduct = (orderId) => {
    Swal.fire({
      title: "Cancel Order",
      input: "textarea",
      inputLabel: "Cancellation Note",
      inputPlaceholder: "Enter the reason for cancellation...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: (note) => {
        if (!note) {
          Swal.showValidationMessage("Cancellation note is required");
        }
        return note;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        cancelOrderWithNote(orderId, result.value);
      }
    });
  };

  const displayCancellationNote = (order) => {
    return categoryName === "canceled" && order.cancellationNote ? (
      <div>
        <strong>Cancellation Note:</strong> {order.cancellationNote}
      </div>
    ) : null;
  };

  const confirmRemoveProduct2 = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        markAsDelivered(orderId);
      }
    });
  };

  const filteredOrders = orders.filter((order) => {
    const searchString = searchQuery.toLowerCase();
    return (
      (order.id && order.id.toString().toLowerCase().includes(searchString)) ||
      (order.items &&
        order.items.length > 0 &&
        order.items[0].vendorId &&
        order.items[0].vendorId
          .toString()
          .toLowerCase()
          .includes(searchString)) ||
      (order.shippingAddress &&
        order.shippingAddress.toLowerCase().includes(searchString)) ||
      (order.paymentMethod &&
        order.paymentMethod.toLowerCase().includes(searchString)) ||
      (order.totalAmount &&
        order.totalAmount.toString().toLowerCase().includes(searchString)) ||
      new Date(order.orderDate)
        .toISOString()
        .split("T")[0]
        .includes(searchString)
    );
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">{categoryName} Orders List</CardTitle>
              <Input
                type="text"
                placeholder="Search Orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px", marginRight: "30px" }}
              />
            </CardHeader>
            <CardBody style={{ paddingTop: "30px" }}>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Order ID</th>
                    <th onClick={() => handleSort("vendors")} style={{ cursor: "pointer" }}>
                      Vendors Delivering the Orders <FaSort />
                    </th>
                    <th onClick={() => handleSort("shippingAddress")} style={{ cursor: "pointer" }}>
                      Address <FaSort />
                    </th>
                    <th onClick={() => handleSort("orderDate")} style={{ cursor: "pointer" }}>
                      Date <FaSort />
                    </th>
                    <th>Payment</th>
                    <th onClick={() => handleSort("totalAmount")} style={{ cursor: "pointer" }}>
                      Total <FaSort />
                    </th>
                    <th></th>
                    {categoryName === "Canceled" && <th>Cancellation Note</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderId}</td>
                      <td>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            <strong>{item.vendorId}</strong>
                          </li>
                        ))}
                      </td>
                      <td>{order.shippingAddress}</td>
                      <td>{new Date(order.orderDate).toISOString().split("T")[0]}</td>
                      <td>{order.paymentMethod}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        {categoryName === "Processing" && (
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => confirmRemoveProduct(order.id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                        {categoryName === "VendorReady" && (
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => confirmRemoveProduct2(order.id)}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </td>
                      {categoryName === "Canceled" && (
                        <td>{order.cancellationNote || "No note provided"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredOrders.map((order) => displayCancellationNote(order))}
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

export default Orders;
