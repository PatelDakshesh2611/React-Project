// src/pages/Checkout.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Alert } from '@mui/material';
import { selectCartItems, clearCart } from '../reducers/cartSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';
import InputMask from 'react-input-mask';

const Checkout: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const user = useSelector((state: RootState) => state.user);
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    paymentMethod: 'card',
    cardNumber: '',
  });

  const [formErrors, setFormErrors] = useState({
    address: '',
    city: '',
    state: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = { address: '', city: '', state: '' };
    let isValid = true;

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.text('Invoice', 20, 10);
    doc.text('----------------------------', 20, 20);
    doc.text('Order Summary:', 20, 30);

    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.title} - Quantity: ${item.quantity} - Price: ${item.price * item.quantity}`, 20, 40 + index * 10);
    });

    doc.text('----------------------------', 20, 40 + items.length * 10);
    doc.text(`Total Price: ₹${Math.round(totalPrice)}`, 20, 50 + items.length * 10);
    doc.text('----------------------------', 20, 60 + items.length * 10);
    doc.text('Delivery Address:', 20, 70 + items.length * 10);
    doc.text(`Address: ${formData.address}`, 20, 80 + items.length * 10);
    doc.text(`City: ${formData.city}`, 20, 90 + items.length * 10);
    doc.text(`State: ${formData.state}`, 20, 100 + items.length * 10);

    doc.save('invoice.pdf');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      generateInvoice();
      alert("Order placed successfully!");
      try {
        await axios.delete('http://localhost:5000/api/cart/clearCart', {
          headers: {
            Authorization: `Bearer ${user.token}`, // Include the token in the headers
          },
        });
        dispatch(clearCart());
        nav('/products');
      } catch (e) {
        console.log(e);
      }
      // Redirect to home or another appropriate page
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts
  }, []);
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h5" gutterBottom>
          Order Summary
        </Typography>
        {items.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
            <Typography>{item.title} (x{item.quantity})</Typography>
            <Typography>&#8377;{item.price * item.quantity}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Typography variant="h6">Total Price:</Typography>
          <Typography variant="h6">&#8377;{Math.round(totalPrice)}</Typography>
        </Box>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          id="address"
          name="address"
          label="Address"
          variant="outlined"
          margin="normal"
          value={formData.address}
          onChange={handleChange}
          error={!!formErrors.address}
          helperText={formErrors.address}
        />
        <TextField
          fullWidth
          id="city"
          name="city"
          label="City"
          variant="outlined"
          margin="normal"
          value={formData.city}
          onChange={handleChange}
          error={!!formErrors.city}
          helperText={formErrors.city}
        />
        <TextField
          fullWidth
          id="state"
          name="state"
          label="State"
          variant="outlined"
          margin="normal"
          value={formData.state}
          onChange={handleChange}
          error={!!formErrors.state}
          helperText={formErrors.state}
        />
        <FormControl component="fieldset" sx={{ marginTop: 2 }}>
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup
            aria-label="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <FormControlLabel value="card" control={<Radio />} label="Card" />
            <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
          </RadioGroup>
        </FormControl>
        {formData.paymentMethod === 'card' && (
          <InputMask
            mask="9999 9999 9999 9999"
            value={formData.cardNumber}
            onChange={handleChange}
          >
            {() => (
              <TextField
                fullWidth
                id="cardNumber"
                name="cardNumber"
                label="Card Number"
                variant="outlined"
                margin="normal"
              />
            )}
          </InputMask>
        )}
        <Box sx={{ marginTop: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
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
            Order
          </Button>
        </Box>
      </form>
      
    </Container>
  );
};

export default Checkout;
