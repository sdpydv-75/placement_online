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
import VerifyCertificate from './pages/VerifyCertificate';

// Route Protector
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  if (user.role === 'student' && !user.isApproved && !window.location.pathname.includes('/profile')) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1a', color: '#f1f5f9', padding: '20px' }}>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(239,68,68,0.2)', maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⏳</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Account Pending Approval</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Hello {user.name}, your account is currently being reviewed by the ITM administration. Once approved, you will have full access to internships, programs, and certifications.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Check Status</button>
            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '12px 24px', borderRadius: '12px', border: '1px solid #ef444444', fontWeight: '700', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </div>
    );
  }

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
              <Route path="/verify" element={<VerifyCertificate />} />

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
