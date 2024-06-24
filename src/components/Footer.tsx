// src/components/Footer.tsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        backgroundColor: '#3f51b5',
        color: 'white',
        width: '100%',
        height: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 'auto',
      }}
    >
      <Typography variant="body1" align="center">
        © 2024 E-Commerce Site
      </Typography>
      <Typography variant="body2" align="center">
        <Link href="/" color="inherit" sx={{ mx: 1 }}>
          Privacy Policy
        </Link>
        <Link href="/" color="inherit" sx={{ mx: 1 }}>
          Terms of Service
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
