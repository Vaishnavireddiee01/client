import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tabs,
    Tab,
    Badge,
    Avatar,
    TextField,
    MenuItem,
    LinearProgress,
    Paper
} from '@mui/material';
import {
    Work as WorkIcon,
    Business as BusinessIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    School as SchoolIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function Applications() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/applications/my-applications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleApplicationStatus = async (applicationId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/applications/${applicationId}`, {
                status,
                feedback
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedback('');
            setOpenDialog(false);
            fetchApplications();
        } catch (error) {
            console.error('Error updating application status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'success';
            case 'rejected':
                return 'error';
            default:
                return 'warning';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <CheckCircleIcon color="success" />;
            case 'rejected':
                return <CancelIcon color="error" />;
            default:
                return <PendingIcon color="warning" />;
        }
    };

    const renderApplicationCard = (application) => {
        const job = application.job;
        const company = job.company;

        return (
            <Card key={application.jobId} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={company.profilePicture}
                            sx={{ width: 56, height: 56, mr: 2 }}
                        >
                            {company.name[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">
                                {job.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {company.companyName}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(application.status)}
                            <Typography variant="body2" color={`${getStatusColor(application.status)}.main`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <LocationIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={job.location} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MoneyIcon />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={`${job.salary?.min || 'N/A'} - ${job.salary?.max || 'N/A'} ${job.salary?.currency || 'USD'}`} 
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <TimeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={job.jobType} />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <SchoolIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={job.experience} />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <WorkIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={`Applied: ${new Date(application.appliedAt).toLocaleDateString()}`} />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Required Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {job.skills?.map((skill, i) => (
                                <Chip key={i} label={skill} size="small" />
                            ))}
                        </Box>
                    </Box>

                    {application.status === 'pending' && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    setSelectedApplication(application);
                                    setOpenDialog(true);
                                }}
                            >
                                Withdraw Application
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    const renderCompanyApplicationCard = (application) => {
        const applicant = application.applicant;
        return (
            <Card key={application._id} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={applicant.profilePicture}
                            sx={{ width: 56, height: 56, mr: 2 }}
                        >
                            {applicant.name[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">
                                {applicant.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {applicant.email}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(application.status)}
                            <Typography variant="body2" color={`${getStatusColor(application.status)}.main`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {applicant.skills?.map((skill, i) => (
                                <Chip key={i} label={skill} size="small" />
                            ))}
                        </Box>
                    </Box>

                    {applicant.experience && applicant.experience.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Experience:
                            </Typography>
                            <List dense>
                                {applicant.experience.map((exp, i) => (
                                    <ListItem key={i}>
                                        <ListItemIcon>
                                            <WorkIcon />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={`${exp.title} at ${exp.company}`}
                                            secondary={exp.duration}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {application.status === 'pending' && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    setSelectedApplication(application);
                                    setOpenDialog(true);
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    setSelectedApplication(application);
                                    setOpenDialog(true);
                                }}
                            >
                                Accept
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Applications
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab 
                        icon={<WorkIcon />} 
                        label="My Applications" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={
                            <Badge 
                                badgeContent={applications.filter(app => app.status === 'pending').length} 
                                color="error"
                            >
                                <DescriptionIcon />
                            </Badge>
                        } 
                        label="Received Applications" 
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {applications.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center">
                        No applications yet
                    </Typography>
                ) : (
                    applications.map(renderApplicationCard)
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                {applications.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center">
                        No received applications yet
                    </Typography>
                ) : (
                    applications.map(renderCompanyApplicationCard)
                )}
            </TabPanel>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedApplication?.status === 'pending' 
                        ? 'Update Application Status' 
                        : 'Withdraw Application'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Add feedback (optional)..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button 
                        onClick={() => handleApplicationStatus(
                            selectedApplication._id,
                            selectedApplication.status === 'pending' ? 'withdrawn' : 'rejected'
                        )} 
                        variant="contained" 
                        color="error"
                    >
                        {selectedApplication?.status === 'pending' ? 'Withdraw' : 'Reject'}
                    </Button>
                    {selectedApplication?.status === 'pending' && (
                        <Button 
                            onClick={() => handleApplicationStatus(selectedApplication._id, 'accepted')} 
                            variant="contained" 
                            color="success"
                        >
                            Accept
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Applications; 