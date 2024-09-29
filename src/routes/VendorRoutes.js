import Dashboard from "../views/Vendor/VendorDashboard.js";
import TableList from "../views/TableList.js";
// import UserProfile from "../views/UserProfile.js";

var routes = [
  {
    path: "/dashboard/:vendorId",
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
    path: "/products/:vendorId",
    name: "Product Management",
    icon: "tim-icons icon-components",
    component: <TableList />,
    layout: "/vendor",
  },
  {
    path: "/products/:vendorId",
    name: "Inventory Management",
    icon: "tim-icons icon-basket-simple",
    component: <TableList />,
    layout: "/vendor",
  },
  {
    path: "/products/:vendorId",
    name: "Order Management",
    icon: "tim-icons icon-delivery-fast",
    component: <TableList />,
    layout: "/vendor",
  },
];

export default routes;
