import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Admin = () => {

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to the Admin Panel
        </Typography>
        <Typography variant="body1" paragraph>
          This is a placeholder for the admin dashboard. You can add user management, 
          audit template customization, and system settings here.
        </Typography>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Admin features will be added here
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Admin;