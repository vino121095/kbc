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
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Footer from '../Footer';
import { useCustomTheme } from '../../context/ThemeContext';
import baseurl from '../Baseurl/baseurl';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h6" color="error">
          {t('failedToLoadProfile') || 'Failed to load profile.'}
        </Typography>
      </Box>
    );
  }

  const fullName = `${member.first_name || ''} ${member.last_name || ''}`;
  const email = member.email || '';
  const status = member.status || '';

  return (
    <Box pb={7}>
      {/* Modern Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #137d13 0%, #3ad13a 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: { xs: 16, sm: 30 },
          borderBottomRightRadius: { xs: 16, sm: 30 },
          boxShadow: '0 4px 24px 0 rgba(34,197,94,0.12)',
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 4 },
          mb: 2
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{
          color: 'white',
          position: 'absolute',
          top: { xs: 12, sm: 18 },
          left: { xs: 8, sm: 24 },
          '&:hover': { background: 'rgba(19, 125, 19, 0.1)' }
        }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          {/* Left: Avatar and Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={image} sx={{ width: 72, height: 72, bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', fontSize: 32, boxShadow: 2 }}>
              {!image && member.first_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h5" color="white" fontWeight="bold" sx={{textAlign: "left"}}>
                {fullName}
              </Typography>
              <Typography variant="body1" color="rgba(255,255,255,0.9)" sx={{textAlign: "left"}}>
                {email}
              </Typography>
            </Box>
          </Box>
          {/* Right: Application Status */}
          <Box sx={{ mt: { xs: 2, sm: 0 }, textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" color="white" sx={{ fontWeight: 600, opacity: 0.8 }}>
              {t('applicationStatus')}
            </Typography>
            <Typography variant="subtitle1" color="white" fontWeight="bold">
              {status}
            </Typography>
          </Box>
        </Box>
        {/* Decorative Circles */}
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', bottom: -20, left: -20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 1 }} />
      </Box>

      <List>
        <ListItem button onClick={() => navigate(`/business-details/${member.mid}`)}>
          <ListItemText primary={t('businessDetails')} secondary={t('manageBusiness')} />
        </ListItem>
        <ListItem button onClick={() => navigate(`/personal-details/${member.mid}`)}>
          <ListItemText primary={t('personalDetails')} secondary={t('managePersonal')} />
        </ListItem>
        <ListItem button onClick={() => navigate(`/family-details/${member.mid}`)}>
          <ListItemText primary={t('familyDetails')} secondary={t('managePersonal')} />
        </ListItem>
        <ListItem button onClick={() => navigate(`/change-password/${member.mid}`)}>
          <ListItemText primary={t('loginCredentials')} secondary={t('updateLogin')} />
        </ListItem>
        <ListItem>
          <ListItemText primary={t('notifications')} />
          <Switch
            checked={localStorage.getItem('notificationsEnabled') === 'true'}
            onChange={(e) => {
              const isEnabled = e.target.checked;
              localStorage.setItem('notificationsEnabled', isEnabled);
              window.location.reload(); // Optional: reload to apply immediately
            }}
          />
        </ListItem>

        <ListItem>
          <ListItemText primary={t('darkMode')} />
          <Switch checked={mode === 'dark'} onChange={toggleTheme} />
        </ListItem>
        <ListItem
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          <ListItemText primary={t('signOut')} primaryTypographyProps={{ color: 'error' }} />
        </ListItem>
      </List>

      <Footer />
    </Box>
  );
};

export default UserProfilePage;
