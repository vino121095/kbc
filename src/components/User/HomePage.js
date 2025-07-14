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
  Divider,
  Container,
  Stack,
  Paper
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
  Groups,
  KeyboardArrowDown,
  MoreVert
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
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 3 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={160} sx={{ borderRadius: 3, mb: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Modern Header with Glassmorphism */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1e3a1e 0%, #137d13 100%)'
            : 'linear-gradient(135deg, #137d13 0%, #3ad13a 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0 0 32px 32px',
          boxShadow: '0 10px 30px rgba(19, 125, 19, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)'
              : 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, transparent 60%)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2, pt: 3, pb: 4 }}>
          <Fade in timeout={1000}>
            <Stack spacing={3}>
              {/* Header Content */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography 
                    variant="h5" 
                    color="white" 
                    fontWeight="800" 
                    sx={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      mb: 0.5
                    }}
                  >
                    {t('Welcome Back')} 👋
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="rgba(255, 255, 255, 0.9)" 
                    sx={{
                      fontWeight: '600',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    {loggedInMember ? `${loggedInMember.first_name} ${loggedInMember.last_name}` : ''}
                  </Typography>
                </Box>
                
                <Badge 
                  color="warning" 
                  variant="dot" 
                  invisible={!loggedInMember?.profile_image}
                  sx={{
                    '& .MuiBadge-badge': {
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '3px solid white',
                      backgroundColor: '#ffa726'
                    }
                  }}
                >
                  <Avatar
                    src={
                      loggedInMember?.profile_image
                        ? `${baseurl}/${loggedInMember.profile_image}`
                        : undefined
                    }
                    sx={{ 
                      width: 64, 
                      height: 64,
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                      color: '#137d13'
                    }}
                  >
                    {!loggedInMember?.profile_image && loggedInMember?.first_name?.[0]}
                  </Avatar>
                </Badge>
              </Box>

              {/* Modern Search Bar */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: theme.palette.background.paper,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search sx={{ 
                        color: theme.palette.primary.main, 
                        mr: 1.5,
                        fontSize: '1.2rem' // slightly smaller icon
                      }} />
                    ),
                    sx: { 
                      border: 'none',
                      minHeight: 36, // reduce min height
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiInputBase-input': {
                        py: 1, // reduce vertical padding
                        fontSize: '0.95rem', // smaller font
                        fontWeight: '500',
                        color: theme.palette.text.primary,
                        '&::placeholder': {
                          color: theme.palette.text.secondary,
                          opacity: 1
                        }
                      }
                    }
                  }}
                />
              </Paper>

              {/* Filter Indicator */}
              {selectedFilter && (
                <Fade in timeout={300}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FilterList sx={{ fontSize: 18, color: 'white' }} />
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: '600' }}>
                        {t('Filtered by')}: {selectedFilter}
                      </Typography>
                    </Stack>
                  </Paper>
                </Fade>
              )}
            </Stack>
          </Fade>
        </Container>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
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
            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
            zIndex: 1
          }}
        />
      </Box>

      {/* Filter Chips Section */}
      <Container maxWidth="sm" sx={{ mt: -2, position: 'relative', zIndex: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 4,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.32)' : '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} sx={{ flex: 1, overflowX: 'auto' }}>
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
                      sx={{
                        height: 40,
                        px: 1,
                        fontSize: '0.875rem',
                        fontWeight: chipFilter === status ? '700' : '500',
                        color: chipFilter === status ? 'white' : '#374151',
                        background: chipFilter === status
                          ? 'linear-gradient(135deg, #137d13, #3ad13a)'
                          : 'rgba(243, 244, 246, 0.8)',
                        border: chipFilter === status ? 'none' : '1px solid rgba(229, 231, 235, 0.8)',
                        boxShadow: chipFilter === status ? '0 4px 12px rgba(19, 125, 19, 0.3)' : 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: chipFilter === status 
                            ? '0 6px 16px rgba(19, 125, 19, 0.4)' 
                            : '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        '& .MuiChip-icon': {
                          color: chipFilter === status ? 'white' : '#6b7280'
                        }
                      }}
                      onClick={() => {
                        setChipFilter(status);
                        setSelectedFilter(status === 'All' ? '' : status);
                      }}
                    />
                  ))}
            </Stack>

            <IconButton 
              onClick={handleFilterClick} 
              sx={{ 
                ml: 1,
                width: 44,
                height: 44,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                border: '1px solid rgba(229, 231, 235, 0.8)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #137d13, #3ad13a)',
                  color: 'white',
                  transform: 'rotate(180deg)',
                  boxShadow: '0 4px 12px rgba(19, 125, 19, 0.3)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <FilterList />
            </IconButton>
          </Stack>
        </Paper>

        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleFilterClose}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 3,
              background: theme.palette.background.paper,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.32)' : '0 8px 32px rgba(0,0,0,0.12)',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.5,
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                fontWeight: '500',
                '&:hover': {
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText
                }
              }
            }
          }}
        >
          {filters.map((filter) => (
            <MenuItem
              key={filter}
              selected={selectedFilter === filter}
              onClick={() => {
                setSelectedFilter(filter);
                setChipFilter(filter);
                handleFilterClose();
              }}
            >
              {t(filter)}
            </MenuItem>
          ))}
        </Menu>
      </Container>

      {/* Members List */}
      <Container maxWidth="sm" sx={{ mt: 3, pb: 12 }}>
        {displayedMembers.length === 0 ? (
          <Fade in timeout={500}>
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 4,
                background: theme.palette.background.paper,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Groups sx={{ fontSize: 64, mb: 2, color: theme.palette.text.disabled }} />
              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary, fontWeight: '600' }}>
                {t('noMembers')}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {t('Try adjusting your filters or search terms')}
              </Typography>
            </Paper>
          </Fade>
        ) : (
          <Stack spacing={2}>
            {displayedMembers.map((member, index) => (
              <Fade key={member.mid} in timeout={300 + index * 100}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: theme.palette.background.paper,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.32)' : '0 4px 20px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.32)' : '0 8px 32px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            src={
                              member.BusinessProfiles?.[0]?.business_profile_image
                                ? `${baseurl}/${member.BusinessProfiles[0].business_profile_image}`
                                : undefined
                            }
                            sx={{
                              width: 68,
                              height: 68,
                              border: '3px solid',
                              borderColor: theme.palette.primary.main,
                              fontSize: '1.5rem',
                              fontWeight: 'bold',
                              background: theme.palette.background.default,
                              color: theme.palette.primary.main,
                              boxShadow: '0 4px 12px rgba(19, 125, 19, 0.2)'
                            }}
                          >
                            {!member.BusinessProfiles?.[0]?.business_profile_image &&
                              `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                          </Avatar>
                          {member.online && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 2,
                                right: 2,
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                background: '#10b981',
                                border: '3px solid white',
                                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: '700', color: theme.palette.text.primary, mb: 0.5, textAlign: 'left', lineHeight: 1.2 }}>
                            {member.first_name} {member.last_name}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessCenter sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontWeight: '500' }}>
                                {member.BusinessProfiles?.[0]?.company_name || t('No Business Info')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TrendingUp sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                {member.BusinessProfiles?.[0]?.business_type || t('No Business Info')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <Star sx={{ fontSize: 18, color: '#fbbf24' }} />
                              <Rating
                                value={memberRatings[member.mid]?.avgRating || 0}
                                precision={0.1}
                                readOnly
                                size="small"
                                sx={{
                                  '& .MuiRating-iconFilled': {
                                    color: '#fbbf24'
                                  }
                                }}
                              />
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: '500', ml: 0.5 }}>
                                ({memberRatings[member.mid]?.totalReviews || 0})
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box> {/* Close the Box for header (avatar + info) */}
                      {/* Rating and Status */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {member.online && (
                          <Chip 
                            label={t('online')} 
                            size="small"
                            sx={{ 
                              height: 24,
                              backgroundColor: theme.palette.mode === 'dark' ? '#134e13' : '#dcfce7',
                              color: theme.palette.mode === 'dark' ? '#bbf7d0' : '#166534',
                              fontWeight: '600',
                              fontSize: '0.75rem',
                              border: `1px solid ${theme.palette.mode === 'dark' ? '#134e13' : '#bbf7d0'}`
                            }}
                          />
                        )}
                      </Box>
                      {/* Action Button */}
                      {loggedInMember?.status === 'Approved' && (
                        <Button
                          variant="contained"
                          startIcon={<Visibility />}
                          fullWidth
                          sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #137d13, #3ad13a)',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 12px rgba(19, 125, 19, 0.3)',
                            color: theme.palette.getContrastText('#137d13'),
                            '&:hover': {
                              background: 'linear-gradient(135deg, #0f6b0f, #32c132)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 6px 16px rgba(19, 125, 19, 0.4)'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          onClick={() =>
                            chipFilter === 'Business Type'
                              ? navigate(`/business-details-view/${member.mid}`)
                              : navigate(`/details/${member.mid}`)
                          }
                        >
                          {t('view')}
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Paper>
              </Fade>
            ))}
          </Stack>
        )}

        {/* Load More Button */}
        {filteredMembers.length > displayedMembers.length && (
          <Fade in timeout={500}>
            <Button
              fullWidth
              variant="outlined"
              endIcon={<KeyboardArrowDown />}
              onClick={handleLoadMore}
              sx={{
                mt: 3,
                py: 2,
                borderRadius: 4,
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.background.paper,
                backdropFilter: 'blur(10px)',
                fontWeight: '600',
                fontSize: '1rem',
                textTransform: 'none',
                border: `2px solid ${theme.palette.primary.main}`,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark' ? '0 6px 20px rgba(19, 125, 19, 0.32)' : '0 6px 20px rgba(19, 125, 19, 0.3)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {t('Load More')} ({filteredMembers.length - displayedMembers.length} {t('remaining')})
            </Button>
          </Fade>
        )}
      </Container>

      <Footer />
      
      {/* Snackbar */}
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
            background: theme.palette.background.paper,
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.32)' : '0 8px 32px rgba(0,0,0,0.12)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;