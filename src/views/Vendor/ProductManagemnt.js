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
import { FaSort } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; 
import Swal from "sweetalert2"; 
import AddEditProduct from "./AddEditProduct";

function ProductTables() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [vendorId, setVendorId] = useState(""); 
  const [sortOrder, setSortOrder] = useState({ field: null, order: null }); 
  const [expandedProducts, setExpandedProducts] = useState({}); 
  const [searchTerm, setSearchTerm] = useState(""); 

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
        const updatedProducts = await response.json();
        setProducts(updatedProducts);
        toggleModal(); 
      } else {
        console.error("Failed to save product.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

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
        handleDeleteProduct(id); 
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
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ marginRight: "30px", width: "250px" }}
                />
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
                    <th>Image</th>
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Product Name
                      <FaSort />
                    </th>
                    <th>Description</th>
                    <th
                      onClick={() => handleSort("categoryName")}
                      style={{ cursor: "pointer" }}
                    >
                      Category
                      <FaSort />
                    </th>
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
                      Quantity
                      <FaSort />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{String(index + 1).padStart(3, "0")}</td>{" "}
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
                          "No Image"
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
                        <Button
                          color="success"
                          size="sm"
                          onClick={() => toggleModal(product)}
                        >
                          <FaEdit />
                        </Button>{" "}
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => confirmDeleteProduct(product.id)} 
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
