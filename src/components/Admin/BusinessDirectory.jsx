import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  Videocam as VideoIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import baseurl from '../Baseurl/baseurl';

export default function BusinessDirectoryForm() {
  const { id } = useParams(); // This is the member ID
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [previewMedia, setPreviewMedia] = useState({
    open: false,
    url: null,
    type: null
  });

  // Get business ID from route state
  const businessId = location.state?.businessId;

  // Form states
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    phone: '',
    email: '',
    address: '',
    source: '',
    city: '',
    state: '',
    zipCode: '',
    role: '',
    experience: '',
    staffSize: '',
  });

  // Profile photo states
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  // Media gallery states
  const [mediaUrls, setMediaUrls] = useState([]);

  // Fetch member and business data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch member data
        const memberResponse = await fetch(`${baseurl}/api/member/${id}`);
        const memberData = await memberResponse.json();
        
        if (!memberResponse.ok) {
          throw new Error(memberData.msg || 'Failed to fetch member');
        }

        setMemberData(memberData.data);
        
        // If we have a business ID, find the specific business profile
        if (businessId && memberData.data.BusinessProfiles) {
          const business = memberData.data.BusinessProfiles.find(
            bp => bp.id == businessId
          );
          
          if (business) {
            setBusinessProfile(business);
            setFormData({
              businessName: business.company_name || '',
              category: business.business_type || '',
              phone: business.contact || '',
              email: business.email || '',
              address: business.company_address || '',
              source: business.source || '',
              city: business.city || '',
              state: business.state || '',
              zipCode: business.zip_code || '',
              role: business.role || '',
              experience: business.experience || '',
              staffSize: business.staff_size || '',
            });
            
            if (business.business_profile_image) {
              setProfileImageUrl(`${baseurl}/${business.business_profile_image}`);
            }
            
            // Parse media gallery
            if (business.media_gallery) {
              const galleryItems = business.media_gallery.split(',')
                .filter(item => item.trim() !== '')
                .map(item => {
                  const path = item.trim();
                  const name = path.split('/').pop();
                  const url = `${baseurl}/${path}`;
                  const type = name.match(/\.(mp4|mov|avi|mkv|webm)$/i) ? 'video' : 
                              name.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? 'image' : 'file';
                  
                  return {
                    url,
                    name,
                    path,
                    type,
                    isExisting: true
                  };
                });
              
              setMediaUrls(galleryItems);
            }
          } else {
            throw new Error('Business profile not found');
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, businessId]);

  // Profile photo upload handlers
  const onProfilePhotoDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setProfileImageFile(file);
      const url = URL.createObjectURL(file);
      setProfileImageUrl(url);
    }
  }, []);

  const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    onDrop: onProfilePhotoDrop
  });

  // Media gallery upload handlers
  const onMediaDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => {
      const preview = URL.createObjectURL(file);
      const name = file.name;
      const type = file.type.startsWith('video/') ? 'video' : 
                  file.type.startsWith('image/') ? 'image' : 'file';
      
      return {
        file,
        preview,
        name,
        type,
        isExisting: false
      };
    });
    
    setMediaUrls(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps: getMediaRootProps, getInputProps: getMediaInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: onMediaDrop
  });

  const removeMedia = (index) => {
    setMediaUrls(prev => {
      const newUrls = [...prev];
      const removed = newUrls.splice(index, 1)[0];
      
      // Revoke object URL if it was a preview
      if (!removed.isExisting && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      
      return newUrls;
    });
  };

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Upload file to server
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${baseurl}/api/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        return data.filePath;
      } else {
        throw new Error(data.msg || 'File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Upload profile image if changed
      let profileImagePath = businessProfile?.business_profile_image || '';
      if (profileImageFile) {
        const uploadedPath = await uploadFile(profileImageFile);
        if (uploadedPath) {
          profileImagePath = uploadedPath;
        }
      }
      
      // Process media gallery
      const mediaPaths = [];
      
      // Upload new media files and collect paths
      for (const media of mediaUrls) {
        if (media.isExisting) {
          // Existing media - keep the path
          mediaPaths.push(media.path);
        } else {
          // New media - upload and get path
          const uploadedPath = await uploadFile(media.file);
          if (uploadedPath) {
            mediaPaths.push(uploadedPath);
          }
        }
      }
      
      const mediaGallery = mediaPaths.join(',');
      
      // Prepare data for API
      const updateData = {
        company_name: formData.businessName,
        business_type: formData.category,
        contact: formData.phone,
        email: formData.email,
        company_address: formData.address,
        source: formData.source,
        business_profile_image: profileImagePath,
        media_gallery: mediaGallery,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        role: formData.role,
        experience: formData.experience,
        staff_size: formData.staffSize,
      };

      // Update endpoint
      const endpoint = `${baseurl}/api/business-profile/update/${businessProfile.id}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      if (result.message === "Business profile updated successfully") {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/BusinessManagement');
        }, 2000);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (err) {
      setError(err.message || 'Error updating business');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean profile image URL
      if (profileImageUrl && profileImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profileImageUrl);
      }
      
      // Clean media URLs
      mediaUrls.forEach(media => {
        if (media.preview && media.preview.startsWith('blob:')) {
          URL.revokeObjectURL(media.preview);
        }
      });
    };
  }, [profileImageUrl, mediaUrls]);

  // Media Preview Dialog
  const MediaPreviewDialog = () => (
    <Dialog 
      open={previewMedia.open} 
      onClose={() => setPreviewMedia({ open: false, url: null, type: null })}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Media Preview</DialogTitle>
      <DialogContent sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '400px'
      }}>
        {previewMedia.type === 'image' ? (
          <img 
            src={previewMedia.url} 
            alt="Full size preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80vh',
              objectFit: 'contain'
            }}
          />
        ) : previewMedia.type === 'video' ? (
          <video 
            controls 
            autoPlay 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80vh' 
            }}
          >
            <source src={previewMedia.url} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <FileIcon sx={{ fontSize: 60, color: '#757575' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Unsupported Preview
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              This file type cannot be previewed.
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => window.open(previewMedia.url, '_blank')}
            >
              Download File
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setPreviewMedia({ open: false, url: null, type: null })}
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!businessProfile) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Business profile not found
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/BusinessManagement')}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Business updated successfully! Redirecting...
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Box sx={{ 
        backgroundColor: 'white', 
        borderRadius: 2, 
        p: { xs: 2, sm: 2.5, md: 3 },
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Left Column - Business Profile */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Business Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Edit business information
            </Typography>

            {/* Profile Image Upload */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Avatar
                  src={profileImageUrl}
                  sx={{ 
                    width: { xs: 60, sm: 80 }, 
                    height: { xs: 60, sm: 80 }, 
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e'
                  }}
                >
                  <PersonIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                </Avatar>
                <Box {...getProfileRootProps()}>
                  <input {...getProfileInputProps()} />
                  <Button 
                    variant="outlined" 
                    fullWidth={isMobile}
                    sx={{ 
                      textTransform: 'none',
                      color: '#1976d2',
                      borderColor: '#e0e0e0',
                      '&:hover': {
                        borderColor: '#1976d2'
                      }
                    }}
                  >
                    Upload Photos
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Business Name */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Business Name
              </Typography>
              <TextField
                fullWidth
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Enter business name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
            </Box>

            {/* Category */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Category
              </Typography>
              <TextField
                fullWidth
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Enter Category "
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
            </Box>

            {/* Location Fields */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  City
                </Typography>
                <TextField
                  fullWidth
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  State
                </Typography>
                <TextField
                  fullWidth
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Enter state"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Zip Code
                </Typography>
                <TextField
                  fullWidth
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  placeholder="Enter zip code"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Role */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Your Role
              </Typography>
              <TextField
                fullWidth
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="Enter your role in the business"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
            </Box>

            {/* Experience and Staff Size */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Experience
                </Typography>
                <TextField
                  fullWidth
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  placeholder="e.g., 5 years"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Staff Size
                </Typography>
                <TextField
                  fullWidth
                  value={formData.staffSize}
                  onChange={(e) => handleChange('staffSize', e.target.value)}
                  placeholder="e.g., 50 employees"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Member Assignment */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Member Assignment
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flexWrap: 'wrap'
              }}>
                {memberData && (
                  <Chip
                    avatar={
                      <Avatar sx={{ backgroundColor: '#4caf50', width: 24, height: 24 }}>
                        <Typography variant="caption" sx={{ color: 'white', fontSize: '10px' }}>
                          {memberData.first_name?.[0]}{memberData.last_name?.[0]}
                        </Typography>
                      </Avatar>
                    }
                    label={`${memberData.first_name} ${memberData.last_name}`}
                    sx={{ backgroundColor: '#f8f9fa' }}
                  />
                )}
                <IconButton sx={{ color: '#666' }}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Source */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Source
              </Typography>
              <TextField
                fullWidth
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                placeholder="Enter source"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Right Column - Contact Details */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              justifyContent: 'space-between', 
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Contact Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publicly visible information
                </Typography>
              </Box>
            </Box>

            {/* Contact Form */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Address
                </Typography>
                <TextField
                  fullWidth
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter business address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Media Gallery */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Media Gallery
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload photos and videos for your business
              </Typography>

              <Box 
                {...getMediaRootProps()}
                sx={{ 
                  border: '2px dashed #e0e0e0', 
                  borderRadius: 2, 
                  p: { xs: 2, sm: 4 }, 
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  mb: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <input {...getMediaInputProps()} />
                <IconButton sx={{ color: '#666', mb: 1 }}>
                  <AddIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Drop files here or click to upload
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Support: JPG, PNG, MP4 (Max 10MB each)
                </Typography>
              </Box>

              {/* Media Preview */}
              <Grid container spacing={1}>
                {mediaUrls.map((media, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Paper 
                      sx={{ 
                        height: { xs: 80, sm: 100 }, 
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }
                      }}
                      onClick={() => setPreviewMedia({
                        open: true,
                        url: media.url || media.preview,
                        type: media.type
                      })}
                    >
                      {media.type === 'image' ? (
                        <img 
                          src={media.url || media.preview} 
                          alt={`Media ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : media.type === 'video' ? (
                        <Box sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5'
                        }}>
                          <VideoIcon sx={{ fontSize: 32, color: '#757575' }} />
                          <Typography variant="caption" sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            px: 0.5,
                            borderRadius: 1
                          }}>
                            VIDEO
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#f5f5f5'
                        }}>
                          <FileIcon sx={{ fontSize: 32, color: '#757575' }} />
                        </Box>
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMedia(index);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.7)'
                          }
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        textAlign: 'center', 
                        mt: 0.5,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%'
                      }}
                    >
                      {media.name || `Media ${index + 1}`}
                    </Typography>
                  </Grid>
                ))}
                
                {mediaUrls.length < 10 && (
                  <Grid item xs={6} sm={4}>
                    <Paper 
                      sx={{ 
                        height: { xs: 80, sm: 100 }, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#e8e4ff',
                        cursor: 'pointer'
                      }}
                      {...getMediaRootProps()}
                    >
                      <AddIcon sx={{ color: '#9c27b0' }} />
                    </Paper>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      display: 'block', 
                      textAlign: 'center', 
                      mt: 0.5 
                    }}>
                      Add more
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button
                variant="outlined"
                fullWidth={isMobile}
                onClick={() => navigate('/admin/BusinessManagement')}
                sx={{
                  textTransform: 'none',
                  color: '#666',
                  borderColor: '#e0e0e0'
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth={isMobile}
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: '#2e7d32',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1b5e20'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Media Preview Dialog */}
      <MediaPreviewDialog />
    </Box>
  );
}