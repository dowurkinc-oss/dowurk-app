import { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AboutUs from '@/pages/AboutUs';
import BusinessDirectory from '@/pages/BusinessDirectory';
import AddBusiness from '@/pages/AddBusiness';
import AIAssistant from '@/pages/AIAssistant';
import Events from '@/pages/Events';
import Resources from '@/pages/Resources';
import LouisianaBizResources from '@/pages/LouisianaBizResources';
import MentalHealthTips from '@/pages/MentalHealthTips';
import GratitudeWall from '@/pages/GratitudeWall';
import Grants from '@/pages/Grants';
import CommunityFeed from '@/pages/CommunityFeed';
import Shop from '@/pages/Shop';
import VirtualBooths from '@/pages/VirtualBooths';
import Donate from '@/pages/Donate';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import Services from '@/pages/Services';
import Certifications from '@/pages/Certifications';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import SevenFPage from '@/pages/SevenFPage';
import SevenFramework from '@/pages/SevenFramework';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="businesses" element={<BusinessDirectory />} />
            <Route path="add-business" element={<AddBusiness />} />
            <Route path="services" element={<Services />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="events" element={<Events />} />
            <Route path="resources" element={<Resources />} />
            <Route path="louisiana-biz-resources" element={<LouisianaBizResources />} />
            <Route path="mental-health" element={<MentalHealthTips />} />
            <Route path="gratitude-wall" element={<GratitudeWall />} />
            <Route path="grants" element={<Grants />} />
            <Route path="community" element={<CommunityFeed />} />
            <Route path="shop" element={<Shop />} />
            <Route path="virtual-booths" element={<VirtualBooths />} />
            <Route path="donate" element={<Donate />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<Blog />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="framework" element={<SevenFramework />} />
            <Route path="framework/faith" element={<SevenFPage fName="Faith" />} />
            <Route path="framework/fitness" element={<SevenFPage fName="Fitness" />} />
            <Route path="framework/foundation" element={<SevenFPage fName="Foundation" />} />
            <Route path="framework/fashion" element={<SevenFPage fName="Fashion" />} />
            <Route path="framework/film" element={<SevenFPage fName="Film" />} />
            <Route path="framework/food" element={<SevenFPage fName="Food" />} />
            <Route path="framework/finances" element={<SevenFPage fName="Finances" />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
