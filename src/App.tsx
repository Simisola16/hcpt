import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Corporate website pages
import { HomePage } from './pages/HomePage';
import { SolutionsPage } from './pages/SolutionsPage';
import { PortalsPage } from './pages/solutions/PortalsPage';
import { ElectronicProcessingPage } from './pages/solutions/ElectronicProcessingPage';
import { CertificationManagementPage } from './pages/solutions/CertificationManagementPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { CapabilitiesPage } from './pages/CapabilitiesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PublicVerificationPage } from './pages/PublicVerificationPage';
import { AdminInquiriesPage } from './pages/AdminInquiriesPage';

// Platform Demo
import { PlatformDemoPage } from './pages/PlatformDemoPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import { apiClient } from './services/apiClient';

// Layout wrapper for corporate pages
function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function App() {
  useEffect(() => {
    // Automatically record visitor location for institutional reach analytics (strictly location data)
    apiClient.trackVisitorLocation();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Interactive Platform Demo (has its own application shell & header) */}
        <Route path="/platform-demo" element={<PlatformDemoPage />} />

        {/* Corporate Website Routes */}
        <Route
          path="/"
          element={
            <CorporateLayout>
              <HomePage />
            </CorporateLayout>
          }
        />
        <Route
          path="/solutions"
          element={
            <CorporateLayout>
              <SolutionsPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/solutions/halal-certification-portals"
          element={
            <CorporateLayout>
              <PortalsPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/solutions/electronic-processing"
          element={
            <CorporateLayout>
              <ElectronicProcessingPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/solutions/certification-management"
          element={
            <CorporateLayout>
              <CertificationManagementPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/industries"
          element={
            <CorporateLayout>
              <IndustriesPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/technology"
          element={
            <CorporateLayout>
              <TechnologyPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/capabilities"
          element={
            <CorporateLayout>
              <CapabilitiesPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/about"
          element={
            <CorporateLayout>
              <AboutPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <CorporateLayout>
              <ContactPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/verify"
          element={
            <CorporateLayout>
              <PublicVerificationPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/verify/:cert"
          element={
            <CorporateLayout>
              <PublicVerificationPage />
            </CorporateLayout>
          }
        />

        {/* Admin Portal - Enterprise Engagement Inquiries & Messages */}
        <Route
          path="/admin"
          element={
            <CorporateLayout>
              <AdminInquiriesPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <CorporateLayout>
              <AdminInquiriesPage />
            </CorporateLayout>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <CorporateLayout>
              <AdminInquiriesPage />
            </CorporateLayout>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            <CorporateLayout>
              <HomePage />
            </CorporateLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
