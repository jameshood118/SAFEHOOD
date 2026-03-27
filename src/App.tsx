// #region [ 📦 IMPORTS ]
import {
  faBiohazard,
  faClipboardList,
  faClockRotateLeft,
  faHouseSignal, // Added for the Home OS Nav Link
  faUsers,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Box, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import type { Session } from '@supabase/supabase-js'; // 🛡️ Import the strict type
import { supabase } from './lib/supabase';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Personnel } from './pages/Personnel';

// 🚀 THE REAL COMPONENTS (No more stubs!)
import { ForevergladesTerminal } from './components/ForevergladesTerminal';
import { FurryNodes } from './pages/FurryNodes';
import { HomeOS } from './pages/Home'; // 🛠️ INJECTED HOME OS
import { Manifests } from './pages/Manifests';
// #endregion

// #region [ 🔐 THE AUTH GATEKEEPER ]
/**
 * This intercepts the render pipeline. It queries the local Supabase client
 * for an active session before allowing access to the children components.
 */
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // 🛡️ NO MORE ANY: It is either a valid Supabase Session, or null if logged out.
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Set up a listener for login/logout events across tabs
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a tactical spinner while the token is being verified
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

  // BOOT PROTOCOL: If no token is found, redirect strictly to the Airlock
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // ACCESS GRANTED: Render the protected layout
  return <>{children}</>;
};
// #endregion

// #region [ 🏗️ THE STRUCTURAL SHELL (Top Nav + Main Content Area) ]
/**
 * The persistent frame of the application.
 * The AppBar stays fixed at the top, and the <Outlet /> is where the React Router
 * dynamically injects the different pages into the viewport below.
 */
const SafehoodLayout = () => {
  const location = useLocation();

  // The Witches Society Navigation Map
  const navItems = [
    { text: 'Command Center', path: '/', icon: faUserShield },
    { text: 'Human OS', path: '/manifests', icon: faClipboardList },
    { text: 'Work OS', path: '/personnel', icon: faUsers },
    { text: 'Home OS', path: '/home', icon: faHouseSignal }, // 🛠️ ADDED TO TOP NAV
    { text: 'Temporal Vault', path: '/temporal-logs', icon: faClockRotateLeft },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* --- THE AIRLOCK HUD (Top Navigation) --- */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper', // #212121
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, md: 3 }, px: { xs: 2, md: 4 } }}>
          {/* Branding */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '1px',
                color: 'primary.contrastText',
                lineHeight: 1.2,
              }}
            >
              SAFEHOOD
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'secondary.main',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.65rem',
              }}
            >
              Protocol Active
            </Typography>
          </Box>

          {/* Navigation Links (Scrollable on small screens) */}
          <Box
            sx={{ display: 'flex', gap: 1, flexGrow: 1, overflowX: 'auto', pb: { xs: 1, md: 0 } }}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={<FontAwesomeIcon icon={item.icon} />}
                  disableElevation
                  sx={{
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    whiteSpace: 'nowrap', // Prevents button text from wrapping
                    color: isActive ? 'action.focus' : 'text.secondary',
                    bgcolor: isActive ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- THE DYNAMIC VIEWPORT (<Outlet />) --- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          bgcolor: 'background.default', // #121212
          p: { xs: 2, md: 4 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
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
        {/* UNPROTECTED ROUTE: The Login Screen */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES: Everything inside AuthGuard requires a valid session */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <SafehoodLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          {/* 🚀 STUBS REMOVED. REAL COMPONENTS INJECTED. */}
          <Route path="manifests" element={<Manifests />} />
          <Route path="personnel" element={<Personnel />} />
          <Route path="home" element={<HomeOS />} /> {/* 🛠️ INJECTED HOME ROUTE */}
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
