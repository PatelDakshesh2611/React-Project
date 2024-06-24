import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import { Product } from '../types';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // Import ProductCard component
const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get('https://dummyjson.com/products/search?q=phone')
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);        
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography mb={4} variant="h4" component="h1" gutterBottom align="center">
        Products
      </Typography>
      <Grid container spacing={5}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;