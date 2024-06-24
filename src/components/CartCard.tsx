import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Product } from '../types';
import { addToCart, removeFromCart } from '../reducers/cartSlice';
import axios from 'axios';

interface CartCardProps {
  product: Product;
}

const CartCard: React.FC<CartCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user); // Assuming you have a 'user' slice in Redux

  const handleIncrease = () => {
    if (user.token) {
      // Call API to increment product quantity
      apiIncrementProductQuantity();
    } else {
      // Update local storage and Redux state directly
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
  };

  const handleDecrease = () => {
    if (user.token) {
      // Call API to decrement product quantity
      apiDecrementProductQuantity();
    } else {
      // Update local storage and Redux state directly
      if (product.quantity > 1) {
        dispatch(addToCart({ ...product, quantity: -1 }));
      } else {
        dispatch(removeFromCart(product.id));
      }
    }
  };
 
  // To remove this will show popup message
  const handleRemove = () => {
    setOpen(true);
  };

  // To close the popup
  const handleClose = () => {
    setOpen(false);
  };

  // Once user clicked confirm to remove this function execute
  const confirmRemove = () => {
    if (user.token) {
      // Call API to remove product from cart
      apiRemoveFromCart();
    } else {
      // Update local storage and Redux state directly
      dispatch(removeFromCart(product.id));
      setOpen(false);
    }
  };

  // To increment a quanitty of a particular product
  const apiIncrementProductQuantity = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/cart/incrementProductQuantity', { id: product.id },
        { headers: {
           Authorization: `Bearer ${user.token}`,
         },});      
         dispatch(addToCart({ ...product, quantity: 1 })); // Update Redux state with the updated product
    } catch (error) {
      console.error('Error incrementing product quantity:', error);
      // Handle error
    }
  };

  // To decrement a quanitty of a particular product
  const apiDecrementProductQuantity = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/cart/decrementProductQuantity',
        { id: product.id },
       { headers: {
          Authorization: `Bearer ${user.token}`,
        },}
      );
  
      if (response.status === 204) {
        dispatch(removeFromCart(product.id)); // Remove from Redux state if quantity is zero
      } else {
            dispatch(addToCart({ ...product, quantity: -1 })); // Update Redux state with the updated product
      }
    } catch (error) {
      console.error('Error decrementing product quantity:', error);
      // Handle error
    }
  };

  // Remove cart logic
  const apiRemoveFromCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/removeProduct/${product.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Include the token in the headers
        },
      });
      dispatch(removeFromCart(product.id)); // Remove from Redux state after successful deletion
      setOpen(false);
    } catch (error) {
      console.error('Error removing product from cart:', error);
      // Handle error
    }
  };

  return (
    <>
      <Card sx={{ display: 'flex', marginBottom: 2 }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={product.images[0]}
          alt={product.title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              &#8377;{product.price} x {product.quantity} = &#8377;{Math.round(product.price * product.quantity)}
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <IconButton aria-label="decrease" onClick={handleDecrease}>
              <Remove />
            </IconButton>
            <Typography>{product.quantity}</Typography>
            <IconButton aria-label="increase" onClick={handleIncrease}>
              <Add />
            </IconButton>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleRemove} 
              sx={{ marginLeft: 2 }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Remove"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove {product.title} from the cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmRemove} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartCard;

