import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Favorite } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../reducers/cartSlice";
import { Product } from "../types";
import { RootState } from "../store";
import Notification from "./Notification";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const productToUse: Product = {
    id: product.id,
    title: product.title,
    description: product.description,
    rating: product.rating,
    quantity: 1,
    price: product.price,
    images: product.images,
  };
  // State and variables declaration
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isInCart, setIsInCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [cartNotiMessage, setCartNoti] = useState("");
  //check if product is already in cart
  const checkIsInCart = () => {
    return cartItems.some((item) => item.id === product.id);
  };
  // This will handle addtocart
  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (isInCart) {
      setCartNoti("Item is already in the cart");
      setShowNotification(true);
    } else {
      if (token) {
        try {
          console.log(productToUse);
          await axios.post(
            "http://localhost:5000/api/cart/addOrUpdateProduct",
            productToUse,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Product added to database");
          dispatch(addToCart(productToUse));
          setCartNoti("Item added to cart");
          setIsInCart(true);
          setShowNotification(true);
        } catch (error) {
          console.error("Error adding product to database:", error);
        }
      } else {
        let localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
        localCart.push(productToUse);
        localStorage.setItem("cartItems", JSON.stringify(localCart));
        setCartNoti("Item added to cart");
        dispatch(addToCart(productToUse));
        setIsInCart(true);
        setShowNotification(true);
        console.log("Product added to local storage");
      }
    }
  };
  // Check wether product is in cart or not
  useEffect(() => {
    setIsInCart(checkIsInCart());
  }, [cartItems]);

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      <Card
        component={Link}
        to={`/product/${product.id}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.03)",
          },
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        <CardMedia
          component="img"
          image={product.images[0]}
          alt={product.title}
          sx={{ height: 200, objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2">
            {product.title}
          </Typography>
          <Typography variant="body2">
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description}
          </Typography>
          <Typography variant="h6" component="p" sx={{ mt: 1 }}>
            &#8377; {product.price.toFixed(2)}
          </Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            p: 1,
            position: "relative",
          }}
        >
          <IconButton
            color={isInCart ? "secondary" : "default"}
            onClick={handleAddToCart}
          >
            <Favorite />
          </IconButton>
        </Box>
      </Card>
      {showNotification && (
        <Notification message={cartNotiMessage} onClose={closeNotification} />
      )}
    </>
  );
};

export default ProductCard;
