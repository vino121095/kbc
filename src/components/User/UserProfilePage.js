import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Switch,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Footer from '../Footer';
import { useCustomTheme } from '../../context/ThemeContext';
import baseurl from '../Baseurl/baseurl';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mode, toggleTheme } = useCustomTheme();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null); // For UI photo upload

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('memberData'));
    const token = localStorage.getItem('token');

    if (stored?.mid && token) {
      fetch(`${baseurl}/api/member/${stored.mid}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setMember(data.data);
            if (data.data.profile_image) {
              setImage(`${baseurl}/${data.data.profile_image}`);
            }
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} sx={{ color: '#137d13' }} />
      </Box>
    );
  }

  if (!member) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="error">
            {t('failedToLoadProfile') || 'Failed to load profile.'}
          </Typography>
        </Paper>
      </Box>
    );
  }

  const fullName = `${member.first_name || ''} ${member.last_name || ''}`;
  const email = member.email || '';
  const status = member.status || '';

  const menuItems = [
    {
      icon: <BusinessIcon />,
      title: t('businessDetails'),
      subtitle: t('manageBusiness'),
      action: () => navigate(`/business-details/${member.mid}`)
    },
    {
      icon: <PersonIcon />,
      title: t('personalDetails'),
      subtitle: t('managePersonal'),
      action: () => navigate(`/personal-details/${member.mid}`)
    },
    {
      icon: <FamilyRestroomIcon />,
      title: t('familyDetails'),
      subtitle: t('managePersonal'),
      action: () => navigate(`/family-details/${member.mid}`)
    },
    {
      icon: <LockIcon />,
      title: t('loginCredentials'),
      subtitle: t('updateLogin'),
      action: () => navigate(`/change-password/${member.mid}`)
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: mode === 'dark' ? '#121212' : '#f8fffe' }}>
      {/* Enhanced Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #137d13 0%, #22c55e 50%, #3ad13a 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: { xs: 24, sm: 32 },
          borderBottomRightRadius: { xs: 24, sm: 32 },
          boxShadow: '0 8px 32px 0 rgba(34,197,94,0.2)',
          px: { xs: 3, sm: 4 },
          py: { xs: 2, sm: 3 },
          mb: 3
        }}
      >
        {/* Back Button */}
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{
            color: 'white',
            position: 'absolute',
            top: { xs: 16, sm: 24 },
            left: { xs: 16, sm: 24 },
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Profile Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          pt: { xs: 2, sm: 2 },
          gap: 3
        }}>
          {/* Avatar with Photo Upload */}
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={image} 
              sx={{ 
                width: { xs: 100, sm: 120 }, 
                height: { xs: 100, sm: 120 }, 
                bgcolor: 'white', 
                color: '#137d13', 
                fontWeight: 'bold', 
                fontSize: { xs: 36, sm: 48 },
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '4px solid rgba(255,255,255,0.3)'
              }}
            >
              {!image && member.first_name?.[0]}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'white',
                color: '#137d13',
                width: 40,
                height: 40,
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                '&:hover': { backgroundColor: '#f0f0f0' }
              }}
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Box>

          {/* User Info */}
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography 
              variant="h4" 
              fontWeight="bold" 
              sx={{ 
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: { xs: '1.8rem', sm: '2.2rem' }
              }}
            >
              {fullName}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.9,
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {email}
            </Typography>
            <Chip 
              label={status}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          </Box>
        </Box>

        {/* Decorative Elements */}
        <Box sx={{ 
          position: 'absolute', 
          top: -40, 
          right: -40, 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)', 
          zIndex: 1 
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: -30, 
          left: -30, 
          width: 60, 
          height: 60, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)', 
          zIndex: 1 
        }} />
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          right: '10%', 
          width: 20, 
          height: 20, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.2)', 
          zIndex: 1 
        }} />
      </Box>

      {/* Menu Items */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 10 }}>
        <Paper 
          elevation={2} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            backgroundColor: mode === 'dark' ? '#1e1e1e' : 'white'
          }}
        >
          <List sx={{ py: 0 }}>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  button 
                  onClick={item.action}
                  sx={{
                    py: 2.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: mode === 'dark' ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.05)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#137d13', 
                    mr: 2,
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </Box>
                  <ListItemText 
                    primary={item.title} 
                    secondary={item.subtitle}
                    primaryTypographyProps={{ 
                      fontWeight: 600,
                      color: mode === 'dark' ? 'white' : '#1a1a1a'
                    }}
                    secondaryTypographyProps={{
                      color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                    }}
                  />
                  <ChevronRightIcon sx={{ color: '#137d13' }} />
                </ListItem>
                {index < menuItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Settings Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            mt: 3, 
            borderRadius: 3, 
            overflow: 'hidden',
            backgroundColor: mode === 'dark' ? '#1e1e1e' : 'white'
          }}
        >
          <List sx={{ py: 0 }}>
            <ListItem sx={{ py: 2.5, px: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#137d13', 
                mr: 2,
                backgroundColor: 'rgba(34,197,94,0.1)',
                borderRadius: '50%',
                width: 48,
                height: 48,
                justifyContent: 'center'
              }}>
                <NotificationsIcon />
              </Box>
              <ListItemText 
                primary={t('notifications')}
                primaryTypographyProps={{ 
                  fontWeight: 600,
                  color: mode === 'dark' ? 'white' : '#1a1a1a'
                }}
              />
              <Switch
                checked={localStorage.getItem('notificationsEnabled') === 'true'}
                onChange={(e) => {
                  const isEnabled = e.target.checked;
                  localStorage.setItem('notificationsEnabled', isEnabled);
                  window.location.reload();
                }}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#137d13',
                    '&:hover': { backgroundColor: 'rgba(19,125,19,0.08)' }
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#137d13'
                  }
                }}
              />
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 2.5, px: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#137d13', 
                mr: 2,
                backgroundColor: 'rgba(34,197,94,0.1)',
                borderRadius: '50%',
                width: 48,
                height: 48,
                justifyContent: 'center'
              }}>
                <DarkModeIcon />
              </Box>
              <ListItemText 
                primary={t('darkMode')}
                primaryTypographyProps={{ 
                  fontWeight: 600,
                  color: mode === 'dark' ? 'white' : '#1a1a1a'
                }}
              />
              <Switch 
                checked={mode === 'dark'} 
                onChange={toggleTheme}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#137d13',
                    '&:hover': { backgroundColor: 'rgba(19,125,19,0.08)' }
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#137d13'
                  }
                }}
              />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              sx={{
                py: 2.5,
                px: 3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(244,67,54,0.05)',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#f44336', 
                mr: 2,
                backgroundColor: 'rgba(244,67,54,0.1)',
                borderRadius: '50%',
                width: 48,
                height: 48,
                justifyContent: 'center'
              }}>
                <LogoutIcon />
              </Box>
              <ListItemText 
                primary={t('signOut')} 
                primaryTypographyProps={{ 
                  color: '#f44336',
                  fontWeight: 600
                }} 
              />
              <ChevronRightIcon sx={{ color: '#f44336' }} />
            </ListItem>
          </List>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default UserProfilePage;