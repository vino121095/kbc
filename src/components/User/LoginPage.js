import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert, Paper, InputAdornment, IconButton, Fade, Slide } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Phone, Lock, Person } from '@mui/icons-material';
import baseurl from '../Baseurl/baseurl';
import logo from '../../assets/image.png';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    if (!identifier || !password) {
      setError(t('formErrors') || 'Email/Phone and password are required');
      setIsLoading(false);
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
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%, #a5d6a7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={24}
          sx={{ 
            maxWidth: 450,
            width: '100%',
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 40px rgba(76, 175, 80, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
            }
          }}
        >
          <Slide direction="down" in={true} timeout={600}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  p: 2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
                  mb: 2,
                  boxShadow: '0 8px 20px rgba(76, 175, 80, 0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                    borderRadius: '50%',
                    zIndex: -1,
                  }
                }}
              >
                <img 
                  src={logo} 
                  alt="Logo" 
                  style={{ 
                    height: '80px', 
                    width: 'auto',
                    borderRadius: '50%',
                    transition: 'transform 0.3s ease',
                  }} 
                />
              </Box>
              <Typography 
                variant="h4" 
                sx={{
                  background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  mb: 1,
                  letterSpacing: '-0.5px'
                }}
              >
                {t('signin')}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '1.1rem',
                  fontWeight: 400
                }}
              >
                {t('subtitle')}
              </Typography>
            </Box>
          </Slide>

          <Slide direction="up" in={true} timeout={800}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
                <Button 
                  variant="outlined"
                  component={Link}
                  to="/signup"
                  sx={{ 
                    borderRadius: 25,
                    px: 3,
                    py: 1.5,
                    borderColor: '#4caf50',
                    color: '#4caf50',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#2e7d32',
                      backgroundColor: 'rgba(76, 175, 80, 0.04)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                    }
                  }}
                >
                  {t('signup')}
                </Button>
                <Button 
                  variant="contained"
                  sx={{ 
                    borderRadius: 25,
                    px: 3,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
                    }
                  }}
                >
                  {t('signin')}
                </Button>
              </Box>

              <TextField
                fullWidth
                margin="normal"
                label="Email or Contact Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {isEmail ? (
                        <Email sx={{ color: '#4caf50' }} />
                      ) : (
                        <Phone sx={{ color: '#4caf50' }} />
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.1)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                    },
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4caf50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#4caf50',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label={t('password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#4caf50' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{ color: '#4caf50' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.1)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                    },
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4caf50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4caf50',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#4caf50',
                    },
                  },
                }}
              />

              {error && (
                <Slide direction="up" in={Boolean(error)} timeout={300}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      border: '1px solid rgba(244, 67, 54, 0.2)',
                      mb: 2,
                    }}
                  >
                    <Typography 
                      color="error" 
                      variant="body2"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 500,
                      }}
                    >
                      {error}
                    </Typography>
                  </Box>
                </Slide>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                disabled={isLoading}
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  borderRadius: 25,
                  background: isLoading 
                    ? 'linear-gradient(45deg, #a5d6a7, #c8e6c9)'
                    : 'linear-gradient(45deg, #4caf50, #66bb6a)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: isLoading 
                      ? 'linear-gradient(45deg, #a5d6a7, #c8e6c9)'
                      : 'linear-gradient(45deg, #2e7d32, #4caf50)',
                    transform: isLoading ? 'none' : 'translateY(-2px)',
                    boxShadow: isLoading 
                      ? '0 6px 16px rgba(76, 175, 80, 0.3)'
                      : '0 8px 20px rgba(76, 175, 80, 0.4)',
                  },
                  '&:disabled': {
                    color: 'white',
                  }
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                    Signing In...
                  </Box>
                ) : (
                  t('signin')
                )}
              </Button>

              <Typography 
                textAlign="center" 
                sx={{ 
                  mt: 3,
                  color: 'text.secondary',
                  fontSize: '0.95rem',
                }}
              >
                {t('alreadyHaveAccount')}{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    textDecoration: 'none',
                    color: '#4caf50',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#2e7d32'}
                  onMouseLeave={(e) => e.target.style.color = '#4caf50'}
                >
                  {t('signup')}
                </Link>
              </Typography>
            </Box>
          </Slide>
        </Paper>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
            '& .MuiAlert-message': {
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;