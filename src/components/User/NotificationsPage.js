import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Badge,
  CircularProgress,
  Alert,
  IconButton,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Footer from '../Footer';
import BaseUrl from '../Baseurl/baseurl';
import { useCustomTheme } from '../../context/ThemeContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { mode } = useCustomTheme();

  useEffect(() => {
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';

    if (!notificationsEnabled) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const memberData = JSON.parse(localStorage.getItem('memberData'));

        if (!token || !memberData?.mid) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(`${BaseUrl}/api/notifications/${memberData.mid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch notifications');
        }

        if (data.success !== false) {
          const transformedNotifications = data.data.map(notif => ({
            ...notif,
            unread: !notif.is_read,
            sender_name: notif.sender ? `${notif.sender.first_name} ${notif.sender.last_name}` : 'Unknown',
            created_at: notif.createdAt,
            note: notif.note || null
          }));
          setNotifications(transformedNotifications);
        } else {
          throw new Error(data.message || 'Failed to fetch notifications');
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      const memberData = JSON.parse(localStorage.getItem('memberData'));

      if (!token || !memberData?.mid) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${BaseUrl}/api/mark-read/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark notification as read');
      }

      if (data.success !== false) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, unread: false, is_read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const memberData = JSON.parse(localStorage.getItem('memberData'));

      if (!token || !memberData?.mid) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${BaseUrl}/api/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark all notifications as read');
      }

      if (data.success !== false) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, unread: false, is_read: true }))
        );
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err.message);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return t('justNow') || 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} ${t('minutesAgo') || 'minutes ago'}`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ${t('hoursAgo') || 'hours ago'}`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ${t('daysAgo') || 'days ago'}`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor={theme.palette.background.default}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      pb={8}
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        color: theme.palette.text.primary
      }}
    >
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(to bottom right, #137d13, #3ad13a)',
        p: 3,
        color: '#fff',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'white', mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          {t('notifications')}
        </Typography>
      </Box>

      {/* Notifications Disabled Info */}
      {localStorage.getItem('notificationsEnabled') !== 'true' && (
        <Typography 
          textAlign="center" 
          mt={4} 
          color="textSecondary"
          sx={{ px: 2 }}
        >
          {t('notificationsAreDisabled') || 'Notifications are disabled. Turn them on from your profile settings.'}
        </Typography>
      )}

      {/* Error Message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            m: 2,
            bgcolor: theme.palette.error.light,
            color: theme.palette.error.contrastText
          }}
        >
          {error}
        </Alert>
      )}

      {/* Mark All As Read Button */}
      {notifications.length > 0 && notifications.some(notif => notif.unread) && (
        <Box 
          display="flex" 
          justifyContent="flex-end" 
          mt={2}
          px={2}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 10,
              background: 'linear-gradient(to right, #137d13, #3ad13a)',
              color: 'white',
              px: 3,
              py: 1,
              fontSize: 14
            }}
            onClick={handleMarkAllRead}
            startIcon={<CheckCircleIcon />}
          >
            {t('markAllRead')}
          </Button>
        </Box>
      )}

      {/* Notifications List */}
      <List sx={{ p: 2 }}>
        {notifications.length === 0 ? (
          <Box 
            textAlign="center" 
            py={4}
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              mt: 2,
              mx: 1
            }}
          >
            <MarkunreadIcon sx={{ fontSize: 60, color: theme.palette.text.disabled }} />
            <Typography 
              variant="h6" 
              color="textSecondary" 
              mt={2}
            >
              {t('No Notifications')}
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary" 
              mt={1}
            >
              {/* {t('noNotificationsDesc') || 'You have no notifications at this time'} */}
            </Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notif.unread 
                    ? theme.palette.mode === 'dark' 
                      ? 'rgba(255, 243, 205, 0.1)' 
                      : '#fff3cd'
                    : theme.palette.background.paper,
                  borderRadius: 2,
                  mb: 1,
                  cursor: notif.unread ? 'pointer' : 'default',
                  border: notif.unread 
                    ? `1px solid ${theme.palette.mode === 'dark' ? '#4d4d00' : '#ffeaa7'}` 
                    : `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    bgcolor: notif.unread 
                      ? theme.palette.mode === 'dark' 
                        ? 'rgba(255, 242, 168, 0.2)' 
                        : '#fff2a8'
                      : theme.palette.mode === 'dark'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[100]
                  }
                }}
                onClick={() => notif.unread && handleMarkAsRead(notif.id)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color="error"
                    invisible={!notif.unread}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: theme.palette.primary.dark,
                        color: 'white'
                      }}
                    >
                      {notif.sender_name?.[0] || 'U'}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="space-between"
                    >
                      <Typography 
                        fontWeight={notif.unread ? "bold" : "normal"} 
                        fontSize={14}
                        color={theme.palette.text.primary}
                      >
                        {notif.message}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      {notif.note && (
                        <Typography 
                          variant="body2" 
                          color={theme.palette.text.secondary}
                          mt={0.5}
                        >
                          {notif.note}
                        </Typography>
                      )}
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        mt={0.5}
                      >
                        <Typography 
                          variant="caption" 
                          color={theme.palette.text.secondary}
                        >
                          {formatTimeAgo(notif.created_at)}
                        </Typography>
                        {notif.unread && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              bgcolor: theme.palette.primary.main, 
                              color: 'white', 
                              px: 1, 
                              borderRadius: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('new')}
                          </Typography>
                        )}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))
        )}
      </List>

      <Footer />
    </Box>
  );
};

export default NotificationsPage;