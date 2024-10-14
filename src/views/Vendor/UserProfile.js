import React, { useEffect, useState } from "react";
import axios from "axios";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function UserProfile() {
  const [vendorId, setVendorId] = useState("");
  const [vendorDetails, setVendorDetails] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const idFromStorage = sessionStorage.getItem("id");
    if (idFromStorage) {
      setVendorId(idFromStorage);
    } else {
      console.error("Vendor ID not found in sessionStorage");
    }
  }, []);

  useEffect(() => {
    if (vendorId) {
      // Fetch the vendor details using the API call
      axios
        .get(`http://127.0.0.1:15240/api/user/getUserById/${vendorId}`)
        .then((response) => {
          setVendorDetails(response.data);
          setUpdatedUser({
            name: response.data.name,
            email: response.data.email,
            address: response.data.address,
          });
        })
        .catch((error) => {
          console.error("Error fetching vendor details:", error);
        });

      // Fetch the average rating for the vendor
      axios
        .get(`http://127.0.0.1:15240/api/rating/getAverageRating/${vendorId}`)
        .then((response) => {
          setAverageRating(response.data.averageRating);
        })
        .catch((error) => {
          console.error("Error fetching average rating:", error);
        });

      // Fetch user reviews
      axios
        .get(`http://127.0.0.1:15240/api/rating/getReviews/${vendorId}`)
        .then((response) => {
          setReviews(response.data);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [vendorId]);

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(
        `http://127.0.0.1:15240/api/user/updateUser/${vendorId}`,
        updatedUser
      )
      .then((response) => {
        alert(response.data); // Show success message
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        alert("Failed to update user account.");
      });
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                {/* <h5 className="title">Edit Profile</h5> */}
              </CardHeader>
              <CardBody>
                <p>
                  * Hi, We are pleased to inform you that the Vendora
                  Cooperation has accepted Your Company as a valued partner. You
                  are welcome to edit the details of your acceptance agreement
                  if needed.
                </p>
                <br></br>
                <p>
                  * If you have any questions or require assistance in
                  understanding the guidelines, please do not hesitate to reach
                  out. Our team is here to support you. Thank you for your
                  cooperation!
                </p>

                <br></br>
                <br></br>
                <Form onSubmit={handleUpdate}>
                  <Row>
                    <Col className="pr-md-1" md="5">
                      <FormGroup>
                        <label>Vendor ID (disabled)</label>
                        <Input
                          value={vendorId}
                          disabled
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                        <label>Username</label>
                        <Input
                          value={updatedUser.name}
                          onChange={(e) =>
                            setUpdatedUser({
                              ...updatedUser,
                              name: e.target.value,
                            })
                          }
                          placeholder="Username"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Email address</label>
                        <Input
                          value={updatedUser.email}
                          onChange={(e) =>
                            setUpdatedUser({
                              ...updatedUser,
                              email: e.target.value,
                            })
                          }
                          placeholder="Email"
                          type="email"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          value={updatedUser.address}
                          onChange={(e) =>
                            setUpdatedUser({
                              ...updatedUser,
                              address: e.target.value,
                            })
                          }
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button className="btn-fill" color="primary" type="submit">
                    Update Profie
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar"
                      src={require("../../assets/img/user.png")}
                    />
                    <h4 className="title">
                      {vendorDetails?.name} {vendorDetails?.lastName}
                      <h5>{vendorDetails?.email}</h5>
                    </h4>
                  </a>
                </div>

                <div className="vendor-details">
                  <p>
                    <strong>Status:</strong>{" "}
                    {vendorDetails?.userStatus || "Pending"}
                  </p>
                  <p>
                    <strong>Average Rating:</strong>{" "}
                    {averageRating ? averageRating : "Not Rated"}
                  </p>
                  <p>
                    <strong>Account Active:</strong>{" "}
                    {vendorDetails?.isActive ? "Yes" : "No"}
                  </p>
                </div>
              </CardBody>
              <CardFooter>
                <div className="button-container">
                  <Button className="btn-icon btn-round" color="facebook">
                    <i className="fab fa-facebook" />
                  </Button>
                  <Button className="btn-icon btn-round" color="twitter">
                    <i className="fab fa-twitter" />
                  </Button>
                  <Button className="btn-icon btn-round" color="google">
                    <i className="fab fa-google-plus" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {/* User Reviews Section */}
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <h5 className="title">User Reviews</h5>
              </CardHeader>
              <CardBody>
                {reviews.length === 0 ? (
                  <p>No reviews available.</p>
                ) : (
                  reviews.map((review, index) => (
                    <Card key={index} className="review-card">
                      <CardBody>
                        <CardText>
                          <strong></strong> {review.review}{" "}
                          {/* Updated to review.Review */}
                        </CardText>
                      </CardBody>
                    </Card>
                  ))
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserProfile;
