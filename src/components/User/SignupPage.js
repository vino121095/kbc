import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
  Slide,
  Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import baseurl from '../Baseurl/baseurl';
import logo from '../../assets/image.png';

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showFamilyDetails, setShowFamilyDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Main form state
  const [formData, setFormData] = useState({
    // Personal Info
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    join_date: '',
    aadhar_no: '',
    blood_group: '',
    contact_no: '',
    alternate_contact_no: '',
    marital_status: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    profile_image: null,
    work_phone: '',
    extension: '',
    mobile_no: '',
    preferred_contact: '',
    secondary_email: '',
    emergency_contact: '',
    emergency_phone: '',
    personal_website: '',
    linkedin_profile: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    kootam: '',
    best_time_to_contact: '',
    // Referral
    referral_name: '',
    referral_code: '',
    // Business Profiles (mandatory)
    business_profiles: [{
      company_name: '',
      business_type: '',
      role: '',
      company_address: '',
      city: '',
      state: '',
      zip_code: '',
      experience: '',
      staff_size: '',
      contact: '',
      email: '',
      source: '',
      business_profile_image: null,
      media_gallery: []
    }],
    // Family Details
    family_details: {
      father_name: '',
      father_contact: '',
      mother_name: '',
      mother_contact: '',
      spouse_name: '',
      spouse_contact: '',
      number_of_children: '',
      address: '',
      children_names: ''
    }
  });

  const handleTogglePassword = () => setShowPassword(prev => !prev);
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle business profile changes
  const handleBusinessProfileChange = (index, e) => {
    const { name, value } = e.target;
    const newProfiles = [...formData.business_profiles];
    newProfiles[index] = { ...newProfiles[index], [name]: value };
    setFormData(prev => ({ ...prev, business_profiles: newProfiles }));
  };

  // Handle family detail changes
  const handleFamilyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      family_details: {
        ...prev.family_details,
        [name]: value
      }
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData(prev => ({ ...prev, [name]: e.target.files[0] }));
  };

  // Handle business file uploads
  const handleBusinessFileChange = (index, name, files) => {
    const newProfiles = [...formData.business_profiles];
    if (name === 'business_profile_image') {
      newProfiles[index][name] = files[0];
    } else if (name === 'media_gallery') {
      newProfiles[index][name] = Array.from(files);
    }
    setFormData(prev => ({ ...prev, business_profiles: newProfiles }));
  };

  // Add new business profile
  const handleAddBusinessProfile = () => {
    setFormData(prev => ({
      ...prev,
      business_profiles: [
        ...prev.business_profiles,
        {
          company_name: '',
          business_type: '',
          role: '',
          company_address: '',
          city: '',
          state: '',
          zip_code: '',
          experience: '',
          staff_size: '',
          contact: '',
          email: '',
          source: '',
          business_profile_image: null,
          media_gallery: []
        }
      ]
    }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    // Required personal fields
    const requiredPersonalFields = [
      'first_name', 'last_name', 'email', 'password',
      'contact_no', 'address', 'city', 'state', 'zip_code'
    ];
    requiredPersonalFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = t('fieldRequired');
      }
    });
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = t('invalidEmail');
    }
    // Validate password strength
    if (formData.password && formData.password.length < 8) {
      newErrors.password = t('passwordStrength');
    }
    // Validate business profiles
    formData.business_profiles.forEach((profile, index) => {
      if (!profile.company_name) {
        newErrors[`business_company_${index}`] = t('companyNameRequired');
      }
      if (!profile.email) {
        newErrors[`business_email_${index}`] = t('businessEmailRequired');
      } else if (!emailRegex.test(profile.email)) {
        newErrors[`business_email_${index}`] = t('invalidEmail');
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: t('formErrors'),
        severity: 'error'
      });
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      // Append personal info
      const personalFields = [
        'first_name', 'last_name', 'email', 'password', 'dob', 'gender',
        'join_date', 'aadhar_no', 'blood_group', 'contact_no', 'alternate_contact_no',
        'marital_status', 'address', 'city', 'state', 'zip_code', 'work_phone',
        'extension', 'mobile_no', 'preferred_contact', 'secondary_email',
        'emergency_contact', 'emergency_phone', 'personal_website',
        'linkedin_profile', 'facebook', 'instagram', 'twitter', 'youtube', 'kootam',
        'best_time_to_contact', 'referral_name', 'referral_code'
      ];
      personalFields.forEach(field => {
        if (formData[field] !== null && formData[field] !== undefined) {
          formDataToSend.append(field, formData[field]);
        }
      });
      // Append profile image
      if (formData.profile_image) {
        formDataToSend.append('profile_image', formData.profile_image);
      }
      // Handle business profiles
      const businessProfiles = formData.business_profiles.map((profile, index) => {
        const { business_profile_image, media_gallery, ...profileData } = profile;
        if (business_profile_image) {
          formDataToSend.append(`business_profile_image_${index}`, business_profile_image);
        }
        if (media_gallery && media_gallery.length > 0) {
          media_gallery.forEach(file => {
            formDataToSend.append(`media_gallery_${index}`, file);
          });
        }
        return {
          ...profileData,
          email: Array.isArray(profileData.email) ? profileData.email[0] : profileData.email
        };
      });
      formDataToSend.append('business_profiles', JSON.stringify(businessProfiles));
      // Handle family details if shown
      if (showFamilyDetails) {
        const familyDetails = { ...formData.family_details };
        if (familyDetails.children_names) {
          familyDetails.children_names = familyDetails.children_names
            .split(',')
            .map(name => name.trim())
            .filter(name => name);
        }
        formDataToSend.append('family_details', JSON.stringify(familyDetails));
      }
      const apiUrl = `${baseurl}/api/member/register`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorResult = await response.json().catch(() => null);
        const errorMessage = errorResult?.msg || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();
      setSnackbar({
        open: true,
        message: result.msg || t('registrationSuccess'),
        severity: 'success'
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || t('registrationFailed'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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
            maxWidth: 600,
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
                {t('signup')}
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
            <Box>
              {/* --- SIGNUP FORM FIELDS (as previously refactored) --- */}
              {/* Place all the signup fields and sections here, as in your latest version, using the new style. */}
              {/* ... (Insert all the signup fields and sections here, as in your current code) ... */}

              {/* Personal Information */}
              <Typography fontWeight="bold" mt={2}>{t('Personal Information')}</Typography>
              <TextField fullWidth margin="dense" label={t('firstname')} name="first_name" value={formData.first_name} onChange={handleChange} error={!!errors.first_name} helperText={errors.first_name} required />
              <TextField fullWidth margin="dense" label={t('lastname')} name="last_name" value={formData.last_name} onChange={handleChange} error={!!errors.last_name} helperText={errors.last_name} required />
              <TextField fullWidth margin="dense" label={t('email')} name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required />
              <TextField fullWidth margin="dense" label={t('password')} name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} required InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleTogglePassword}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
              <TextField fullWidth margin="dense" label={t('dob')} name="dob" type="date" value={formData.dob} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <FormControl fullWidth margin="dense"><InputLabel>{t('gender')}</InputLabel><Select value={formData.gender} label={t('gender')} name="gender" onChange={handleChange}><MenuItem value="male">{t('Male')}</MenuItem><MenuItem value="female">{t('Female')}</MenuItem><MenuItem value="other">{t('Other')}</MenuItem></Select></FormControl>
              <TextField fullWidth margin="dense" label={t('joindate')} name="join_date" type="date" value={formData.join_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth margin="dense" label={t('aadharno')} name="aadhar_no" value={formData.aadhar_no} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('bloodgroup')} name="blood_group" value={formData.blood_group} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('contactno')} name="contact_no" value={formData.contact_no} onChange={handleChange} error={!!errors.contact_no} helperText={errors.contact_no} required />
              <TextField fullWidth margin="dense" label={t('alternatecontactno')} name="alternate_contact_no" value={formData.alternate_contact_no} onChange={handleChange} />
              <FormControl fullWidth margin="dense"><InputLabel>{t('maritalstatus')}</InputLabel><Select value={formData.marital_status} label={t('maritalstatus')} name="marital_status" onChange={handleChange}><MenuItem value="single">{t('Single')}</MenuItem><MenuItem value="married">{t('Married')}</MenuItem><MenuItem value="divorced">{t('Divorced')}</MenuItem><MenuItem value="widowed">{t('Widowed')}</MenuItem></Select></FormControl>
              <TextField fullWidth margin="dense" label={t('address')} name="address" value={formData.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} required multiline rows={3} />
              <TextField fullWidth margin="dense" label={t('city')} name="city" value={formData.city} onChange={handleChange} error={!!errors.city} helperText={errors.city} required />
              <TextField fullWidth margin="dense" label={t('state')} name="state" value={formData.state} onChange={handleChange} error={!!errors.state} helperText={errors.state} required />
              <TextField fullWidth margin="dense" label={t('zipcode')} name="zip_code" type="number" value={formData.zip_code} onChange={handleChange} error={!!errors.zip_code} helperText={errors.zip_code} required />
              <TextField fullWidth margin="dense" label={t('profileimage')} type="file" InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*' }} onChange={handleFileChange} name="profile_image" />
              <TextField fullWidth margin="dense" label={t('workphone')} name="work_phone" value={formData.work_phone} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('extension')} name="extension" value={formData.extension} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('mobileno')} name="mobile_no" value={formData.mobile_no} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('preferredcontact')} name="preferred_contact" value={formData.preferred_contact} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('secondaryemail')} name="secondary_email" type="email" value={formData.secondary_email} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('emergencycontact')} name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('emergencyphone')} name="emergency_phone" value={formData.emergency_phone} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('personalwebsite')} name="personal_website" value={formData.personal_website} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('linkedinprofile')} name="linkedin_profile" value={formData.linkedin_profile} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('facebook')} name="facebook" value={formData.facebook} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('instagram')} name="instagram" value={formData.instagram} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('twitter')} name="twitter" value={formData.twitter} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('youtube')} name="youtube" value={formData.youtube} onChange={handleChange} />
              <TextField fullWidth margin="dense" label={t('kootam')} name="kootam" value={formData.kootam} onChange={handleChange} />
              <FormControl fullWidth margin="dense"><InputLabel>{t('besttimetocontact')}</InputLabel><Select value={formData.best_time_to_contact} label={t('besttimetocontact')} name="best_time_to_contact" onChange={handleChange}><MenuItem value="morning">{t('Morning')}</MenuItem><MenuItem value="afternoon">{t('Afternoon')}</MenuItem><MenuItem value="evening">{t('Evening')}</MenuItem><MenuItem value="weekend">{t('Weekend')}</MenuItem></Select></FormControl>
              <FormControlLabel control={<Checkbox checked={showReferral} onChange={() => setShowReferral(prev => !prev)} />} label={t('Do You Have Referral')} />
              <br />
              {showReferral && (<><Typography fontWeight="bold" mt={2}>{t('Referral Person Details')}</Typography><TextField fullWidth margin="dense" label={t('referralname')} name="referral_name" value={formData.referral_name} onChange={handleChange} /><TextField fullWidth margin="dense" label={t('referralcode')} name="referral_code" value={formData.referral_code} onChange={handleChange} /></>)}
              {/* Business Details */}
              <Typography fontWeight="bold" mt={2}>{t('Business Details')}</Typography>
              {formData.business_profiles.map((profile, index) => (
                <Box key={index} sx={{ my: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  <Typography variant="subtitle1">{t('Business Profile')} {index + 1}</Typography>
                  <TextField fullWidth margin="dense" label={t('companyname')} name="company_name" value={profile.company_name} onChange={(e) => handleBusinessProfileChange(index, e)} error={!!errors[`business_company_${index}`]} helperText={errors[`business_company_${index}`]} required />
                  <TextField fullWidth margin="dense" label={t('businesstype')} name="business_type" value={profile.business_type} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('role')} name="role" value={profile.role} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('companyaddress')} name="company_address" value={profile.company_address} onChange={(e) => handleBusinessProfileChange(index, e)} multiline rows={2} />
                  <TextField fullWidth margin="dense" label={t('city')} name="city" value={profile.city} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('state')} name="state" value={profile.state} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('zipcode')} name="zip_code" type="number" value={profile.zip_code} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('experience')} name="experience" value={profile.experience} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('staffsize')} name="staff_size" type="number" value={profile.staff_size} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('contact')} name="contact" value={profile.contact} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('email')} name="email" type="email" value={profile.email} onChange={(e) => handleBusinessProfileChange(index, e)} error={!!errors[`business_email_${index}`]} helperText={errors[`business_email_${index}`]} required />
                  <TextField fullWidth margin="dense" label={t('source')} name="source" value={profile.source} onChange={(e) => handleBusinessProfileChange(index, e)} />
                  <TextField fullWidth margin="dense" label={t('businessprofileimage')} type="file" InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*' }} onChange={(e) => handleBusinessFileChange(index, 'business_profile_image', e.target.files)} />
                  <TextField fullWidth margin="dense" label={t('mediagallery')} type="file" InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*,video/*', multiple: true }} onChange={(e) => handleBusinessFileChange(index, 'media_gallery', e.target.files)} />
                </Box>
              ))}
              <Button variant="outlined" onClick={handleAddBusinessProfile} sx={{ mt: 2 }}>{t('Add Business Profile')}</Button> <br />
              {/* Family Details */}
              <FormControlLabel control={<Checkbox checked={showFamilyDetails} onChange={() => setShowFamilyDetails(prev => !prev)} />} label={t('Family Details')} />
              {showFamilyDetails && (<><Typography fontWeight="bold" mt={2}>{t('Family Details')}</Typography><TextField fullWidth margin="dense" label={t('fathername')} name="father_name" value={formData.family_details.father_name} onChange={handleFamilyChange} /><TextField fullWidth margin="dense" label={t('fathercontact')} name="father_contact" value={formData.family_details.father_contact} onChange={handleFamilyChange} /><TextField fullWidth margin="dense" label={t('mothername')} name="mother_name" value={formData.family_details.mother_name} onChange={handleFamilyChange} /><TextField fullWidth margin="dense" label={t('mothercontact')} name="mother_contact" value={formData.family_details.mother_contact} onChange={handleFamilyChange} /><TextField fullWidth margin="dense" label={t('spousename')} name="spouse_name" value={formData.family_details.spouse_name} onChange={handleFamilyChange} /><TextField fullWidth margin="dense" label={t('spousecontact')} name="spouse_contact" value={formData.family_details.spouse_contact} onChange={handleFamilyChange} /><TextField fullWidth margin="dense" label={t('numberofchildren')} name="number_of_children" type="number" value={formData.family_details.number_of_children} onChange={handleFamilyChange} /><TextField fullWidth margin="dense" label={t('familyaddress')} name="address" value={formData.family_details.address} onChange={handleFamilyChange} multiline rows={2} /><TextField fullWidth margin="dense" label={t('childrennames')} name="children_names" value={formData.family_details.children_names} onChange={handleFamilyChange} /></>)}
              <Button fullWidth variant="contained" sx={{ mt: 3, backgroundColor: 'green', borderRadius: 25 }} onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : t('createAccount')}
              </Button>
              <Typography textAlign="center" mt={2}>
                {t('alreadyHaveAccount')} <Link to="/login" style={{ textDecoration: 'none', color: 'green' }}>{t('signin')}</Link>
              </Typography>
            </Box>
          </Slide>
        </Paper>
      </Fade>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupPage;
