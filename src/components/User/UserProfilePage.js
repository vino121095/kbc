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
      <Box sx={{ bgcolor: 'green', p: 3, color: 'white', textAlign: 'center', position: 'relative' }}>
        <Avatar src={image} sx={{ margin: 'auto', width: 60, height: 60 }}>
          {!image && member.first_name?.[0]}
        </Avatar>
        <label htmlFor="upload-photo">
          <input
            style={{ display: 'none' }}
            id="upload-photo"
            name="upload-photo"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* <IconButton
            color="default"
            aria-label="upload picture"
            component="span"
            sx={{ position: 'absolute', top: 55, right: '40%' }}
          >
            <PhotoCamera sx={{ color: 'white' }} />
          </IconButton> */}
        </label>
        <Typography variant="h6">{fullName}</Typography>
        <Typography variant="body2">{email}</Typography>
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
        <ListItem>
          <ListItemText primary={t('applicationStatus')} secondary={status} />
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
