import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Avatar, Divider, Button, IconButton, CircularProgress,
  Rating, List, ListItem, ListItemText, ListItemAvatar, Grid, Card, CardContent, 
  useTheme, Modal, Chip, Stack, Paper, Fade, Zoom, Slide
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Phone, WhatsApp, Email, Share, Home, LocationOn, Work, 
  CalendarToday, Bloodtype, FamilyRestroom, Star, StarBorder,
  Business, Person, Close, PlayArrow
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
        if (data.success !== false) {
          const transformedRatings = data.data.map(rating => ({
            ...rating,
            user: rating.ratedBy,
            comment: rating.message,
            created_at: rating.createdAt
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
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)' }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#137d13',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }} 
        />
      </Box>
    );
  }

  if (!member) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)' }}
      >
        <Typography variant="h6" color="text.secondary">
          {t('noMemberFound')}
        </Typography>
      </Box>
    );
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

  const InfoCard = ({ icon, title, children, delay = 0 }) => (
    <Fade in timeout={600 + delay}>
      <Card 
        sx={{ 
          mb: 3, 
          borderRadius: 4,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(34,197,94,0.10)'
            : '0 8px 32px rgba(19, 125, 19, 0.08)',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: theme.palette.primary.main,
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 12px 40px rgba(34,197,94,0.18)'
              : '0 12px 40px rgba(19, 125, 19, 0.15)',
            transition: 'all 0.3s ease-in-out'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Box
              sx={{
                background: theme.palette.primary.main,
                borderRadius: 3,
                p: 1.5,
                mr: 2,
                color: theme.palette.primary.contrastText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
            <Typography 
              variant="h6" 
              fontWeight="700" 
              sx={{ 
                color: theme.palette.primary.main,
                fontSize: '1.1rem'
              }}
            >
              {title}
            </Typography>
          </Box>
          {children}
        </CardContent>
      </Card>
    </Fade>
  );

  const InfoRow = ({ label, value, icon }) => (
    <Box 
      display="flex" 
      alignItems="center" 
      mb={2}
      sx={{
        p: 2,
        borderRadius: 3,
        background: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          background: theme.palette.action.hover,
          transform: 'translateX(4px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      {icon && (
        <Box 
          sx={{ 
            mr: 2, 
            color: theme.palette.primary.main, 
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {icon}
        </Box>
      )}
      <Box flex={1}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 500,
            color: theme.palette.text.primary,
            mt: 0.5
          }}
        >
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{
      background: theme.palette.background.default,
      minHeight: '100vh',
      color: theme.palette.text.primary
    }}>
      {/* Enhanced Header */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #184c24 0%, #137d13 100%)'
            : 'linear-gradient(135deg, #137d13 0%, #3ad13a 100%)',
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
            background: theme.palette.mode === 'dark'
              ? 'rgba(0,0,0,0.2)'
              : 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, p: 3, pb: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <IconButton 
              onClick={() => navigate(-1)} 
              sx={{ 
                color: '#fff', 
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <Zoom in timeout={800}>
              <Avatar
                src={member.profile_image ? `${baseurl}/${member.profile_image}` : undefined}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  border: '4px solid rgba(255,255,255,0.3)', 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  mr: 2
                }}
              >
                {member.first_name?.[0]}{member.last_name?.[0]}
              </Avatar>
            </Zoom>
            <Box>
              <Typography 
                variant="h5" 
                color="white" 
                fontWeight="800" 
                sx={{ 
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  mb: 0.5
                }}
              >
                {member.first_name} {member.last_name}
              </Typography>
              <Chip
                label={member.BusinessProfiles?.[0]?.role || 'Member'}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
            </Box>
          </Box>

          {/* Enhanced Stats */}
          <Box 
            display="flex" 
            justifyContent="space-around" 
            sx={{
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.15)',
              borderRadius: 4,
              p: 2,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            {[
              { 
                value: member.total_reviews || ratings.length, 
                label: t('reviews'), 
                icon: <Star sx={{ fontSize: 20 }} /> 
              },
              { 
                value: `${ratings.length > 0
                  ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
                  : member.avg_rating?.toFixed(1) || '0.0'
                }`, 
                label: t('rating'), 
                icon: <StarBorder sx={{ fontSize: 20 }} /> 
              },
              { 
                value: member.rewards || 0, 
                label: t('rewards'), 
                icon: <Business sx={{ fontSize: 20 }} /> 
              }
            ].map((stat, index) => (
              <Zoom in timeout={1000 + index * 200} key={index}>
                <Box textAlign="center">
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    gap={0.5}
                    mb={0.5}
                  >
                    {stat.icon}
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color={theme.palette.primary.contrastText}
                      sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color={theme.palette.primary.contrastText}
                    sx={{ 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Zoom>
            ))}
          </Box>
        </Box>

        {/* Enhanced Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Content */}
      <Box p={3} sx={{ pb: 10 }}>
        {/* Business Info */}
        <InfoCard 
          icon={<BusinessIcon />} 
          title={t('businessInfo')} 
          delay={0}
        >
          {member.BusinessProfiles?.length > 0 && (
            <Box>
              {member.BusinessProfiles.map((profile, index) => {
                const mediaGallery = profile.media_gallery?.split(',') || [];
                const isVideo = (file) => file?.endsWith('.mp4') || file?.endsWith('.mov');

                return (
                  <Box key={index} mb={3}>
                    <Stack spacing={0}>
                      <InfoRow 
                        label={t('businessName')} 
                        value={profile.company_name}
                        icon={<Business />}
                      />
                      <InfoRow 
                        label={t('businessType')} 
                        value={profile.business_type}
                        icon={<Work />}
                      />
                      <InfoRow 
                        label={t('address')} 
                        value={profile.company_address}
                        icon={<LocationOn />}
                      />
                      <InfoRow 
                        label={t('role')} 
                        value={profile.role}
                        icon={<Person />}
                      />
                      <InfoRow 
                        label={t('experience')} 
                        value={profile.experience}
                        icon={<CalendarToday />}
                      />
                      <InfoRow 
                        label={t('contact')} 
                        value={profile.contact}
                        icon={<Phone />}
                      />
                      <InfoRow 
                        label={t('email')} 
                        value={profile.email}
                        icon={<Email />}
                      />
                    </Stack>

                    {/* Business Profile Image */}
                    {profile.business_profile_image && (
                      <Box mt={3}>
                        <Typography 
                          variant="body2" 
                          fontWeight="bold" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            mb: 2,
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {t('Business Profile Image')}
                        </Typography>
                        <Box
                          sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(19, 125, 19, 0.1)',
                            border: '1px solid rgba(19, 125, 19, 0.1)',
                            maxWidth: 200
                          }}
                        >
                          <img
                            src={`${baseurl}/${profile.business_profile_image}`}
                            alt="Business Profile"
                            style={{ 
                              width: '100%',
                              height: 'auto',
                              display: 'block'
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Media Gallery */}
                    {mediaGallery.length > 0 && (
                      <Box mt={3}>
                        <Typography 
                          variant="body2" 
                          fontWeight="bold" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            mb: 2,
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {t('mediaGallery')}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                          {mediaGallery.slice(0, 1).map((file, i) => (
                            <Box 
                              key={i} 
                              sx={{ 
                                width: 200, 
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(19, 125, 19, 0.1)',
                                border: '1px solid rgba(19, 125, 19, 0.1)',
                                position: 'relative'
                              }}
                            >
                              {isVideo(file) ? (
                                <Box sx={{ position: 'relative' }}>
                                  <video 
                                    controls 
                                    width="100%" 
                                    style={{ display: 'block' }}
                                  >
                                    <source src={`${baseurl}/${file}`} type="video/mp4" />
                                  </video>
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      right: 8,
                                      backgroundColor: 'rgba(0,0,0,0.6)',
                                      borderRadius: 2,
                                      p: 0.5,
                                      color: 'white'
                                    }}
                                  >
                                    <PlayArrow fontSize="small" />
                                  </Box>
                                </Box>
                              ) : (
                                <img
                                  src={`${baseurl}/${file}`}
                                  alt={`Media ${i + 1}`}
                                  style={{ 
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                  }}
                                />
                              )}
                            </Box>
                          ))}
                          {mediaGallery.length > 1 && (
                            <Button
                              variant="outlined"
                              sx={{ 
                                borderRadius: 4,
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                '&:hover': {
                                  borderColor: theme.palette.primary.dark,
                                  backgroundColor: theme.palette.action.hover,
                                  transform: 'scale(1.05)'
                                }
                              }}
                              onClick={() => { 
                                setModalMedia(mediaGallery); 
                                setMediaModalOpen(true); 
                              }}
                            >
                              {t('viewMore')} ({mediaGallery.length - 1})
                            </Button>
                          )}
                        </Box>

                        {/* Enhanced Modal */}
                        <Modal 
                          open={mediaModalOpen} 
                          onClose={() => setMediaModalOpen(false)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2
                          }}
                        >
                          <Fade in={mediaModalOpen}>
                            <Box
                              sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 6,
                                boxShadow: '0 20px 80px rgba(0,0,0,0.3)',
                                p: 4,
                                maxWidth: 800,
                                width: '100%',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                position: 'relative'
                              }}
                            >
                              <Box 
                                display="flex" 
                                justifyContent="space-between" 
                                alignItems="center" 
                                mb={3}
                              >
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    color: theme.palette.primary.main,
                                    fontWeight: 700
                                  }}
                                >
                                  {t('mediaGallery')}
                                </Typography>
                                <IconButton
                                  onClick={() => setMediaModalOpen(false)}
                                  sx={{
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                      backgroundColor: theme.palette.action.hover
                                    }
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                              
                              <Grid container spacing={3}>
                                {modalMedia.map((file, i) => (
                                  <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Box
                                      sx={{
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 32px rgba(19, 125, 19, 0.1)',
                                        border: '1px solid rgba(19, 125, 19, 0.1)',
                                        position: 'relative'
                                      }}
                                    >
                                      {isVideo(file) ? (
                                        <video 
                                          controls 
                                          width="100%" 
                                          style={{ display: 'block' }}
                                        >
                                          <source src={`${baseurl}/${file}`} type="video/mp4" />
                                        </video>
                                      ) : (
                                        <img
                                          src={`${baseurl}/${file}`}
                                          alt={`Media ${i + 1}`}
                                          style={{ 
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block'
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          </Fade>
                        </Modal>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </InfoCard>

        {/* Personal & Family Info */}
        {!showLimitedInfo && (
          <>
            <InfoCard 
              icon={<PersonIcon />} 
              title={t('personalInfo')} 
              delay={200}
            >
              <Stack spacing={0}>
                <InfoRow 
                  label={t('status')} 
                  value={member.marital_status}
                  icon={<FamilyRestroom />}
                />
                <InfoRow 
                  label={t('dob')} 
                  value={member.dob}
                  icon={<CalendarToday />}
                />
                <InfoRow 
                  label={t('bloodGroup')} 
                  value={member.blood_group}
                  icon={<Bloodtype />}
                />
                <InfoRow 
                  label={t('mobile')} 
                  value={member.contact_no}
                  icon={<Phone />}
                />
                <InfoRow 
                  label={t('email')} 
                  value={member.email}
                  icon={<Email />}
                />
              </Stack>
            </InfoCard>

            <InfoCard 
              icon={<FamilyRestroomIcon />} 
              title={t('familyInfo')} 
              delay={400}
            >
              <Stack spacing={0}>
                <InfoRow 
                  label={t('spouseName')} 
                  value={member.MemberFamily?.spouse_name}
                  icon={<Person />}
                />
                <InfoRow 
                  label={t('children')} 
                  value={member.MemberFamily?.number_of_children}
                  icon={<FamilyRestroom />}
                />
                <InfoRow 
                  label={t('childrenName')} 
                  value={(() => {
                    let names = member.MemberFamily?.children_names;
                    if (typeof names === 'string') {
                      try {
                        names = JSON.parse(names);
                      } catch {}
                    }
                    if (Array.isArray(names) && names.length > 0) {
                      return names.join(', ');
                    }
                    return '—';
                  })()}
                  icon={<Person />}
                />
                <InfoRow 
                  label={t('homeAddress')} 
                  value={member.MemberFamily?.address}
                  icon={<LocationOn />}
                />
              </Stack>
            </InfoCard>
          </>
        )}

{/* Ratings & Reviews */}
<InfoCard 
          icon={<StarBorderIcon />} 
          title={t('ratingsReviews')} 
          delay={600}
        >
          {ratingsLoading ? (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress 
                size={32} 
                sx={{ 
                  color: theme.palette.primary.main,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }} 
              />
            </Box>
          ) : ratings.length > 0 ? (
            <>
              {/* Rating Summary */}
              <Box 
                display="flex" 
                alignItems="center" 
                mb={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: theme.palette.primary.main,
                  }
                }}
              >
                <Box 
                  sx={{
                    background: theme.palette.primary.main,
                    borderRadius: 3,
                    p: 2,
                    mr: 3,
                    color: theme.palette.primary.contrastText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 80,
                    flexDirection: 'column'
                  }}
                >
                  <Typography 
                    variant="h4" 
                    fontWeight="bold"
                    sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                  >
                    {(ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      opacity: 0.9
                    }}
                  >
                    {t('rating')}
                  </Typography>
                </Box>
                
                <Box flex={1}>
                  <Rating
                    value={
                      ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
                    }
                    precision={0.5}
                    readOnly
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiRating-iconEmpty': {
                        color: theme.palette.mode === 'dark' ? 'rgba(34,197,94,0.18)' : 'rgba(19, 125, 19, 0.3)',
                      }
                    }}
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mt: 1,
                      color: theme.palette.primary.main,
                      fontWeight: 600
                    }}
                  >
                     {ratings.length} {ratings.length === 1 ? t('review') : t('reviews')}
                  </Typography>
                </Box>
              </Box>

              {/* Reviews List */}
              <Box>
                <Typography 
                  variant="body2" 
                  fontWeight="bold" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    mb: 3,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                </Typography>
                
                {ratings.map((rating, index) => (
                  <Fade in timeout={800 + index * 100} key={rating.rid || index}>
                    <Box
                      sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 4,
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: theme.palette.primary.main,
                        },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(34,197,94,0.10)' : '0 8px 32px rgba(19, 125, 19, 0.12)',
                          transition: 'all 0.3s ease-in-out'
                        }
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        <Avatar 
                          src={rating.user?.profile_image ? `${baseurl}/${rating.user.profile_image}` : undefined}
                          sx={{
                            width: 50,
                            height: 50,
                            border: `2px solid ${theme.palette.divider}`,
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            fontWeight: 'bold'
                          }}
                        >
                          {rating.user?.first_name?.[0]}{rating.user?.last_name?.[0]}
                        </Avatar>
                        
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                            <Box>
                              <Typography 
                                variant="subtitle1" 
                                fontWeight="bold"
                                sx={{ color: theme.palette.primary.main, mb: 0.5 }}
                              >
                                {rating.user?.first_name} {rating.user?.last_name}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Rating 
                                  value={rating.rating} 
                                  readOnly 
                                  size="small"
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: theme.palette.primary.main,
                                    }
                                  }}
                                />
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500
                                  }}
                                >
                                  {new Date(rating.created_at).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          {rating.comment && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.text.primary,
                                lineHeight: 1.6,
                                fontStyle: 'italic',
                                mt: 1,
                                pl: 2,
                                borderLeft: `3px solid ${theme.palette.primary.light}`,
                                backgroundColor: theme.palette.action.hover,
                                py: 1,
                                borderRadius: '0 8px 8px 0'
                              }}
                            >
                              "{rating.comment}"
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Fade>
                ))}
              </Box>
            </>
          ) : (
            <Box 
              textAlign="center" 
              py={6}
              sx={{
                background: theme.palette.background.default,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <StarBorderIcon 
                sx={{ 
                  fontSize: 60, 
                  color: theme.palette.mode === 'dark' ? 'rgba(34,197,94,0.18)' : 'rgba(19, 125, 19, 0.3)',
                  mb: 2 
                }} 
              />
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 600,
                  mb: 1 
                }}
              >
                {t('No Reviews Yet')}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ opacity: 0.8 }}
              >
                {t('Be The First To Review')}
              </Typography>
            </Box>
          )}
          {/* Give Review Button */}
      <Button
            fullWidth
            variant="contained"
            sx={{ 
              mt: 4,
              py: 2,
              borderRadius: 4,
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 700,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(34,197,94,0.10)' : '0 8px 32px rgba(19, 125, 19, 0.3)',
              '&:hover': {
                background: theme.palette.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: theme.palette.mode === 'dark' ? '0 12px 40px rgba(34,197,94,0.18)' : '0 12px 40px rgba(19, 125, 19, 0.4)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
            onClick={() => navigate(`/review/${id}`)}
          >
            <Star sx={{ mr: 1, fontSize: 20 }} />
            {t('giveReview')}
          </Button>

          </InfoCard>
      </Box>
    
      {/* Spacer */}
      <Box sx={{ height: '60px' }} />
      <Footer />
    </Box>

  );
};

export default DetailsPage;