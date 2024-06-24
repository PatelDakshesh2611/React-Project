import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { setToken } from '../reducers/userSlice';
import { setCartItems } from '../reducers/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../store';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const nav=useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {
      email: '',
      password: '',
    };

    let isValid = true;

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setFeedbackMessage('');
      try {
        const response = await axios.post('http://localhost:5000/api/login', formData);
        const { token } = response.data;
        
        // Dispatch action to store token in Redux
        dispatch(setToken(token));
        localStorage.setItem('token',token);
        localStorage.removeItem('cartItems')
        setFeedbackMessage('Login successful!');

        // Check if there are items in the cart
        if (cartItems.length > 0) {
          setShowDialog(true);
        }else{
          nav('/products')
        }

      } catch (error) {
        console.log(error)
        if (error.response && error.response.data.error === 'Invalid credentials') {
          setFeedbackMessage('Incorrect email or password. Please try again.');
        } else if (error.response && error.response.data.error === 'User not found') {
          setFeedbackMessage('User not found. Please sign up.');
        } else {
          setFeedbackMessage('Login failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form validation failed');
    }
  };

  const handleMergeCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/addBulkProducts', cartItems, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      dispatch(setCartItems(response.data.products));
      setShowDialog(false);
      nav('/products')
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error merging cart items:', error);
    }
  };

  
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {feedbackMessage && <Alert severity={feedbackMessage.includes('successful') ? 'success' : 'error'}>{feedbackMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        </form>
       <Link to='/signup'>
       <Button
          variant="text"
          color="primary"
          sx={{ mt: 2 }}
        >
          Go to Sign Up
        </Button>
       </Link>
      </Box>

      <Dialog
        open={showDialog}
          
      >
        <DialogTitle>Merge Cart Items</DialogTitle>
        <DialogContent>
          <Typography>
            Your cart has items. It get merged into your cart
          </Typography>
        </DialogContent>
        <DialogActions>         
          <Button onClick={handleMergeCart} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginForm;
