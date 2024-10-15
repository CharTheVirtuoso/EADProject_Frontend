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

function Products() {
  const [products, setProducts] = useState([]);
  const { categoryName } = useParams();
  const [sortOrder, setSortOrder] = useState({ field: null, order: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
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

  const toggleDescription = (productId) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.price.toString().includes(searchQuery)
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
                    <th>#</th>
                    <th>Image</th>
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer" }}
                    >
                      Product Name <FaSort />
                    </th>
                    <th>Description</th>
                    <th
                      onClick={() => handleSort("price")}
                      style={{ cursor: "pointer" }}
                    >
                      Price <FaSort />
                    </th>
                    <th
                      onClick={() => handleSort("stockQuantity")}
                      style={{ cursor: "pointer" }}
                    >
                      Stock Quantity <FaSort />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>
                        {String(
                          (currentPage - 1) * itemsPerPage + index + 1
                        ).padStart(3, "0")}
                      </td>
                      <td>
                        {product.image ? (
                          <img
                            src={product.Imgurl}
                            alt={product.name}
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          "No Image"
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
              {/* Pagination controls */}
              <div
                className="pagination-controls"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "15px",
                }}
              >
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
