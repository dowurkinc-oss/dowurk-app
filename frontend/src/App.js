import { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import BusinessDirectory from '@/pages/BusinessDirectory';
import AIAssistant from '@/pages/AIAssistant';
import Events from '@/pages/Events';
import Resources from '@/pages/Resources';
import Grants from '@/pages/Grants';
import CommunityFeed from '@/pages/CommunityFeed';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="businesses" element={<BusinessDirectory />} />
            <Route path="ai-assistant" element={<AIAssistant />} />
            <Route path="events" element={<Events />} />
            <Route path="resources" element={<Resources />} />
            <Route path="grants" element={<Grants />} />
            <Route path="community" element={<CommunityFeed />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
