// #region [ 📦 IMPORTS ]
import { faBiohazard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';

import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

// 🚀 THE REAL COMPONENTS
import { ForevergladesTerminal } from './components/ForevergladesTerminal';
import { SafehoodLayout } from './components/SafehoodLayout'; // 🛡️ UPLINK TO GLOBAL LAYOUT
import { AIPortal } from './pages/AIPortal';
import { Dashboard } from './pages/Dashboard';
import { FurryNodes } from './pages/FurryNodes';
import { HomeOS } from './pages/Home';
import { Login } from './pages/Login';
import { Manifests } from './pages/Manifests';
import { Personnel } from './pages/Personnel';
// #endregion

// #region [ 🔐 THE AUTH GATEKEEPER ]
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
// #endregion

// #region [ 🚧 404 COMPONENT ]
const NotFound = () => (
  <Box sx={{ textAlign: 'center', mt: 10 }}>
    <FontAwesomeIcon icon={faBiohazard} size="4x" color="#f44336" />
    <Typography variant="h3" sx={{ color: 'error.main', mt: 3, fontWeight: 800 }}>
      404: TIMELINE DIVERGENCE
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
      The structural dampers cannot hold this logic. Route not found.
    </Typography>
    <Button
      component={Link}
      to="/"
      variant="outlined"
      sx={{ mt: 4, color: '#00E5FF', borderColor: '#00E5FF' }}
    >
      RETURN TO COMMAND CENTER
    </Button>
  </Box>
);
// #endregion

// #region [ 🚀 THE ROUTER ]
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <SafehoodLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="ai-portal" element={<AIPortal />} />
          <Route path="manifests" element={<Manifests />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="home" element={<HomeOS />} />
          <Route path="temporal-logs" element={<ForevergladesTerminal />} />
          <Route path="furry-nodes" element={<FurryNodes />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
// #endregion
