// src/components/NavBar.tsx
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { clearToken } from '../reducers/userSlice';
import {clearCart} from '../reducers/cartSlice' // Assuming logoutUser action exists
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  // const history = useHistory();
  const nav=useNavigate();
  const handleLogout = () => {
    // Dispatch logout action to clear user state (including token)
    dispatch(clearToken());
    dispatch(clearCart());
    localStorage.removeItem('token')
    localStorage.removeItem('cartItems')
    nav('/products')
    // Redirect to home page or login page after logout
    
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          E-Commerce
        </Typography>
        <IconButton component={Link} to="/" color="inherit">
          <HomeIcon />
        </IconButton>
        <IconButton component={Link} to="/products" color="inherit">
          <ShoppingBagIcon />
        </IconButton>
        {/* <IconButton component={Link} to="/contact" color="inherit">
          <ContactMailIcon />
        </IconButton> */}
        <Box sx={{ ml: 'auto' }}>
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {user.token ? (
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
              Logout
            </Button>
          ) : (
            <>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
