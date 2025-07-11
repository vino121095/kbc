import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import baseurl from '../Baseurl/baseurl';
import logo from '../../assets/image.png';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleLogin = async () => {
    setError('');

    if (!identifier || !password) {
      setError(t('formErrors') || 'Email/Phone and password are required');
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const loginPayload = {
      password,
      ...(isEmail ? { email: identifier } : { contact_no: identifier }),
    };

    try {
      const response = await fetch(`${baseurl}/api/member/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.msg || 'Login failed');
      }

      const result = await response.json();

      // Store token and member data
      localStorage.setItem('token', result.token);
      localStorage.setItem('memberData', JSON.stringify(result.data));

      setSnackbar({
        open: true,
        message: result.msg || 'Login successful!',
        severity: 'success',
      });

      // Redirect to home page
      navigate('/home');
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error',
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', bgcolor: '#fff', p: 3, height: '100vh' }}>
      <Box sx={{ textAlign: 'center'}}>
        <img src={logo} alt="Logo" style={{ height: '100px', width: 'auto' }} />
      </Box>

      <Typography variant="h5" color="green" mt={4}>{t('signin')}</Typography>
      <Typography mt={1}>{t('subtitle')}</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Button 
          variant="outlined" 
          sx={{ borderRadius: 25, mr: 1 }}
          component={Link}
          to="/signup"
        >
          {t('signup')}
        </Button>
        <Button variant="contained" sx={{ borderRadius: 25, backgroundColor: 'green' }}>
          {t('signin')}
        </Button>
      </Box>

      <TextField
        fullWidth
        margin="dense"
        label="Email or Contact Number"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <TextField
        fullWidth
        margin="dense"
        label={t('password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3, backgroundColor: 'green', borderRadius: 25 }}
        onClick={handleLogin}
      >
        {t('signin')}
      </Button>

      <Typography textAlign="center" mt={2}>
        {t('alreadyHaveAccount')} <Link to="/signup" style={{ textDecoration: 'none', color: 'green' }}>{t('signup')}</Link>
      </Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;