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
import { useParams } from "react-router-dom"; // Import useParams to get category name from URL

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { categoryName } = useParams(); // Get category name from URL parameters

  // Fetch products by category from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:15240/api/product/getProductByCategory/${categoryName}`
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

  // Function to handle removing a product

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
      } else {
        console.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Function to notify the vendor about low stock
  const handleNotifyVendor = (vendorId, productName) => {
    console.log(
      `Notifying vendor with ID: ${vendorId} for product: ${productName}`
    );
    // Add functionality to notify vendor (e.g., API call or email notification)
  };

  // Filtered products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendorId.toString().includes(searchQuery.toLowerCase())
  );

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
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
                style={{ width: "250px", marginRight: "30px" }}
              />
            </CardHeader>
            <CardBody style={{ paddingTop: "30px" }}>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Stock Status</th>
                    <th>Vendor ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => {
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
                        <td>{String(index + 1).padStart(3, "0")}</td>
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
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stockQuantity}</td>
                        <td>{stockStatus}</td>
                        <td>{product.vendorId}</td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.id)}
                            style={{ marginRight: "15px" }} // Add margin to the right
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
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Products;
