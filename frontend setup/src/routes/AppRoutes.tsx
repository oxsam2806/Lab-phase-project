import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import SellerDashboard from "../pages/seller/SellerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotFound from "../pages/NotFound";
import ProductDetails from "../pages/ProductDetails";
import CartPage from "../pages/Cart";
import Wishlist from "../pages/Wishlist";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="category/:slug" element={<Shop />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="seller" element={<SellerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;