import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState(""); // For feedback

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      email,
      password,
      role,
    };

    console.log("Submitting new user:", newUser); // Debugging log

    try {
      const response = await fetch(
        "http://127.0.0.1:15240/api/user/admin/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      console.log("Response status:", response.status); // Debugging log

      if (response.status === 201) {
        const createdUser = await response.json();
        console.log("User created successfully:", createdUser);
        setMessage("User created successfully!"); // Success message
      } else {
        setMessage("Error creating user. Please try again."); // Error message
        const errorData = await response.json();
        console.error("Error creating user:", errorData);
      }
    } catch (error) {
      setMessage("Error while creating user. Please try again."); // Error message
      console.error("Error while creating user:", error);
    }
  };

  return (
    <div className="content">
      <Row className="justify-content-center">
        <Col md="6" lg="5">
          <Card>
            <CardHeader>
              <h5 className="title">Create New User</h5>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Email</label>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Password</label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Role</label>
                      <Input
                        type="select"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="CSR">CSR</option>
                        <option value="Vendor">Vendor</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit">
                    Submit
                  </Button>
                </CardFooter>
              </Form>
            </CardBody>
          </Card>
          {message && <div className="alert alert-info">{message}</div>}{" "}
          {/* Feedback message */}
        </Col>
      </Row>
    </div>
  );
}

export default AddUser;
