import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import CandidateLayout from './layouts/CandidateLayout';
import RecruiterLayout from './layouts/RecruiterLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import UploadResumePage from './pages/candidate/UploadResumePage';
import ExtractedSkillsPage from './pages/candidate/ExtractedSkillsPage';
import BrowseJobsPage from './pages/candidate/BrowseJobsPage';
import AppliedJobsPage from './pages/candidate/AppliedJobsPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import ViewCandidatesPage from './pages/recruiter/ViewCandidatesPage';
import RankedCandidatesPage from './pages/recruiter/RankedCandidatesPage';
import AnalyticsPage from './pages/recruiter/AnalyticsPage';

import ProtectedRoute from './routes/ProtectedRoute';
function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
          {/* Public / Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Candidate routes */}
          <Route
            path="/candidate"
            element={
              <ProtectedRoute allowedRole="CANDIDATE">
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route path="upload-resume" element={<UploadResumePage />} />
            <Route path="skills" element={<ExtractedSkillsPage />} />
            <Route path="jobs" element={<BrowseJobsPage />} />
            <Route path="applications" element={<AppliedJobsPage />} />
          </Route>

          {/* Recruiter routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRole="RECRUITER">
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="create-job" element={<CreateJobPage />} />
            <Route path="candidates/:jobId" element={<ViewCandidatesPage />} />
            <Route path="ranked/:jobId" element={<RankedCandidatesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
