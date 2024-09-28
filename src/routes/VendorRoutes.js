import Dashboard from "../views/Vendor/VendorDashboard.js";
import TableList from "../views/TableList.js";
// import UserProfile from "../views/UserProfile.js";

var routes = [
  {
    path: "/dashboard",
    name: "Vendor Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/vendor",
  },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "tim-icons icon-single-02",
  //   component: <UserProfile />,
  //   layout: "/admin",
  // },
  {
    path: "/products",
    name: "Product Managemnt",
    icon: "tim-icons icon-puzzle-10",
    component: <TableList />,
    layout: "/vendor",
  },
];
export default routes;
