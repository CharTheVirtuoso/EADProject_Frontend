import Dashboard from "../views/Admin/AdminDashboard.js";
import UserTable from "../views/Admin/AdminUserTable.js";
import Vendors from "../views/Admin/VendorManagement.js";
import Notificatoions from "../views/Notifications.js";
import ProductCategories from "../views/Admin/ProductManagement.js";

var routes = [
  {
    path: "/dashboard",
    name: "Admin Dashboard",
    icon: "tim-icons icon-chart-pie-36", // A chart icon fits the dashboard
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "User Management",
    icon: "tim-icons icon-single-02", // A user icon makes sense for user management
    component: <UserTable />,
    layout: "/admin",
  },
  {
    path: "/vendors",
    name: "Vendor Management",
    icon: "tim-icons icon-badge", // Badge icon to represent vendor roles and access
    component: <Vendors />,
    layout: "/admin",
  },
  {
    path: "/product-categories",
    name: "Product Management",
    icon: "tim-icons icon-components", // Box icon for product-related features
    component: <ProductCategories />,
    layout: "/admin",
  },
  {
    path: "/inventory-management",
    name: "Inventory Management",
    icon: "tim-icons icon-basket-simple", // Basket icon for managing inventory
    component: <Notificatoions />,
    layout: "/admin",
  },
  {
    path: "/order-management",
    name: "Order Management",
    icon: "tim-icons icon-delivery-fast", // Delivery truck icon for order management
    component: <Notificatoions />,
    layout: "/admin",
  },
];

export default routes;
