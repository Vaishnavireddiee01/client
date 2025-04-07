import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function JobCard({ job, onViewApplicants }) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {job.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    {job.location} • {job.jobType}
                </Typography>
                <Typography variant="body2" paragraph>
                    {job.description.substring(0, 150)}...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Applications: {job.applications?.length || 0}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => onViewApplicants(job._id)}>
                    View Applicants
                </Button>
            </CardActions>
        </Card>
    );
}

function CompanyDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        requirements: '',
        skills: '',
        location: '',
        jobType: 'Full-time',
        experience: 'Entry Level',
        remoteWork: false
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/jobs/company', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleCreateJob = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/jobs', newJob, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOpenDialog(false);
            fetchJobs();
        } catch (error) {
            console.error('Error creating job:', error);
        }
    };

    const handleViewApplicants = (jobId) => {
        navigate(`/company/applicants/${jobId}`);
    };

    const dashboardItems = [
        {
            title: 'Post New Job',
            description: 'Create a new job posting',
            icon: <AddIcon color="primary" />,
            onClick: () => setOpenDialog(true)
        },
        {
            title: 'Profile',
            description: 'View and edit your company profile',
            icon: <PersonIcon color="primary" />,
            path: '/company/profile'
        },
        {
            title: 'Settings',
            description: 'Manage your account settings',
            icon: <SettingsIcon color="primary" />,
            path: '/company/settings'
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome, {user?.companyName}!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage your job postings and view applications
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {dashboardItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    {item.icon}
                                    <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                                        {item.title}
                                    </Typography>
                                </Box>
                                <Typography color="textSecondary">
                                    {item.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary" onClick={item.onClick || (() => navigate(item.path))}>
                                    {item.title === 'Post New Job' ? 'Create' : 'View More'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Active Job Postings
            </Typography>

            <Grid container spacing={3}>
                {jobs.map((job) => (
                    <Grid item xs={12} sm={6} md={4} key={job._id}>
                        <JobCard job={job} onViewApplicants={handleViewApplicants} />
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New Job Posting</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Job Title"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Requirements"
                        multiline
                        rows={3}
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Skills (comma-separated)"
                        value={newJob.skills}
                        onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Location"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        select
                        label="Job Type"
                        value={newJob.jobType}
                        onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                        margin="normal"
                    >
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                        <MenuItem value="Internship">Internship</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        select
                        label="Experience Level"
                        value={newJob.experience}
                        onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                        margin="normal"
                    >
                        <MenuItem value="Entry Level">Entry Level</MenuItem>
                        <MenuItem value="Junior">Junior</MenuItem>
                        <MenuItem value="Mid Level">Mid Level</MenuItem>
                        <MenuItem value="Senior">Senior</MenuItem>
                        <MenuItem value="Lead">Lead</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateJob} variant="contained" color="primary">
                        Create Job
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default CompanyDashboard; 