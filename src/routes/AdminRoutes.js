import Dashboard from "../views/Admin/AdminDashboard.js";
import Notifications from "../views/Notifications.js";
import UserTable from "../views/Admin/AdminUserTable.js";
import Vendors from "../views/Admin/VendorManagement.js";
import AddUser from "../views/Admin/AddUser.js";

var routes = [
  {
    path: "/dashboard",
    name: "Admin Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/UserTable",
    name: "User Management",
    icon: "tim-icons icon-single-02",
    component: <UserTable />,
    layout: "/admin",
  },
  {
    path: "/Vendors",
    name: "Vendor Management",
    icon: "tim-icons icon-single-02",
    component: <Vendors />,
    layout: "/admin",
  },
];
export default routes;
