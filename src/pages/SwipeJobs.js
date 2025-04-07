import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
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
    Rating,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Info as InfoIcon,
    Work as WorkIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    AccessTime as TimeIcon,
    Business as BusinessIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function SwipeJobs() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedJob, setSelectedJob] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const onSwipe = async (direction, jobId) => {
        if (direction === 'right') {
            setSelectedJob(jobs[currentIndex]);
            setOpenDialog(true);
        }
        setCurrentIndex(currentIndex + 1);
    };

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/applications/${selectedJob._id}`, {
                coverLetter
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOpenDialog(false);
            setCoverLetter('');
            navigate('/applications');
        } catch (error) {
            console.error('Error applying for job:', error);
        }
    };

    const getExperienceLevel = (level) => {
        const levels = {
            'Entry Level': 1,
            'Junior': 2,
            'Mid Level': 3,
            'Senior': 4,
            'Lead': 5
        };
        return levels[level] || 0;
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Find Jobs
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Swipe right to apply for jobs, left to skip
            </Typography>

            <Box sx={{ height: '600px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {jobs.map((job, index) => (
                    <Box
                        key={job._id}
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            display: index === currentIndex ? 'block' : 'none'
                        }}
                    >
                        <TinderCard
                            onSwipe={(dir) => onSwipe(dir, job._id)}
                            preventSwipe={['up', 'down']}
                        >
                            <Card sx={{ height: '500px', position: 'relative' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <BusinessIcon sx={{ mr: 1 }} />
                                        <Typography variant="h5" component="h2">
                                            {job.company.companyName}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {job.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        {job.description}
                                    </Typography>

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
                                        <ListItem>
                                            <ListItemIcon>
                                                <SchoolIcon />
                                            </ListItemIcon>
                                            <ListItemText>
                                                <Rating 
                                                    value={getExperienceLevel(job.experience)} 
                                                    readOnly 
                                                    size="small"
                                                />
                                            </ListItemText>
                                        </ListItem>
                                    </List>

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

                                    {job.requirements && job.requirements.length > 0 && (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Requirements:
                                            </Typography>
                                            <List dense>
                                                {job.requirements.map((req, i) => (
                                                    <ListItem key={i}>
                                                        <ListItemIcon>
                                                            <WorkIcon />
                                                        </ListItemIcon>
                                                        <ListItemText primary={req} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}
                                </CardContent>
                                <Box sx={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 1 }}>
                                    <IconButton color="error" onClick={() => onSwipe('left', job._id)}>
                                        <ThumbDownIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => onSwipe('right', job._id)}>
                                        <ThumbUpIcon />
                                    </IconButton>
                                    <IconButton color="info" onClick={() => {
                                        setSelectedJob(job);
                                        setOpenDialog(true);
                                    }}>
                                        <InfoIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </TinderCard>
                    </Box>
                ))}
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Company: {selectedJob?.company.companyName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                                {selectedJob?.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                                Cover Letter
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Write your cover letter here..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleApply} variant="contained" color="primary">
                        Apply Now
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SwipeJobs; 