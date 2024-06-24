import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CartCard from '../components/CartCard';
import { selectCartItems } from '../reducers/cartSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

const Cart: React.FC = () => {
  const items = useSelector(selectCartItems);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const userToken = useSelector((state: RootState) => state.user.token);
  const [showDialog, setShowDialog] = useState(false);
  
  const nav = useNavigate();
  

  const handleCheckout = () => {
    if (userToken) {
      //checkout logic when user is logged in
      nav('/checkout');
    } else {
      setShowDialog(true);
      // Handle scenario when user is not logged in (e.g., redirect to login)
       // Adjust to your login route
    }
  };
  const signuOrLogin=()=>{
    nav('/login');
  }
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {items.length > 0 ? (
        <>
          {items.map((item) => (
            <CartCard key={item.id} product={item} />
          ))}
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h5">
              Total Price: &#8377;{Math.round(totalPrice)}
            </Typography>
          </Box>
          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s',
                },
                padding: '10px 20px',
                fontSize: '16px'
              }}
            >
              Checkout
            </Button>
          </Box>
        </>
      ) : (
        <Alert severity="info">
          Your cart is empty. Please add items to proceed.
        </Alert>
      )}
      <Dialog
        open={showDialog}
          
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Typography>
            Please do signup or login first
          </Typography>
        </DialogContent>
        <DialogActions>         
          <Button onClick={signuOrLogin} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;
