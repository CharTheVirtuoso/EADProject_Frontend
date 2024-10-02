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
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import AddEditProduct from "./AddEditProduct"; // Import Add/Edit Product Component

function ProductTables() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for editing
  const [vendorId, setVendorId] = useState(""); // State to store vendor ID from localStorage

  const navigate = useNavigate();

  // Fetch vendorId from localStorage
  useEffect(() => {
    const vendorIdFromStorage = localStorage.getItem("vendorId");
    if (vendorIdFromStorage) {
      setVendorId(vendorIdFromStorage);
    }
  }, []);

  // Fetch the product data from the backend API
  useEffect(() => {
    if (vendorId) {
      fetch(
        `http://localhost:5069/api/product/getProductsByVendor/${vendorId}`
      )
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Error fetching product data:", error));
    }
  }, [vendorId]);

  // Toggle modal visibility and optionally select a product to edit
  const toggleModal = (product = null) => {
    setSelectedProduct(product);
    setModal(!modal);
  };

  // Function to handle adding or editing a product
  const handleSaveProduct = async (product) => {
    const url = selectedProduct
      ? `http://localhost:5069/api/product/updateProduct/${selectedProduct.id}`
      : "http://localhost:5069/api/product/createProduct";

    const method = selectedProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        // Refetch the product list after saving
        const updatedProducts = await response.json();
        setProducts(updatedProducts);
        toggleModal(); // Close modal after save
      } else {
        console.error("Failed to save product.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Function to delete a product
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5069/api/product/deleteProduct/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
      } else {
        console.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Product Details</CardTitle>
              {/* +Add Product Button */}
              <Button color="primary" onClick={() => toggleModal()}>
                + Add Product
              </Button>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>Image</th> {/* New Image Column */}
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td>{" "}
                      {/* Auto-incrementing ID with padding */}
                      <td>
                        {product.image ? (
                          <img
                            src={product.Imgurl} // Display the image from Firebase URL
                            alt={product.name}
                            style={{ width: "50px", height: "50px" }} // Adjust the size as needed
                          />
                        ) : (
                          "No Image" // Fallback text if no image is available
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => toggleModal(product)}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
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

      {/* Modal for adding/editing a product */}
      <Modal isOpen={modal} toggle={() => toggleModal()}>
        <ModalHeader toggle={() => toggleModal()}>
          {selectedProduct ? "Edit Product" : "Add Product"}
        </ModalHeader>
        <AddEditProduct
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={() => toggleModal()}
        />
      </Modal>
    </div>
  );
}

export default ProductTables;
