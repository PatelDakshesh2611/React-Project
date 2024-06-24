import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { setToken } from '../reducers/userSlice';
import { setCartItems } from '../reducers/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const dispatch = useDispatch();
  const nav=useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {
      name: '',
      email: '',
      password: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
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
        const response = await axios.post('http://localhost:5000/api/signup', formData);
        const { token } = response.data;

        // Dispatch action to store token in Redux
        dispatch(setToken(token));
        localStorage.setItem('token',token);
        // Retrieve cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

        // If there are items in the cart, send them to the backend
        if (cartItems.length > 0) {
          const res = await axios.post('http://localhost:5000/api/addBulkProducts', cartItems, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(setCartItems(res.data.products));
          
          // Optionally, clear cart items from localStorage after successful API call
          localStorage.removeItem('cartItems');
          nav('/products');
        }else{
          nav('/products')
        }

        setFeedbackMessage('Signup successful!');
      } catch (error) {
        if (error.response && error.response.data.error === 'User already exists') {
          setFeedbackMessage('User already exists. Please log in.');
        } else {
          setFeedbackMessage('Signup failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        {feedbackMessage && <Alert severity={feedbackMessage.includes('successful') ? 'success' : 'error'}>{feedbackMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
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
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
        </form>
        <Link to='/login'>
        <Button
          variant="text"
          color="primary"
          sx={{ mt: 2 }}
          // onClick={() => history.push('/login')}
        >
          Go to Login
        </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default SignupForm;
