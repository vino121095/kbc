import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Divider, Button, IconButton, CircularProgress,
  Rating, List, ListItem, ListItemText, ListItemAvatar, Grid, Card, CardContent, useTheme, Modal
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Phone, WhatsApp, Email, Share, Home
} from '@mui/icons-material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Footer from '../Footer';
import baseurl from '../Baseurl/baseurl';

const DetailsPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInMember, setLoggedInMember] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState([]);

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
            setLoggedInMember(data.data);
          } else {
            setLoggedInMember(stored);
          }
        })
        .catch(() => setLoggedInMember(stored));
    }
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${baseurl}/api/member/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setMember(data.data);
          // Fetch ratings after getting member data
          if (data.data.BusinessProfiles?.[0]?.id) {
            fetchRatings(data.data.BusinessProfiles[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching member:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRatings = async (businessId) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${baseurl}/api/ratings/${businessId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success !== false) { // Handle cases where success field might be missing
          // Transform the API response to match component expectations
          const transformedRatings = data.data.map(rating => ({
            ...rating,
            user: rating.ratedBy, // Map ratedBy to user
            comment: rating.message, // Map message to comment
            created_at: rating.createdAt // Map createdAt to created_at
          }));
          setRatings(transformedRatings);
        }
      } catch (err) {
        console.error('Error fetching ratings:', err);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!member) {
    return <Typography textAlign="center">No member data found.</Typography>;
  }

  const showLimitedInfo = loggedInMember?.access_level === 'Advanced' && member.status === 'Pending';

  // Bottom bar action handlers
  const handleCall = () => {
    if (member.contact_no) window.open(`tel:${member.contact_no}`);
  };

  const handleEmail = () => {
    if (member.email) window.open(`mailto:${member.email}`);
  };

  const handleWhatsApp = () => {
    if (member.contact_no) window.open(`https://wa.me/${member.contact_no}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${member.first_name} ${member.last_name}`,
      text: `Check out the profile of ${member.first_name} ${member.last_name}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        alert("Share failed.");
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  return (
    <Box>
      {/* Header - HomePage style */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #137d13 0%, #3ad13a 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, p: 2, pb: 2.5 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff', mr: 1 }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Avatar
              src={member.profile_image ? `${baseurl}/${member.profile_image}` : undefined}
              sx={{ width: 64, height: 64, border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 2px 12px rgba(0,0,0,0.2)', mr: 2 }}
            >
              {member.first_name?.[0]}{member.last_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h6" color="white" fontWeight="700" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {member.first_name} {member.last_name}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.9)" fontWeight="500">
                {member.BusinessProfiles?.[0]?.role || '—'}
              </Typography>
            </Box>
          </Box>
          {/* Ratings summary */}
          <Box display="flex" justifyContent="space-around" mt={2} width="100%">
            <Box textAlign="center">
              <Typography fontWeight="bold" color="white">{member.total_reviews || ratings.length}</Typography>
              <Typography variant="caption" color="white">{t('reviews')}</Typography>
            </Box>
            <Box textAlign="center">
              <Typography fontWeight="bold" color="white">
                {ratings.length > 0
                  ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
                  : member.avg_rating?.toFixed(1) || '0.0'
                } ⭐
              </Typography>
              <Typography variant="caption" color="white">{t('rating')}</Typography>
            </Box>
            <Box textAlign="center">
              <Typography fontWeight="bold" color="white">{member.rewards || 0}</Typography>
              <Typography variant="caption" color="white">{t('rewards')}</Typography>
            </Box>
          </Box>
        </Box>
        {/* Decorative blurred circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }}
        />
      </Box>

      {/* About Section */}
      <Box p={2}>
        {/* Business Info */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <BusinessIcon color="primary" sx={{ mr: 1 }} />
              <Typography fontWeight="bold">{t('businessInfo')}</Typography>
            </Box>
            {member.BusinessProfiles?.length > 0 && (
              <Box>
                {member.BusinessProfiles.map((profile, index) => {
                  const mediaGallery = profile.media_gallery?.split(',') || [];
                  const isVideo = (file) => file?.endsWith('.mp4') || file?.endsWith('.mov');

                  return (
                    <Box key={index} mb={4} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {t('businessInfo')} {index + 1}
                      </Typography>

                      {/* Business Details */}
                      <Box sx={{ textAlign: "left" }}>
                        {[
                          ['businessName', profile.company_name],
                          ['businessType', profile.business_type],
                          ['address', profile.company_address],
                          ['role', profile.role],
                          ['experience', profile.experience],
                          ['contact', profile.contact],
                          ['email', profile.email],
                        ].map(([label, value], i) => (
                          <Box key={i} mb={2}>
                            <Typography variant="body2">
                              <strong>{t(label)}:</strong> {value || '—'}
                            </Typography>
                          </Box>
                        ))}

                        {/* Business Profile Image */}
                        {profile.business_profile_image && (
                          <Box mt={2} mb={2}>
                            <Typography variant="body2" fontWeight="bold">
                              {t('Business Profile Image')}:
                            </Typography>
                            <Box mt={1} mb={2}>
                              <img
                                src={`${baseurl}/${profile.business_profile_image}`}
                                alt="Business Profile"
                                style={{ maxWidth: '100px', borderRadius: 8, marginBottom: 8 }}
                              />
                            </Box>
                          </Box>
                        )}

                        {/* Media Gallery */}
                        {mediaGallery.length > 0 && (
                          <Box mt={2}>
                            <Typography variant="body2" fontWeight="bold" mb={1}>
                              {t('mediaGallery')}:
                            </Typography>
                            <Box mt={1} display="flex" flexWrap="wrap" gap={2}>
                              {/* Show only the first image or video */}
                              {mediaGallery.slice(0, 1).map((file, i) => (
                                <Box key={i} sx={{ width: 160, mb: 2 }}>
                                  {isVideo(file) ? (
                                    <video controls width="100%" style={{ borderRadius: 8, marginBottom: 8 }}>
                                      <source src={`${baseurl}/${file}`} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  ) : (
                                    <img
                                      src={`${baseurl}/${file}`}
                                      alt={`Media ${i + 1}`}
                                      style={{ width: '100%', borderRadius: 8, marginBottom: 8 }}
                                    />
                                  )}
                                </Box>
                              ))}
                              {/* Show 'View More' button if more than 1 media */}
                              {mediaGallery.length > 1 && (
                                <Button
                                  variant="outlined"
                                  sx={{ height: 40, alignSelf: 'center', borderRadius: 3, color: 'green', borderColor: 'green', ml: 2 }}
                                  onClick={() => { setModalMedia(mediaGallery); setMediaModalOpen(true); }}
                                >
                                  {t('viewMore')}
                                </Button>
                              )}
                            </Box>
                            {/* Modal for all media */}
                            <Modal open={mediaModalOpen} onClose={() => setMediaModalOpen(false)}>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  bgcolor: 'background.paper',
                                  boxShadow: 24,
                                  borderRadius: 3,
                                  p: 3,
                                  maxWidth: 600,
                                  width: '90vw',
                                  maxHeight: '90vh',
                                  overflowY: 'auto',
                                }}
                              >
                                <Typography variant="h6" mb={2}>{t('mediaGallery')}</Typography>
                                <Box display="flex" flexWrap="wrap" gap={2}>
                                  {modalMedia.map((file, i) => (
                                    <Box key={i} sx={{ width: 180, mb: 2 }}>
                                      {isVideo(file) ? (
                                        <video controls width="100%" style={{ borderRadius: 8, marginBottom: 8 }}>
                                          <source src={`${baseurl}/${file}`} type="video/mp4" />
                                          Your browser does not support the video tag.
                                        </video>
                                      ) : (
                                        <img
                                          src={`${baseurl}/${file}`}
                                          alt={`Media ${i + 1}`}
                                          style={{ width: '100%', borderRadius: 8, marginBottom: 8 }}
                                        />
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                                <Button onClick={() => setMediaModalOpen(false)} sx={{ mt: 3, borderRadius: 3 }} variant="contained" color="success">{t('close')}</Button>
                              </Box>
                            </Modal>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}

          </CardContent>
        </Card>

        {/* Personal & Family Info */}
        {!showLimitedInfo && (
          <>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography fontWeight="bold">{t('personalInfo')}</Typography>
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  {[
                    ['status', member.marital_status],
                    ['dob', member.dob],
                    ['bloodGroup', member.blood_group],
                    ['mobile', member.contact_no],
                    ['email', member.email],
                  ].map(([label, value], index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box mb={2}>
                        <Typography variant="body2">
                          <strong>{t(label)}:</strong> {value || '—'}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <FamilyRestroomIcon color="primary" sx={{ mr: 1 }} />
                  <Typography fontWeight="bold">{t('familyInfo')}</Typography>
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  {[
                    ['spouseName', member.MemberFamily?.spouse_name],
                    ['children', member.MemberFamily?.number_of_children],
                    ['childrenName', member.MemberFamily?.children_names],
                    ['homeAddress', member.MemberFamily?.address],
                  ].map(([label, value], index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box mb={2}>
                        <Typography variant="body2">
                          <strong>{t(label)}:</strong>{' '}
                          {label === 'childrenName' ? (
                            (() => {
                              let names = value;
                              if (typeof names === 'string') {
                                try {
                                  names = JSON.parse(names);
                                } catch {
                                  // not JSON, fallback
                                }
                              }
                              if (Array.isArray(names) && names.length > 0) {
                                return names.join(', ');
                              }
                              return '—';
                            })()
                          ) : (
                            value || '—'
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </>
        )}

        {/* Ratings & Reviews */}
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <StarBorderIcon color="primary" sx={{ mr: 1 }} />
              <Typography fontWeight="bold">{t('ratingsReviews')}</Typography>
            </Box>

            {ratingsLoading ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress size={24} />
              </Box>
            ) : ratings.length > 0 ? (
              <>
                <Box display="flex" alignItems="center" mb={2}>
                  <Rating
                    value={
                      ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
                    }
                    precision={0.5}
                    readOnly
                    size="large"
                  />
                  <Typography ml={1} variant="h6">
                    {(ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)} ({ratings.length} {t('reviews')})
                  </Typography>
                </Box>

                <List>
                  {ratings.map((rating, index) => (
                    <ListItem key={rating.rid || index} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={rating.user?.profile_image ? `${baseurl}/${rating.user.profile_image}` : undefined}>
                          {rating.user?.first_name?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography component="span" variant="subtitle1">
                              {rating.user?.first_name} {rating.user?.last_name}
                            </Typography>
                            <Rating value={rating.rating} readOnly size="small" sx={{ ml: 1 }} />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(rating.created_at).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {rating.comment}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Typography color="text.secondary" textAlign="center" my={2}>
                {t('noReviewsYet')}
              </Typography>
            )}

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 3, borderRadius: 5, color: 'green', borderColor: 'green' }}
              onClick={() => navigate(`/review/${id}`)}
            >
              {t('giveReview')}
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Action Bar */}
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper,
        py: 1,
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        <IconButton onClick={handleCall}>
          <Phone color={theme.palette.mode === 'dark' ? 'primary' : 'success'} />
        </IconButton>
        <IconButton onClick={() => navigate('/')}>
          <Home color={theme.palette.mode === 'dark' ? 'primary' : 'success'} />
        </IconButton>
        <IconButton onClick={handleEmail}>
          <Email color={theme.palette.mode === 'dark' ? 'primary' : 'success'} />
        </IconButton>
        <IconButton onClick={handleWhatsApp}>
          <WhatsApp color={theme.palette.mode === 'dark' ? 'primary' : 'success'} />
        </IconButton>
        <IconButton onClick={handleShare}>
          <Share color={theme.palette.mode === 'dark' ? 'primary' : 'success'} />
        </IconButton>
      </Box>


      {/* Spacer */}
      <Box sx={{ height: '60px' }} />
    </Box>

  );
};

export default DetailsPage;