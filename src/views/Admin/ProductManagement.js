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
import Swal from "sweetalert2"; // Import SweetAlert2

function CategoryCards() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch the category data from the backend API
  useEffect(() => {
    fetch(
      "http://localhost:5069/api/category/getAllCategoriesWithProductCount"
    )
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching category data:", error));
  }, []);

  // Function to activate a category
  const handleActivate = (categoryId) => {
    fetch(
      `http://localhost:5069/api/category/${categoryId}/activateCategory`,
      {
        method: "PUT",
      }
    )
      .then((response) => {
        if (response.ok) {
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === categoryId
                ? { ...category, isActive: true }
                : category
            )
          );
          Swal.fire(
            "Activated!",
            "The category has been Activated.",
            "success"
          );
          console.log(`Category ${categoryId} activated`);
        } else {
          console.error("Failed to activate category");
        }
      })
      .catch((error) => console.error("Error activating category:", error));
  };

  // Function to deactivate a category with confirmation
  const handleDeactivate = (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "All the prodducts will be deactivated under this category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `http://127.0.0.1:15240/api/category/${categoryId}/deactivateCategory`,
          {
            method: "PUT",
          }
        )
          .then((response) => {
            if (response.ok) {
              setCategories((prevCategories) =>
                prevCategories.map((category) =>
                  category.id === categoryId
                    ? { ...category, isActive: false }
                    : category
                )
              );
              Swal.fire(
                "Deactivated!",
                "The category has been deactivated.",
                "success"
              );
            } else {
              console.error("Failed to deactivate category");
            }
          })
          .catch((error) =>
            console.error("Error deactivating category:", error)
          );
      }
    });
  };

  return (
    <div className="content">
      <Row>
        {categories.map((category) => (
          <Col md="4" key={category.id}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle tag="h3">
                  <BiCategory className="me-2" />
                  {" " + category.categoryName}
                </CardTitle>
                <h5 className="text-muted">
                  Total Products: {category.categoryCount}
                </h5>
                <h6
                  className={category.isActive ? "text-success" : "text-danger"}
                >
                  Status: {category.isActive ? "Active" : "Inactive"}
                </h6>
              </CardHeader>
              <CardBody>
                <Button
                  color="primary"
                  onClick={() =>
                    navigate(`/admin/products/${category.categoryName}`)
                  }
                >
                  View Products
                </Button>{" "}
                {category.isActive ? (
                  <Button
                    color="danger"
                    onClick={() => handleDeactivate(category.id)}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    color="success"
                    onClick={() => handleActivate(category.id)}
                  >
                    Activate
                  </Button>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CategoryCards;
