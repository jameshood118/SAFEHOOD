// #region [ 📦 IMPORTS ]
import {
  faBrain,
  faBriefcase,
  faCat,
  faHouseSignal,
  faRobot,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
// #endregion

// #region [ 🗃️ THE ARCHITECTURE (Module Definitions) ]
/**
 * By defining the modules in an array, we keep the UI purely functional.
 * If you need to add a new system node later, you just drop it in this array.
 */
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
    id: 'safehood-chat',
    title: 'SAFEHOOD Chat',
    description: 'The AI Subroutine. Awaiting input.',
    icon: faRobot,
    path: '/chat',
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
    accentColor: '#FFFFFF', // Tactical White (like the star on her chest)
  }
];
// #endregion

// #region [ 🚀 DASHBOARD VIEW ]
export const Dashboard = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
          System Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Select a localized OS environment to initiate the uplink.
        </Typography>
      </Box>

      {/* The Bento Box Grid */}
      <Grid container spacing={3}>
        {systemModules.map((module) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.id}>

            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, border-color 0.2s ease-in-out',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: module.accentColor,
                  boxShadow: `0 8px 24px ${module.accentColor}20`, // Glowing drop shadow
                }
              }}
            >
              {/* CardActionArea makes the entire card a massive, accessible button */}
              <CardActionArea
                component={Link}
                to={module.path}
                sx={{ height: '100%', p: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                  {/* The Icon Badge */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: `${module.accentColor}15`, // 15% opacity of the accent color
                      color: module.accentColor,
                      mb: 2
                    }}
                  >
                    <FontAwesomeIcon icon={module.icon} size="2x" />
                  </Box>

                  {/* The Text Payload */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                    {module.description}
                  </Typography>

                </CardContent>
              </CardActionArea>
            </Card>

          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
// #endregion
