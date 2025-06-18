import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Rating, Chip, Button, IconButton, Alert, Snackbar
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [value, setValue] = useState(4);
  const [review, setReview] = useState('');
  const [tags, setTags] = useState(['Quality', 'On-time', 'Professional']);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [memberData, setMemberData] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({
        open: true,
        message: t('pleaseLogin'),
        severity: 'error'
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
  }, [navigate, t]);

  // Fetch member data to get business_id
  useEffect(() => {
    const fetchMemberData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8000/api/member/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setMemberData(data.data);
        } else {
          setSnackbar({
            open: true,
            message: data.message || t('errorFetchingMemberData'),
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        setSnackbar({
          open: true,
          message: t('errorFetchingMemberData'),
          severity: 'error'
        });
      }
    };

    fetchMemberData();
  }, [id, t]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({
        open: true,
        message: t('pleaseLogin'),
        severity: 'error'
      });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      // Enhanced validation
      if (!memberData) {
        setSnackbar({
          open: true,
          message: 'Member data not loaded',
          severity: 'error'
        });
        return;
      }

      if (!memberData?.BusinessProfiles?.[0]) {
        setSnackbar({
          open: true,
          message: t('noBusinessProfile'),
          severity: 'error'
        });
        return;
      }

      if (!review.trim()) {
        setSnackbar({
          open: true,
          message: t('reviewRequired'),
          severity: 'error'
        });
        return;
      }

      setLoading(true);
      
      // Get the correct business ID (bid field from backend)
      const businessProfile = memberData.BusinessProfiles[0];
      
      // Log the data for debugging
      console.log('Member Data:', memberData);
      console.log('Business Profile:', businessProfile);
      
      // Ensure we have the correct IDs
      const memberId = memberData.mid; // Use mid from member data
      const businessId = businessProfile.id; // Use id from business profile
      
      if (!memberId) {
        throw new Error('Member ID (mid) not found in member data');
      }
      
      if (!businessId) {
        throw new Error('Business ID not found in business profile');
      }

      // Create the payload with only required fields that backend expects
      const requestPayload = {
        member_id: memberId,
        business_id: businessId,
        rating: parseInt(value),
        message: review.trim()
      };

      // Validate the payload
      if (isNaN(requestPayload.rating)) {
        throw new Error('Invalid rating value');
      }

      if (requestPayload.rating < 1 || requestPayload.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      console.log('Submitting rating with payload:', requestPayload);

      const response = await fetch('http://localhost:8000/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('Response Status:', response.status);

      // Parse response
      const data = await response.json();
      console.log('Response Data:', data);

      if (!response.ok) {
        // Handle specific backend errors
        if (response.status === 400) {
          throw new Error(data.error || 'Invalid request data');
        } else if (response.status === 404) {
          if (data.error?.includes('Member not found')) {
            throw new Error(`Member with ID ${requestPayload.member_id} not found. Please check member exists.`);
          } else if (data.error?.includes('Business not found')) {
            throw new Error(`Business with ID ${requestPayload.business_id} not found. Please check business profile.`);
          } else {
            throw new Error(data.error || 'Resource not found');
          }
        } else if (response.status === 500) {
          console.error('Server Error Details:', data);
          throw new Error(data.error || 'Server error occurred. Please try again later.');
        } else {
          throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Success handling
      if (data.message && data.data) {
        setSnackbar({
          open: true,
          message: data.message || t('reviewSubmitted'),
          severity: 'success'
        });
        setTimeout(() => navigate(-1), 2000);
      } else {
        throw new Error('Unexpected response format');
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({
        open: true,
        message: error.message || t('reviewSubmissionFailed'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ background: 'linear-gradient(to right, #137d13, #3ad13a)', p: 2, color: '#fff', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff' }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography fontWeight="bold">{t('ratingsReviews')}</Typography>
        </Box>
      </Box>

      <Box p={2}>
        {/* Rating */}
        <Typography fontWeight="bold" mt={3}>{t('rating')}</Typography>
        <Box display="flex" alignItems="center">
          <Rating
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
          />
          <Typography ml={1}>{value}.0 {t('outOf5')}</Typography>
        </Box>

        {/* Review Note */}
        <Typography fontWeight="bold" mt={3}>{t('reviewThank')}</Typography>
        <TextField
          multiline
          rows={5}
          fullWidth
          placeholder={t('reviewPlaceholder')}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          inputProps={{ maxLength: 500 }}
          helperText={`${review.length}/500`}
          sx={{ mt: 1 }}
        />

        {/* Tags */}
        <Typography fontWeight="bold" mt={3}>{t('tags')} ({t('optional')})</Typography>
        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {tags.map((tag, i) => (
            <Chip 
              key={i} 
              label={tag} 
              variant="outlined" 
              color="success"
              onDelete={() => setTags(tags.filter((_, index) => index !== i))}
            />
          ))}
        </Box>

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 4, borderRadius: 10, backgroundColor: 'green' }}
          onClick={handleSubmit}
          disabled={loading || !review.trim()}
        >
          {loading ? t('submitting') : t('submitReview')}
        </Button>
      </Box>

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

export default ReviewPage;