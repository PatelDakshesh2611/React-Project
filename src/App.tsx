// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import { setCartItems } from "./reducers/cartSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "./store";
import ProductDetails from "./pages/ProductDetails";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import axios from "axios";
import { setToken } from "./reducers/userSlice";
import Checkout from "./pages/Checkout";
import PrivateRoute from "./components/PrivateRoute";


const App: React.FC = () => {
  const cartItemCount = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/auth/checkToken",
            { token }
          );
          if (response.data.valid) {
            dispatch(setToken(token));
            const res = await axios.get(
              "http://localhost:5000/api/cart/getUserCart",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            dispatch(setCartItems(res.data));
          } else {
            // Token expired or invalid, clear local storage and Redux state
            localStorage.removeItem("token");
            dispatch(setCartItems([])); // Clear cart items from Redux state
          }
        } catch (error) {
          console.error("Error checking token validity:", error);
          // Handle error if needed
        }
      }
    };

    checkTokenValidity();
  }, [dispatch]);

  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <NavBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
