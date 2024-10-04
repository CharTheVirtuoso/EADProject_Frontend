import Dashboard from "../views/Admin/AdminDashboard.js";
import UserTable from "../views/Admin/AdminUserTable.js";
import Vendors from "../views/Admin/VendorManagement.js";
import Notificatoions from "../views/Notifications.js";
import ProductCategories from "../views/Admin/ProductManagement.js";
import ProductList from "../views/Admin/ProductList.js";
import Stocks from "../views/Admin/StockList.js";
import Inventory from "../views/Admin/InventoryManagemnt.js";
import OrderCategories from "../views/Admin/OrderManagement.js";
import Orders from "../views/Admin/OrderList.js";

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
    component: <Inventory />,
    layout: "/admin",
  },
  {
    path: "/order-management",
    name: "Order Management",
    icon: "tim-icons icon-delivery-fast", // Delivery truck icon for order management
    component: <OrderCategories />,
    layout: "/admin",
  },

  {
    path: "/products/:categoryName",
    component: <ProductList />,
    layout: "/admin",
  },
  {
    path: "/stocks/:categoryName",
    component: <Stocks />,
    layout: "/admin",
  },
  {
    path: "/orders/:categoryName",
    component: <Orders />,
    layout: "/admin",
  },
];

export default routes;
