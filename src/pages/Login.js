import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import "../assets/css/Login.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      // Make an API request to your backend for login
      const response = await axios.post(
        "http://127.0.0.1:15240/api/User/login",
        {
          email: email,
          password: password,
        }
      );

      // Handle successful login response
      if (response.status === 200) {
        const user = response.data; // Get user data from the response, including vendorId

        // Store vendorId and role in localStorage for future use
        localStorage.setItem("vendorId", user.id);
        localStorage.setItem("role", user.role);

        // Redirect based on user role
        if (user.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "CSR") {
          navigate("/csr/dashboard");
        } else if (user.role === "Vendor") {
          // Redirect vendor to their dashboard using vendorId
          navigate(`/vendor/dashboard/${user.id}`);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col md="12">
          <Card className="login-card">
            <CardHeader className="text-center">
              <h3>Login</h3>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <Button type="submit" color="primary" block>
                  Login
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
