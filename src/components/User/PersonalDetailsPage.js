// src/pages/PersonalDetailsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Footer from '../Footer';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import baseurl from '../Baseurl/baseurl';

const PersonalDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    // Personal Details
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    gender: '',
    blood_group: '',
    contact_no: '',
    alternate_contact_no: '',
    marital_status: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    work_phone: '',
    extension: '',
    mobile_no: '',
    preferred_contact: '',
    secondary_email: '',
    emergency_contact: '',
    emergency_phone: '',
    personal_website: '',
    best_time_to_contact: '',
    // Family Details
    father_name: '',
    father_contact: '',
    mother_name: '',
    mother_contact: '',
    spouse_name: '',
    spouse_contact: '',
    number_of_children: '',
    children_names: '',
    family_address: ''
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setFetchLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          return;
        }

        console.log('Fetching member data for ID:', id);
        console.log('Using token:', token);

        const response = await fetch(`${baseurl}/api/member/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && data.data) {
          const memberData = data.data;
          console.log('Member Data:', memberData);

          // Store member ID for update
          localStorage.setItem('memberId', memberData.mid);

          // Set personal details
          setFormData(prev => ({
            ...prev,
            // Personal Details
            first_name: memberData.first_name || '',
            last_name: memberData.last_name || '',
            email: memberData.email || '',
            dob: memberData.dob || '',
            gender: memberData.gender || '',
            blood_group: memberData.blood_group || '',
            contact_no: memberData.contact_no || '',
            alternate_contact_no: memberData.alternate_contact_no || '',
            marital_status: memberData.marital_status || '',
            address: memberData.address || '',
            city: memberData.city || '',
            state: memberData.state || '',
            zip_code: memberData.zip_code || '',
            work_phone: memberData.work_phone || '',
            extension: memberData.extension || '',
            mobile_no: memberData.mobile_no || '',
            preferred_contact: memberData.preferred_contact || '',
            secondary_email: memberData.secondary_email || '',
            emergency_contact: memberData.emergency_contact || '',
            emergency_phone: memberData.emergency_phone || '',
            personal_website: memberData.personal_website || '',
            best_time_to_contact: memberData.best_time_to_contact || '',
            // Family Details
            father_name: memberData.MemberFamily?.father_name || '',
            father_contact: memberData.MemberFamily?.father_contact || '',
            mother_name: memberData.MemberFamily?.mother_name || '',
            mother_contact: memberData.MemberFamily?.mother_contact || '',
            spouse_name: memberData.MemberFamily?.spouse_name || '',
            spouse_contact: memberData.MemberFamily?.spouse_contact || '',
            number_of_children: memberData.MemberFamily?.number_of_children || '',
            children_names: memberData.MemberFamily?.children_names || '',
            family_address: memberData.MemberFamily?.address || ''
          }));
        } else {
          setError(data.message || 'Failed to load member data');
        }
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError(`Failed to load member data: ${err.message}`);
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchMemberData();
    } else {
      setFetchLoading(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const memberId = localStorage.getItem('memberId');

      if (!token) {
        setError('Authentication required');
        return;
      }

      if (!memberId) {
        setError('Member ID not found');
        return;
      }

      const formDataToSend = new FormData();

      // Append personal details
      const personalDetails = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        blood_group: formData.blood_group,
        contact_no: formData.contact_no,
        alternate_contact_no: formData.alternate_contact_no,
        marital_status: formData.marital_status,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        work_phone: formData.work_phone,
        extension: formData.extension,
        mobile_no: formData.mobile_no,
        preferred_contact: formData.preferred_contact,
        secondary_email: formData.secondary_email,
        emergency_contact: formData.emergency_contact,
        emergency_phone: formData.emergency_phone,
        personal_website: formData.personal_website,
        best_time_to_contact: formData.best_time_to_contact
      };

      // Append family details
      const familyDetails = {
        father_name: formData.father_name,
        father_contact: formData.father_contact,
        mother_name: formData.mother_name,
        mother_contact: formData.mother_contact,
        spouse_name: formData.spouse_name,
        spouse_contact: formData.spouse_contact,
        number_of_children: formData.number_of_children,
        children_names: formData.children_names,
        address: formData.family_address
      };

      // Append personal details as JSON
      formDataToSend.append('personal_details', JSON.stringify(personalDetails));

      // Append family details as JSON
      formDataToSend.append('family_details', JSON.stringify(familyDetails));

      const response = await fetch(`${baseurl}/api/member/update/${memberId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Update Response:', data);

      if (data.success !== false) {
        setSuccess('Profile updated successfully');
        setTimeout(() => navigate(-1), 2000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box pb={10}>
      <Box sx={{ bgcolor: 'green', color: 'white', p: 2 }}>
        <Box display="flex" alignItems="center" gap={1} sx={{ p: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff' }}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography fontSize={14} fontWeight={600}>
            {t('personalDetails')}
          </Typography>
        </Box>
      </Box>

      <Box p={2} component="form" onSubmit={handleSubmit}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Typography fontWeight="bold" mt={2}>{t('Personal Information')}</Typography>

        <TextField
          fullWidth
          margin="dense"
          label={t('firstname')}
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('lastname')}
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('dob')}
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>{t('gender')}</InputLabel>
          <Select
            value={formData.gender}
            label={t('gender')}
            name="gender"
            onChange={handleInputChange}
          >
            <MenuItem value="male">{t('Male')}</MenuItem>
            <MenuItem value="female">{t('Female')}</MenuItem>
            <MenuItem value="other">{t('Other')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="dense"
          label={t('bloodgroup')}
          name="blood_group"
          value={formData.blood_group}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('contactno')}
          name="contact_no"
          value={formData.contact_no}
          onChange={handleInputChange}
          required
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('alternatecontactno')}
          name="alternate_contact_no"
          value={formData.alternate_contact_no}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>{t('maritalstatus')}</InputLabel>
          <Select
            value={formData.marital_status}
            label={t('maritalstatus')}
            name="marital_status"
            onChange={handleInputChange}
          >
            <MenuItem value="single">{t('Single')}</MenuItem>
            <MenuItem value="married">{t('Married')}</MenuItem>
            <MenuItem value="divorced">{t('Divorced')}</MenuItem>
            <MenuItem value="widowed">{t('Widowed')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="dense"
          label={t('address')}
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          multiline
          rows={3}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('city')}
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          required
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('state')}
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          required
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('zipcode')}
          name="zip_code"
          type="number"
          value={formData.zip_code}
          onChange={handleInputChange}
          required
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('workphone')}
          name="work_phone"
          value={formData.work_phone}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('extension')}
          name="extension"
          value={formData.extension}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('mobileno')}
          name="mobile_no"
          value={formData.mobile_no}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('preferredcontact')}
          name="preferred_contact"
          value={formData.preferred_contact}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('secondaryemail')}
          name="secondary_email"
          type="email"
          value={formData.secondary_email}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('emergencycontact')}
          name="emergency_contact"
          value={formData.emergency_contact}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('emergencyphone')}
          name="emergency_phone"
          value={formData.emergency_phone}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('personalwebsite')}
          name="personal_website"
          value={formData.personal_website}
          onChange={handleInputChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>{t('besttimetocontact')}</InputLabel>
          <Select
            value={formData.best_time_to_contact}
            label={t('besttimetocontact')}
            name="best_time_to_contact"
            onChange={handleInputChange}
          >
            <MenuItem value="morning">{t('Morning')}</MenuItem>
            <MenuItem value="afternoon">{t('Afternoon')}</MenuItem>
            <MenuItem value="evening">{t('Evening')}</MenuItem>
            <MenuItem value="weekend">{t('Weekend')}</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* <Typography fontWeight="bold" mt={2}>{t('Family Details')}</Typography>

        <TextField
          fullWidth
          margin="dense"
          label={t('fathername')}
          name="father_name"
          value={formData.father_name}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('fathercontact')}
          name="father_contact"
          value={formData.father_contact}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('mothername')}
          name="mother_name"
          value={formData.mother_name}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('mothercontact')}
          name="mother_contact"
          value={formData.mother_contact}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('spousename')}
          name="spouse_name"
          value={formData.spouse_name}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('spousecontact')}
          name="spouse_contact"
          value={formData.spouse_contact}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('numberofchildren')}
          name="number_of_children"
          type="number"
          value={formData.number_of_children}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('childrennames')}
          name="children_names"
          value={formData.children_names}
          onChange={handleInputChange}
        />

        <TextField
          fullWidth
          margin="dense"
          label={t('familyaddress')}
          name="family_address"
          value={formData.family_address}
          onChange={handleInputChange}
          multiline
          rows={3}
        /> */}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ mt: 3, bgcolor: 'green' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('updateChanges')}
        </Button>
      </Box>

      <Footer />
    </Box>
  );
};

export default PersonalDetailsPage;
