import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignUp,
  SignIn,
  AuthenticateWithRedirectCallback
} from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PhotoPage from './pages/PhotoPage/PhotoPage';
import AnalysisPage from './pages/AnalysisPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import PricingPage from './pages/PricingPage';
import HistoryPage from './pages/HistoryPage';
import ConsultationPage from './pages/ConsultationPage';
import HairLossPage from './pages/HairLossPage';
import StyleGuidePage from './pages/StyleGuidePage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SavedProductsPage from './pages/SavedProductsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Home page */}
          <Route index element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={
            <>
              <Navbar />
              <PricingPage />
              <Footer />
            </>
          } />

          {/* Login route, redirect signed-in users to "/dashboard/analysis" */}
          <Route path="/login" element={
            <>
              <SignedIn>
                <Navigate to="/dashboard/analysis" replace />
              </SignedIn>
              <SignedOut>
                <div className="flex items-center justify-center h-screen">
                  <SignIn
                    routing="path"
                    path="/login"
                    signUpUrl="/signup"
                    forceRedirectUrl="/dashboard/analysis"
                  />
                </div>
              </SignedOut>
            </>
          } />

          {/* Signup route */}
          <Route path="/signup" element={
            <>
              <SignedIn>
                <Navigate to="/dashboard/analysis" replace />
              </SignedIn>
              <SignedOut>
                <div className="flex items-center justify-center h-screen">
                  <SignUp
                    routing="path"
                    path="/signup"
                    signInUrl="/login"
                    forceRedirectUrl="/dashboard/analysis"
                  />
                </div>
              </SignedOut>
            </>
          } />

          {/* OAuth/SSO callback route used by Clerk after provider redirect */}
          <Route
            path="/sso-callback"
            element={<AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/dashboard/analysis" />}
          />
          <Route
            path="/login/sso-callback"
            element={<AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/dashboard/analysis" />}
          />
          <Route
            path="/signup/sso-callback"
            element={<AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/dashboard/analysis" />}
          />

          {/* Dashboard and nested routes */}
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="photo" element={<PhotoPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="consult" element={<ConsultationPage />} />
            <Route path="hair-loss" element={<HairLossPage />} />
            <Route path="style-guide" element={<StyleGuidePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="saved" element={<SavedProductsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
