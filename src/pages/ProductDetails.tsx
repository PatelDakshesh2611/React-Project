import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCartItems } from "../reducers/cartSlice"; // Import addToCart action
import { RootState } from "../store"; // Import RootState if using Redux
import { Product } from "../types"; // Import Product type
import Notification from "../components/Notification";
import { Star, StarBorder, Add, Remove } from "@mui/icons-material";
import axios from "axios";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav=useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if(response.ok!==true){
          nav('/products');
        }
        const data = await response.json();
        const updatedData = {
          ...data,
          quantity: 1,
        };
        setProduct(updatedData);
      } catch (error) {
        nav('/products')
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, [id]);

  const isInCart = cartItems.some((item) => item.id === product?.id);

  const handleAddToCart = async () => {
    if (product) {
      if (isInCart) {
        setOpenDialog(true);
      } else {
        if (token) {
          try {
           const res= await axios.post(
              "http://localhost:5000/api/cart/addOrUpdateProduct",
              { ...product, quantity },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            dispatch(addToCart(product));
            setShowNotification(true);
            
          } catch (error) {
            console.error("Error adding product to cart:", error);
          }
        } else {
          dispatch(addToCart({ ...product, quantity }));
          setShowNotification(true);
        }
      }
    }
  };

  const handleConfirmAddToCart = async () => {
    if (product && token) {
      try {
        const res= await axios.post(
          "http://localhost:5000/api/cart/addOrUpdateProduct",
          { ...product, quantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(addToCart(product));
        setShowNotification(true);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error incrementing product quantity:", error);
      }
    }
  };

  const handleIncreaseQuantity = () => {
    setProduct({ ...product!, quantity: quantity + 1 });
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = async () => {
    if (quantity > 1) {
      setProduct({ ...product!, quantity: quantity - 1 });
      setQuantity(quantity - 1);
      if (token) {
        try {
          await axios.put(
            "/api/cart/decrementProductQuantity",
            { id: product?.id },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error("Error decrementing product quantity:", error);
        }
      }
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Product not found.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
          }}
        >
          <CardMedia
            component="img"
            image={product.images[0]}
            alt={product.title}
            sx={{ width: "100%", height: "auto", maxWidth: 400 }}
          />
          <CardContent sx={{ width: "100%" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              color="primary"
              gutterBottom
            >
              &#8377; {product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              {product.description}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {[...Array(5)].map((_, index) => (
                <Box key={index} sx={{ display: "inline" }}>
                  {index < Math.round(product.rating) ? (
                    <Star color="primary" />
                  ) : (
                    <StarBorder color="primary" />
                  )}
                </Box>
              ))}
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.rating})
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconButton onClick={handleDecreaseQuantity}>
                <Remove />
              </IconButton>
              <Typography variant="body1" sx={{ mx: 2 }}>
                {quantity}
              </Typography>
              <IconButton onClick={handleIncreaseQuantity}>
                <Add />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              sx={{ mt: 2 }}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Item already in cart</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This item is already in your cart. Do you want to increase its
              quantity?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmAddToCart} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {showNotification && (
        <Notification
          message={"Item added to the cart"}
          onClose={closeNotification}
        />
      )}
    </>
  );
};

export default ProductDetails;
