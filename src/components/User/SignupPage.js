import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Calendar, Upload, ArrowLeft, ArrowRight, Plus, Check, LogIn } from 'lucide-react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import baseurl from '../Baseurl/baseurl';

const SignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('forward');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    genderOther: '', // For custom gender input
    contact_no: '',
    marital_status: '',
    kootam: '', // New field
    kootamOther: '', // For custom kootam input
    kovil: '', // New field
    kovilOther: '', // For custom kovil input
    profile_image: null,
    // Address Information
    address: '',
    city: '',
    state: '',
    zip_code: '',
    // Referral Information
    has_referral: false,
    referral_name: '',
    referral_code: '',
    // Business Profiles
    businessProfiles: [{
      business_type: '',
      category_id: '',
      company_name: '',
      business_registration_type: '',
      business_registration_type_other: '', // For custom business registration type
      about: '',
      company_address: '',
      city: '',
      state: '',
      zip_code: '',
      business_starting_year: '',
      email: '',
      designation: '',
      salary: '',
      location: '',
      experience: '',
      business_profile_image: null,
      media_gallery: [],
      contact_no: ''
    }],
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

  const steps = [
    { number: 1, name: 'Personal', active: currentStep >= 1 },
    { number: 2, name: 'Address', active: currentStep >= 2 },
    { number: 3, name: 'Business', active: currentStep >= 3 },
    { number: 4, name: 'Family', active: currentStep >= 4 },
    { number: 5, name: 'Complete', active: currentStep >= 5 }
  ];

  // Animation handler
  const handleStepChange = (newStep, dir = 'forward') => {
    if (newStep === currentStep) return;
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrentStep(newStep);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 150);
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!formData.first_name) errors.first_name = "Full name is required";
      if (!formData.email) errors.email = "Email is required";
      if (!formData.password) errors.password = "Password is required";
      if (!formData.contact_no) errors.contact_no = "Contact number is required";
    }
    if (step === 2) {
      if (!formData.address) errors.address = "Address is required";
      if (!formData.city) errors.city = "City is required";
      if (!formData.state) errors.state = "State is required";
      if (!formData.zip_code) errors.zip_code = "Pincode is required";
    }
    if (step === 3) {
      formData.businessProfiles.forEach((profile, index) => {
        if (!profile.business_type) errors[`business_type_${index}`] = "Business type is required";
        if (profile.business_type === "salary") {
          if (!profile.company_name) errors[`company_name_${index}`] = "Company name is required";
          if (!profile.email) errors[`email_${index}`] = "Email is required";
          if (!profile.designation) errors[`designation_${index}`] = "Designation is required";
          if (!profile.salary) errors[`salary_${index}`] = "Salary is required";
          if (!profile.experience) errors[`experience_${index}`] = "Experience is required";
          if (!profile.location) errors[`location_${index}`] = "Location is required";
        }
        if (profile.business_type === "self-employed" || profile.business_type === "business") {
          if (!profile.company_name) errors[`company_name_${index}`] = "Company name is required";
          if (!profile.about) errors[`about_${index}`] = "About is required";
          if (!profile.email) errors[`email_${index}`] = "Email is required";
          if (!profile.business_starting_year) errors[`business_starting_year_${index}`] = "Starting year is required";
          if (!profile.contact_no) errors[`contact_no_${index}`] = "Contact number is required";
        }
      });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAllSteps = () => {
    const errors = {};
    // Validate step 1 - Personal Information
    if (!formData.first_name) errors.first_name = "Full name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.contact_no) errors.contact_no = "Contact number is required";
    // Validate step 2 - Address Information
    if (!formData.address) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.zip_code) errors.zip_code = "Pincode is required";
    // Validate step 3 - Business Profiles
    formData.businessProfiles.forEach((profile, index) => {
      if (!profile.business_type) errors[`business_type_${index}`] = "Business type is required";
      if (profile.business_type === "salary") {
        if (!profile.company_name) errors[`company_name_${index}`] = "Company name is required";
        if (!profile.email) errors[`email_${index}`] = "Email is required";
        if (!profile.designation) errors[`designation_${index}`] = "Designation is required";
        if (!profile.salary) errors[`salary_${index}`] = "Salary is required";
        if (!profile.experience) errors[`experience_${index}`] = "Experience is required";
        if (!profile.location) errors[`location_${index}`] = "Location is required";
      }
      if (profile.business_type === "self-employed" || profile.business_type === "business") {
        if (!profile.company_name) errors[`company_name_${index}`] = "Company name is required";
        if (!profile.about) errors[`about_${index}`] = "About is required";
        if (!profile.email) errors[`email_${index}`] = "Email is required";
        if (!profile.business_starting_year) errors[`business_starting_year_${index}`] = "Starting year is required";
        if (!profile.contact_no) errors[`contact_no_${index}`] = "Contact number is required";
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        handleStepChange(currentStep + 1, 'forward');
      } else if (currentStep === 4) {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1, 'backward');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBusinessProfileChange = (index, field, value) => {
    setFormData(prev => {
      const updatedProfiles = [...prev.businessProfiles];
      updatedProfiles[index][field] = value;
      return {
        ...prev,
        businessProfiles: updatedProfiles
      };
    });
  };

  const addBusinessProfile = () => {
    setFormData(prev => ({
      ...prev,
      businessProfiles: [
        ...prev.businessProfiles,
        {
          business_type: '',
          category_id: '',
          company_name: '',
          business_registration_type: '',
          business_registration_type_other: '',
          about: '',
          company_address: '',
          city: '',
          state: '',
          zip_code: '',
          business_starting_year: '',
          email: '',
          designation: '',
          salary: '',
          location: '',
          experience: '',
          business_profile_image: null,
          media_gallery: [],
          contact_no: ''
        }
      ]
    }));
  };

  const handleBusinessFileUpload = (index, field, file) => {
    setFormData(prev => {
      const updatedProfiles = [...prev.businessProfiles];
      if (field === 'media_gallery') {
        // Handle multiple files for media gallery
        const filesArray = Array.from(file);
        updatedProfiles[index][field] = [...updatedProfiles[index][field], ...filesArray];
      } else {
        updatedProfiles[index][field] = file;
      }
      return {
        ...prev,
        businessProfiles: updatedProfiles
      };
    });
  };

  const handleSubmit = async () => {
    // Validate all steps before submission
    if (!validateAllSteps()) return;
    setLoading(true);
    setError(null);
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Append personal information
      submitData.append('first_name', formData.first_name || '');
      submitData.append('email', formData.email || '');
      submitData.append('password', formData.password || '');
      submitData.append('dob', formData.dob || '');
      submitData.append('gender', formData.gender || '');
      submitData.append('genderOther', formData.genderOther || '');
      submitData.append('contact_no', formData.contact_no || '');
      submitData.append('marital_status', formData.marital_status || '');
      submitData.append('kootam', formData.kootam || '');
      submitData.append('kootamOther', formData.kootamOther || '');
      submitData.append('kovil', formData.kovil || '');
      submitData.append('kovilOther', formData.kovilOther || '');
      
      if (formData.profile_image) {
        submitData.append('profile_image', formData.profile_image);
      }
      
      // Append address information
      submitData.append('address', formData.address || '');
      submitData.append('city', formData.city || '');
      submitData.append('state', formData.state || '');
      submitData.append('zip_code', formData.zip_code || '');
      
      // Append referral information - convert boolean to string
      submitData.append('has_referral', formData.has_referral ? 'true' : 'false');
      if (formData.has_referral) {
        submitData.append('referral_name', formData.referral_name || '');
        submitData.append('referral_code', formData.referral_code || '');
      }
      
      // Process business profiles - send as JSON string
      const businessProfilesForBackend = formData.businessProfiles.map((profile, index) => {
        // Create a copy of the profile without the file objects
        const { business_profile_image, media_gallery, ...profileData } = profile;
        return profileData;
      });
      
      submitData.append('business_profiles', JSON.stringify(businessProfilesForBackend));
      
      // Handle business profile images and media gallery files separately
      formData.businessProfiles.forEach((profile, index) => {
        if (profile.business_profile_image) {
          submitData.append(`business_profile_image_${index}`, profile.business_profile_image);
        }
        // Handle media gallery files
        if (profile.media_gallery && profile.media_gallery.length > 0) {
          profile.media_gallery.forEach((file) => {
            submitData.append(`media_gallery_${index}`, file);
          });
        }
      });
      
      // Append family details
      submitData.append('father_name', formData.father_name || '');
      submitData.append('father_contact', formData.father_contact || '');
      submitData.append('mother_name', formData.mother_name || '');
      submitData.append('mother_contact', formData.mother_contact || '');
      submitData.append('spouse_name', formData.spouse_name || '');
      submitData.append('spouse_contact', formData.spouse_contact || '');
      submitData.append('number_of_children', formData.number_of_children || '');
      submitData.append('children_names', formData.children_names || '');
      submitData.append('family_address', formData.family_address || '');
      
      // Log the FormData for debugging (note: this won't show file contents)
      console.log('Submitting form data:');
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? '[File]' : pair[1]));
      }
      
      const response = await fetch(`${baseurl}/api/member/register`, {
        method: 'POST',
        body: submitData,
      });
      
      const result = await response.json();
      if (!response.ok) {
        console.error('Server response:', result);
        throw new Error(result.msg || result.message || 'Registration failed');
      }
      
      if (result.success) {
        handleStepChange(5, 'forward'); // Move to success step
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [categories, setCategories] = useState([]);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${baseurl}/api/category/all`);
        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Top Header with Login Button
  const TopHeader = () => (
    <div className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <img
                src="/image.png"
                alt="profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                KBC
              </h1>
            </div>
          </div>
          {/* Right side - Login Button */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-gray-600 text-sm">
              Already have an account?
            </span>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 bg-white border-2 border-green-500 text-green-600 px-4 py-2 rounded-xl hover:bg-green-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Components
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-4 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 2)) * 100}%` }}
            />
          </div>
          {steps.slice(0, -1).map((step, index) => (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer hover:scale-105 ${step.active
                  ? currentStep > step.number
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-green-500 text-white shadow-lg ring-4 ring-green-100'
                  : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                onClick={() => step.active && handleStepChange(step.number)}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5 animate-in fade-in duration-300" />
                ) : (
                  <span className="animate-in fade-in duration-300">{step.number}</span>
                )}
              </div>
              <div className={`text-xs mt-2 text-center font-medium transition-colors duration-300 hidden sm:block ${step.active ? 'text-green-600' : 'text-gray-400'
                }`}>
                {step.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const InputField = ({ label, name, placeholder, required = false, type = 'text', icon = null, className = '', value, onChange, error }) => (
    <div className={`mb-4 group ${className}`}>
      <label className="block text-gray-800 text-sm font-semibold mb-2 transition-colors duration-200 group-focus-within:text-green-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 placeholder-gray-400 text-gray-700 hover:border-gray-300 focus:bg-white focus:shadow-sm ${error ? 'border-red-500' : 'border-gray-200'}`}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors duration-200">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );

  const SelectField = ({ label, name, placeholder, required = false, options = [], value, onChange, className = '', error }) => (
    <div className={`mb-4 group ${className}`}>
      <label className="block text-gray-800 text-sm font-semibold mb-2 transition-colors duration-200 group-focus-within:text-green-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-gray-50 text-gray-700 hover:border-gray-300 focus:bg-white focus:shadow-sm transition-all duration-200 ${error ? 'border-red-500' : 'border-gray-200'}`}
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value || option}>{option.label || option}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none group-focus-within:text-green-500 transition-colors duration-200" />
      </div>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );

  const FileUpload = ({ label, name, acceptedFormats, multiple = false, onChange, className = '', error }) => (
    <div className={`mb-4 ${className}`}>
      <label className="block text-gray-800 text-sm font-semibold mb-2">{label}</label>
      <label className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-300 cursor-pointer group block ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-green-500 group-hover:scale-110 transition-all duration-300" />
        <p className="text-gray-600 mb-1 group-hover:text-green-600 transition-colors duration-300">
          Upload {multiple ? 'Media' : 'Image'}
        </p>
        <p className="text-sm text-gray-400">Accepted formats: {acceptedFormats}</p>
        <input
          type="file"
          name={name}
          accept={acceptedFormats}
          multiple={multiple}
          onChange={onChange}
          className="hidden"
        />
      </label>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );

  const ActionButtons = ({ showBack = true, backLabel = 'Back', nextLabel = 'Continue', onNext, onBack }) => (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center font-medium hover:shadow-md transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="mr-2 w-5 h-5" /> {backLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {nextLabel} <ArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );

  const StepContainer = ({ children }) => (
    <div className={`transition-all duration-300 ${isAnimating
      ? direction === 'forward'
        ? 'transform translate-x-4 opacity-0'
        : 'transform -translate-x-4 opacity-0'
      : 'transform translate-x-0 opacity-100'
      }`}>
      {children}
    </div>
  );

  const PersonalInformation = () => (
    <StepContainer>
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-909 mb-2">Personal Information</h2>
          <p className="text-gray-600">Please provide your personal details</p>
        </div>
        <div className="space-y-8 text-left">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Personal Information
            </h3>
            <InputField
              label="Full Name"
              name="first_name"
              placeholder="Enter your full name"
              required
              value={formData.first_name}
              onChange={handleInputChange}
              error={validationErrors.first_name}
            />
            <InputField
              label="Email"
              name="email"
              placeholder="Enter your email address"
              required
              value={formData.email}
              onChange={handleInputChange}
              error={validationErrors.email}
            />
            <InputField
              label="Password"
              name="password"
              placeholder="Enter your password"
              required
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={validationErrors.password}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                label="Date of Birth"
                name="dob"
                placeholder="dd-mm-yyyy"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-gray-50 text-gray-700 hover:border-gray-300 focus:bg-white focus:shadow-sm transition-all duration-200"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            {/* Custom Gender Input */}
            {formData.gender === 'Other' && (
              <InputField
                label="Specify Gender"
                name="genderOther"
                placeholder="Enter gender"
                value={formData.genderOther}
                onChange={handleInputChange}
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                label="Contact Number"
                name="contact_no"
                placeholder="Enter contact number"
                required
                value={formData.contact_no}
                onChange={handleInputChange}
                error={validationErrors.contact_no}
              />
              <SelectField
                label="Marital Status"
                name="marital_status"
                placeholder="Select marital status"
                options={['Single', 'Married', 'Divorced', 'Widowed']}
                value={formData.marital_status}
                onChange={handleInputChange}
              />
            </div>
            
            {/* Kootam Field with Others Option */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Kootam</label>
              <select
                name="kootam"
                value={formData.kootam}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-gray-50 text-gray-700 hover:border-gray-300 focus:bg-white focus:shadow-sm transition-all duration-200"
              >
                <option value="">Select Kootam</option>
                <option value="Agamudayar">Agamudayar</option>
                <option value="Karkathar">Karkathar</option>
                <option value="Kallar">Kallar</option>
                <option value="Maravar">Maravar</option>
                <option value="Servai">Servai</option>
                <option value="Others">Others</option>
              </select>
            </div>
            
            {/* Custom Kootam Input */}
            {formData.kootam === 'Others' && (
              <InputField
                label="Specify Kootam"
                name="kootamOther"
                placeholder="Enter kootam"
                value={formData.kootamOther}
                onChange={handleInputChange}
              />
            )}
            
            {/* Kovil Field with Others Option */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Kovil</label>
              <select
                name="kovil"
                value={formData.kovil}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-gray-50 text-gray-700 hover:border-gray-300 focus:bg-white focus:shadow-sm transition-all duration-200"
              >
                <option value="">Select Kovil</option>
                <option value="Madurai Meenakshi Amman">Madurai Meenakshi Amman</option>
                <option value="Thanjavur Brihadeeswarar">Thanjavur Brihadeeswarar</option>
                <option value="Palani Murugan">Palani Murugan</option>
                <option value="Srirangam Ranganathar">Srirangam Ranganathar</option>
                <option value="Kanchipuram Kamakshi Amman">Kanchipuram Kamakshi Amman</option>
                <option value="Others">Others</option>
              </select>
            </div>
            
            {/* Custom Kovil Input */}
            {formData.kovil === 'Others' && (
              <InputField
                label="Specify Kovil"
                name="kovilOther"
                placeholder="Enter kovil"
                value={formData.kovilOther}
                onChange={handleInputChange}
              />
            )}
            
            <FileUpload
              label="Profile Image"
              name="profile_image"
              acceptedFormats="image/*"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <ActionButtons showBack={false} nextLabel="Continue" onNext={nextStep} />
      </div>
    </StepContainer>
  );

  const AddressDetails = () => (
    <StepContainer>
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-909 mb-2">Address & Contact Details</h2>
          <p className="text-gray-600">Please provide your address and referral information</p>
        </div>
        <div className="space-y-8 text-left">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Address Information
            </h3>
            <InputField
              label="Address"
              name="address"
              placeholder="Enter your complete address"
              required
              value={formData.address}
              onChange={handleInputChange}
              error={validationErrors.address}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                label="City"
                name="city"
                placeholder="Enter city"
                required
                value={formData.city}
                onChange={handleInputChange}
                error={validationErrors.city}
              />
              <InputField
                label="State"
                name="state"
                placeholder="Enter state"
                required
                value={formData.state}
                onChange={handleInputChange}
                error={validationErrors.state}
              />
            </div>
            <InputField
              label="Pincode"
              name="zip_code"
              placeholder="Enter pincode"
              required
              value={formData.zip_code}
              onChange={handleInputChange}
              error={validationErrors.zip_code}
            />
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-orange-700 mb-4 flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              Referral Information
            </h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="has_referral"
                checked={formData.has_referral}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 rounded mr-3 focus:ring-2 focus:ring-green-500"
              />
              <label className="text-gray-700 font-medium">Do You Have Referral</label>
            </div>
            {formData.has_referral && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InputField
                  label="Referral Name"
                  name="referral_name"
                  placeholder="Enter referral name"
                  value={formData.referral_name}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Referral Code"
                  name="referral_code"
                  placeholder="Enter referral code"
                  value={formData.referral_code}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </div>
        <ActionButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </StepContainer>
  );

  const BusinessProfile = () => (
    <StepContainer>
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Profile</h2>
          <p className="text-gray-600">Please provide your business information</p>
        </div>
        <div className="space-y-8">
          {formData.businessProfiles.map((profile, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl border border-gray-200 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-green-700 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </div>
                Business Profile {index + 1}
              </h3>
              <div className="space-y-4 text-left">
                {/* Business Type Selector */}
                <SelectField
                  label="Business Type"
                  placeholder="Select business type"
                  options={[
                    { value: 'self-employed', label: 'Self Employed' },
                    { value: 'business', label: 'Business' },
                    { value: 'salary', label: 'Salary' }
                  ]}
                  value={profile.business_type}
                  onChange={(e) => handleBusinessProfileChange(index, 'business_type', e.target.value)}
                  required
                  error={validationErrors[`business_type_${index}`]}
                />
                
                {/* Conditional Rendering */}
                {profile.business_type === "salary" && (
                  <>
                    <InputField
                      label="Company Name"
                      placeholder="Enter company name"
                      required
                      value={profile.company_name}
                      onChange={(e) => handleBusinessProfileChange(index, 'company_name', e.target.value)}
                      error={validationErrors[`company_name_${index}`]}
                    />
                    <InputField
                      label="Email"
                      placeholder="Enter email"
                      required
                      value={profile.email}
                      onChange={(e) => handleBusinessProfileChange(index, 'email', e.target.value)}
                      error={validationErrors[`email_${index}`]}
                    />
                    <InputField
                      label="Designation"
                      placeholder="Enter designation"
                      required
                      value={profile.designation}
                      onChange={(e) => handleBusinessProfileChange(index, 'designation', e.target.value)}
                      error={validationErrors[`designation_${index}`]}
                    />
                    <InputField
                      label="Salary"
                      placeholder="Enter salary"
                      required
                      value={profile.salary}
                      onChange={(e) => handleBusinessProfileChange(index, 'salary', e.target.value)}
                      error={validationErrors[`salary_${index}`]}
                    />
                    <InputField
                      label="Experience"
                      placeholder="Enter experience in years"
                      required
                      value={profile.experience}
                      onChange={(e) => handleBusinessProfileChange(index, 'experience', e.target.value)}
                      error={validationErrors[`experience_${index}`]}
                    />
                    <div className="flex flex-col w-full">
                      <label className="text-sm font-bold">
                        Location <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <TextareaAutosize
                        minRows={3}
                        placeholder="Enter location"
                        required
                        value={profile.location}
                        onChange={(e) => handleBusinessProfileChange(index, 'location', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring focus:ring-green-300 focus:outline-none ${validationErrors[`location_${index}`] ? 'border-red-500' : 'border-gray-200'}`}
                        style={{ resize: "vertical" }}
                      />
                      {validationErrors[`location_${index}`] && <p className="mt-1 text-red-500 text-sm">{validationErrors[`location_${index}`]}</p>}
                    </div>
                  </>
                )}
                
                {(profile.business_type === "self-employed" || profile.business_type === "business") && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <InputField
                        label="Company Name"
                        placeholder="Enter company name"
                        required
                        value={profile.company_name}
                        onChange={(e) => handleBusinessProfileChange(index, 'company_name', e.target.value)}
                        error={validationErrors[`company_name_${index}`]}
                      />
                      <SelectField
                        label="Category"
                        placeholder="Select category"
                        options={categories.map(cat => ({ value: cat.cid, label: cat.category_name }))}
                        value={profile.category_id}
                        onChange={(e) => handleBusinessProfileChange(index, 'category_id', e.target.value)}
                        required
                      />
                    </div>
                    
                    {/* Business Registration Type with Others Option */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Business Registration Type</label>
                      <select
                        value={profile.business_registration_type}
                        onChange={(e) => handleBusinessProfileChange(index, 'business_registration_type', e.target.value)}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-gray-50 text-gray-700 hover:border-gray-300 focus:bg-white focus:shadow-sm transition-all duration-200"
                      >
                        <option value="">Select Business Registration Type</option>
                        <option value="proprietor">Proprietor</option>
                        <option value="partnership">Partnership</option>
                        <option value="llp">LLP</option>
                        <option value="pvtltd">Private Limited</option>
                        <option value="ltd">Public Limited</option>
                        <option value="others">Others</option>
                      </select>
                    </div>
                    
                    {/* Custom Business Registration Type Input */}
                    {profile.business_registration_type === 'others' && (
                      <InputField
                        label="Specify Business Registration Type"
                        value={profile.business_registration_type_other}
                        onChange={(e) => handleBusinessProfileChange(index, 'business_registration_type_other', e.target.value)}
                        placeholder="Enter business registration type"
                      />
                    )}
                    
                    <InputField
                      label="Business Contact Number"
                      placeholder="Enter business contact number"
                      required
                      value={profile.contact_no || ''}
                      onChange={(e) => handleBusinessProfileChange(index, 'contact_no', e.target.value)}
                      error={validationErrors[`contact_no_${index}`]}
                    />
                    
                    <div className="flex flex-col w-full">
                      <label className="text-sm font-bold">
                        About <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <TextareaAutosize
                        minRows={4}
                        placeholder="Enter company about"
                        required
                        value={profile.about}
                        onChange={(e) => handleBusinessProfileChange(index, 'about', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring focus:ring-green-300 focus:outline-none ${validationErrors[`about_${index}`] ? 'border-red-500' : 'border-gray-200'}`}
                        style={{ resize: "vertical" }}
                      />
                      {validationErrors[`about_${index}`] && <p className="mt-1 text-red-500 text-sm">{validationErrors[`about_${index}`]}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <InputField
                        label="Email"
                        placeholder="Enter email"
                        required
                        value={profile.email}
                        onChange={(e) => handleBusinessProfileChange(index, 'email', e.target.value)}
                        error={validationErrors[`email_${index}`]}
                      />
                      <InputField
                        label="Business Starting Year"
                        placeholder="Enter starting year"
                        required
                        value={profile.business_starting_year}
                        onChange={(e) => handleBusinessProfileChange(index, 'business_starting_year', e.target.value)}
                        error={validationErrors[`business_starting_year_${index}`]}
                      />
                    </div>
                    
                    <div className="flex flex-col w-full">
                      <label className="text-sm font-bold">
                        Company Address
                      </label>
                      <TextareaAutosize
                        minRows={4}
                        placeholder="Enter company address"
                        value={profile.company_address}
                        onChange={(e) => handleBusinessProfileChange(index, 'company_address', e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-green-300 focus:outline-none"
                        style={{ resize: "vertical" }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <InputField
                        label="City"
                        placeholder="Enter city"
                        value={profile.city}
                        onChange={(e) => handleBusinessProfileChange(index, 'city', e.target.value)}
                      />
                      <InputField
                        label="State"
                        placeholder="Enter state"
                        value={profile.state}
                        onChange={(e) => handleBusinessProfileChange(index, 'state', e.target.value)}
                      />
                      <InputField
                        label="Pincode"
                        placeholder="Enter pincode"
                        value={profile.zip_code}
                        onChange={(e) => handleBusinessProfileChange(index, 'zip_code', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FileUpload
                        label="Business Profile Image"
                        acceptedFormats="image/*"
                        onChange={(e) => handleBusinessFileUpload(index, 'business_profile_image', e.target.files[0])}
                      />
                      <FileUpload
                        label={`Media Gallery (${profile.media_gallery.length}/5)`}
                        acceptedFormats="image/*,video/*"
                        multiple
                        onChange={(e) => handleBusinessFileUpload(index, 'media_gallery', e.target.files)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addBusinessProfile}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="mr-2 w-5 h-5" /> Add Business Profile
          </button>
        </div>
        <ActionButtons onNext={nextStep} onBack={prevStep} />
      </div>
    </StepContainer>
  );

  const FamilyDetails = () => (
    <StepContainer>
      <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Family Details</h2>
          <p className="text-gray-600">Please provide your family information</p>
        </div>
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              label="Father Name"
              name="father_name"
              placeholder="Enter father's name"
              value={formData.father_name}
              onChange={handleInputChange}
            />
            <InputField
              label="Father Contact"
              name="father_contact"
              placeholder="Enter father's contact number"
              value={formData.father_contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              label="Mother Name"
              name="mother_name"
              placeholder="Enter mother's name"
              value={formData.mother_name}
              onChange={handleInputChange}
            />
            <InputField
              label="Mother Contact"
              name="mother_contact"
              placeholder="Enter mother's contact number"
              value={formData.mother_contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              label="Spouse Name"
              name="spouse_name"
              placeholder="Enter spouse's name"
              value={formData.spouse_name}
              onChange={handleInputChange}
            />
            <InputField
              label="Spouse Contact"
              name="spouse_contact"
              placeholder="Enter spouse's contact number"
              value={formData.spouse_contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InputField
              label="Number of Children"
              name="number_of_children"
              placeholder="Enter number of children"
              value={formData.number_of_children}
              onChange={handleInputChange}
            />
            <InputField
              label="Family Address"
              name="family_address"
              placeholder="Enter family address"
              value={formData.family_address}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 text-sm font-semibold mb-2">Children Names</label>
            <textarea
              placeholder="Enter children names (separated by comma)"
              rows={4}
              name="children_names"
              value={formData.children_names}
              onChange={handleInputChange}
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none bg-gray-50 placeholder-gray-400 text-gray-700 hover:border-gray-300 focus:bg-white focus:shadow-sm"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={nextStep}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </StepContainer>
  );

  const CompleteStep = () => (
    <StepContainer>
      <div className="max-w-2xl mx-auto text-center animate-in slide-in-from-right duration-500">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
          <p className="text-gray-600">Your account has been successfully created.</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Go to Login
        </button>
      </div>
    </StepContainer>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformation />;
      case 2:
        return <AddressDetails />;
      case 3:
        return <BusinessProfile />;
      case 4:
        return <FamilyDetails />;
      case 5:
        return <CompleteStep />;
      default:
        return <PersonalInformation />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <TopHeader />
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <StepIndicator />
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 lg:p-12">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;