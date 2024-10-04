import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Input, // Import Input component for the search box
  Button,
} from "reactstrap";
import { FaSort } from "react-icons/fa"; // Import the sort icon
import { useParams } from "react-router-dom"; // Import useParams to get category name from URL

function Products() {
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams(); // Get category name from URL parameters
  const [sortOrder, setSortOrder] = useState({ field: null, order: null }); // Track sorting
  const [searchQuery, setSearchQuery] = useState(""); // State to track search query

  // State to keep track of expanded descriptions
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Fetch products by category from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:15240/api/Product/getProductByCategory/${categoryName}`
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

  // Function to toggle the description view
  const toggleDescription = (productId) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  // Filter products based on the search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.price.toString().includes(searchQuery) // Convert price to string for comparison
  );

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Product List - {categoryName}</CardTitle>
              {/* Search input box on the right */}
              <Input
                type="text"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px", marginRight: "30px" }} // Adjust width as needed
              />
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
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
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
                      <td>
                        {expandedDescriptions[product.id] ? (
                          <span>
                            {product.description}{" "}
                            <Button
                              color="link"
                              onClick={() => toggleDescription(product.id)}
                            >
                              See less
                            </Button>
                          </span>
                        ) : (
                          <span>
                            {product.description.length > 50
                              ? `${product.description.substring(0, 100)}...`
                              : product.description}{" "}
                            <Button
                              color="link"
                              onClick={() => toggleDescription(product.id)}
                            >
                              See more
                            </Button>
                          </span>
                        )}
                      </td>
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
