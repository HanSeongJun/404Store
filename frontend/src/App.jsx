import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Order from './pages/Order';
import OrderComplete from './pages/OrderComplete';
import UserOrders from './pages/UserOrders';
import AdminManagement from './pages/AdminManagement';
import ProductDetail from './pages/ProductDetail';
import FeaturedProducts from './pages/FeaturedProducts';
import NewProducts from './pages/NewProducts';
import './App.css';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Home />
        </div>
      ),
    },
    {
      path: "/login",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Login />
        </div>
      ),
    },
    {
      path: "/register",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Register />
        </div>
      ),
    },
    {
      path: "/products",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Products />
        </div>
      ),
    },
    {
      path: "/products/:id",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <ProductDetail />
        </div>
      ),
    },
    {
      path: "/products/featured",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <FeaturedProducts />
        </div>
      ),
    },
    {
      path: "/products/new",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <NewProducts />
        </div>
      ),
    },
    {
      path: "/cart",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Cart />
        </div>
      ),
    },
    {
      path: "/order",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Order />
        </div>
      ),
    },
    {
      path: "/order/complete",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <OrderComplete />
        </div>
      ),
    },
    {
      path: "/orders",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <UserOrders />
        </div>
      ),
    },
    {
      path: "/admin",
      element: (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <AdminManagement />
        </div>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
