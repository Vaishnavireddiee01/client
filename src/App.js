import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Home from './pages/Home';
import DeveloperDashboard from './pages/DeveloperDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import SwipeDevelopers from './pages/SwipeDevelopers';
import SwipeJobs from './pages/SwipeJobs';
import Connections from './pages/Connections';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ViewApplicants from './pages/ViewApplicants';

// Context
import { AuthProvider } from './context/AuthContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Developer Routes */}
            <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
            <Route path="/developer/swipe-developers" element={<SwipeDevelopers />} />
            <Route path="/developer/swipe-jobs" element={<SwipeJobs />} />
            <Route path="/developer/connections" element={<Connections />} />
            <Route path="/developer/applications" element={<Applications />} />
            <Route path="/developer/profile" element={<Profile />} />
            <Route path="/developer/settings" element={<Settings />} />
            
            {/* Company Routes */}
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/applicants/:jobId" element={<ViewApplicants />} />
            <Route path="/company/profile" element={<Profile />} />
            <Route path="/company/settings" element={<Settings />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
