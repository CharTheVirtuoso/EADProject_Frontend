import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
} from "reactstrap";
import { FaFolder } from "react-icons/fa"; // Example icon from react-icons
import { BiCategory } from "react-icons/bi";
import { BiSolidCategory } from "react-icons/bi";

function CategoryCards() {
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Fetch the category data from the backend API
  useEffect(() => {
    fetch("http://127.0.0.1:15240/api/category/getAllCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching category data:", error));
  }, []);

  // Function to fetch products by category
  const fetchProductsByCategory = (categoryName) => {
    fetch(
      `http://127.0.0.1:15240/api/product/getProductByCategory/${categoryName}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSelectedProducts(data);
        console.log(`Products for ${categoryName}:`, data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  // Function to handle activate/deactivate actions
  const handleActivate = (categoryName) => {
    console.log(`Category ${categoryName} activated`);
    // Add logic to call your API to activate the category
  };

  const handleDeactivate = (categoryName) => {
    console.log(`Category ${categoryName} deactivated`);
    // Add logic to call your API to deactivate the category
  };

  return (
    <div className="content">
      <Row>
        {categories.map((category) => (
          <Col md="4" key={category.categoryName}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle tag="h3">
                  {/* Adding an icon next to the category name */}
                  <BiCategory className="me-2" />
                  {" " + category.categoryName}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Button
                  color="primary"
                  onClick={() => fetchProductsByCategory(category.categoryName)}
                >
                  View Products
                </Button>{" "}
                {category.isActive ? (
                  <Button
                    color="danger"
                    onClick={() => handleDeactivate(category.categoryName)}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    color="success"
                    onClick={() => handleActivate(category.categoryName)}
                  >
                    Activate
                  </Button>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Display the selected products */}
      {selectedProducts.length > 0 && (
        <div>
          <h4>Products in Selected Category</h4>
          <ul>
            {selectedProducts.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CategoryCards;
