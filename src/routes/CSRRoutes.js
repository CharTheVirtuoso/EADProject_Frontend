import Dashboard from "../views/CSR/CSRDashboard.js";
import UserTable from "../views/CSR/CSRUserTable.js";

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
    path: "/users",
    name: "Order Management",
    icon: "tim-icons icon-delivery-fast",
    component: <UserTable />,
    layout: "/csr",
  },
];
export default routes;
