// HomePage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Chip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  Fade,
  Skeleton,
  Badge,
  Divider
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  BusinessCenter, 
  Person, 
  LocationOn, 
  Star, 
  Visibility,
  TrendingUp,
  Groups
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../Footer';
import Rating from '@mui/material/Rating';
import { useCustomTheme } from '../../context/ThemeContext';
import baseurl from '../Baseurl/baseurl';

const filters = [
  'Company Name',
  'Company Category',
  'Member Name',
  'Member Kootam',
  'Review'
];

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useCustomTheme();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedInMember, setLoggedInMember] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [displayedMembers, setDisplayedMembers] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [chipFilter, setChipFilter] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [memberRatings, setMemberRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMemberRatings = async (memberId, businessId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseurl}/api/ratings/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success !== false && data.data) {
        const ratings = data.data;
        const avgRating = ratings.length > 0 
          ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length 
          : 0;
        
        setMemberRatings(prev => ({
          ...prev,
          [memberId]: {
            avgRating: avgRating,
            totalReviews: ratings.length
          }
        }));
      }
    } catch (error) {
      console.error(`Error fetching ratings for member ${memberId}:`, error);
    }
  };

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
          setLoading(false);
        })
        .catch(() => {
          setLoggedInMember(stored);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Set chipFilter based on member status
  useEffect(() => {
    if (loggedInMember) {
      if (loggedInMember.status === 'Pending') {
        setChipFilter('Business Type');
      } else {
        setChipFilter('All');
      }
    }
  }, [loggedInMember]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${baseurl}/api/member/all`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const members = Array.isArray(data.data) ? data.data : [data.data];
          setMembersData(members);
          
          // Fetch ratings for each member with a business profile
          members.forEach(member => {
            if (member.BusinessProfiles?.[0]?.id) {
              fetchMemberRatings(member.mid, member.BusinessProfiles[0].id);
            }
          });
        }
      })
      .catch(() => setMembersData([]));
  }, []);

  useEffect(() => {
    if (!loggedInMember || !membersData.length) {
      setFilteredMembers([]);
      return;
    }

    let filtered = [];

    if (loggedInMember.status === 'Pending') {
      filtered = membersData.filter(
        (m) =>
          m.mid !== loggedInMember.mid &&
          m.BusinessProfiles?.[0]?.business_type
      );
    } else if (loggedInMember.status === 'Approved') {
      if (loggedInMember.access_level === 'Basic') {
        filtered = membersData.filter(
          (m) => m.access_level === 'Basic' && m.mid !== loggedInMember.mid
        );
      } else if (loggedInMember.access_level === 'Advanced') {
        filtered = membersData.filter((m) => m.mid !== loggedInMember.mid);
      }
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((m) => {
        const fullName = `${m.first_name} ${m.last_name}`.toLowerCase();
        const businessName = m.BusinessProfiles?.[0]?.company_name?.toLowerCase() || '';
        const businessType = m.BusinessProfiles?.[0]?.business_type?.toLowerCase() || '';
        const kootam = m.kootam?.toLowerCase() || '';

        switch (selectedFilter) {
          case 'Company Name':
            return businessName.includes(lowerSearch);
          case 'Company Category':
            return businessType.includes(lowerSearch);
          case 'Member Name':
            return fullName.includes(lowerSearch);
          case 'Member Kootam':
            return kootam.includes(lowerSearch);
          case 'Review':
            return false;
          default:
            return (
              fullName.includes(lowerSearch) ||
              businessName.includes(lowerSearch) ||
              businessType.includes(lowerSearch) ||
              kootam.includes(lowerSearch)
            );
        }
      });
    }

    if (
      ['Company Name', 'Company Category', 'Member Name', 'Member Kootam'].includes(selectedFilter)
    ) {
      filtered.sort((a, b) => {
        const getSortValue = (m) => {
          switch (selectedFilter) {
            case 'Company Name':
              return m.BusinessProfiles?.[0]?.company_name || '';
            case 'Company Category':
              return m.BusinessProfiles?.[0]?.business_type || '';
            case 'Member Name':
              return `${m.first_name} ${m.last_name}`;
            case 'Member Kootam':
              return m.kootam || '';
            default:
              return '';
          }
        };
        return getSortValue(a).localeCompare(getSortValue(b));
      });
    }

    setFilteredMembers(filtered);
    setItemsToShow(5); // Reset to show first 5 when filters change
  }, [loggedInMember, membersData, searchTerm, chipFilter, selectedFilter]);

  // Update displayed members when filteredMembers or itemsToShow changes
  useEffect(() => {
    setDisplayedMembers(filteredMembers.slice(0, itemsToShow));
  }, [filteredMembers, itemsToShow]);

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 5); // Load 5 more items
  };

  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);

  const handleViewProfile = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      const memberData = JSON.parse(localStorage.getItem('memberData'));
      
      if (!token || !memberData?.mid) {
        throw new Error('Not authenticated');
      }

      // Don't send notification if viewing own profile
      if (memberData.mid === memberId) {
        navigate(`/details/${memberId}`);
        return;
      }

      const response = await fetch(`${baseurl}/api/profileview`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender_id: memberData.mid,
          receiver_id: memberId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // If it's a 400 error about duplicate notification, just proceed with navigation
        if (response.status === 400 && data.error?.includes('already sent')) {
          navigate(`/details/${memberId}`);
          return;
        }
        throw new Error(data.error || 'Failed to send notification');
      }

      // Navigate to details page after successful notification
      navigate(`/details/${memberId}`);
    } catch (err) {
      console.error('Error sending profile view notification:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getFilterIcon = (filter) => {
    switch (filter) {
      case 'All': return <Groups />;
      case 'Members': return <Person />;
      case 'Business Type': return <BusinessCenter />;
      default: return <Groups />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        p: 2
      }}>
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4, mb: 2 }} />
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      color: theme.palette.text.primary
    }}>
      {/* Compact Header with Reduced Height */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #137d13 0%, #3ad13a 100%)',
          position: 'relative',
          overflow: 'hidden',
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
        <Box sx={{ 
          position: 'relative', 
          zIndex: 2, 
          p: 2,
          pb: 2.5
        }}>
          <Fade in timeout={1000}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h5" 
                color="white" 
                fontWeight="700" 
                sx={{
                  textAlign: "left",
                  mb: 0.5,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {t('Welcome Back')} 👋
              </Typography>
              <Typography 
                variant="body1" 
                color="rgba(255, 255, 255, 0.9)" 
                sx={{
                  textAlign: "left",
                  fontWeight: '500'
                }}
              >
                {loggedInMember ? `${loggedInMember.first_name} ${loggedInMember.last_name}` : ''}
              </Typography>
            </Box>
          </Fade>

          {/* Compact Search Bar */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ color: theme.palette.primary.main, mr: 1 }} />,
                sx: { 
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: `2px solid ${theme.palette.primary.main}`
                  },
                  '& .MuiInputBase-input': {
                    color: theme.palette.text.primary,
                    fontWeight: '500',
                    py: 1.5
                  },
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }
              }}
            />
            <Badge 
              color="primary" 
              variant="dot" 
              invisible={!loggedInMember?.profile_image}
            >
              <Avatar
                src={
                  loggedInMember?.profile_image
                    ? `${baseurl}/${loggedInMember.profile_image}`
                    : undefined
                }
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {!loggedInMember?.profile_image && loggedInMember?.first_name?.[0]}
              </Avatar>
            </Badge>
          </Box>

          {selectedFilter && (
            <Fade in timeout={300}>
              <Box
                sx={{
                  mt: 1.5,
                  p: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="caption" sx={{ color: 'white', fontWeight: '600' }}>
                  <FilterList sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                  Active Filter: {selectedFilter}
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>

        {/* Smaller Decorative Elements */}
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

      {/* Compact Filter Chips */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          mt: -1.5,
          position: 'relative',
          zIndex: 3
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {loggedInMember &&
            ['All', 'Members', 'Business Type']
              .filter((status) => {
                if (loggedInMember.status === 'Pending') {
                  return status === 'Business Type';
                }
                return true;
              })
              .map((status) => (
                <Chip
                  key={status}
                  icon={getFilterIcon(status)}
                  label={t(status.toLowerCase())}
                  size="small"
                  sx={{
                    color: chipFilter === status ? 'white' : theme.palette.text.primary,
                    background: chipFilter === status
                      ? 'linear-gradient(135deg, #137d13, #3ad13a)'
                      : theme.palette.mode === 'dark' 
                        ? theme.palette.grey[700] 
                        : theme.palette.grey[200],
                    fontWeight: chipFilter === status ? '600' : '500',
                    boxShadow: chipFilter === status ? '0 2px 8px rgba(19, 125, 19, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => setChipFilter(status)}
                />
              ))}
        </Box>

        <IconButton 
          onClick={handleFilterClick} 
          size="small"
          sx={{ 
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              transform: 'rotate(180deg)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <FilterList />
        </IconButton>
        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleFilterClose}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.divider}`
            }
          }}
        >
          {filters.map((filter) => (
            <MenuItem
              key={filter}
              onClick={() => {
                setSelectedFilter(filter);
                handleFilterClose();
              }}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white'
                }
              }}
            >
              {t(filter)}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Enhanced Members List */}
      <Box px={2} py={1.5}>
        {displayedMembers.length === 0 ? (
          <Fade in timeout={500}>
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 6,
                color: theme.palette.text.secondary
              }}
            >
              <Groups sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('noMembers')}
              </Typography>
              <Typography variant="body2">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          </Fade>
        ) : (
          displayedMembers.map((member, index) => (
            <Fade key={member.mid} in timeout={300 + index * 100}>
              <Card 
                sx={{ 
                  mb: 2, 
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <Box display="flex" alignItems="flex-start" width="100%">
                    <Badge 
                      color="success" 
                      variant="dot" 
                      invisible={!member.online}
                      sx={{
                        '& .MuiBadge-badge': {
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          border: '2px solid white'
                        }
                      }}
                    >
                      <Avatar
                        src={
                          member.BusinessProfiles?.[0]?.business_profile_image
                            ? `${baseurl}/${member.BusinessProfiles[0].business_profile_image}`
                            : undefined
                        }
                        sx={{
                          width: 56,
                          height: 56,
                          border: '2px solid',
                          borderColor: theme.palette.primary.main,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                      >
                        {!member.BusinessProfiles?.[0]?.business_profile_image &&
                          `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                      </Avatar>
                    </Badge>
                    <Box ml={2} flex={1} minWidth={0}>
                      {(() => {
                        switch (chipFilter) {
                          case 'Members':
                            return (
                              <>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5, textAlign: 'left' }}>
                                  {member.first_name} {member.last_name}
                                </Typography>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <Person sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2" color="textSecondary">
                                    {member.email || t('noEmail')}
                                  </Typography>
                                </Box>
                              </>
                            );
                          case 'Business Type':
                            return (
                              <>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5, textAlign: 'left' }}>
                                  {member.BusinessProfiles?.[0]?.company_name || t('noBusinessInfo')}
                                </Typography>
                                <Box display="flex" alignItems="center" mb={0.5}>
                                  <BusinessCenter sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2" color="textSecondary">
                                    {member.BusinessProfiles?.[0]?.business_type || t('noBusinessInfo')}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <LocationOn sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2" color="textSecondary">
                                    {member.BusinessProfiles?.[0]?.company_address || t('noAddress')}
                                  </Typography>
                                </Box>
                              </>
                            );
                          case 'All':
                          default:
                            return (
                              <>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5, textAlign: 'left' }}>
                                  {member.first_name} {member.last_name}
                                </Typography>
                                <Box display="flex" alignItems="center" mb={0.5}>
                                  <BusinessCenter sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2" color="textSecondary">
                                    {member.BusinessProfiles?.[0]?.company_name || t('noBusinessInfo')}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <TrendingUp sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2" color="textSecondary">
                                    {member.BusinessProfiles?.[0]?.business_type || t('noBusinessInfo')}
                                  </Typography>
                                </Box>
                              </>
                            );
                        }
                      })()}

                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <Star sx={{ fontSize: 14, mr: 0.5, color: '#FFA726' }} />
                          <Rating
                            name={`rating-${member.mid}`}
                            value={memberRatings[member.mid]?.avgRating || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" ml={0.5} color="textSecondary">
                            ({memberRatings[member.mid]?.totalReviews || 0})
                          </Typography>
                        </Box>
                        {member.online && (
                          <Chip 
                            label={t('online')} 
                            color="success" 
                            size="small"
                            sx={{ 
                              fontWeight: '600',
                              fontSize: '0.7rem',
                              height: 20
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  {loggedInMember?.status === 'Approved' && (
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="contained"
                        startIcon={<Visibility />}
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(135deg, #137d13, #3ad13a)',
                          borderRadius: 2,
                          color: 'white',
                          fontWeight: '600',
                          px: 2,
                          py: 1,
                          textTransform: 'none',
                          boxShadow: '0 2px 8px rgba(19, 125, 19, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0f6b0f, #32c132)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(19, 125, 19, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() =>
                          chipFilter === 'Business Type'
                            ? navigate(`/business-details-view/${member.mid}`)
                            : navigate(`/details/${member.mid}`)
                        }
                      >
                        {t('view')}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Fade>
          ))
        )}

        {filteredMembers.length > displayedMembers.length && (
          <Fade in timeout={500}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ 
                mt: 2, 
                mb: 10,
                borderRadius: 3,
                py: 1.5,
                color: theme.palette.primary.main, 
                borderColor: theme.palette.primary.main,
                backgroundColor: 'transparent',
                fontSize: '0.95rem',
                fontWeight: '600',
                textTransform: 'none',
                border: `2px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.3s ease'
              }}
              onClick={handleLoadMore}
            >
              {t('Load More')} ({filteredMembers.length - displayedMembers.length} remaining)
            </Button>
          </Fade>
        )}
      </Box>

      <Footer />
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;