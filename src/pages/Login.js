import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import image from '../assets/Images/pngegg.png';
import logo from '../assets/Images/VENDORA.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      const response = await axios.post('http://127.0.0.1:15240/api/User/login', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('vendorId', response.data.id);

      if (response.data.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (response.data.role === 'CSR') {
        navigate('/csr/dashboard');
      } else if (response.data.role === 'Vendor') {
        navigate(`/vendor/dashboard/${response.data.id}`);
      }
    } catch (error) {
      setError('Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#01174c' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '1200px', minWidth: '800px', width: '100%', backgroundColor: '#011b57', border: 'none' }}>
        <div className="row g-0">
          <div className="col-md-6 d-flex justify-content-center align-items-center" style={{ overflow: 'hidden' }}>
            <img
              src={image}
              alt="login form"
              className="img-fluid rounded-start"
              style={{ width: '70%' }}
            />
          </div>

          <div className="col-md-6">
            <div className="card-body d-flex flex-column text-white">
              <div className="d-flex flex-row mt-2 align-items-center">
                <img 
                  src={logo} 
                  alt="Vendora Logo" 
                  style={{ width: '200px', height: 'auto' }} 
                />
              </div>
              <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px', color: '#fff' }}>
                Sign into your account
              </h5>

              <form onSubmit={handleLogin}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group mb-4">
                  <label htmlFor="email" style={{ color: '#fff' }}>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{ backgroundColor: '#02174c', color: '#fff', border: '1px solid #ff6219' }}
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="password" style={{ color: '#fff' }}>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{ backgroundColor: '#02174c', color: '#fff', border: '1px solid #ff6219' }}
                  />
                </div>

                <button type="submit" className="btn w-100" style={{ backgroundColor: '#ff6219', color: '#fff' }} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      {' Logging in...'}
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>

              <a className="small text-muted mt-3" href="#!" style={{ color: '#fff' }}>Forgot password?</a>
              <p className="mb-5 pb-lg-2 mt-2" style={{ color: '#fff' }}>
                Don't have an account? <a href="#!" style={{ color: '#fff' }}>Contact admin</a>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
