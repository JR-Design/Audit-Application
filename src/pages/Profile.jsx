import React from 'react';
import { Container, Typography, Paper, Box, Avatar, Divider, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h5">{currentUser.name}</Typography>
          <Typography variant="body1" color="text.secondary">{currentUser.email}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Role: {currentUser.role}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Typography variant="body2" paragraph>
              This is a placeholder for user profile information. You can add profile editing functionality, 
              account preferences, and personalization options here.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;