// #region [ 📦 IMPORTS ]
import {
  faBrain,
  faBriefcase,
  faCat,
  faClockRotateLeft,
  faHouseSignal,
  faTerminal,
  faUserShield,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { CaptainsLog } from '../types'; // 🛡️ Import from the Armory
// #endregion

// #region [ 🗃️ THE ARCHITECTURE (Module Definitions) ]
const systemModules = [
  {
    id: 'work-os',
    title: 'Work OS',
    description: 'Employees, Clients, Intern Hazards, and Furry Nodes.',
    icon: faBriefcase,
    path: '/personnel',
    accentColor: '#4CAF50', // Tactical Green
  },
  {
    id: 'human-os',
    title: 'Human OS',
    description: 'Captains Logs, Manifests, and Furry Nodes.',
    icon: faBrain,
    path: '/manifests',
    accentColor: '#9C27B0', // Deep Purple
  },
  {
    id: 'home-os',
    title: 'Home OS',
    description: 'Infrastructure, Inventory, and Base Camp Logistics.',
    icon: faHouseSignal,
    path: '/home',
    accentColor: '#FF9800', // Warning Orange
  },
  {
    id: 'temporal-vault',
    title: 'Temporal Vault',
    description: 'Search, filter, and scrub the analog wasteland logs.',
    icon: faClockRotateLeft,
    path: '/temporal-logs',
    accentColor: '#00E5FF', // System Cyan
  },
  {
    id: 'admin',
    title: 'Admin Override',
    description: 'Superadmin permissions, roles, and temporal settings.',
    icon: faUserShield,
    path: '/admin',
    accentColor: '#F44336', // Critical Red
  },
  {
    id: 'furry-nodes',
    title: 'Furry Nodes (Global)',
    description: 'Direct telemetry on Rita and the Tuxedo fleet.',
    icon: faCat,
    path: '/furry-nodes',
    accentColor: '#FFFFFF', // Tactical White
  },
];
// #endregion

// #region [ 🚀 DASHBOARD VIEW ]
export const Dashboard = () => {
  // 🛡️ NO MORE ANY: We explicitly declare this as an array of CaptainsLog rows
  const [recentLogs, setRecentLogs] = useState<CaptainsLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 📡 Fetch the latest 3 logs for the HUD
  useEffect(() => {
    const fetchRecentTelemetry = async () => {
      const { data, error } = await supabase
        .from('captains_logs')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setRecentLogs(data);
      }
      setIsLoading(false);
    };

    fetchRecentTelemetry();
  }, []);

  return (
    <Box component="section" sx={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <Box
        component="header"
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 800, color: 'primary.contrastText', letterSpacing: '-0.5px' }}
          >
            COMMAND CENTER
          </Typography>
          <Typography
            variant="body1"
            component="p"
            sx={{ color: 'text.secondary', fontFamily: 'monospace', mt: 0.5 }}
          >
            S.A.F.E.H.O.O.D. v2.1{'//'}Awaiting Pilot Input
          </Typography>
        </Box>

        {/* Live Status Indicator */}
        <Chip
          icon={<FontAwesomeIcon icon={faWifi} className="fa-fade" />}
          label="UPLINK ESTABLISHED"
          sx={{
            bgcolor: 'rgba(0, 255, 65, 0.1)',
            color: '#00ff41',
            border: '1px solid #00ff41',
            fontWeight: 700,
            fontFamily: 'monospace',
            borderRadius: 1,
          }}
        />
      </Box>

      {/* The Dual-Pane Cockpit Layout */}
      <Grid container spacing={4}>
        {/* LEFT PANE: The Bento Box Grid (takes 8 columns on desktop) */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Grid container spacing={3}>
            {systemModules.map((module) => (
              <Grid size={{ xs: 12, sm: 6 }} key={module.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.2s ease-in-out',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: module.accentColor,
                      bgcolor: 'rgba(255,255,255,0.04)',
                      boxShadow: `0 8px 24px ${module.accentColor}20`,
                    },
                  }}
                >
                  <CardActionArea component={Link} to={module.path} sx={{ height: '100%', p: 3 }}>
                    <CardContent
                      sx={{
                        p: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '12px',
                          bgcolor: `${module.accentColor}15`,
                          color: module.accentColor,
                          mb: 2.5,
                        }}
                      >
                        <FontAwesomeIcon icon={module.icon} size="2x" />
                      </Box>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 700, mb: 1, color: 'primary.contrastText' }}
                      >
                        {module.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                      >
                        {module.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* RIGHT PANE: Live Telemetry & System Status (takes 4 columns on desktop) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              bgcolor: '#0a0510',
              border: '1px solid #1b5e20',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <FontAwesomeIcon icon={faTerminal} /> RECENT TELEMETRY
              </Typography>

              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress sx={{ color: '#8a2be2' }} size={30} />
                </Box>
              ) : (
                <Stack spacing={3}>
                  {recentLogs.map((log) => {
                    // 🛡️ Cast the parsed JSON so TS knows what shape to expect
                    const entry = (
                      typeof log.entry_text === 'string'
                        ? JSON.parse(log.entry_text)
                        : log.entry_text
                    ) as Record<string, string>;

                    const isSystem = log.entry_type !== 'CAPTAINS_LOG';

                    // 🛡️ Safe Date Parsing: Fallback to current time if DB returns null
                    const logDate = log.created_at ? new Date(log.created_at) : new Date();

                    return (
                      <Box
                        key={log.id}
                        sx={{ borderLeft: `2px solid ${isSystem ? '#00E5FF' : '#9C27B0'}`, pl: 2 }}
                      >
                        <Typography
                          variant="caption"
                          component="time"
                          sx={{
                            color: 'text.disabled',
                            fontFamily: 'monospace',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          {logDate.toLocaleDateString()}{' '}
                          {logDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="p"
                          sx={{
                            color: 'primary.contrastText',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            mb: 0.5,
                          }}
                        >
                          {entry.subject || 'UNTITLED AUDIT'}
                        </Typography>
                        <Typography
                          variant="caption"
                          component="p"
                          sx={{
                            color: 'text.secondary',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {entry.primary_data}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              )}

              <Divider sx={{ my: 4, borderColor: '#1b5e20' }} />

              {/* High Priority Node Status */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  color: '#00ff41',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <FontAwesomeIcon icon={faCat} /> NODE STATUS
              </Typography>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                    Rita (Tuxedo Unit 1)
                  </Typography>
                  <Chip
                    size="small"
                    label="NOMINAL"
                    sx={{
                      bgcolor: 'rgba(0, 255, 65, 0.1)',
                      color: '#00ff41',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
// #endregion
