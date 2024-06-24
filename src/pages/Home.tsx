import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Box, Container } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          backgroundColor: '#f0f0f0',
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: '#ff6347' }}>
            Welcome to Our E-commerce Store
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Typography variant="h5" component="h2" sx={{ marginTop: '20px', color: '#4682b4' }}>
            Discover the best products at unbeatable prices
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <img
            src="https://imgs.search.brave.com/QkysFrxs6kUNY4fLw-vHNMHBkOlv6onKxdgFa-KlvH0/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9wZWJi/bGVseS5jb20vX251/eHQvYmFja2dyb3Vu/ZC1yZW1vdmFsLWV4/YW1wbGVzLmM2OWY4/NTRjLmpwZw"
            alt="E-commerce"
            style={{
              marginTop: '40px',
              maxWidth: '100%',
              borderRadius: '8px',
            }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <Typography variant="h4" component="h2" sx={{ marginTop: '40px', color: '#32cd32' }}>
            Why Shop With Us?
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginTop: '20px', color: '#555' }}>
            We offer a wide range of products to meet all your needs. From electronics to fashion, 
            we have it all. Our products are sourced from trusted suppliers and we guarantee 
            the best prices.
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
        >
          <Typography variant="h4" component="h2" sx={{ marginTop: '40px', color: '#ffa500' }}>
            Customer Satisfaction
          </Typography>
          <Typography variant="body1" component="p" sx={{ marginTop: '20px', color: '#555' }}>
            Your satisfaction is our top priority. We offer easy returns, secure payment options, 
            and 24/7 customer support. Shop with confidence knowing that we are here to help you 
            every step of the way.
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Home;