import Home from "./pages/Home";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import NavBar from "./pages/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import ProductDetails from "./pages/ProductDetails";
 

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
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order/:orderId", element: <Order /> },
      { path: "/product/:productId", element: <ProductDetails /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
