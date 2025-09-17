import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, Phone, Globe, MapPin, Clock, Mail, Users, ChevronDown, Briefcase, Building2, User as UserIcon, Tag } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import baseurl from '../../components/Baseurl/baseurl';

const BusinessListing = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const { id } = useParams();
  const isMounted = useRef(true);
  const currentId = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${baseurl}/api/category/all`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted.current && data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (isMounted.current) {
          setCategories([]);
        }
      } finally {
        if (isMounted.current) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();
  }, []);

  const getCategoryName = (categoryId) => {
    if (!categoryId || categoriesLoading) return 'N/A';
    const category = categories.find(cat => cat.cid === parseInt(categoryId));
    return category ? category.category_name : 'Not specified';
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Skip if id is undefined or if it's the same as the last fetched id
    if (!id || (currentId.current !== null && currentId.current === id)) {
      return;
    }

    // Update the currentId ref
    currentId.current = id;

    const fetchBusinessProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching business profile for ID:", id);

        const apiUrl = `${baseurl}/api/business-profile/${id}`;
        console.log("Fetching from URL:", apiUrl);

        const response = await fetch(apiUrl, {
          credentials: 'include'
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch business profile: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("API response data:", data);

        if (isMounted.current) {
          // Fixed: Check for the correct data structure - data.data is a single object, not an array
          if (data && data.success && data.data && typeof data.data === 'object') {
            // Check if the ID matches
            if (parseInt(data.data.id) === parseInt(id)) {
              setBusinessProfile(data.data);
              console.log("Found business profile:", data.data);
            } else {
              console.error("Business profile ID mismatch");
              setError('Business profile ID mismatch');
            }
          } else {
            console.error("Unexpected API response structure:", data);
            setError('Invalid data format');
          }
        }
      } catch (err) {
        console.error("Error fetching business profile:", err);
        if (isMounted.current) {
          setError(err.message || 'Unable to load business profile');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchBusinessProfile();
  }, [id]);

  // Fetch ratings for the business
  useEffect(() => {
    if (!id) return;

    const fetchRatings = async () => {
      try {
        setRatingsLoading(true);
        console.log("Fetching ratings for business ID:", id);

        const ratingsUrl = `${baseurl}/api/ratings/${id}`;
        console.log("Fetching ratings from URL:", ratingsUrl);

        const response = await fetch(ratingsUrl, {
          credentials: 'include'
        });

        console.log("Ratings response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch ratings: ${response.status} ${response.statusText}`);
        }

        const ratingsData = await response.json();
        console.log("Ratings API response data:", ratingsData);

        if (isMounted.current) {
          if (ratingsData && ratingsData.data && Array.isArray(ratingsData.data)) {
            setRatings(ratingsData.data);
            console.log("Found ratings:", ratingsData.data);
          } else {
            console.error("Unexpected ratings API response structure:", ratingsData);
            setRatings([]);
          }
        }
      } catch (err) {
        console.error("Error fetching ratings:", err);
        if (isMounted.current) {
          setRatings([]);
        }
      } finally {
        if (isMounted.current) {
          setRatingsLoading(false);
        }
      }
    };

    fetchRatings();
  }, [id]);

  // Calculate average rating
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : 0;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = ratings.filter(r => r.rating === rating).length;
    const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
    return { rating, count, percentage };
  });

  const StarRating = ({ rating, size = "w-4 h-4" }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Debugging information
  console.log("Current state:", { loading, error, businessProfile, id, ratings, averageRating });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business profile...</p>
          <p className="mt-2 text-sm text-gray-500">ID: {id || 'Not available'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!businessProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-5xl mb-4">🏢</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Business Profile Not Found</h2>
          <p className="text-gray-600">The requested business profile could not be found.</p>
          <p className="mt-2 text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>
    );
  }

  // Extract member information from the business profile
  const member = businessProfile.Member;
  const memberName = member ? `${member.first_name || ''} ${member.last_name || ''}`.trim() : 'Unknown Member';
  const memberFamily = member?.MemberFamily || null;

  // Get profile image URL
  const profileImageUrl = businessProfile?.business_profile_image
    ? businessProfile.business_profile_image.startsWith('https')
      ? businessProfile.business_profile_image
      : `${baseurl}/${businessProfile.business_profile_image}`
    : '';

  // Get media gallery URL
  const mediaGalleryUrl = businessProfile?.media_gallery
    ? businessProfile.media_gallery.startsWith('https')
      ? businessProfile.media_gallery
      : `${baseurl}/${businessProfile.media_gallery}`
    : '';

  // Get social media links
  const socialLinks = {
    website: businessProfile?.website || '',
    facebook: businessProfile?.facebook_link || '',
    instagram: businessProfile?.instagram_link || '',
    linkedin: businessProfile?.linkedin_link || '',
    google: businessProfile?.google_link || ''
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="w-full">
        {/* Green Banner Section */}
        <div className="bg-green-500 text-white rounded-t-lg">
          <div className="relative h-48 sm:h-64 md:h-72 lg:h-80">
            {/* Background image from media gallery or fallback */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: mediaGalleryUrl
                  ? `url(${mediaGalleryUrl})`
                  : "url('/fallback.png')"
              }}
            ></div>
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={businessProfile.company_name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{businessProfile.company_name}</h1>
                  <p className="text-green-100 text-sm sm:text-base">
                    {businessProfile.business_type || 'Business'} • {memberName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* White Section - 50% */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  {businessProfile.company_address || businessProfile.location || 'Address not available'}
                  {businessProfile.city && `, ${businessProfile.city}`}
                  {businessProfile.state && `, ${businessProfile.state}`}
                  {businessProfile.zip_code && ` ${businessProfile.zip_code}`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{member?.contact_no || 'Phone not available'}</span>
              </div>
              {socialLinks.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{socialLinks.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* About This Business Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-left">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold text-left">About This Business</h2>
            <button
              onClick={() => setAboutExpanded(!aboutExpanded)}
              className="shrink-0 p-2 rounded-md hover:bg-gray-50 text-gray-600"
              aria-label={aboutExpanded ? 'Show less' : 'Show more'}
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${aboutExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <p
            className="text-gray-700 text-sm leading-relaxed text-left mt-2"
            style={aboutExpanded ? {} : {
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {businessProfile.about || `${businessProfile.company_name} is a ${businessProfile.business_type || 'business'} established in ${businessProfile.business_starting_year || 'recently'}.`}
          </p>
        </div>
        {/* Business Details Grid Card */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Business Owner Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-left">
              <h3 className="font-semibold mb-4 text-base">Business Owner Details</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><UserIcon className="w-4 h-4 text-green-600" /> First Name:</span>
                  <p className="text-gray-600 mt-1">{memberName}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Mail className="w-4 h-4 text-green-600" /> Email:</span>
                  <p className="text-gray-600 mt-1">{member?.email || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Phone className="w-4 h-4 text-green-600" /> Contact Number:</span>
                  <p className="text-gray-600 mt-1">{member?.contact_no || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><MapPin className="w-4 h-4 text-green-600" /> Location:</span>
                  <p className="text-gray-600 mt-1">
                    {businessProfile.location || member?.address || 'Not available'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Phone className="w-4 h-4 text-green-600" /> Alternative Contact:</span>
                  <p className="text-gray-600 mt-1">{member?.alternate_contact_no || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Clock className="w-4 h-4 text-green-600" /> Best Time to Contact:</span>
                  <p className="text-gray-600 mt-1">{member?.best_time_to_contact || 'Not available'}</p>
                </div>
              </div>
            </div>
            {/* Business Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-left">
              <h3 className="font-semibold mb-4 text-base">Business Information</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Briefcase className="w-4 h-4 text-green-600" /> Business Type:</span>
                  <p className="text-gray-600 mt-1">{businessProfile.business_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Tag className="w-4 h-4 text-green-600" /> Business Registration:</span>
                  <p className="text-gray-600 mt-1">{businessProfile.business_registration_type || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Clock className="w-4 h-4 text-green-600" /> Business Started:</span>
                  <p className="text-gray-600 mt-1">{businessProfile.business_starting_year || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Users className="w-4 h-4 text-green-600" /> Staff Size:</span>
                  <p className="text-gray-600 mt-1">{businessProfile.staff_size || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 inline-flex items-center gap-2 align-middle"><Tag className="w-4 h-4 text-green-600" /> Category:</span>
                  <p className="text-gray-600 mt-1">{getCategoryName(businessProfile.category_id)}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-1">
                    <Tag className="w-4 h-4 text-green-600" />
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{businessProfile.tags || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Address & Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 text-left">
              <h3 className="font-semibold mb-4 text-base">Address & Contact</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600" /> Business Address:</span>
                  <p className="text-gray-600 mt-1">{businessProfile.company_address || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> Work Phone:</span>
                  <p className="text-gray-600 mt-1">{businessProfile.business_work_contract || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> Emergency Contact:</span>
                  <p className="text-gray-600 mt-1">{member?.emergency_contact || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><Mail className="w-4 h-4 text-green-600" /> Work Email:</span>
                  <p className="text-gray-600 mt-1">{businessProfile.email || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><Globe className="w-4 h-4 text-green-600" /> Social Media:</span>
                  <p className="text-gray-600 leading-relaxed mt-1">
                    Website: {businessProfile.website || 'Not specified'}<br />
                    LinkedIn: {businessProfile.linkedin_link || 'Not specified'}<br />
                    Instagram: {businessProfile.instagram_link || 'Not specified'}<br />
                    Facebook: {businessProfile.facebook_link || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Images Section Card */}
        {profileImageUrl && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-semibold mb-4 text-sm">Business Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                <img
                  src={profileImageUrl}
                  alt="Business Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {mediaGalleryUrl && (
                <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                  {businessProfile.media_gallery_type === 'video' ? (
                    <video
                      src={mediaGalleryUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaGalleryUrl}
                      alt="Business Gallery"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              {[...Array(3 - (mediaGalleryUrl ? 1 : 0))].map((_, i) => (
                <div key={i} className="aspect-video bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        )}
        {/* Family Information Card */}
        {memberFamily && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-left">
            <h3 className="font-semibold mb-4 text-sm text-left">Family Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><UserIcon className="w-4 h-4 text-green-600" /> Father Name:</span>
                  <p className="text-gray-600 mt-1">{memberFamily?.father_name || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> Father Contact:</span>
                  <p className="text-gray-600 mt-1">{memberFamily?.father_contact || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><UserIcon className="w-4 h-4 text-green-600" /> Mother Name:</span>
                  <p className="text-gray-600 mt-1">{memberFamily?.mother_name || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> Mother Contact:</span>
                  <p className="text-gray-600 mt-1">{memberFamily?.mother_contact || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><UserIcon className="w-4 h-4 text-green-600" /> Spouse Name:</span>
                  <p className="text-gray-600 mt-1">{memberFamily?.spouse_name || 'Not available'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-800 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> Spouse Contact:</span>
                  <p className="text-gray-600 mt-1">{memberFamily?.spouse_contact || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Ratings & Reviews and Rewards Program Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 lg:pr-10 lg:border-r lg:border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold mb-5 text-left">Ratings & Reviews</h2>
              <div className="flex flex-col sm:flex-row items-start sm:space-x-7 space-y-4 sm:space-y-0">
                <div className="min-w-[120px]">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                    {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                  </div>
                  <div className="mt-1"><StarRating rating={Math.round(averageRating)} size="w-4 h-4" /></div>
                  <p className="text-xs text-gray-600 mt-1">Based on {ratings.length} reviews</p>
                  <p className="text-xs text-gray-500">Last updated 2 days ago</p>
                </div>
                <div className="flex-1 w-full pt-1">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-2 mb-2">
                      <span className="text-xs w-3 text-right">{rating}</span>
                      <Star className="w-3 h-3 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-orange-400 h-1.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-10 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-10">
              <h2 className="text-lg sm:text-xl font-semibold mb-5 text-left">Rewards Program</h2>
              <div className="flex items-center sm:items-start sm:justify-start justify-center sm:space-x-4 gap-4">
                <div className="w-12 h-12 sm:w-10 sm:h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                  <Star className="w-6 h-6 sm:w-5 sm:h-5 text-white fill-white" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-base">Loyalty Points: {member?.reward_points || 0}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Earn 10 points per $1 spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Customer Reviews Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <h3 className="text-xl font-semibold mb-6 text-left">Customer Reviews</h3>

          {ratingsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reviews...</p>
            </div>
          ) : ratings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this business!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {ratings.map((review) => {
                const ratedBy = review.ratedBy || {};
                const initials = `${ratedBy.first_name?.charAt(0) || ''}${ratedBy.last_name?.charAt(0) || ''}`;
                const bgColor = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"][Math.floor(Math.random() * 5)];

                return (
                  <div key={review.rid} className="rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {ratedBy.profile_image ? (
                          <img
                            src={ratedBy.profile_image.startsWith('https')
                              ? ratedBy.profile_image
                              : `${baseurl}/${ratedBy.profile_image}`}
                            alt={ratedBy.first_name}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm sm:text-base truncate">
                            {`${ratedBy.first_name || ''} ${ratedBy.last_name || ''}`.trim() || 'Anonymous'}
                          </h4>
                          <StarRating rating={review.rating} size="w-3 h-3" />
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{review.message}</p>
                        <div className="mt-3 text-xs text-gray-500">
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center space-y-3">
            <button className="inline-flex items-center justify-center px-6 py-2 border border-green-500 text-green-600 rounded-full text-sm hover:bg-green-50 font-medium">
              View All {ratings.length} Reviews
            </button>
            <div>
              <button className="inline-flex items-center justify-center px-6 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 font-medium"
                onClick={() => navigate(`/review/${businessProfile.id}`)}
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default BusinessListing;