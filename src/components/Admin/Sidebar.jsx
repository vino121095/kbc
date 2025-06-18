import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ShareIcon from '@mui/icons-material/Share';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [showLogout, setShowLogout] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: 'dashboard' },
    { text: 'Member Management', icon: <PeopleIcon />, path: 'MemberManagement' },
    { text: 'Business Directory', icon: <BusinessIcon />, path: 'BusinessManagement' },
    { text: 'Family Information', icon: <FamilyRestroomIcon />, path: 'FamilyInformation' },
    { text: 'Referral System', icon: <ShareIcon />, path: 'ReferralSystem' },
    { text: 'Review Testimonials', icon: <RateReviewIcon />, path: 'ReviewTestimonals' },
  ];

  const getCurrentRoute = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    return segments.length > 1 ? segments[segments.length - 1] : 'dashboard';
  };

  const isActive = (itemPath) => {
    const currentRoute = getCurrentRoute();
    return currentRoute === itemPath;
  };

  const handleNavigation = (path) => {
    navigate(`/admin/${path}`);
    if (isMobile) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#2e7d32'
    }}>
      {/* Logo Section */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40, mr: 1.5 }}>
            <BusinessIcon sx={{ color: 'white' }} />
          </Avatar>
          <Box sx={{
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
  }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              Business Directory
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Admin Panel
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, px: 1 }}>
        <List sx={{ pt: 0 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 0.5,
                mx: 1,
                borderRadius: 2,
                backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  color: 'white',
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Admin User Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setShowLogout(!showLogout)}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40, mr: 1.5 }}>
            A
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', textAlign: "left" }}>
              Admin User
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              admin@businessdir.com
            </Typography>
          </Box>
        </Box>

        {showLogout && (
          <Box onClick={handleLogout} sx={{ 
            mt: 1.5, 
            px: 2, 
            py: 1, 
            display: 'flex', 
            alignItems: 'center',
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' }
          }}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">Logout</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: '#2e7d32',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;