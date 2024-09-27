import Dashboard from "../views/CSR/CSRDashboard.js";
import UserTable from "../views/CSR/CSRUserTable.js";
// import UserProfile from "../views/UserProfile.js";

var routes = [
  {
    path: "/dashboard",
    name: "CSR Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/csr",
  },
  {
    path: "/UserTable",
    name: "User Management",
    icon: "tim-icons icon-single-02",
    component: <UserTable />,
    layout: "/csr",
  },
];
export default routes;
