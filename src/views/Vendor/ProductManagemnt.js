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
  ModalFooter,
  Input,

} from "reactstrap";
import { FaSort } from "react-icons/fa"; // Import the sort icon
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Importing edit and delete icons
import Swal from "sweetalert2"; // Import SweetAlert
import AddEditProduct from "./AddEditProduct"; // Import Add/Edit Product Component

function ProductTables() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false); // State to handle modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for editing
  const [vendorId, setVendorId] = useState(""); // State to store vendor ID from localStorage
  const [sortOrder, setSortOrder] = useState({ field: null, order: null }); // Track the current sort field and order
  const [expandedProducts, setExpandedProducts] = useState({}); // State to track expanded product descriptions
  const [searchTerm, setSearchTerm] = useState(""); // State to handle search input

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
        `http://127.0.0.1:15240/api/product/getProductsByVendor/${vendorId}`
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
      ? `http://127.0.0.1:15240/api/product/updateProduct/${selectedProduct.id}`
      : "http://127.0.0.1:15240/api/product/createProduct";

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

  // SweetAlert for delete confirmation
  const confirmDeleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteProduct(id); // Call delete function if confirmed
      }
    });
  };

  // Function to delete a product
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/product/deleteProduct/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
        Swal.fire("Deleted!", "Your product has been deleted.", "success"); // Success message
      } else {
        console.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Sorting functionality
  const handleSort = (field) => {
    const isAsc = sortOrder.field === field && sortOrder.order === "asc";
    const newOrder = isAsc ? "desc" : "asc";

    const sortedProducts = [...products].sort((a, b) => {
      if (a[field] < b[field]) return newOrder === "asc" ? -1 : 1;
      if (a[field] > b[field]) return newOrder === "asc" ? 1 : -1;
      return 0;
    });

    setProducts(sortedProducts);
    setSortOrder({ field, order: newOrder });
  };

  // Function to toggle description visibility
  const toggleDescription = (id) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.categoryName.toLowerCase().includes(searchLower) ||
      product.stockQuantity.toString().includes(searchLower)
    );
  });

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Product Details</CardTitle>
              <div className="d-flex align-items-center">
                {/* Search Input */}
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ marginRight: "30px", width: "250px" }} // Adjust width as needed
                />
                {/* Icon for adding product */}
                <FaPlus
                  size={28}
                  color="white"
                  style={{ cursor: "pointer", marginRight: "30px" }}
                  onClick={() => toggleModal()}
                />
              </div>
            </CardHeader>
            <CardBody style={{ paddingTop: "30px" }}>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th
                      onClick={() => handleSort("id")}
                      style={{ cursor: "pointer" }}
                    >
                      #
                      <FaSort />
                    </th>
                    <th>Image</th> {/* New Image Column */}
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Product Name
                      <FaSort />
                    </th>
                    <th>Description</th>
                    <th
                      onClick={() => handleSort("price")}
                      style={{ cursor: "pointer" }}
                    >
                      Price
                      <FaSort />
                    </th>
                    <th
                      onClick={() => handleSort("stockQuantity")}
                      style={{ cursor: "pointer" }}
                    >
                      Stock Quantity
                      <FaSort />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td> {/* Auto-incrementing ID with padding */}
                      <td>
                        {product.imgurl ? (
                          <img
                            src={product.imgurl}
                            alt={product.name}
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          />
                        ) : (
                          "No Image" // Fallback text if no image is available
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>
                        {expandedProducts[product.id]
                          ? product.description
                          : `${product.description.substring(0, 50)}... `}
                        <Button
                          color="link"
                          size="sm"
                          onClick={() => toggleDescription(product.id)}
                        >
                          {expandedProducts[product.id]
                            ? "See Less"
                            : "See More"}
                        </Button>
                      </td>
                      <td>{product.categoryName}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        {/* Edit button with green icon */}
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => toggleModal(product)}
                        >
                          <FaEdit />
                        </Button>{" "}
                        {/* Delete button with red icon */}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => confirmDeleteProduct(product.id)} // SweetAlert confirmation before deletion
                        >
                          <FaTrash />
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
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        style={{ maxWidth: "600px", backgroundColor: "#2C3E50" }}
      >
        <ModalBody style={{ backgroundColor: "#2C3E50", color: "#ffffff" }}>
          <h5
            style={{ color: "#ffffff", textAlign: "center", fontSize: "20px" }}
          >
            {selectedProduct ? "Edit Product" : "Add Product"}
          </h5>

          <AddEditProduct
            product={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={() => toggleModal()}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ProductTables;
