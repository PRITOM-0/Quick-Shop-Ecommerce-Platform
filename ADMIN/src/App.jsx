import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import NavBar from "../src/pages/NavBar";
import Dashboard from "../src/pages/Dashboard";
import AddProduct from "../src/pages/Addproduct";
import { ProductList } from "../src/pages/ProductList";
import EditProduct from "../src/pages/EditProduct";
import OrderList from "../src/pages/OrderList";

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard />},
      { path: "/admin/allProducts", element: <ProductList /> },
      { path: "/admin/addProduct", element: <AddProduct /> },
      { path: "/admin/editProduct/:id", element: <EditProduct /> },
      { path: "/admin/allOrders", element: <OrderList /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
