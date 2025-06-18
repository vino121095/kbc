import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/Admin/DashboardLayout';
import './App.css';
import './i18n';
import HomePage from './components/User/HomePage';
import SignupPage from './components/User/SignupPage';
import LoginPage from './components/User/LoginPage';
import OTPPage from './components/User/OTPPage';
import LanguagePage from './components/User/LanguagePage';
import DetailsPage from './components/User/DetailsPage';
import NotificationsPage from './components/User/NotificationsPage';
import UserProfilePage from './components/User/UserProfilePage';
import ReviewPage from './components/User/ReviewPage';
import BusinessDetailsPage from './components/User/BusinessDetailsPage';
import PersonalDetailsPage from './components/User/PersonalDetailsPage';
import FamilyDetailsPage from './components/User/FamilyDetailsPage';
import UpdateCredentialsPage from './components/User/UpdateCredentialsPage';
import BusinessDetailView from './components/User/BusinessDetailsView';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LanguagePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/otp" element={<OTPPage />} />
          
          {/* User protected routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/details/:id" element={
            <ProtectedRoute>
              <DetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/review/:id" element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          } />
          <Route path="/business-details/:id" element={
            <ProtectedRoute>
              <BusinessDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/personal-details/:id" element={
            <ProtectedRoute>
              <PersonalDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/family-details/:id" element={
            <ProtectedRoute>
              <FamilyDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/change-password/:id" element={
            <ProtectedRoute>
              <UpdateCredentialsPage />
            </ProtectedRoute>
          } />
          <Route path="/business-details-view/:id" element={
            <ProtectedRoute>
              <BusinessDetailView />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={<DashboardLayout />} />
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;