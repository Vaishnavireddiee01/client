import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Tab,
    Tabs,
    Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function Home() {
    const navigate = useNavigate();
    const { login, register, error } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'developer'
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await login(formData.email, formData.password);
            navigate(user.role === 'developer' ? '/developer/dashboard' : '/company/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const user = await register(formData);
            navigate(user.role === 'developer' ? '/developer/dashboard' : '/company/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Typography variant="h3" component="h1" align="center" gutterBottom>
                    HireNew
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    Connect with developers and companies using our Tinder-style swipe feature
                </Typography>
            </Box>

            <Paper elevation={3}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <TabPanel value={tabValue} index={0}>
                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                        >
                            Login
                        </Button>
                    </form>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <form onSubmit={handleRegister}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                            SelectProps={{
                                native: true
                            }}
                        >
                            <option value="developer">Developer</option>
                            <option value="company">Company</option>
                        </TextField>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                        >
                            Register
                        </Button>
                    </form>
                </TabPanel>
            </Paper>
        </Container>
    );
}

export default Home; 