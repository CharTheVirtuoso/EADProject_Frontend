import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/Images/Vendora_logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:15240/api/User/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("vendorId", response.data.id);

      if (response.data.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (response.data.role === "CSR") {
        navigate("/csr/dashboard");
      } else if (response.data.role === "Vendor") {
        navigate(`/vendor/dashboard/${response.data.id}`);
      }
    } catch (error) {
      setError("Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ background: "#073980" }} // Updated to a solid background color
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "1100px",
          minWidth: "800px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          border: "none",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="row g-0">
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <img
              src={logo}
              alt="login form"
              className="img-fluid rounded-start"
              style={{ width: "70%" }}
            />
          </div>

          <div className="col-md-6">
            <div className="card-body d-flex flex-column text-white">
              <h4
                className="fw-normal mb-4 text-center"
                style={{
                  letterSpacing: "1px",
                  color: "#fff",
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
                }}
              >
                Sign In
              </h4>

              <form onSubmit={handleLogin}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="form-group mb-4">
                  <label htmlFor="email" style={{ color: "#fff" }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      backgroundColor: "#253366",
                      color: "#fff",
                      border: "1px solid #f25c29",
                      borderRadius: "5px",
                    }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 5px rgba(242, 92, 41, 0.5)")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="password" style={{ color: "#fff" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      backgroundColor: "#253366",
                      color: "#fff",
                      border: "1px solid #f25c29",
                      borderRadius: "5px",
                    }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 5px rgba(242, 92, 41, 0.5)")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  />
                  <a
                    className="small text-muted"
                    href="#!"
                    style={{ color: "#ccc" }}
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    backgroundColor: "#f25c29",
                    color: "#fff",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e24b1d")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f25c29")
                  }
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {" Logging in..."}
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              <div className="d-flex justify-content-between mt-3">
                <p style={{ color: "#fff" }}>
                  Don't have an account?{" "}
                  <a href="#!" style={{ color: "#f25c29" }}>
                    Contact admin
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
