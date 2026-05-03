import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login&SignUp/Login";
import Register from "./components/Login&SignUp/Register";
import OTPVerification from "./components/Login&SignUp/OTPVerification";
import ForgotPassword from "./components/Login&SignUp/ForgotPassword.jsx";
import ResetPassword from "./components/Login&SignUp/ResetPassword.jsx";
import { AuthProvider } from './context/AuthContext.jsx';


import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";

import ProductListing from './components/Products/ProductListing';
import ProductDetail from './components/Products/ProductDetail';
import Whishlist from "./components/Products/Whishlist.jsx";
import Profile from "./components/Products/Profile.jsx";
import MyOrders from './components/Products/MyOrders';

// 👇 Protected Route wrapper (optional but recommended)
import AdminRoute from "./components/admin/AdminRoute.jsx";
import AddProduct from "./components/admin/AddProduct.jsx";
import EditProduct from "./components/admin/EditProduct.jsx";
import AdminProducts from "./components/admin/AdminProducts.jsx";
import AdminOrders from "./components/admin/AdminOrders.jsx";
import AdminUsers from "./components/admin/AdminUsers.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Whishlist />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/add-product" element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/edit-product/:id" element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
