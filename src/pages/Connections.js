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
    MenuItem
} from '@mui/material';
import {
    Message as MessageIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Person as PersonIcon,
    Work as WorkIcon,
    Chat as ChatIcon,
    Group as GroupIcon,
    Pending as PendingIcon
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

function Connections() {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [pendingConnections, setPendingConnections] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [selectedConnection, setSelectedConnection] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchConnections();
        fetchPendingConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/connections', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConnections(response.data);
        } catch (error) {
            console.error('Error fetching connections:', error);
        }
    };

    const fetchPendingConnections = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/connections/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingConnections(response.data);
        } catch (error) {
            console.error('Error fetching pending connections:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleConnectionStatus = async (connectionId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/connections/${connectionId}`, {
                status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchConnections();
            fetchPendingConnections();
        } catch (error) {
            console.error('Error updating connection status:', error);
        }
    };

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/connections/${selectedConnection._id}/message`, {
                message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('');
            setOpenDialog(false);
            fetchConnections();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const renderConnectionCard = (connection) => {
        const otherUser = connection.sender._id === user._id ? connection.receiver : connection.sender;
        return (
            <Card key={connection._id} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={otherUser.profilePicture}
                            sx={{ width: 56, height: 56, mr: 2 }}
                        >
                            {otherUser.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h6">
                                {otherUser.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {connection.projectType}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                        Project Details:
                    </Typography>
                    <Typography variant="body2" paragraph>
                        {connection.projectDetails.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        {connection.projectDetails.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Required Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {connection.projectDetails.skills?.map((skill, i) => (
                                <Chip key={i} label={skill} size="small" />
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="textSecondary">
                            Duration: {connection.projectDetails.duration}
                        </Typography>
                        <Box>
                            <IconButton 
                                color="primary" 
                                onClick={() => {
                                    setSelectedConnection(connection);
                                    setOpenDialog(true);
                                }}
                            >
                                <MessageIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    const renderPendingConnectionCard = (connection) => {
        const sender = connection.sender;
        return (
            <Card key={connection._id} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={sender.profilePicture}
                            sx={{ width: 56, height: 56, mr: 2 }}
                        >
                            {sender.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h6">
                                {sender.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {connection.projectType}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>
                        Project Details:
                    </Typography>
                    <Typography variant="body2" paragraph>
                        {connection.projectDetails.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        {connection.projectDetails.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Required Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {connection.projectDetails.skills?.map((skill, i) => (
                                <Chip key={i} label={skill} size="small" />
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton 
                            color="error" 
                            onClick={() => handleConnectionStatus(connection._id, 'rejected')}
                        >
                            <CloseIcon />
                        </IconButton>
                        <IconButton 
                            color="success" 
                            onClick={() => handleConnectionStatus(connection._id, 'accepted')}
                        >
                            <CheckIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Connections
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab 
                        icon={<GroupIcon />} 
                        label="Active Connections" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={
                            <Badge badgeContent={pendingConnections.length} color="error">
                                <PendingIcon />
                            </Badge>
                        } 
                        label="Pending Requests" 
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {connections.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center">
                        No active connections yet
                    </Typography>
                ) : (
                    connections.map(renderConnectionCard)
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                {pendingConnections.length === 0 ? (
                    <Typography variant="body1" color="textSecondary" align="center">
                        No pending connection requests
                    </Typography>
                ) : (
                    pendingConnections.map(renderPendingConnectionCard)
                )}
            </TabPanel>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Send Message</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSendMessage} variant="contained" color="primary">
                        Send Message
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Connections; 