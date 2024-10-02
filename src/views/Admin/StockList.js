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
import { useParams } from "react-router-dom"; // Import useParams to get category name from URL

function Products() {
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams(); // Get category name from URL parameters

  // Fetch products by category from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5069/api/product/getProductByCategory/${categoryName}`
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
  const handleRemoveProduct = (productId) => {
    console.log(`Removing product with ID: ${productId}`);
    // Add functionality to remove the product (e.g., API call to delete)
  };

  // Function to notify the vendor about low stock
  const handleNotifyVendor = (vendorId, productName) => {
    console.log(
      `Notifying vendor with ID: ${vendorId} for product: ${productName}`
    );
    // Add functionality to notify vendor (e.g., API call or email notification)
  };

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Product List - {categoryName}</CardTitle>
            </CardHeader>
            <CardBody>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock Quantity</th>
                    <th>Stock Status</th>
                    <th>Vendor ID</th> {/* New Vendor ID Column */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
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
                        <td>{stockStatus}</td> {/* Display Stock Status */}
                        <td>{product.vendorId}</td> {/* Display Vendor ID */}
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.id)}
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
