import "./App.css";
import Home from "./Component/home/Home";
import ProductDetail from "./Component/product/ProductDetail.jsx";
import Products from "./Component/product/Products.jsx";
import Footer from "./Component/layout/Footer";
import Header from "./Component/layout/Header.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginSignup from "./Component/user/LoginSignup.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/userSlice.js";
import UserOptions from "./Component/layout/UserOptions.jsx";
import Profile from "./Component/user/Profile.jsx";
import Cart from "./Component/cart/Cart.jsx";

import ShippingInfo from "./Component/payment/ShippingInfo.jsx";
import ConfirmOrder from "./Component/payment/ConfirmOrder.jsx";
import Success from "./Component/payment/Success.jsx";
import Payment from "./Component/payment/Payment.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Loader from "./Component/layout/Loader.jsx";
import MyOrders from "./Component/orders/MyOrders.jsx";
import OrderDetail from "./Component/orders/OrderDetail.jsx";
import ProtectedRoute from "./Component/user/ProtectedRoute.jsx";

import Dashboard from "./Component/admin/Dashboad.jsx";
import AdminProducts from "./Component/admin/AdminProducts.jsx";
import NewProduct from "./Component/admin/NewProduct.jsx";
import UpdateProduct from "./Component/admin/UpdateProduct.jsx";
import AllOrders from "./Component/admin/AllOrders.jsx";
import UpdateOrder from "./Component/admin/UpdateOrder.jsx";
import AllUsers from "./Component/admin/AllUsers.jsx";
import UpdateUserRole from "./Component/admin/UpdateUserRole.jsx";
import AllReviews from "./Component/admin/AllReviews.jsx";
import PageNotFound from "./Component/layout/PageNotFound.jsx";
import About from "./Component/About.jsx";
import Contact from "./Component/Contact.jsx";
// const serverURL = "https://2023-mern-ecommerce-backend.vercel.app";
console.log(window.location.origin);
console.log(window.location);

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [key, setKey] = useState("");

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get(
        `${window.location.origin}/api/v1/stripeapikey`
      );
      setKey(data?.stripeApiKey);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    dispatch(loadUser());
    getStripeApiKey();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Header />
      <UserOptions />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />

        <Route path="/login" element={<LoginSignup />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              <ShippingInfo />
            </ProtectedRoute>
          }
        />

        {key && (
          <Route
            path="/payment"
            element={
              <Elements stripe={loadStripe(key)}>
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              </Elements>
            }
          />
        )}

        <Route
          path="/confirmorder"
          element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>
          }
        />

        {/* ----------------------------------------ADMIN ROUTES---------------------------------------------------------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/new"
          element={
            <ProtectedRoute adminOnly={true}>
              <NewProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AllOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <UpdateOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <AllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <UpdateUserRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/review"
          element={
            <ProtectedRoute adminOnly={true}>
              <AllReviews />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
