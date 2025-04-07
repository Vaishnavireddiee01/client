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
    TextField,
    Grid,
    Rating
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Info as InfoIcon,
    Message as MessageIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function SwipeDevelopers() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [developers, setDevelopers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState('');
    const [projectType, setProjectType] = useState('hackathon');
    const [projectDetails, setProjectDetails] = useState({
        title: '',
        description: '',
        duration: '',
        skills: []
    });

    useEffect(() => {
        fetchDevelopers();
    }, []);

    const fetchDevelopers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/developers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevelopers(response.data);
        } catch (error) {
            console.error('Error fetching developers:', error);
        }
    };

    const onSwipe = async (direction, developerId) => {
        if (direction === 'right') {
            setSelectedDeveloper(developers[currentIndex]);
            setOpenDialog(true);
        }
        setCurrentIndex(currentIndex + 1);
    };

    const handleSendConnection = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/connections', {
                receiver: selectedDeveloper._id,
                message,
                projectType,
                projectDetails
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOpenDialog(false);
            setMessage('');
            setProjectDetails({
                title: '',
                description: '',
                duration: '',
                skills: []
            });
        } catch (error) {
            console.error('Error sending connection:', error);
        }
    };

    const handleSkillsChange = (event) => {
        const skills = event.target.value.split(',').map(skill => skill.trim());
        setProjectDetails({ ...projectDetails, skills });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Find Developers
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Swipe right to connect with developers, left to skip
            </Typography>

            <Box sx={{ height: '600px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                {developers.map((developer, index) => (
                    <Box
                        key={developer._id}
                        sx={{
                            position: 'absolute',
                            width: '100%',
                            display: index === currentIndex ? 'block' : 'none'
                        }}
                    >
                        <TinderCard
                            onSwipe={(dir) => onSwipe(dir, developer._id)}
                            preventSwipe={['up', 'down']}
                        >
                            <Card sx={{ height: '500px', position: 'relative' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={developer.profilePicture || 'https://via.placeholder.com/400x200'}
                                    alt={developer.name}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {developer.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        {developer.bio}
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Skills:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {developer.skills?.map((skill, i) => (
                                                <Chip key={i} label={skill} size="small" />
                                            ))}
                                        </Box>
                                    </Box>
                                    {developer.experience && developer.experience.length > 0 && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Experience:
                                            </Typography>
                                            {developer.experience.map((exp, i) => (
                                                <Typography key={i} variant="body2">
                                                    {exp.title} at {exp.company} ({exp.duration})
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                </CardContent>
                                <Box sx={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 1 }}>
                                    <IconButton color="error" onClick={() => onSwipe('left', developer._id)}>
                                        <ThumbDownIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => onSwipe('right', developer._id)}>
                                        <ThumbUpIcon />
                                    </IconButton>
                                    <IconButton color="info" onClick={() => {
                                        setSelectedDeveloper(developer);
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
                <DialogTitle>Connect with {selectedDeveloper?.name}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Message"
                                multiline
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Project Type"
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                            >
                                <option value="hackathon">Hackathon</option>
                                <option value="collaboration">Collaboration</option>
                                <option value="mentorship">Mentorship</option>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Project Title"
                                value={projectDetails.title}
                                onChange={(e) => setProjectDetails({ ...projectDetails, title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Project Description"
                                multiline
                                rows={3}
                                value={projectDetails.description}
                                onChange={(e) => setProjectDetails({ ...projectDetails, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Project Duration"
                                value={projectDetails.duration}
                                onChange={(e) => setProjectDetails({ ...projectDetails, duration: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Required Skills (comma-separated)"
                                value={projectDetails.skills.join(', ')}
                                onChange={handleSkillsChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSendConnection} variant="contained" color="primary">
                        Send Connection Request
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SwipeDevelopers; 