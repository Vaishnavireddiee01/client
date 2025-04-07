import React from 'react';
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
    CardActions
} from '@mui/material';
import {
    People as PeopleIcon,
    Work as WorkIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function DashboardCard({ title, description, icon, onClick }) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon}
                    <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography color="textSecondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={onClick}>
                    View More
                </Button>
            </CardActions>
        </Card>
    );
}

function DeveloperDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const dashboardItems = [
        {
            title: 'Find Developers',
            description: 'Connect with other developers for hackathons and collaborations',
            icon: <PeopleIcon color="primary" />,
            path: '/developer/swipe-developers'
        },
        {
            title: 'Find Jobs',
            description: 'Discover and apply to job opportunities that match your skills',
            icon: <WorkIcon color="primary" />,
            path: '/developer/swipe-jobs'
        },
        {
            title: 'My Connections',
            description: 'Manage your connections and collaboration requests',
            icon: <PeopleIcon color="primary" />,
            path: '/developer/connections'
        },
        {
            title: 'My Applications',
            description: 'Track your job applications and their status',
            icon: <WorkIcon color="primary" />,
            path: '/developer/applications'
        },
        {
            title: 'Profile',
            description: 'View and edit your professional profile',
            icon: <PersonIcon color="primary" />,
            path: '/developer/profile'
        },
        {
            title: 'Settings',
            description: 'Manage your account settings and preferences',
            icon: <SettingsIcon color="primary" />,
            path: '/developer/settings'
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome, {user?.name}!
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Here's an overview of your developer dashboard
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {dashboardItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <DashboardCard
                            title={item.title}
                            description={item.description}
                            icon={item.icon}
                            onClick={() => navigate(item.path)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default DeveloperDashboard; 