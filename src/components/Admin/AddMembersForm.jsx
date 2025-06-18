import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Avatar,
  Chip,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Delete,
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Business,
  Family,
  Close,
  ExpandMore,
  Add,
  Work
} from '@mui/icons-material';
import baseurl from '../Baseurl/baseurl';
import { useNavigate } from 'react-router-dom';

// Move FamilyModal outside the main component
const FamilyModal = ({ 
  open, 
  onClose, 
  familyData, 
  onFamilyDataChange, 
  onSubmit 
}) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    maxWidth="md"
    fullWidth
    disableEscapeKeyDown
    onBackdropClick={(e) => e.stopPropagation()}
  >
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" fontWeight={600}>
        Family Details
      </Typography>
      <IconButton onClick={onClose} color="error">
        <Close />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Father's Name"
            value={familyData.fatherName}
            onChange={(e) => onFamilyDataChange('fatherName', e.target.value)}
            placeholder="Robert Brown"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Father's Contact"
            value={familyData.fatherContact}
            onChange={(e) => onFamilyDataChange('fatherContact', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mother's Name"
            value={familyData.motherName}
            onChange={(e) => onFamilyDataChange('motherName', e.target.value)}
            placeholder="Jessica"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mother's Contact"
            value={familyData.motherContact}
            onChange={(e) => onFamilyDataChange('motherContact', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Spouse Name (if Married)"
            value={familyData.spouseName}
            onChange={(e) => onFamilyDataChange('spouseName', e.target.value)}
            placeholder="Maria John"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Spouse Contact"
            value={familyData.spouseContact}
            onChange={(e) => onFamilyDataChange('spouseContact', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="No. of Children"
            type="number"
            value={familyData.numberOfChildren}
            onChange={(e) => onFamilyDataChange('numberOfChildren', e.target.value)}
            placeholder="2"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Children Names"
            value={familyData.childrenNames.join(', ')}
            onChange={(e) => onFamilyDataChange('childrenNames', e.target.value)}
            placeholder="Chris John, Jane Doe"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Home Address"
            multiline
            rows={2}
            value={familyData.homeAddress}
            onChange={(e) => onFamilyDataChange('homeAddress', e.target.value)}
            placeholder="123, ABC Road, Chennai - 600001"
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          color="success" 
          onClick={onSubmit}
          sx={{ px: 4 }}
        >
          Continue
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

// Add BusinessProfileModal component outside the main component
const BusinessProfileModal = ({
  open,
  onClose,
  businessData,
  onBusinessDataChange,
  onSubmit,
  onImageChange,
  onGalleryChange,
  showAddAnother
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    disableEscapeKeyDown
    onBackdropClick={(e) => e.stopPropagation()}
  >
    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" fontWeight={600}>
        Business Profile Details
      </Typography>
      <IconButton onClick={onClose} color="error">
        <Close />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Business Profile Image */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Business Profile Image
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'grey.200',
                  '& img': { objectFit: 'cover' }
                }}
                src={businessData.businessProfileImage ? URL.createObjectURL(businessData.businessProfileImage) : null}
              >
                <Work sx={{ fontSize: 40, color: 'grey.500' }} />
              </Avatar>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  component="label"
                  sx={{ mb: 1 }}
                >
                  Upload Image
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={(e) => onImageChange(e.target.files[0])}
                  />
                </Button>
                <Typography variant="caption" display="block" color="text.secondary">
                  Recommended size: 500x500px
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Business Details */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Company Name"
            value={businessData.companyName}
            onChange={(e) => onBusinessDataChange('companyName', e.target.value)}
            placeholder="Enter company name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Business Type</InputLabel>
            <Select
              value={businessData.businessType}
              onChange={(e) => onBusinessDataChange('businessType', e.target.value)}
              label="Business Type"
            >
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Retail">Retail</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
              <MenuItem value="Services">Services</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              value={businessData.role}
              onChange={(e) => onBusinessDataChange('role', e.target.value)}
              label="Role"
            >
              <MenuItem value="Owner">Owner</MenuItem>
              <MenuItem value="Partner">Partner</MenuItem>
              <MenuItem value="Director">Director</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Experience (Years)"
            type="number"
            value={businessData.experience}
            onChange={(e) => onBusinessDataChange('experience', e.target.value)}
            placeholder="Enter years of experience"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Staff Size"
            type="number"
            value={businessData.staffSize}
            onChange={(e) => onBusinessDataChange('staffSize', e.target.value)}
            placeholder="Enter number of employees"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Business Email"
            type="email"
            value={businessData.email}
            onChange={(e) => onBusinessDataChange('email', e.target.value)}
            placeholder="business@company.com"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Business Contact"
            value={businessData.contact}
            onChange={(e) => onBusinessDataChange('contact', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Company Address"
            multiline
            rows={2}
            value={businessData.companyAddress}
            onChange={(e) => onBusinessDataChange('companyAddress', e.target.value)}
            placeholder="Enter company address"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="City"
            value={businessData.city}
            onChange={(e) => onBusinessDataChange('city', e.target.value)}
            placeholder="Enter city"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="State"
            value={businessData.state}
            onChange={(e) => onBusinessDataChange('state', e.target.value)}
            placeholder="Enter state"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="ZIP Code"
            value={businessData.zipCode}
            onChange={(e) => onBusinessDataChange('zipCode', e.target.value)}
            placeholder="Enter ZIP code"
          />
        </Grid>

        {/* Media Gallery */}
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Media Gallery
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              component="label"
              sx={{ mb: 2 }}
            >
              Upload Media
              <input 
                type="file" 
                hidden 
                multiple
                accept="image/*,video/*"
                onChange={(e) => onGalleryChange(Array.from(e.target.files))}
              />
            </Button>
            {businessData.mediaGallery && businessData.mediaGallery.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {businessData.mediaGallery.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Gallery ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.100'
                        }}
                      >
                        <Typography variant="caption">Video</Typography>
                      </Box>
                    )}
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                      onClick={() => {
                        const newGallery = [...businessData.mediaGallery];
                        newGallery.splice(index, 1);
                        onBusinessDataChange('mediaGallery', newGallery);
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={onSubmit}
          sx={{ px: 4 }}
        >
          {showAddAnother ? 'Add & Add Another' : 'Add Business Profile'}
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

const AddNewMemberForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [familyAdded, setFamilyAdded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    firstName: '',
    lastName: '',
    email: 'john.smith@example.com',
    password: '',
    phone: '+1 (555) 123-4567',
    phoneVisibility: true,
    dateOfBirth: '',
    gender: '',
    aadharNumber: '',
    bloodGroup: '',
    maritalStatus: '',
    joinDate: '2025-06-05',
    streetAddress: '123 Main Street',
    city: 'City name',
    state: 'State',
    zipCode: '12345',
    
    // Step 2 - Contact
    workPhone: '+1 (555) 987-6543',
    extension: 'Ext.',
    mobilePhone: '+1 (555) 123-4567',
    preferredContact: 'Email',
    secondaryEmail: 'secondary@example.com',
    emergencyContact: 'Contact name',
    emergencyPhone: 'Emergency number',
    personalWebsite: 'https://www.example.com',
    linkedinProfile: 'https://linkedin.com/in/username',
    socialMedia: [],
    subscribeNewsletter: true,
    smsNotifications: true,
    whatsappNotifications: true,
    eventNotifications: false,
    marketingCommunications: false,
    bestTimeToContact: 'Morning',
    timezone: 'EST (UTC-5)',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    
    // Step 3 - Access & Links
    accessLevel: 'Basic',
    autoApprove: true,
    businessProfile: '',
    familyProfile: '',
    referralSource: 'Existing Member',
    referredBy: '',
    additionalNotes: ''
  });

  const [familyData, setFamilyData] = useState({
    fatherName: '',
    fatherContact: '',
    motherName: '',
    motherContact: '',
    spouseName: '',
    spouseContact: '',
    numberOfChildren: '',
    childrenNames: [],
    homeAddress: ''
  });

  // Update business state to handle multiple profiles
  const [businessModalOpen, setBusinessModalOpen] = useState(false);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [businessData, setBusinessData] = useState({
    companyName: '',
    businessType: '',
    role: '',
    experience: '',
    staffSize: '',
    email: '',
    contact: '',
    companyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    businessProfileImage: null,
    mediaGallery: []
  });

  // Add profile image state
  const [profileImage, setProfileImage] = useState(null);

  // Add profile image handler
  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
    }
  };

  const steps = ['Basic Info', 'Contact', 'Access & Links'];

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFamilyInputChange = (field, value) => {
    if (field === 'childrenNames') {
      // Convert comma-separated string to array when storing
      const namesArray = value.split(',').map(name => name.trim()).filter(name => name);
      setFamilyData(prev => ({ ...prev, [field]: namesArray }));
    } else {
      setFamilyData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create FormData object for file upload
      const formDataToSend = new FormData();

      // Format the data according to backend expectations
      const memberData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        dob: formData.dateOfBirth,
        gender: formData.gender,
        join_date: formData.joinDate,
        aadhar_no: formData.aadharNumber,
        blood_group: formData.bloodGroup,
        contact_no: formData.phone,
        alternate_contact_no: formData.mobilePhone,
        marital_status: formData.maritalStatus,
        address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        work_phone: formData.workPhone,
        extension: formData.extension,
        mobile_no: formData.mobilePhone,
        preferred_contact: formData.preferredContact,
        secondary_email: formData.secondaryEmail,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        personal_website: formData.personalWebsite,
        linkedin_profile: formData.linkedinProfile,
        facebook: formData.socialMedia.includes('Facebook') ? formData.facebookUrl : null,
        instagram: formData.socialMedia.includes('Instagram') ? formData.instagramUrl : null,
        twitter: formData.socialMedia.includes('Twitter') ? formData.twitterUrl : null,
        youtube: formData.socialMedia.includes('YouTube') ? formData.youtubeUrl : null,
        best_time_to_contact: formData.bestTimeToContact,
        referral_name: formData.referredBy,
        referral_code: formData.referralCode,
        status: formData.autoApprove ? 'Approved' : 'Pending',
        access_level: formData.accessLevel,
      };

      // Add member data to FormData
      Object.keys(memberData).forEach(key => {
        if (memberData[key] !== null && memberData[key] !== undefined) {
          formDataToSend.append(key, memberData[key]);
        }
      });

      // Handle profile image if exists
      if (profileImage) {
        formDataToSend.append('profile_image', profileImage);
      }

      // Handle business profiles with their images and gallery
      const businessProfilesToSend = businessProfiles.map((profile, index) => {
        // Create a base profile object without files
        const baseProfile = {
          company_name: profile.companyName,
          business_type: profile.businessType,
          role: profile.role,
          company_address: profile.companyAddress,
          city: profile.city,
          state: profile.state,
          zip_code: profile.zipCode,
          experience: profile.experience,
          staff_size: profile.staffSize,
          contact: profile.contact,
          email: profile.email,
          source: 'Direct'
        };

        // Add business profile image if exists
        if (profile.businessProfileImage) {
          formDataToSend.append(`business_profile_image_${index}`, profile.businessProfileImage);
          baseProfile.business_profile_image = `business_profile_image_${index}`;
        }

        // Add media gallery files if they exist
        if (profile.mediaGallery && profile.mediaGallery.length > 0) {
          const galleryReferences = [];
          profile.mediaGallery.forEach((file, fileIndex) => {
            formDataToSend.append(`media_gallery_${fileIndex}`, file);
            galleryReferences.push(`media_gallery_${fileIndex}`);
          });
          baseProfile.media_gallery = galleryReferences;
        }

        return baseProfile;
      });

      formDataToSend.append('business_profiles', JSON.stringify(businessProfilesToSend));

      // Handle family details if added
      if (familyAdded) {
        let familyDetails = {
          father_name: familyData.fatherName,
          father_contact: familyData.fatherContact,
          mother_name: familyData.motherName,
          mother_contact: familyData.motherContact,
          address: familyData.homeAddress,
        };

        // Add spouse details if member is married
        if (formData.maritalStatus?.toLowerCase().trim() === 'married') {
          familyDetails = {
            ...familyDetails,
            spouse_name: familyData.spouseName,
            spouse_contact: familyData.spouseContact,
            number_of_children: parseInt(familyData.numberOfChildren)
          };

          // Add children details if they exist and array length matches number of children
          if (familyData.numberOfChildren > 0 && 
              Array.isArray(familyData.childrenNames) && 
              familyData.childrenNames.length === parseInt(familyData.numberOfChildren)) {
            familyDetails = {
              ...familyDetails,
              children_names: JSON.stringify(familyData.childrenNames) // Send as JSON stringified array
            };
          }
        }

        // Add family details to FormData
        formDataToSend.append('family_details', JSON.stringify(familyDetails));
      }

      // Make API call
      const memberResponse = await fetch(`${baseurl}/api/member/register`, {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await memberResponse.json();

      if (!memberResponse.ok) {
        throw new Error(responseData.msg || 'Failed to register member');
      }

      setSuccess(true);
      console.log('Member registered successfully:', responseData);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          phoneVisibility: true,
          dateOfBirth: '',
          gender: '',
          aadharNumber: '',
          bloodGroup: '',
          maritalStatus: '',
          joinDate: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          workPhone: '',
          extension: '',
          mobilePhone: '',
          preferredContact: 'Email',
          secondaryEmail: '',
          emergencyContact: '',
          emergencyPhone: '',
          personalWebsite: '',
          linkedinProfile: '',
          socialMedia: [],
          subscribeNewsletter: true,
          smsNotifications: true,
          whatsappNotifications: true,
          eventNotifications: false,
          marketingCommunications: false,
          bestTimeToContact: 'Morning',
          timezone: 'EST (UTC-5)',
          accessLevel: 'Basic',
          autoApprove: true,
          businessProfile: '',
          familyProfile: '',
          referralSource: 'Existing Member',
          referredBy: '',
          additionalNotes: '',
          facebookUrl: '',
          twitterUrl: '',
          instagramUrl: '',
          youtubeUrl: '',
        });
        setFamilyData({
          fatherName: '',
          fatherContact: '',
          motherName: '',
          motherContact: '',
          spouseName: '',
          spouseContact: '',
          numberOfChildren: '',
          childrenNames: [],
          homeAddress: ''
        });
        setFamilyAdded(false);
        setActiveStep(0);
        setProfileImage(null);
        setBusinessProfiles([]);
      }, 2000);

    } catch (err) {
      setError(err.message || 'An error occurred while registering the member');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialMediaToggle = (platform) => {
    setFormData(prev => {
      const newSocialMedia = prev.socialMedia.includes(platform)
        ? prev.socialMedia.filter(p => p !== platform)
        : [...prev.socialMedia, platform];
      
      // Reset URL when platform is removed
      const urlField = `${platform.toLowerCase()}Url`;
      return {
        ...prev,
        socialMedia: newSocialMedia,
        [urlField]: prev.socialMedia.includes(platform) ? '' : prev[urlField]
      };
    });
  };

  const handleSocialMediaUrlChange = (platform) => (event) => {
    const urlField = `${platform.toLowerCase()}Url`;
    setFormData(prev => ({
      ...prev,
      [urlField]: event.target.value
    }));
  };

  const handleFamilySubmit = () => {
    console.log('Family data added:', familyData);
    setFamilyModalOpen(false);
    setFamilyAdded(true);
  };

  const handleRemoveFamilyProfile = () => {
    setFamilyAdded(false);
    setFamilyData({
      fatherName: '',
      fatherContact: '',
      motherName: '',
      motherContact: '',
      spouseName: '',
      spouseContact: '',
      numberOfChildren: '',
      childrenNames: [],
      homeAddress: ''
    });
  };

  // Update business handlers
  const handleBusinessSubmit = () => {
    // Add the current business data to the profiles array
    setBusinessProfiles(prev => [...prev, { ...businessData }]);
    
    // Reset the form data for next entry
    setBusinessData({
      companyName: '',
      businessType: '',
      role: '',
      experience: '',
      staffSize: '',
      email: '',
      contact: '',
      companyAddress: '',
      city: '',
      state: '',
      zipCode: '',
      businessProfileImage: null,
      mediaGallery: []
    });
    
    // Keep modal open for next entry
    // setBusinessModalOpen(false); // Commented out to keep modal open
  };

  const handleRemoveBusinessProfile = (index) => {
    setBusinessProfiles(prev => prev.filter((_, i) => i !== index));
  };

  // Add back the business handlers
  const handleBusinessDataChange = (field, value) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessImageChange = (file) => {
    setBusinessData(prev => ({ ...prev, businessProfileImage: file }));
  };

  const handleBusinessGalleryChange = (files) => {
    setBusinessData(prev => ({ 
      ...prev, 
      mediaGallery: [...(prev.mediaGallery || []), ...files]
    }));
  };

  // Step 1 - Basic Info
  const renderBasicInfo = () => (
    <Box>
      {/* Profile Picture Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Profile Picture
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'grey.300',
              '& img': { objectFit: 'cover' }
            }}
            src={profileImage ? URL.createObjectURL(profileImage) : null}
          >
            <Business sx={{ fontSize: 40 }} />
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              component="label"
            >
              Upload Photo
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </Button>
            {profileImage && (
              <Button 
                variant="text" 
                color="error" 
                size="small"
                onClick={() => setProfileImage(null)}
              >
              Remove
            </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Basic Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Basic Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              required
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              placeholder="Enter first name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              required
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              placeholder="Enter last name"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'error.main', fontSize: 14 }}>
                      S
                    </Avatar>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              required
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'success.main',
                    borderWidth: 2
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Create Password"
              required
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              helperText="Password must be at least 8 characters long and include a number and special character"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'success.main',
                    borderWidth: 2
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              required
              value={formData.phone}
              onChange={handleInputChange('phone')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Phone Visibility
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.phoneVisibility}
                      onChange={handleInputChange('phoneVisibility')}
                      color="success"
                    />
                  }
                  label="Public"
                />
                <Typography variant="caption" color="text.secondary">
                  Visible to all users
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange('dateOfBirth')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={handleInputChange('gender')}
                label="Gender"
              >
                <MenuItem value="">Select gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleInputChange('aadharNumber')}
              placeholder="XXXX XXXX XXXX"
              inputProps={{ maxLength: 12 }}
              helperText="12-digit Aadhar number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Blood Group</InputLabel>
              <Select
                value={formData.bloodGroup}
                onChange={handleInputChange('bloodGroup')}
                label="Blood Group"
              >
                <MenuItem value="">Select blood group</MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Marital Status</InputLabel>
              <Select
                value={formData.maritalStatus}
                onChange={handleInputChange('maritalStatus')}
                label="Marital Status"
              >
                <MenuItem value="">Select status</MenuItem>
                <MenuItem value="married">Married</MenuItem>
                <MenuItem value="unmarried">Unmarried</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Join Date"
              required
              type="date"
              value={formData.joinDate}
              onChange={handleInputChange('joinDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Address Information */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Address Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              value={formData.streetAddress}
              onChange={handleInputChange('streetAddress')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={handleInputChange('city')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={handleInputChange('state')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={formData.zipCode}
              onChange={handleInputChange('zipCode')}
            />
          </Grid>
        </Grid>
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">* Required fields</Typography>
      </Alert>
    </Box>
  );

  // Step 2 - Contact
  const renderContact = () => (
    <Box>
      {/* Primary Contact Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Primary Contact Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Work Phone"
              value={formData.workPhone}
              onChange={handleInputChange('workPhone')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'success.main',
                    borderWidth: 2
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Extension"
              value={formData.extension}
              onChange={handleInputChange('extension')}
              placeholder="Ext."
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Mobile Phone"
              value={formData.mobilePhone}
              onChange={handleInputChange('mobilePhone')}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Preferred Contact</InputLabel>
              <Select
                value={formData.preferredContact}
                onChange={handleInputChange('preferredContact')}
                label="Preferred Contact"
              >
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="Text">Text</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Secondary Email"
              value={formData.secondaryEmail}
              onChange={handleInputChange('secondaryEmail')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Emergency Contact"
              value={formData.emergencyContact}
              onChange={handleInputChange('emergencyContact')}
              placeholder="Contact name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Emergency Phone"
              value={formData.emergencyPhone}
              onChange={handleInputChange('emergencyPhone')}
              placeholder="Emergency number"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Social Media & Online Presence */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Social Media & Online Presence
        </Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Personal Website"
              value={formData.personalWebsite}
              onChange={handleInputChange('personalWebsite')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn Profile"
              value={formData.linkedinProfile}
              onChange={handleInputChange('linkedinProfile')}
            />
          </Grid>
        </Grid>
        
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Social Media Platforms
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          {[
            { platform: 'Facebook', icon: <Facebook />, color: '#1877F2' },
            { platform: 'Twitter', icon: <Twitter />, color: '#1DA1F2' },
            { platform: 'Instagram', icon: <Instagram />, color: '#E4405F' },
            { platform: 'YouTube', icon: <YouTube />, color: '#FF0000' }
          ].map(({ platform, icon, color }) => (
            <Button
              key={platform}
              variant={formData.socialMedia.includes(platform) ? "contained" : "outlined"}
              startIcon={icon}
              onClick={() => handleSocialMediaToggle(platform)}
              sx={{
                borderColor: color,
                color: formData.socialMedia.includes(platform) ? 'white' : color,
                backgroundColor: formData.socialMedia.includes(platform) ? color : 'transparent',
                '&:hover': {
                  backgroundColor: formData.socialMedia.includes(platform) ? color : `${color}15`
                }
              }}
            >
              {platform}
            </Button>
          ))}
        </Box>

        {/* Social Media URL Fields */}
        <Grid container spacing={2}>
          {formData.socialMedia.includes('Facebook') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Facebook Profile URL"
                value={formData.facebookUrl}
                onChange={handleSocialMediaUrlChange('Facebook')}
                placeholder="https://facebook.com/yourprofile"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Facebook sx={{ color: '#1877F2' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {formData.socialMedia.includes('Twitter') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Twitter Profile URL"
                value={formData.twitterUrl}
                onChange={handleSocialMediaUrlChange('Twitter')}
                placeholder="https://twitter.com/yourprofile"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Twitter sx={{ color: '#1DA1F2' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {formData.socialMedia.includes('Instagram') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram Profile URL"
                value={formData.instagramUrl}
                onChange={handleSocialMediaUrlChange('Instagram')}
                placeholder="https://instagram.com/yourprofile"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Instagram sx={{ color: '#E4405F' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
          {formData.socialMedia.includes('YouTube') && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="YouTube Channel URL"
                value={formData.youtubeUrl}
                onChange={handleSocialMediaUrlChange('YouTube')}
                placeholder="https://youtube.com/c/yourchannel"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <YouTube sx={{ color: '#FF0000' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Communication Preferences */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Communication Preferences
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.subscribeNewsletter}
                  onChange={handleInputChange('subscribeNewsletter')}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Subscribe to Newsletter
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive monthly updates and announcements
                  </Typography>
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.smsNotifications}
                  onChange={handleInputChange('smsNotifications')}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    SMS Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive text messages for urgent updates
                  </Typography>
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.whatsappNotifications}
                  onChange={handleInputChange('whatsappNotifications')}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    WhatsApp Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Receive text messages for urgent updates
                  </Typography>
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.marketingCommunications}
                  onChange={handleInputChange('marketingCommunications')}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Marketing Communications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Promotional offers and business opportunities
                  </Typography>
                </Box>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.eventNotifications}
                  onChange={handleInputChange('eventNotifications')}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Event Notifications
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Get notified about upcoming events and activities
                  </Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Box>

      {/* Best Time to Contact */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Best Time to Contact
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            value={formData.bestTimeToContact}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setFormData(prev => ({ ...prev, bestTimeToContact: newValue }));
              }
            }}
            sx={{
              '& .MuiToggleButton-root.Mui-selected': {
                backgroundColor: 'success.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'success.dark'
                }
              }
            }}
          >
            <ToggleButton value="Morning">Morning</ToggleButton>
            <ToggleButton value="Afternoon">Afternoon</ToggleButton>
            <ToggleButton value="Evening">Evening</ToggleButton>
            <ToggleButton value="Weekend">Weekend</ToggleButton>
          </ToggleButtonGroup>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Timezone</InputLabel>
            <Select
              value={formData.timezone}
              onChange={handleInputChange('timezone')}
              label="Timezone"
            >
              <MenuItem value="EST (UTC-5)">EST (UTC-5)</MenuItem>
              <MenuItem value="CST (UTC-6)">CST (UTC-6)</MenuItem>
              <MenuItem value="MST (UTC-7)">MST (UTC-7)</MenuItem>
              <MenuItem value="PST (UTC-8)">PST (UTC-8)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );

  // Step 3 - Access & Links
  const renderAccessLinks = () => (
    <Box>
      {/* Access Level Management */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Access Level Management
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={formData.accessLevel}
            onChange={handleInputChange('accessLevel')}
          >
            <Grid container spacing={2}>
              {[
                {
                  value: 'Basic',
                  label: 'Basic',
                  description: 'Basic directory access',
                  features: ['View public profiles', 'Contact other members'],
                  color: 'success.light'
                },
                {
                  value: 'Advanced',
                  label: 'Advanced',
                  description: 'Enhanced permissions',
                  features: ['Manage member content', 'Review applications'],
                  color: 'success.main'
                }
              ].map((option) => (
                <Grid item xs={12} sm={4} key={option.value}>
                  <Paper
                    sx={{
                      p: 2,
                      border: formData.accessLevel === option.value ? 2 : 1,
                      borderColor: formData.accessLevel === option.value ? option.color : 'grey.300',
                      backgroundColor: formData.accessLevel === option.value ? `${option.color}08` : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, accessLevel: option.value }))}
                  >
                    <FormControlLabel
                      value={option.value}
                      control={<Radio color="success" />}
                      label={
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {option.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {option.description}
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, m: 0 }}>
                            {option.features.map((feature, idx) => (
                              <Typography component="li" variant="caption" key={idx} color="text.secondary">
                                {feature}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      }
                      sx={{ alignItems: 'flex-start', width: '100%' }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Application Status */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Application Status
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.autoApprove}
                onChange={handleInputChange('autoApprove')}
                color="success"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Auto-approve this member
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Member will be immediately active without manual review
                </Typography>
              </Box>
            }
          />
          <Box sx={{ pl: 4, mt: 1 }}>
            <Typography variant="body2" fontWeight={500} color="text.secondary">
              Require manual review
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin approval needed before activation
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Link Member Profile */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Link Member Profile
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
              Business Profiles
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button 
                variant="contained" 
                color="success"
                
                onClick={() => setBusinessModalOpen(true)}
                fullWidth
                startIcon={<Add />}
              >
                Add Business Profile
              </Button>
            </Box>
            
            {/* Show all added business profiles */}
            {businessProfiles.map((profile, index) => (
              <Alert 
                key={index}
                severity="success" 
                sx={{ mt: 2 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => handleRemoveBusinessProfile(index)}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business color="success" />
                  <Box>
                    <Typography>
                      {profile.companyName} - {profile.role}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                      {profile.businessType} • {profile.staffSize} employees
                  </Typography>
                </Box>
              </Box>
              </Alert>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
              Family Profiles
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => setFamilyModalOpen(true)}
                fullWidth
              >
                Create family members
              </Button>
            </Box>
            
            {/* Show Family Profile Added notification */}
            {familyAdded && (
              <Alert 
                severity="success" 
                sx={{ mt: 2 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleRemoveFamilyProfile}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                Family Profile Added
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Search existing families"
              />
              <Button variant="outlined">
                Link Existing
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Referral Source */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Referral Source
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>How did they find us?</InputLabel>
              <Select
                value={formData.referralSource}
                onChange={handleInputChange('referralSource')}
                label="How did they find us?"
              >
                <MenuItem value="Existing Member">Existing Member</MenuItem>
                <MenuItem value="Social Media">Social Media</MenuItem>
                <MenuItem value="Website">Website</MenuItem>
                <MenuItem value="Referral">Referral</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Referred by"
              value={formData.referredBy}
              onChange={handleInputChange('referredBy')}
              placeholder="Search member name..."
            />
          </Grid>
        </Grid>
      </Box>

      {/* Additional Notes */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Additional Notes
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={formData.additionalNotes}
          onChange={handleInputChange('additionalNotes')}
          placeholder="Add any additional notes or special instructions for this member..."
        />
      </Box>
    </Box>
  );
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('MemberManagement')}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Add New Member
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setSuccess(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Member and family details registered successfully!
        </Alert>
      )}

      {/* Stepper */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': {
                        color: 'success.main',
                      },
                      '&.Mui-completed': {
                        color: 'success.main',
                      },
                    }
                  }}
                >
                  <Typography
                    variant="body2"
                    color={index <= activeStep ? 'success.main' : 'text.secondary'}
                    fontWeight={index <= activeStep ? 600 : 400}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {activeStep === 0 && renderBasicInfo()}
          {activeStep === 1 && renderContact()}
          {activeStep === 2 && renderAccessLinks()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Step {activeStep + 1} of {steps.length}
              {activeStep === 2 && ' - Final Review'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} disabled={isSubmitting}>
                  Previous
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" color="success" onClick={handleNext} disabled={isSubmitting}>
                  Next Step
                </Button>
              ) : (
                <>
                  <Button variant="outlined" disabled={isSubmitting}>
                    Skip Step
                  </Button>
                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isSubmitting ? 'Creating Member...' : 'Create Member'}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Family Modal */}
      <FamilyModal 
        open={familyModalOpen}
        onClose={() => setFamilyModalOpen(false)}
        familyData={familyData}
        onFamilyDataChange={handleFamilyInputChange}
        onSubmit={handleFamilySubmit}
      />

      {/* BusinessProfileModal */}
      <BusinessProfileModal
        open={businessModalOpen}
        onClose={() => {
          setBusinessModalOpen(false);
          // Reset form when closing
          setBusinessData({
            companyName: '',
            businessType: '',
            role: '',
            experience: '',
            staffSize: '',
            email: '',
            contact: '',
            companyAddress: '',
            city: '',
            state: '',
            zipCode: '',
            businessProfileImage: null,
            mediaGallery: []
          });
        }}
        businessData={businessData}
        onBusinessDataChange={handleBusinessDataChange}
        onImageChange={handleBusinessImageChange}
        onGalleryChange={handleBusinessGalleryChange}
        onSubmit={handleBusinessSubmit}
        showAddAnother={true}
      />
    </Container>
  );
};

export default AddNewMemberForm;