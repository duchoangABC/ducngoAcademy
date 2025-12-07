

import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import CourseListScreen from './screens/CourseListScreen';
import LessonDetailScreen from './screens/LessonDetailScreen';
import BadgesScreen from './screens/BadgesScreen';
import ChatScreen from './screens/ChatScreen';
import MenuScreen from './screens/MenuScreen';
import HomeScreen from './screens/HomeScreen';
import EntryTestScreen from './screens/EntryTestScreen'; // Import Entry Test
import BottomNav from './components/BottomNav';
import { OnboardingProvider } from './context/OnboardingContext';
import { UserProvider } from './context/UserContext';
import OnboardingOverlay from './components/OnboardingOverlay';

// Admin Imports - Using explicit relative paths
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './screens/admin/AdminDashboard';
import AdaptiveCourseBuilder from './screens/admin/AdaptiveCourseBuilder';
import AssessmentEngine from './screens/admin/AssessmentEngine';
import LearnerAnalytics from './screens/admin/LearnerAnalytics';
import ContentManager from './screens/admin/ContentManager';
import CompetencyManager from './screens/admin/CompetencyManager';
import MentorAIManager from './screens/admin/MentorAIManager';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isChat = location.pathname === '/chat';
  const isEntryTest = location.pathname === '/entry-test';
  
  // If in Admin mode, we use a different layout structure
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="adaptive" element={<AdaptiveCourseBuilder />} />
            <Route path="assessment" element={<AssessmentEngine />} />
            <Route path="analytics" element={<LearnerAnalytics />} />
            <Route path="competency" element={<CompetencyManager />} />
            <Route path="mentor-ai" element={<MentorAIManager />} />
          </Route>
        </Routes>
      </div>
    );
  }

  // Mobile App Student View
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className={`w-full max-w-md bg-white shadow-xl min-h-screen relative flex flex-col ${isChat || isEntryTest ? 'h-screen overflow-hidden' : ''}`}>
        <OnboardingOverlay />
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/courses" element={<CourseListScreen />} />
          <Route path="/lesson/:id" element={<LessonDetailScreen />} />
          <Route path="/badges" element={<BadgesScreen />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/entry-test" element={<EntryTestScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {!isEntryTest && <BottomNav />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <UserProvider>
        <OnboardingProvider>
          <AppContent />
        </OnboardingProvider>
      </UserProvider>
    </HashRouter>
  );
};

export default App;