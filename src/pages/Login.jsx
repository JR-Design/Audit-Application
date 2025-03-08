import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Tabs,
  Tab,
  Alert,
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      const success = login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred while logging in.');
      console.error(err);
    }
    
    setLoading(false);
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    try {
      setLoading(true);
      const success = register(name, email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Failed to register. Email might already be in use.');
      }
    } catch (err) {
      setError('An error occurred while registering.');
      console.error(err);
    }
    
    setLoading(false);
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {tabValue === 0 ? 'Sign In' : 'Sign Up'}
        </Typography>
        
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3, width: '100%' }}>
          <Tab label="Login" sx={{ width: '50%' }} />
          <Tab label="Register" sx={{ width: '50%' }} />
        </Tabs>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {tabValue === 0 ? (
          // Login Form
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign In
            </Button>
          </Box>
        ) : (
          // Register Form
          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;