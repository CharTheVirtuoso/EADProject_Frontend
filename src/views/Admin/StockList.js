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
  Input,
} from "reactstrap";
import { FaSort } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function Products() {
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams();
  const [sortOrder, setSortOrder] = useState({ field: null, order: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:15240/api/Product/getProductByCategory/${encodeURIComponent(categoryName)}`
        );
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const handleSort = (field) => {
    const isAsc = sortOrder.field === field && sortOrder.order === "asc";
    const newOrder = isAsc ? "desc" : "asc";

    const sortedProducts = [...products].sort((a, b) => {
      if (field === "stockQuantity" || field === "price") {
        return newOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
      } else if (field === "stockStatus") {
        const getStockStatus = (product) => {
          if (product.stockQuantity === 0) return "Out of Stock";
          if (product.stockQuantity < 5) return "Low Stock";
          return "In Stock";
        };
        const statusA = getStockStatus(a);
        const statusB = getStockStatus(b);
        return newOrder === "asc" ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
      } else {
        return newOrder === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
      }
    });

    setProducts(sortedProducts);
    setSortOrder({ field, order: newOrder });
  };

  const handleRemoveProduct = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/product/deleteProduct/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
        Swal.fire({
          icon: "success",
          title: "Product Removed",
          text: "The product has been successfully removed.",
        });
      } else {
        console.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const confirmRemoveProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveProduct(productId);
      }
    });
  };

  const handleNotifyVendor = async (vendorId, productName) => {
    Swal.fire({
      icon: "info",
      title: "Vendor Notified",
      text: `Notification sent to the vendor about low stock for ${productName}.`,
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendorId.toString().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Product List - {categoryName}</CardTitle>
              <Input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px", marginRight: "30px" }}
              />
            </CardHeader>
            <CardBody style={{ paddingTop: "30px" }}>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                      # <FaSort />
                    </th>
                    <th>Image</th>
                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                      Product Name <FaSort />
                    </th>
                    <th onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
                      Price <FaSort />
                    </th>
                    <th onClick={() => handleSort("stockQuantity")} style={{ cursor: "pointer" }}>
                      Stock Quantity <FaSort />
                    </th>
                    <th onClick={() => handleSort("stockStatus")} style={{ cursor: "pointer" }}>
                      Stock Status <FaSort />
                    </th>
                    <th onClick={() => handleSort("vendorId")} style={{ cursor: "pointer" }}>
                      Vendor ID <FaSort />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => {
                    let stockStatus;
                    if (product.stockQuantity === 0) {
                      stockStatus = (
                        <span className="text-danger">Out of Stock</span>
                      );
                    } else if (product.stockQuantity < 5) {
                      stockStatus = (
                        <span className="text-warning">Low Stock</span>
                      );
                    } else {
                      stockStatus = (
                        <span className="text-success">In Stock</span>
                      );
                    }

                    return (
                      <tr key={product.id}>
                        <td>{String((currentPage - 1) * itemsPerPage + index + 1).padStart(3, "0")}</td>
                        <td>
                          {product.imgurl ? (
                            <img
                              src={product.imgurl}
                              alt={product.name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stockQuantity}</td>
                        <td>{stockStatus}</td>
                        <td>{product.vendorId}</td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => confirmRemoveProduct(product.id)}
                            style={{ marginRight: "15px" }}
                          >
                            Remove Product
                          </Button>{" "}
                          <Button
                            color="warning"
                            size="sm"
                            onClick={() =>
                              handleNotifyVendor(product.vendorId, product.name)
                            }
                          >
                            Notify Vendor
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
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

export default Products;
