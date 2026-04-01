import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';

// Import ALL our screens
import { Dashboard, AddRecipe } from './MainScreens';
import { SplashScreen, Login, Signup, EmailVerification, ForgotPassword, ResetPassword, PasswordUpdated, RoleVerification } from './AuthScreens';
import { RecordVoice, UploadAudio, UploadPDF, AiProcessing, CulturalQuestions } from './UploadScreens';
import { RecipePreview, SubmissionSuccess } from './RecipeScreens';
import { RecipesList, CookingPrep, RecipeDetail } from './BrowseAndCookScreens';
import { CookingMode, CookingCompleted } from './CookingModeScreens';
import { Profile } from './ProfileScreen';
import { Settings } from './SettingsScreen'; 
import { AdminDashboard, RecipeModeration } from './AdminScreens';

const { Content, Footer } = Layout;

// --- Helper: Scroll to top on every route change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Custom Bottom Nav SVGs (User) ---
const NavHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const NavBook = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const NavAdd = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const NavCook = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" y1="17" x2="18" y2="17"></line></svg>;
const NavUser = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

// --- Custom Bottom Nav SVGs (Admin) ---
const NavShield = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const NavCheckList = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
const NavApp = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenNavRoutes = [
    '/', '/login', '/signup', '/email-verification', '/forgot-password', 
    '/reset-password', '/password-updated', '/role-verification',
    '/ai-processing'
  ];
  
  if (hiddenNavRoutes.includes(location.pathname)) return null;

  const isAdminRoute = ['/admin-dashboard', '/recipe-moderation'].includes(location.pathname);

  const userItems = [
    { key: '/dashboard', icon: <NavHome />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Home</span> },
    { key: '/recipes', icon: <NavBook />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Recipes</span> },
    { key: '/add-recipe', icon: <NavAdd />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Add</span> },
    { key: '/cooking-prep', icon: <NavCook />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Cook</span> },
    { key: '/profile', icon: <NavUser />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Profile</span> },
  ];

  const adminItems = [
    { key: '/admin-dashboard', icon: <NavShield />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Admin</span> },
    { key: '/recipe-moderation', icon: <NavCheckList />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Moderate</span> },
    { key: '/profile', icon: <NavUser />, label: <span style={{fontSize: '11px', fontWeight: 600}}>Profile</span> },
  ];

  return (
    <Footer style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '430px', padding: 0, zIndex: 1000, borderTop: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
      <style>
        {`
          .custom-bottom-nav .ant-menu-item-selected { color: #FF5238 !important; }
          .custom-bottom-nav .ant-menu-item-selected::after { border-bottom-color: transparent !important; }
          .custom-bottom-nav .ant-menu-item::after { border-bottom: none !important; }
          .custom-bottom-nav .ant-menu-item { color: #888; padding: 0 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
          .custom-bottom-nav .ant-menu-title-content { margin-left: 0 !important; line-height: 1; }
        `}
      </style>
      <Menu 
  className="custom-bottom-nav"
  mode="horizontal"
  style={{ 
  display: 'flex',
  justifyContent: 'space-around',   // ✅ BEST for AntD
  borderBottom: 'none',
  height: '65px',
  alignItems: 'center'
}}
  selectedKeys={[location.pathname]}
  onClick={({ key }) => navigate(key)}
  items={isAdminRoute ? adminItems : userItems}
/>
    </Footer>
  );
};

// --- GLOBAL APP BOOT MANAGER (The "Theater Curtain") ---
const BootSplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start smoothly fading out the curtain at 2.2 seconds
    const fadeTimer = setTimeout(() => setOpacity(0), 2200);
    // Completely remove the curtain from the screen at 2.5 seconds
    const removeTimer = setTimeout(() => setVisible(false), 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999, // Guarantees this sits on top of EVERYTHING
      opacity: opacity,
      transition: 'opacity 0.3s ease-out',
      backgroundColor: '#FCF4F1'
    }}>
      <SplashScreen />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop /> 
      {/* The Global Overlay that runs on every refresh */}
      <BootSplashScreen /> 
      
      <Layout style={{ minHeight: '100vh', maxWidth: '430px', margin: '0 auto', border: '1px solid #f0f0f0', position: 'relative' }}>
        <Content style={{ paddingBottom: '70px', background: '#FCF4F1' }}>
          <Routes>
            {/* --- Auth Flow --- */}
            <Route path="/" element={<Navigate to="/login" replace />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-updated" element={<PasswordUpdated />} />
            <Route path="/role-verification" element={<RoleVerification />} />
            
            {/* --- User Hub --- */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/recipes" element={<RecipesList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} /> 
            
            {/* --- Documentation Flow --- */}
            <Route path="/voice-recording" element={<RecordVoice />} />
            <Route path="/upload-audio" element={<UploadAudio />} />
            <Route path="/upload-pdf" element={<UploadPDF />} />
            <Route path="/ai-processing" element={<AiProcessing />} />
            <Route path="/cultural-questions" element={<CulturalQuestions />} />
            <Route path="/recipe-preview" element={<RecipePreview />} />
            <Route path="/submission-success" element={<SubmissionSuccess />} />
            
            {/* --- Cooking Flow --- */}
            <Route path="/recipe-detail" element={<RecipeDetail />} /> 
            <Route path="/cooking-prep" element={<CookingPrep />} />
            <Route path="/cooking-mode" element={<CookingMode />} />
            <Route path="/cooking-completed" element={<CookingCompleted />} />

            {/* --- Admin Flow --- */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/recipe-moderation" element={<RecipeModeration />} />

            {/* --- 404 Catch-all --- */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Content>
        <BottomNav />
      </Layout>
    </Router>
  );
}