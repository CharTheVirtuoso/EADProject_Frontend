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
import { FaSort } from "react-icons/fa"; // Import the sort icon
import { useParams } from "react-router-dom"; // Import useParams to get category name from URL

function Products() {
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams(); // Get category name from URL parameters
  const [sortOrder, setSortOrder] = useState({ field: null, order: null }); // Track sorting

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

  // Sorting functionality
  const handleSort = (field) => {
    const isAsc = sortOrder.field === field && sortOrder.order === "asc";
    const newOrder = isAsc ? "desc" : "asc";

    const sortedProducts = [...products].sort((a, b) => {
      if (a[field] < b[field]) {
        return newOrder === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return newOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    setProducts(sortedProducts);
    setSortOrder({ field, order: newOrder });
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
                    <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                      #
                      <FaSort />
                    </th>
                    <th>Image</th> {/* New Image Column */}
                    <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                      Product Name
                      <FaSort />
                    </th>
                    <th>Description</th>
                    <th onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
                      Price
                      <FaSort />
                    </th>
                    <th onClick={() => handleSort("stockQuantity")} style={{ cursor: "pointer" }}>
                      Stock Quantity
                      <FaSort />
                    </th>
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
                    </tr>
                  ))}
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
