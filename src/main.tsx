// #region [ 📦 IMPORTS (The Dependencies) ]
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import customTheme from './theme';
// #endregion

// #region [ ⚙️ SYSTEM INITIALIZATION (The Engines) ]
// Initialize the Epistemic Data Fetcher (React Query)
// We set conservative defaults to prevent aggressive background refetching.
// The Human OS doesn't need the UI flashing every time they switch browser tabs.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't auto-fetch just because the user clicked back into the window
      retry: 1, // Only retry failed requests once before throwing an error
      staleTime: 5 * 60 * 1000, // Treat data as "fresh" for 5 minutes
    },
  },
});
// #endregion

// #region [ 🚀 THE AIRLOCK (Render Pipeline) ]
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 1. DATA LAYER: Wraps the app in the caching & fetching engine */}
    <QueryClientProvider client={queryClient}>
      {/* 2. VISUAL LAYER: Injects the SAFEHOOD WCAG 2.2 Dark Theme */}
      <ThemeProvider theme={customTheme}>
        {/* 3. PHYSICS ENGINE: Applies the CSS reset, <body> background, and global FontAwesome hacks */}
        <CssBaseline />

        {/* 4. THE OPERATING SYSTEM */}
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
// #endregion
