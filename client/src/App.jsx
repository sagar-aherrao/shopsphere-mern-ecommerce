import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile/Profile";

import ProtectedRoute from "./components/common/ProtectedRoute";
import CustomerLayout from "./components/layout/CustomerLayout";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/customer/ProductDetails";
import CategoryProducts from "./pages/customer/CategoryProducts";
import FrontCategories from "./pages/customer/FrontCategories";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/customer/OrderSuccess";
import MyOrders from "./pages/customer/MyOrders";

import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";

import Categories from "./admin/pages/Categories";
import CategoryForm from "./admin/pages/CategoryForm";
import ProductsAdmin from "./admin/pages/Products";
import ProductForm from "./admin/pages/ProductForm";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminOrderDetails from "./pages/Admin/AdminOrderDetails";

import AdminRoute from "./components/common/AdminRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Customer Layout Routes */}
        <Route element={<CustomerLayout />}>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/categories"
            element={<FrontCategories />}
          />

          <Route
            path="/categories/:id"
            element={<CategoryProducts />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />


          <Route
            path="/cart"
            element={<Cart />}
          />

          {/* <Route
            path="/checkout"
            element={<Checkout />}
          /> */}

          <Route
            path="/order-success/:id"
            element={<OrderSuccess />}
          />


        </Route>


        {/* Authentication Routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* User Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/my-orders"
            element={<MyOrders />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />
        </Route>


        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="categories"
              element={<Categories />}
            />

            <Route
              path="categories/add"
              element={<CategoryForm />}
            />

            <Route
              path="categories/edit/:id"
              element={<CategoryForm />}
            />

            <Route
              path="products"
              element={<ProductsAdmin />}
            />

            <Route
              path="products/add"
              element={<ProductForm />}
            />

            <Route
              path="products/edit/:id"
              element={<ProductForm />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="orders/:id"
              element={<AdminOrderDetails />}
            />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;