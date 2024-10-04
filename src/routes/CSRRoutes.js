import Dashboard from "../views/CSR/CSRDashboard.js";
import UserTable from "../views/CSR/CSRUserTable.js";
import OrderCategories from "../views/Admin/OrderManagement.js";
import Orders from "../views/Admin/OrderList.js";

var routes = [
  {
    path: "/dashboard",
    name: "CSR Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/csr",
  },
  {
    path: "/users",
    name: "User Management",
    icon: "tim-icons icon-single-02",
    component: <UserTable />,
    layout: "/csr",
  },
  {
    path: "/order-management",
    name: "Order Management",
    icon: "tim-icons icon-delivery-fast", // Delivery truck icon for order management
    component: <OrderCategories />,
    layout: "/csr",
  },
  {
    path: "/orders/:categoryName",
    component: <Orders />,
    layout: "/admin",
  },
];
export default routes;
