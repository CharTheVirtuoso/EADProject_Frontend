import Dashboard from "../views/Vendor/VendorDashboard.js";
import ProductList from "../views/Vendor/ProductManagemnt.js";
import OrderList from "../views/Vendor/OrderManagement.js";
import UserProfile from "../views/Vendor/UserProfile.js";

var routes = [
  {
    path: "/dashboard/:vendorId",
    name: "Vendor Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: <Dashboard />,
    layout: "/vendor",
  },
  {
    path: "/user-profile/:vendorId",
    name: "User Profile",
    icon: "tim-icons icon-single-02",
    component: <UserProfile />,
    layout: "/vendor",
  },
  {
    path: "/products/:vendorId",
    name: "Product Management",
    icon: "tim-icons icon-components",
    component: <ProductList />,
    layout: "/vendor",
  },
  // {
  //   path: "/products/:vendorId",
  //   name: "Inventory Management",
  //   icon: "tim-icons icon-basket-simple",
  //   component: <TableList />,
  //   layout: "/vendor",
  // },
  {
    path: "/orders/:vendorId",
    name: "Order Management",
    icon: "tim-icons icon-delivery-fast",
    component: <OrderList />,
    layout: "/vendor",
  },
];

export default routes;
