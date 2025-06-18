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
  useTheme
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../Footer';
import Rating from '@mui/material/Rating';
import { useCustomTheme } from '../../context/ThemeContext';

const BaseUrl = 'http://localhost:8000';

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

  const fetchMemberRatings = async (memberId, businessId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BaseUrl}/api/ratings/${businessId}`, {
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
      fetch(`${BaseUrl}/api/member/${stored.mid}`, {
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
    fetch(`${BaseUrl}/api/member/all`, {
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

      const response = await fetch(`${BaseUrl}/api/profileview`, {
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

  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      color: theme.palette.text.primary
    }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(to bottom right, #137d13, #3ad13a)',
          p: 2,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30
        }}
      >
        <Typography variant="h5" color="white" fontWeight="bold" sx={{textAlign: "left"}}>
          {t('welcomeBack')} 👋
        </Typography>
        <Typography variant="subtitle1" color="white" sx={{textAlign: "left"}}>
          {loggedInMember ? `${loggedInMember.first_name} ${loggedInMember.last_name}` : ''}
        </Typography>

        <Box mt={2} display="flex" alignItems="center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'gray' }} />,
              sx: { 
                borderRadius: 10, 
                backgroundColor: 'background.paper',
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary
                }
              }
            }}
          />
          <Avatar
            src={
              loggedInMember?.profile_image
                ? `http://localhost:8000/${loggedInMember.profile_image}`
                : undefined
            }
            sx={{ ml: 2 }}
          >
            {!loggedInMember?.profile_image && loggedInMember?.first_name?.[0]}
          </Avatar>
        </Box>

        {selectedFilter && (
          <Typography variant="caption" sx={{ mt: 1, color: 'white' }}>
            Filter: {selectedFilter}
          </Typography>
        )}
      </Box>

      {/* Filter Chips */}
      <Box
        sx={{
          px: 2,
          pt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
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
                  label={t(status.toLowerCase())}
                  sx={{
                    mr: 1,
                    color: chipFilter === status ? 'white' : 'default',
                    background:
                      chipFilter === status
                        ? 'linear-gradient(to bottom right, #137d13, #3ad13a)'
                        : theme.palette.mode === 'dark' 
                          ? theme.palette.grey[700] 
                          : theme.palette.grey[300]
                  }}
                  onClick={() => setChipFilter(status)}
                />
              ))}
        </Box>

        <Box>
          <IconButton onClick={handleFilterClick} sx={{ color: theme.palette.text.primary }}>
            <FilterList />
          </IconButton>
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleFilterClose}
            PaperProps={{
              style: {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
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
              >
                {t(filter)}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Members List */}
      <Box px={2}>
        {displayedMembers.length === 0 ? (
          <Typography sx={{ mt: 2, textAlign: 'center' }}>{t('noMembers')}</Typography>
        ) : (
          displayedMembers.map((member) => (
            <Card 
              key={member.mid} 
              sx={{ 
                my: 2, 
                borderRadius: 3, 
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={
                        member.BusinessProfiles?.[0]?.business_profile_image
                          ? `${BaseUrl}/${member.BusinessProfiles[0].business_profile_image}`
                          : undefined
                      }
                    >
                      {!member.BusinessProfiles?.[0]?.business_profile_image &&
                        `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                    </Avatar>

                    <Box ml={2} sx={{ color: theme.palette.text.primary }}>
                      {(() => {
                        switch (chipFilter) {
                          case 'Members':
                            return (
                              <>
                                <Typography fontWeight="bold">
                                  {member.first_name} {member.last_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {member.email || t('noEmail')}
                                </Typography>
                              </>
                            );
                          case 'Business Type':
                            return (
                              <>
                                <Typography fontWeight="bold">
                                  {member.BusinessProfiles?.[0]?.company_name || t('noBusinessInfo')}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {member.BusinessProfiles?.[0]?.business_type || t('noBusinessInfo')}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {member.BusinessProfiles?.[0]?.company_address || t('noAddress')}
                                </Typography>
                              </>
                            );
                          case 'All':
                          default:
                            return (
                              <>
                                <Typography fontWeight="bold">
                                  {member.first_name} {member.last_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {member.BusinessProfiles?.[0]?.company_name || t('noBusinessInfo')}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {member.BusinessProfiles?.[0]?.business_type || t('noBusinessInfo')}
                                </Typography>
                              </>
                            );
                        }
                      })()}

                      <Box display="flex" alignItems="center" mt={1}>
                        <Rating
                          name={`rating-${member.mid}`}
                          value={memberRatings[member.mid]?.avgRating || 0}
                          precision={0.1}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" ml={1}>
                          ({memberRatings[member.mid]?.totalReviews || 0})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box textAlign="right">
                    {member.online && (
                      <Chip 
                        label={t('online')} 
                        color="success" 
                        size="small" 
                        sx={{ mb: 1 }} 
                      />
                    )}
                    {loggedInMember?.status === 'Approved' && (
                      <Button
                        variant="contained"
                        sx={{ 
                          mt: 1, 
                          background: 'linear-gradient(to right, #137d13, #3ad13a)',
                          borderRadius: 5,
                          color: 'white'
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
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}

        {filteredMembers.length > displayedMembers.length && (
          <Button
            fullWidth
            variant="outlined"
            sx={{ 
              mt: 2, 
              mb: 10,
              borderRadius: 5, 
              color: 'primary.main', 
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark'
              }
            }}
            onClick={handleLoadMore}
          >
            {t('Load More')} ({filteredMembers.length - displayedMembers.length} remaining)
          </Button>
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