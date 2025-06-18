// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import BaseUrl from './Baseurl/baseurl';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const memberData = JSON.parse(localStorage.getItem('memberData'));
        
        if (!token || !memberData?.mid) {
          return;
        }

        const response = await fetch(`${BaseUrl}/api/notifications/${memberData.mid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (data.success !== false && data.data) {
          const unreadNotifications = data.data.filter(notif => !notif.is_read);
          setUnreadCount(unreadNotifications.length);
        }
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    fetchUnreadCount();
    // Refresh unread count every minute
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation value={location.pathname} onChange={handleChange}>
        <BottomNavigationAction label="Home" value="/home" icon={<HomeIcon />} />
        <BottomNavigationAction 
          label="Notifications" 
          value="/notifications" 
          icon={
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          } 
        />
        <BottomNavigationAction label="Profile" value="/profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default Footer;
