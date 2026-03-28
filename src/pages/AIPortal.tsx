// src/pages/AIPortal.tsx
// #region [ 📦 IMPORTS ]
import { faBolt, faDiceD20, faMicrochip, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSafehoodAI } from '../hooks/useSafehoodAI';
import type { AIResponse } from '../types';
// #endregion

export const AIPortal = () => {
  const [prompt, setPrompt] = useState('');
  const [partition, setPartition] = useState<'HUMAN_OS' | 'WORK_OS' | 'SYSTEM'>('SYSTEM');
  const [history, setHistory] = useState<AIResponse[]>([]);

  const aiMutation = useSafehoodAI();

  const handleTransmit = () => {
    if (!prompt.trim()) return;

    aiMutation.mutate(
      { prompt, context_partition: partition },
      {
        onSuccess: (data) => {
          setHistory((prev) => [data, ...prev]);
          setPrompt(''); // Clear the analog input
        },
      },
    );
  };

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 100px)', display: 'flex' }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* ========================================================= */}
        {/* 🟢 LEFT PANE: THE ANALOG CLOSET (Terminal Input)          */}
        {/* ========================================================= */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            bgcolor: '#0a0510',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            borderRight: { md: '2px solid rgba(0, 255, 65, 0.2)' },
            borderBottom: { xs: '2px solid rgba(0, 255, 65, 0.2)', md: 'none' },
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#00ff41', fontFamily: 'monospace', letterSpacing: '2px', mb: 2 }}
          >
            <FontAwesomeIcon icon={faTerminal} style={{ marginRight: '8px' }} />
            ANALOG TERMINAL
          </Typography>

          <Typography variant="h4" sx={{ color: 'primary.contrastText', fontWeight: 800, mb: 1 }}>
            Input Directive
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Raw prompts enter here. The structural dampers will stabilize the logic before passing
            it through the fissure.
          </Typography>

          <Stack spacing={3} sx={{ flexGrow: 1 }}>
            <TextField
              select
              fullWidth
              label="Target Partition"
              value={partition}
              onChange={(e) => setPartition(e.target.value as 'HUMAN_OS' | 'WORK_OS' | 'SYSTEM')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  borderRadius: 0,
                  bgcolor: 'rgba(0, 255, 65, 0.05)',
                  '& fieldset': { borderColor: 'rgba(0, 255, 65, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff41' },
                },
                '& .MuiInputLabel-root': { color: '#00ff41' },
              }}
            >
              <MenuItem value="SYSTEM">SYSTEM (Root Access)</MenuItem>
              <MenuItem value="HUMAN_OS">HUMAN OS (Base Camp)</MenuItem>
              <MenuItem value="WORK_OS">WORK OS (Professional)</MenuItem>
            </TextField>

            <TextField
              multiline
              rows={8}
              fullWidth
              placeholder="Awaiting pilot input..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  borderRadius: 0,
                  bgcolor: 'rgba(0,0,0,0.4)',
                  '& fieldset': { borderColor: 'rgba(0, 255, 65, 0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#00ff41' },
                },
              }}
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={!prompt.trim() || aiMutation.isPending}
              onClick={handleTransmit}
              startIcon={
                aiMutation.isPending ? (
                  <CircularProgress size={20} sx={{ color: '#000' }} />
                ) : (
                  <FontAwesomeIcon icon={faBolt} />
                )
              }
              sx={{
                mt: 'auto',
                py: 2,
                bgcolor: '#00ff41',
                color: '#000',
                fontWeight: 800,
                fontFamily: 'monospace',
                borderRadius: 0,
                '&:hover': { bgcolor: '#00c833' },
                '&:disabled': { bgcolor: 'rgba(0, 255, 65, 0.2)', color: 'rgba(255,255,255,0.3)' },
              }}
            >
              {aiMutation.isPending ? 'TRANSMITTING ACROSS FISSURE...' : 'EXECUTE UPLINK'}
            </Button>
          </Stack>
        </Grid>

        {/* ========================================================= */}
        {/* 🟣 RIGHT PANE: THE WIZARD'S DOMAIN (Optimized AI Output)  */}
        {/* ========================================================= */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            bgcolor: '#120b1c', // A deep, violet-tinted void
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: 'inset 10px 0 20px rgba(156, 39, 176, 0.1)', // The Fissure Glow
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: '#E040FB', fontFamily: 'monospace', letterSpacing: '2px', mb: 2 }}
          >
            <FontAwesomeIcon icon={faDiceD20} style={{ marginRight: '8px' }} />
            OPTIMIZED LATENT SPACE
          </Typography>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
            {history.length === 0 && !aiMutation.isPending && (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(224, 64, 251, 0.3)',
                  textAlign: 'center',
                }}
              >
                <FontAwesomeIcon icon={faMicrochip} size="4x" style={{ marginBottom: '16px' }} />
                <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                  THE VEIL IS QUIET.
                </Typography>
                <Typography variant="body2">
                  Awaiting transmission from the analog layer.
                </Typography>
              </Box>
            )}

            <Stack spacing={4}>
              {/* If loading, show the glowing orb effect */}
              {aiMutation.isPending && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <CircularProgress sx={{ color: '#E040FB' }} />
                  <Typography
                    variant="caption"
                    sx={{ color: '#E040FB', display: 'block', mt: 2, fontFamily: 'monospace' }}
                  >
                    SYNTHESIZING D20 FATE VARIABLES...
                  </Typography>
                </Box>
              )}

              {/* Display the history of responses */}
              {history.map((res) => (
                <Box
                  key={res.id}
                  sx={{
                    bgcolor: 'rgba(224, 64, 251, 0.05)',
                    border: '1px solid rgba(224, 64, 251, 0.2)',
                    borderLeft: '4px solid #E040FB',
                    p: 3,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#F3E5F5',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.8,
                      fontFamily: 'monospace',
                    }}
                  >
                    {res.output}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: 'rgba(224, 64, 251, 0.1)' }} />

                  <Stack direction="row" spacing={3}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontFamily: 'monospace' }}
                    >
                      LATENCY: {res.latency_ms}ms
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontFamily: 'monospace' }}
                    >
                      TOKENS: {res.tokens_consumed}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
