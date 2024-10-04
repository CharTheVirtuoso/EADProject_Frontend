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
import { BiCategory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

function CategoryCards() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Use navigate for routing

  // Fetch the category data from the backend API
  useEffect(() => {
    fetch(
      "http://localhost:5069/api/category/getAllCategoriesWithProductCount"
    )
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching category data:", error));
  }, []);

  return (
    <div className="content">
      <Row>
        {categories.map((category) => (
          <Col md="3" key={category.categoryName}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle tag="h3">
                  <BiCategory className="me-2" />
                  {" " + category.categoryName}
                </CardTitle>

                {/* Display the total product count under the category name */}
                <h5 className="text-muted">
                  Total Products: {category.categoryCount}
                </h5>

                {/* Display the active status of the category */}
                <h6
                  className={category.isActive ? "text-success" : "text-danger"}
                >
                  Status: {category.isActive ? "Active" : "Inactive"}
                </h6>
              </CardHeader>
              <CardBody>
                {/* Show only the Manage Stocks button */}
                <Button
                  color="primary"
                  onClick={() =>
                    navigate(`/admin/stocks/${category.categoryName}`)
                  }
                >
                  Manage Stocks
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CategoryCards;
