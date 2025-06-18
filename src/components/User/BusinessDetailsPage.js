import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Footer from '../Footer';

const BaseUrl = 'http://localhost:8000';

const BusinessDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [businessProfileId, setBusinessProfileId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    services: '',
    role: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    experience: '',
    staffSize: '',
    contact: '',
    email: '',
    referredBy: '',
    profileImage: null,
    mediaGallery: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BaseUrl}/api/member/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const businessProfiles = data?.data?.BusinessProfiles;

        if (!businessProfiles || businessProfiles.length === 0) {
          throw new Error('Business profile not found.');
        }

        const business = businessProfiles[0];
        setBusinessProfileId(business.id);

        setFormData({
          companyName: business.company_name || '',
          services: business.business_type || '',
          role: business.role || '',
          address: business.company_address || '',
          city: business.city || '',
          state: business.state || '',
          pincode: business.zip_code || '',
          experience: business.experience || '',
          staffSize: business.staff_size || '',
          contact: business.contact || '',
          email: business.email || '',
          referredBy: business.source || '',
          profileImage: business.business_profile_image || null,
          mediaGallery: business.media_gallery ? business.media_gallery.split(',') : [],
        });
      } catch (error) {
        console.error('Failed to fetch business data:', error);
        setSnackbar({
          open: true,
          message: error.message || t('failedToLoadData'),
          severity: 'error'
        });
      }
    };

    fetchData();
  }, [id, t]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'profileImage') {
      setFormData(prev => ({ ...prev, profileImage: files[0] }));
    } else if (name === 'mediaGallery') {
      setFormData(prev => ({ ...prev, mediaGallery: Array.from(files) }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error(t('pleaseLogin'));

      if (!businessProfileId) throw new Error(t('businessProfileNotFound'));

      const formDataToSend = new FormData();
      formDataToSend.append('company_name', formData.companyName);
      formDataToSend.append('business_type', formData.services);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('company_address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('zip_code', formData.pincode);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('staff_size', formData.staffSize);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('source', formData.referredBy);

      if (formData.profileImage instanceof File) {
        formDataToSend.append('business_profile_image', formData.profileImage);
      }

      if (formData.mediaGallery.length > 0 && formData.mediaGallery[0] instanceof File) {
        formData.mediaGallery.forEach(file => {
          formDataToSend.append('media_gallery', file);
        });
      }

      const response = await fetch(`${BaseUrl}/api/business-profile/update/${businessProfileId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('updateFailed'));
      }

      setSnackbar({
        open: true,
        message: data.message || t('updateSuccess'),
        severity: 'success'
      });

      setTimeout(() => navigate(-1), 2000);

    } catch (error) {
      console.error('Update error:', error);
      setSnackbar({
        open: true,
        message: error.message || t('updateFailed'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pb={10}>
      <Box sx={{ bgcolor: 'green', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ p: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff' }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography fontSize={14} fontWeight={600}>
            {t('businessDetails')}
          </Typography>
        </Box>
      </Box>

      <Box p={2}>
        {[
          ['companyName', 'Company Name'],
          ['services', 'Services'],
          ['role', 'Your Role'],
          ['address', 'Company Address'],
          ['city', 'City'],
          ['state', 'State'],
          ['pincode', 'Pincode'],
          ['experience', 'Experience'],
          ['staffSize', 'Staff Size'],
          ['contact', 'Contact'],
          ['email', 'Email'],
          ['referredBy', 'Referred by']
        ].map(([name, label]) => (
          <TextField
            key={name}
            fullWidth
            label={label}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            size="small"
            sx={{ mb: 2 }}
          />
        ))}

        <Box mt={3}>
          <Typography variant="body2" mb={1}>Business Profile Image:</Typography>
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            onChange={handleFileChange}
            style={{ marginBottom: '1rem' }}
          />
          {formData.profileImage && (
            <img
              src={formData.profileImage instanceof File
                ? URL.createObjectURL(formData.profileImage)
                : `${BaseUrl}/${formData.profileImage}`}
              alt="Business"
              style={{ width: '100%', maxWidth: 300, height: 'auto' }}
            />
          )}
        </Box>

        <Box mt={4}>
          <Typography fontWeight="bold">Media Gallery</Typography>
          <Typography variant="body2" mb={1}>Upload images and videos:</Typography>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            name="mediaGallery"
            onChange={handleFileChange}
            style={{ marginBottom: '1rem' }}
          />
          <Box display="flex" flexWrap="wrap" gap={2}>
            {formData.mediaGallery.map((media, index) => {
              const isVideo = media instanceof File
                ? media.type.startsWith('video/')
                : media.match(/\.(mp4|webm|ogg)$/i);

              const mediaUrl = media instanceof File
                ? URL.createObjectURL(media)
                : `${BaseUrl}/${media}`;

              return isVideo ? (
                <video key={index} src={mediaUrl} width="200" height="150" controls />
              ) : (
                <img
                  key={index}
                  src={mediaUrl}
                  alt={`media-${index}`}
                  width="200"
                  height="150"
                  style={{ objectFit: 'cover' }}
                />
              );
            })}
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, bgcolor: 'green' }}
          onClick={handleSubmit}
          disabled={loading || !businessProfileId}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('updateChanges')}
        </Button>
      </Box>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BusinessDetailsPage;
