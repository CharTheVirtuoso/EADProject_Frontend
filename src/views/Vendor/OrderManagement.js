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
import { useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

function Orders() {
  const [orders, setOrders] = useState([]);
  const { categoryName } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders by status from the backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get vendor ID from local storage
        const vendorId = localStorage.getItem("vendorId");

        if (!vendorId) {
          console.error("Vendor ID not found in local storage.");
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:15240/api/order/getOrdersByVendorId/${vendorId}`
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

  // Function to mark the order as ready
  const ReadyOrder = async (orderId) => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      console.log(vendorId);
      const response = await fetch(
        `http://127.0.0.1:15240/api/order/${orderId}/vendor/${vendorId}/updateVendorStatus/ready`,
        {
          method: "PUT", // Use PUT for updating status
        }
      );
      if (response.ok) {
        // Update UI to reflect order status change
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Order is sent for delivery.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // SweetAlert confirmation for marking a product as ready
  const confirmReadyProduct = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, ready to deliver it!",
    }).then((result) => {
      if (result.isConfirmed) {
        ReadyOrder(orderId);
      }
    });
  };

  // Filter orders based on the search query
  const filteredOrders = orders.filter((order) => {
    const searchString = searchQuery.toLowerCase();
    return (
      (order.id && order.id.toString().toLowerCase().includes(searchString)) ||
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

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">{categoryName} Orders List</CardTitle>
              {/* Search input box on the right */}
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
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Vendor Status</th>
                    <th>Order Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    // Filter items belonging to the current vendor
                    const vendorId = localStorage.getItem("vendorId");
                    const vendorItems = order.items.filter(
                      (item) => item.vendorId === vendorId
                    );

                    return vendorItems.map((item) => (
                      <tr key={item.id}>
                        <td>{order.id}</td>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{order.shippingAddress}</td>
                        <td>
                          {
                            new Date(order.orderDate)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td>{order.paymentMethod}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td>{item.vendorStatus}</td>
                        <td>{order.status}</td>
                        <td>
                          {/* Conditionally render buttons based on the order status */}
                          {item.vendorStatus === "Processing" && (
                            <Button
                              color="success"
                              size="sm"
                              onClick={() => confirmReadyProduct(order.id)}
                            >
                              Ready
                            </Button>
                          )}
                          {item.vendorStatus !== "Processing" && (
                            <Button color="success" size="sm" disabled="true">
                              Delivered
                            </Button>
                          )}
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Orders;
