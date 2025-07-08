import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import * as htmlToImage from 'html-to-image';
import * as XLSX from 'xlsx';
import baseurl from '../Baseurl/baseurl';

const Dashboard = () => {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeBusinesses, setActiveBusinesses] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);
  const [reviewsThisMonth, setReviewsThisMonth] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${baseurl}/api/member/all`);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const members = result.data;
          setTotalMembers(members.length);

          const totalBusinesses = members.reduce((acc, member) => {
            return acc + (member.BusinessProfiles ? member.BusinessProfiles.length : 0);
          }, 0);
          setActiveBusinesses(totalBusinesses);

          const pendingCount = members.filter(member => member.status === 'Pending').length;
          setPendingApplications(pendingCount);

          // Generate monthly chart data
          const monthlyStats = Array(12).fill(null).map((_, index) => ({
            name: new Date(0, index).toLocaleString('default', { month: 'short' }),
            'New Registrations': 0,
            'Business Listings': 0
          }));

          members.forEach(member => {
            const createdAt = new Date(member.createdAt);
            const monthIndex = createdAt.getMonth();

            monthlyStats[monthIndex]['New Registrations'] += 1;

            if (Array.isArray(member.BusinessProfiles)) {
              monthlyStats[monthIndex]['Business Listings'] += member.BusinessProfiles.length;
            }
          });

          setChartData(monthlyStats);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${baseurl}/api/ratings/all`);
        const result = await res.json();
        if (result?.data) {
          setReviews(result.data);

          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const thisMonthReviews = result.data.filter(review => {
            const reviewDate = new Date(review.createdAt);
            return (
              reviewDate.getMonth() === currentMonth &&
              reviewDate.getFullYear() === currentYear
            );
          });

          setReviewsThisMonth(thisMonthReviews.length);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchMembers();
    fetchReviews();
  }, []);

  const exportToImage = async (format = 'png') => {
    const chartElement = document.querySelector('.recharts-wrapper');
    
    if (!chartElement) {
      console.error('Chart element not found');
      return;
    }

    try {
      let dataUrl;
      if (format === 'png') {
        dataUrl = await htmlToImage.toPng(chartElement);
      } else {
        dataUrl = await htmlToImage.toJpeg(chartElement, { quality: 0.95 });
      }

      const link = document.createElement('a');
      link.download = `growth-analytics.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  const exportToExcel = () => {
    // Prepare data for Excel export
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Growth Analytics');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'growth-analytics.xlsx');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const statsCards = [
     {
      title: 'Total Members',
      value: totalMembers.toLocaleString(),
      change: '+12% from last month',
      changeType: 'positive',
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      iconBg: '#2e7d32'
    },
    {
      title: 'Active Businesses',
      value: activeBusinesses.toLocaleString(),
      change: '+8% from last month',
      changeType: 'positive',
      icon: <BusinessIcon sx={{ fontSize: 28 }} />,
      iconBg: '#2e7d32'
    },
    {
      title: 'Pending Applications',
      value: pendingApplications.toLocaleString(),
      change: 'Requires attention',
      changeType: 'warning',
      icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
      iconBg: '#d32f2f'
    },
    {
      title: 'Reviews This Month',
      value: reviewsThisMonth.toLocaleString(),
      change: 'Live count',
      changeType: 'neutral',
      icon: <StarIcon sx={{ fontSize: 28 }} />,
      iconBg: '#2e7d32'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0',
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      backgroundColor: card.iconBg,
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(card.icon, { sx: { color: 'white', fontSize: 28 } })}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {card.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {card.changeType === 'positive' && (
                        <ArrowUpwardIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            card.changeType === 'positive'
                              ? '#4caf50'
                              : card.changeType === 'warning'
                              ? '#f44336'
                              : 'text.secondary'
                        }}
                      >
                        {card.change}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ width: '100%' }}>
        <Card
          sx={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #f0f0f0',
            borderRadius: 2,
            width: '100%'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Growth Analytics
              </Typography>
              <div>
                <Button 
                  size="small" 
                  sx={{ color: '#2e7d32', textTransform: 'none' }}
                  onClick={handleMenuClick}
                >
                  Export Data
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { exportToExcel(); handleMenuClose(); }}>
                    Export to Excel
                  </MenuItem>
                  <MenuItem onClick={() => { exportToImage('png'); handleMenuClose(); }}>
                    Export as PNG
                  </MenuItem>
                  <MenuItem onClick={() => { exportToImage('jpeg'); handleMenuClose(); }}>
                    Export as JPEG
                  </MenuItem>
                </Menu>
              </div>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="New Registrations"
                    fill="#2e7d32"
                    radius={[4, 4, 0, 0]}
                    name="New Registrations"
                  />
                  <Bar
                    dataKey="Business Listings"
                    fill="#66bb6a"
                    radius={[4, 4, 0, 0]}
                    name="Business Listings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FiberManualRecordIcon sx={{ fontSize: 12, color: '#2e7d32', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  New Registrations
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FiberManualRecordIcon sx={{ fontSize: 12, color: '#66bb6a', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Business Listings
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;