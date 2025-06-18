import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Container,
    TextField,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    IconButton,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import {
    FamilyRestroom,
    ArrowBack,
    Save
} from '@mui/icons-material';
import baseurl from '../Baseurl/baseurl';

const EditFamily = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [family, setFamily] = useState({
        father_name: '',
        father_contact: '',
        mother_name: '',
        mother_contact: '',
        spouse_name: '',
        spouse_contact: '',
        number_of_children: 0,
        children_names: [],
        address: '',
        children_details: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch member data
    useEffect(() => {
        const fetchMember = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseurl}/api/member/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Failed to fetch member');
                }

                setMember(data.data);
                
                // Initialize family data if exists
                if (data.data.MemberFamily) {
                    // Convert children names from JSON string to array
                    const childrenArray = data.data.MemberFamily.children_names 
                        ? JSON.parse(data.data.MemberFamily.children_names) 
                        : [];
                    
                    setFamily({
                        father_name: data.data.MemberFamily.father_name || '',
                        father_contact: data.data.MemberFamily.father_contact || '',
                        mother_name: data.data.MemberFamily.mother_name || '',
                        mother_contact: data.data.MemberFamily.mother_contact || '',
                        spouse_name: data.data.MemberFamily.spouse_name || '',
                        spouse_contact: data.data.MemberFamily.spouse_contact || '',
                        number_of_children: data.data.MemberFamily.number_of_children || 0,
                        children_names: childrenArray,
                        address: data.data.MemberFamily.address || '',
                        children_details: childrenArray.join(', ') // Convert array to string for input
                    });
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching member');
                setSnackbarMessage(err.message || 'Failed to load family details');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                console.error('Error fetching member:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFamily(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Convert children details to array
            const childrenArray = family.children_details 
                ? family.children_details.split(',').map(name => name.trim()).filter(name => name)
                : [];
            
            // Prepare payload matching backend expectations
            const payload = {
                member_id: parseInt(id),
                father_name: family.father_name,
                father_contact: family.father_contact,
                mother_name: family.mother_name,
                mother_contact: family.mother_contact,
                spouse_name: family.spouse_name,
                spouse_contact: family.spouse_contact,
                number_of_children: childrenArray.length,
                children_names: childrenArray,
                address: family.address,
                marital_status: member?.marital_status || ''
            };

            const response = await fetch(`${baseurl}/api/family-details/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to update family details');
            }

            setSnackbarMessage('Family details updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            
            // Redirect after successful update
            setTimeout(() => {
                navigate('/admin/FamilyInformation');
            }, 1500);
        } catch (err) {
            setError(err.message || 'An error occurred while updating');
            setSnackbarMessage(err.message || 'Failed to update family details');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error('Error updating family:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading && !member) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h5" color="error" gutterBottom>
                    Error
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/admin/FamilyInformation')}
                    sx={{ mt: 2 }}
                >
                    Back to Family Information
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button 
                variant="outlined" 
                startIcon={<ArrowBack />}
                onClick={() => navigate('/admin/FamilyInformation')}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            src={member?.profile_image ? `${baseurl}/${member.profile_image}` : undefined}
                            sx={{ width: 80, height: 80, mr: 3 }}
                        >
                            {member?.first_name?.[0]}{member?.last_name?.[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                Edit Family Details
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {member?.first_name} {member?.last_name}
                            </Typography>
                        </Box>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Family Details */}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FamilyRestroom sx={{ mr: 1, color: '#2E7D32' }} />
                                    Family Information
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Father's Name"
                                    name="father_name"
                                    value={family.father_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Father's Contact"
                                    name="father_contact"
                                    value={family.father_contact}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mother's Name"
                                    name="mother_name"
                                    value={family.mother_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mother's Contact"
                                    name="mother_contact"
                                    value={family.mother_contact}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Spouse Name"
                                    name="spouse_name"
                                    value={family.spouse_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Spouse Contact"
                                    name="spouse_contact"
                                    value={family.spouse_contact}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Marital Status</InputLabel>
                                    <Select
                                        value={member?.marital_status || ''}
                                        label="Marital Status"
                                        onChange={(e) => setMember(prev => ({
                                            ...prev,
                                            marital_status: e.target.value
                                        }))}
                                    >
                                        <MenuItem value="single">Single</MenuItem>
                                        <MenuItem value="married">Married</MenuItem>
                                        <MenuItem value="divorced">Divorced</MenuItem>
                                        <MenuItem value="widowed">Widowed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Family Address"
                                    name="address"
                                    value={family.address}
                                    onChange={handleChange}
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Children Details"
                                    name="children_details"
                                    value={family.children_details}
                                    onChange={handleChange}
                                    variant="outlined"
                                    placeholder="Enter names separated by commas"
                                    helperText="e.g., John, Mary, David"
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained" 
                                    startIcon={<Save />}
                                    disabled={loading}
                                    sx={{
                            bgcolor: '#4CAF50',
                            minWidth: 120,
                            '&:hover': { bgcolor: '#45a049' },
                             py: 1.5, px: 4 
                        }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EditFamily;