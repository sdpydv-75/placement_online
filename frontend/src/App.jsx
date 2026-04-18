import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobListing from './pages/JobListing';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import ViewApplicants from './pages/ViewApplicants';
import StudentProfile from './pages/StudentProfile';
import AdminPanel from './pages/AdminPanel';
import OnlineDegree from './pages/OnlineDegree';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeEditor from './pages/ResumeEditor';
import InterviewPrep from './pages/InterviewPrep';
import CareerGuide from './pages/CareerGuide';
import CampusPlacements from './pages/CampusPlacements';
import CompanyReviews from './pages/CompanyReviews';
import SuccessStories from './pages/SuccessStories';
import CertifiedInternship from './pages/CertifiedInternship';

// Route Protector
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Public Job Browsing */}
              <Route path="/jobs" element={<JobListing />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/online-degree" element={<OnlineDegree />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resume-editor" element={<ResumeEditor />} />
              <Route path="/interview-prep" element={<InterviewPrep />} />
              <Route path="/career-guide" element={<CareerGuide />} />
              <Route path="/campus-placements" element={<CampusPlacements />} />
              <Route path="/company-reviews" element={<CompanyReviews />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/certified-internship" element={<CertifiedInternship />} />

              {/* Student Protected Routes */}
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />

              {/* Recruiter Routes */}
              <Route path="/post-job" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><PostJob /></ProtectedRoute>} />
              <Route path="/applicants" element={<ProtectedRoute allowedRoles={['recruiter', 'admin']}><ViewApplicants /></ProtectedRoute>} />

              {/* Admin Panel */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />

              {/* Shared Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
