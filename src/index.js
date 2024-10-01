/*!

=========================================================
* EAD PROJECT 
=========================================================

* Coded by Chanux & Nash

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/Admin.js";
import CSRDashboard from "./pages/CSR.js";
import VendorDashboard from "./pages/Vendor.js";
import Login from "./pages/Login.js";
import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Register />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/csr/*" element={<CSRDashboard />} />
          <Route path="/vendor/*" element={<VendorDashboard />} />
        </Routes>
      </BrowserRouter>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>
);
