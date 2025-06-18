import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  DialogContentText
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import baseurl from '../Baseurl/baseurl';

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [member, setMember] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    last_name: '',
    email: '',
    secondary_email: '',
    dob: '',
    gender: '',
    blood_group: '',
    marital_status: '',
    aadhar_no: '',
    
    // Contact Information
    contact_no: '',
    alternate_contact_no: '',
    work_phone: '',
    extension: '',
    mobile_no: '',
    preferred_contact: '',
    best_time_to_contact: '',
    
    // Emergency Contact
    emergency_contact: '',
    emergency_phone: '',
    
    // Address
    address: '',
    city: '',
    state: '',
    zip_code: '',
    
    // Social Media
    personal_website: '',
    linkedin_profile: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    
    // Access Control
    access_level: 'Basic',
    status: 'Pending',
    
    // Business Profile
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
      source: ''
    }],
    
    // Family Information
    member_family: {
      father_name: '',
      father_contact: '',
      mother_name: '',
      mother_contact: '',
      spouse_name: '',
      spouse_contact: '',
      number_of_children: '',
      children_names: '',
      address: ''
    }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseurl}/api/member/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || 'Failed to fetch member details');
        }

        setMember(data.data);
        setProfileImage(data.data.profile_image);
        setMediaGallery(data.data.media_gallery || []);
        setFormData({
          // Personal Information
          first_name: data.data.first_name || '',
          last_name: data.data.last_name || '',
          email: data.data.email || '',
          secondary_email: data.data.secondary_email || '',
          dob: data.data.dob || '',
          gender: data.data.gender || '',
          blood_group: data.data.blood_group || '',
          marital_status: data.data.marital_status || '',
          aadhar_no: data.data.aadhar_no || '',
          
          // Contact Information
          contact_no: data.data.contact_no || '',
          alternate_contact_no: data.data.alternate_contact_no || '',
          work_phone: data.data.work_phone || '',
          extension: data.data.extension || '',
          mobile_no: data.data.mobile_no || '',
          preferred_contact: data.data.preferred_contact || '',
          best_time_to_contact: data.data.best_time_to_contact || '',
          
          // Emergency Contact
          emergency_contact: data.data.emergency_contact || '',
          emergency_phone: data.data.emergency_phone || '',
          
          // Address
          address: data.data.address || '',
          city: data.data.city || '',
          state: data.data.state || '',
          zip_code: data.data.zip_code || '',
          
          // Social Media
          personal_website: data.data.personal_website || '',
          linkedin_profile: data.data.linkedin_profile || '',
          facebook: data.data.facebook || '',
          instagram: data.data.instagram || '',
          twitter: data.data.twitter || '',
          youtube: data.data.youtube || '',
          
          // Access Control
          access_level: data.data.access_level || 'Basic',
          status: data.data.status || 'Pending',
          
          // Business Profile
          business_profiles: data.data.BusinessProfiles?.map(bp => ({
            company_name: bp.company_name || '',
            business_type: bp.business_type || '',
            role: bp.role || '',
            company_address: bp.company_address || '',
            city: bp.city || '',
            state: bp.state || '',
            zip_code: bp.zip_code || '',
            experience: bp.experience || '',
            staff_size: bp.staff_size || '',
            contact: bp.contact || '',
            email: bp.email || '',
            source: bp.source || ''
          })) || [{
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
            source: ''
          }],
          
          // Family Information
          member_family: {
            father_name: data.data.MemberFamily?.father_name || '',
            father_contact: data.data.MemberFamily?.father_contact || '',
            mother_name: data.data.MemberFamily?.mother_name || '',
            mother_contact: data.data.MemberFamily?.mother_contact || '',
            spouse_name: data.data.MemberFamily?.spouse_name || '',
            spouse_contact: data.data.MemberFamily?.spouse_contact || '',
            number_of_children: data.data.MemberFamily?.number_of_children || '',
            children_names: data.data.MemberFamily?.children_names || '',
            address: data.data.MemberFamily?.address || ''
          }
        });
      } catch (err) {
        setError(err.message || 'An error occurred while fetching member details');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleChange = (e, section = null, index = null) => {
    const { name, value } = e.target;
    
    if (section === 'business_profiles') {
      setFormData(prev => ({
        ...prev,
        business_profiles: prev.business_profiles.map((bp, i) => 
          i === index ? { ...bp, [name]: value } : bp
        )
      }));
    } else if (section === 'member_family') {
      setFormData(prev => ({
        ...prev,
        member_family: {
          ...prev.member_family,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Handle status change for access level
    if (name === 'status') {
      setFormData(prev => ({
        ...prev,
        access_level: value === 'Approved' ? 'Advanced' : 'Basic'
      }));
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setMediaGallery(prev => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (index) => {
    setMediaGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewMedia = (index) => {
    setSelectedMediaIndex(index);
    setOpenViewDialog(true);
  };

  const handleDeleteClick = (index) => {
    setSelectedMediaIndex(index);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMediaIndex !== null) {
      handleRemoveMedia(selectedMediaIndex);
      setOpenDeleteDialog(false);
      setSelectedMediaIndex(null);
    }
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedMediaIndex(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedMediaIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      
      // Append profile image if changed
      if (profileImage && typeof profileImage === 'object' && profileImage instanceof File) {
        formDataToSend.append('profile_image', profileImage);
      }

      // Append media gallery files
      mediaGallery.forEach((media) => {
        if (media && typeof media === 'object' && media instanceof File) {
          formDataToSend.append('media_gallery', media);
        }
      });

      // Create a copy of formData to modify social media fields
      const processedFormData = { ...formData };
      
      // Convert empty social media URLs to null
      const socialMediaFields = [
        'personal_website',
        'linkedin_profile',
        'facebook',
        'instagram',
        'twitter',
        'youtube'
      ];
      
      socialMediaFields.forEach(field => {
        if (processedFormData[field] === '') {
          processedFormData[field] = null;
        }
      });

      // Append all other form data
      Object.keys(processedFormData).forEach(key => {
        if (key === 'business_profiles' || key === 'member_family') {
          formDataToSend.append(key, JSON.stringify(processedFormData[key]));
        } else {
          formDataToSend.append(key, processedFormData[key]);
        }
      });

      const response = await fetch(`${baseurl}/api/member/update/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to update member');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/MemberManagement');
      }, 1500);

    } catch (err) {
      setError(err.message || 'An error occurred while updating the member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/MemberManagement')} sx={{ color: '#666' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#2E7D32' }}>
            Edit Member Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Application ID: {member?.application_id}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Member updated successfully! Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Access Control - Moved to top */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32', borderBottom: '2px solid #e0e0e0', pb: 1 }}>
                Access Control
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="Status"
                      required
                      sx={{ backgroundColor: '#fff' }}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Access Level</InputLabel>
                    <Select
                      name="access_level"
                      value={formData.access_level}
                      onChange={handleChange}
                      label="Access Level"
                      required
                      disabled={formData.status === 'Pending'}
                      sx={{ backgroundColor: '#fff' }}
                    >
                      <MenuItem value="Basic">Basic</MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                  {formData.status === 'Pending' && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Access level will be set automatically based on status approval
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Profile Image and Media Gallery */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32', borderBottom: '2px solid #e0e0e0', pb: 1 }}>
                Profile Image & Media Gallery
              </Typography>
              <Grid container spacing={3}>
                {/* Profile Image */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ 
                    textAlign: 'center',
                    p: 2,
                    border: '1px dashed #ccc',  
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleProfileImageChange}
                    />
                    <label htmlFor="profile-image-upload">
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                          src={imagePreview || (profileImage ? `${baseurl}/${profileImage}` : undefined)}
                          sx={{ 
                            width: 150, 
                            height: 150, 
                            cursor: 'pointer',
                            border: '3px solid #fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {member?.first_name?.[0]}{member?.last_name?.[0]}
                        </Avatar>
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            '&:hover': { backgroundColor: 'white' }
                          }}
                          component="span"
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </label>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Click to change profile image
                    </Typography>
                  </Box>
                </Grid>

                {/* Media Gallery */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ 
                    p: 2,
                    border: '1px dashed #ccc',
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    minHeight: '200px'
                  }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Media Gallery
                      </Typography>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="media-gallery-upload"
                        type="file"
                        multiple
                        onChange={handleMediaUpload}
                      />
                      <label htmlFor="media-gallery-upload">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<AddIcon />}
                          sx={{ 
                            backgroundColor: '#4CAF50',
                            '&:hover': { backgroundColor: '#45a049' }
                          }}
                        >
                          Add Media
                        </Button>
                      </label>
                    </Box>
                    <ImageList 
                      sx={{ 
                        width: '100%', 
                        height: 300,
                        '& .MuiImageListItem-root': {
                          borderRadius: 1,
                          overflow: 'hidden'
                        }
                      }} 
                      cols={3} 
                      rowHeight={164}
                    >
                      {mediaGallery.map((media, index) => (
                        <ImageListItem key={index}>
                          <img
                            src={media.preview || `${baseurl}/${media}`}
                            alt={`Media ${index + 1}`}
                            loading="lazy"
                            style={{ objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => handleViewMedia(index)}
                          />
                          <ImageListItemBar
                            position="top"
                            actionIcon={
                              <Box>
                                <IconButton
                                  sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                                    mr: 1
                                  }}
                                  onClick={() => handleViewMedia(index)}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                  sx={{ 
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                  }}
                                  onClick={() => handleDeleteClick(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            }
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Profile Summary Card */}
          {/* <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={member?.profile_image ? `${baseurl}/${member.profile_image}` : undefined}
                  sx={{ width: 80, height: 80 }}
                >
                  {member?.first_name?.[0]}{member?.last_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {member?.first_name} {member?.last_name}
                  </Typography>
                  <Typography color="text.secondary">
                    {member?.email}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Typography variant="body2" sx={{ 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      backgroundColor: member?.status === 'Approved' ? '#e8f5e9' : 
                                     member?.status === 'Pending' ? '#fff3e0' : '#ffebee',
                      color: member?.status === 'Approved' ? '#2e7d32' : 
                            member?.status === 'Pending' ? '#f57c00' : '#c62828'
                    }}>
                      {member?.status}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      backgroundColor: member?.access_level === 'Advanced' ? '#e8f5e9' : '#e3f2fd',
                      color: member?.access_level === 'Advanced' ? '#2e7d32' : '#1565c0'
                    }}>
                      {member?.access_level}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid> */}

          {/* Personal Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32', borderBottom: '2px solid #e0e0e0', pb: 1 }}>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    sx={{ backgroundColor: '#fff' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    sx={{ backgroundColor: '#fff' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{ backgroundColor: '#fff' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Secondary Email"
                    name="secondary_email"
                    type="email"
                    value={formData.secondary_email}
                    onChange={handleChange}
                    sx={{ backgroundColor: '#fff' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: '#fff' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ backgroundColor: '#fff' }}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Blood Group"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    sx={{ backgroundColor: '#fff' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth sx={{ backgroundColor: '#fff' }}>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleChange}
                      label="Marital Status"
                    >
                      <MenuItem value="married">Married</MenuItem>
                      <MenuItem value="unmarried">Unmarried</MenuItem>
                      <MenuItem value="divorced">Divorced</MenuItem>
                      <MenuItem value="widowed">Widowed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Aadhar Number"
                    name="aadhar_no"
                    value={formData.aadhar_no}
                    onChange={handleChange}
                    sx={{ backgroundColor: '#fff' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32' }}>
                Contact Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alternate Contact"
                    name="alternate_contact_no"
                    value={formData.alternate_contact_no}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Work Phone"
                    name="work_phone"
                    value={formData.work_phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Extension"
                    name="extension"
                    value={formData.extension}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobile_no"
                    value={formData.mobile_no}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Preferred Contact</InputLabel>
                    <Select
                      name="preferred_contact"
                      value={formData.preferred_contact}
                      onChange={handleChange}
                      label="Preferred Contact"
                    >
                      <MenuItem value="Phone">Phone</MenuItem>
                      <MenuItem value="Email">Email</MenuItem>
                      <MenuItem value="SMS">SMS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Best Time to Contact</InputLabel>
                    <Select
                      name="best_time_to_contact"
                      value={formData.best_time_to_contact}
                      onChange={handleChange}
                      label="Best Time to Contact"
                    >
                      <MenuItem value="Morning">Morning</MenuItem>
                      <MenuItem value="Afternoon">Afternoon</MenuItem>
                      <MenuItem value="Evening">Evening</MenuItem>
                      <MenuItem value="Night">Night</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32' }}>
                Emergency Contact
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Phone"
                    name="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32' }}>
                Address
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32' }}>
                Social Media
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Personal Website"
                    name="personal_website"
                    value={formData.personal_website}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn Profile"
                    name="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="YouTube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Business Profile */}
          {formData.business_profiles.map((profile, index) => (
            <Grid item xs={12} key={index}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32' }}>
                  Business Profile {index + 1}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="company_name"
                      value={profile.company_name}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Business Type"
                      name="business_type"
                      value={profile.business_type}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Role"
                      name="role"
                      value={profile.role}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Address"
                      name="company_address"
                      value={profile.company_address}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={profile.city}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={profile.state}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      name="zip_code"
                      value={profile.zip_code}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Experience (Years)"
                      name="experience"
                      value={profile.experience}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Staff Size"
                      name="staff_size"
                      value={profile.staff_size}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact"
                      name="contact"
                      value={profile.contact}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Source"
                      name="source"
                      value={profile.source}
                      onChange={(e) => handleChange(e, 'business_profiles', index)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}

          {/* Family Information */}
          {/* <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#2E7D32' }}>
                Family Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Father's Name"
                    name="father_name"
                    value={formData.member_family.father_name}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Father's Contact"
                    name="father_contact"
                    value={formData.member_family.father_contact}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mother's Name"
                    name="mother_name"
                    value={formData.member_family.mother_name}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mother's Contact"
                    name="mother_contact"
                    value={formData.member_family.mother_contact}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Spouse's Name"
                    name="spouse_name"
                    value={formData.member_family.spouse_name}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Spouse's Contact"
                    name="spouse_contact"
                    value={formData.member_family.spouse_contact}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Children"
                    name="number_of_children"
                    value={formData.member_family.number_of_children}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Children's Names"
                    name="children_names"
                    value={formData.member_family.children_names}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Family Address"
                    name="address"
                    value={formData.member_family.address}
                    onChange={(e) => handleChange(e, 'member_family')}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid> */}

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              mt: 3,
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/MemberManagement')}
                sx={{ 
                  color: '#666',
                  borderColor: '#666',
                  '&:hover': { 
                    backgroundColor: '#f5f5f5',
                    borderColor: '#666'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' },
                  px: 4,
                  py: 1
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <Typography variant="h6">View Image</Typography>
          <IconButton onClick={handleCloseViewDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {selectedMediaIndex !== null && mediaGallery[selectedMediaIndex] && (
            <Box
              component="img"
              src={mediaGallery[selectedMediaIndex].preview || `${baseurl}/${mediaGallery[selectedMediaIndex]}`}
              alt={`Media ${selectedMediaIndex + 1}`}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                maxHeight: '80vh'
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: '#f5f5f5',
          color: '#d32f2f'
        }}>
          Delete Image
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this image? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            sx={{ 
              color: '#666',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ 
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditMember; 