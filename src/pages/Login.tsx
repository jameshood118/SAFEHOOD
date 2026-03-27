// #region [ 📦 IMPORTS ]
import { faEnvelope, faLock, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
// #endregion

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // #region [ 🚀 THE AUTHENTICATION PIPELINE ]
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Pass the credentials to Supabase's GoTrue Auth server.
    // We never see or store the hashed password; Supabase returns a secure session JWT.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // If successful, the Supabase client automatically saves the JWT token in local storage
      // and attaches it to all future database calls.
      window.location.href = '/'; // Hard redirect to Command Center to reload state
    }
  };
  // #endregion

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'absolute', // Pulls it out of the App.tsx layout grid
        top: 0,
        left: 0,
        zIndex: 9999, // Sits on top of everything
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', m: 2, border: '1px solid rgba(0, 229, 255, 0.2)' }}>
        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <FontAwesomeIcon
              icon={faUserShield}
              size="3x"
              color="#00E5FF"
              style={{ marginBottom: '16px' }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
              SAFEHOOD PROTOCOL
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', letterSpacing: '1px', textTransform: 'uppercase' }}
            >
              Superadmin Authentication Required
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Form */}
          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <TextField
              fullWidth
              label="System Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faEnvelope} color="rgba(255,255,255,0.5)" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Passphrase"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faLock} color="rgba(255,255,255,0.5)" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 2,
                bgcolor: 'action.focus',
                color: '#000',
                '&:hover': { bgcolor: '#00B8CC' },
              }}
            >
              {isLoading ? 'Verifying...' : 'Initialize Uplink'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
