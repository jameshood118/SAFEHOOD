// #region [ 📦 IMPORTS ]
import { faBookJournalWhills, faMicrochip, faTerminal, faTimeline } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
// #endregion

// #region [ 🏷️ TYPES ]
// Define the strict union of our Human OS sectors
export type HumanOSEntryType =
  | 'CAPTAINS_LOG'
  | 'OS_MANIFEST'
  | 'SAFEHOOD_PROTOCOL'
  | 'ANALOG_WASTELAND'
  | 'observation' // Keep legacy for compatibility if needed
  | 'incident'
  | 'directive';

interface LogRecord {
  id: string;
  created_at: string;
  entry_type: HumanOSEntryType; // <--- Apply the union here
  entry_text: string;
  is_deleted: boolean;
}
// #endregion

// #region [ 📡 THE EPISTEMIC FETCH ]
const fetchManifests = async () => {
  const { data, error } = await supabase
    .from('captains_logs')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as unknown as LogRecord[];
};
// #endregion

export const Manifests = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { data: logs, isLoading, isError, error } = useQuery({
    queryKey: ['manifest-logs'],
    queryFn: fetchManifests,
  });

  // #region [ 🛠️ PARSER ENGINE ]
const renderEntryText = (text: string | null) => {
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    return (
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          bgcolor: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          overflowX: 'auto',
          color: '#00ff41', // Matching the Foreverglades Green
          border: '1px solid rgba(0, 255, 65, 0.1)',
          fontFamily: 'monospace'
        }}
      >
        {JSON.stringify(parsed, null, 2)}
      </Box>
    );
  } catch {
    return (
      <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
        {text}
      </Typography>
    );
  }
};
  // #endregion

// 🛠️ Updated Filter: Capturing the 1,743 logs
const chronologicalLogs = logs?.filter(l =>
  l.entry_type === 'CAPTAINS_LOG' ||
  l.entry_type === 'observation' ||
  l.entry_type === 'incident'
) || [];

// 🛠️ Updated Filter: Capturing the System Directives
const manifestDirectives = logs?.filter(l =>
  l.entry_type === 'OS_MANIFEST' ||
  l.entry_type === 'SAFEHOOD_PROTOCOL' ||
  l.entry_type === 'ANALOG_WASTELAND' ||
  l.entry_type === 'directive'
) || [];

  const activeData = activeTab === 0 ? chronologicalLogs : manifestDirectives;

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>

      {/* --- PAGE HEADER --- */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.contrastText', display: 'flex', alignItems: 'center', gap: 2 }}>
          <FontAwesomeIcon icon={faBookJournalWhills} color="#9C27B0" />
          Human OS Architecture
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
          Immutable historical record and core operating directives of the Sovereign Pilot.
        </Typography>
      </Box>

      {/* --- DUAL-BAND NAVIGATION --- */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab icon={<FontAwesomeIcon icon={faTimeline} />} iconPosition="start" label="Captain's Logs" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }} />
          <Tab icon={<FontAwesomeIcon icon={faMicrochip} />} iconPosition="start" label="OS Manifest" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }} />
        </Tabs>
      </Box>

      {/* --- STATE: LOADING / ERROR --- */}
      {isLoading && <CircularProgress color="secondary" sx={{ display: 'block', mx: 'auto', mt: 8 }} />}
      {isError && <Alert severity="error">Airlock Breach: {(error as Error).message}</Alert>}

      {/* --- THE ACTIVE FEED --- */}
      {!isLoading && !isError && (
        <Stack spacing={4}>
          {activeData.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 2 }}>
              <Typography variant="body1" color="text.secondary">
                No records found in this partition. Ready for uplink.
              </Typography>
            </Box>
          )}

{activeData.map((log) => {
  const safeDateString = log.created_at || new Date().toISOString();
  const logDate = new Date(safeDateString);

  // 🛠️ Updated Visual Check:
  // Ensures OS_MANIFEST, SAFEHOOD, and WASTELAND get the "System Cyan" styling
  const isManifestPartition = [
    'OS_MANIFEST',
    'SAFEHOOD_PROTOCOL',
    'ANALOG_WASTELAND',
    'directive'
  ].includes(log.entry_type);

  return (
    <Card key={log.id} sx={{
      borderLeft: '4px solid',
      // Cyan for System Architecture, Purple for Historical Logs
      borderColor: isManifestPartition ? '#00E5FF' : '#9C27B0',
      bgcolor: 'background.paper',
      mb: 2 // Adding a bit of breathing room
    }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* ... rest of your existing CardContent code ... */}

        {/* Ensure the Chip also uses the new check for its colors */}
        <Chip
          icon={<FontAwesomeIcon icon={faTerminal} />}
          label={log.entry_type ? log.entry_type.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
          size="small"
          sx={{
            bgcolor: isManifestPartition ? 'rgba(0, 229, 255, 0.15)' : 'rgba(156, 39, 176, 0.15)',
            color: isManifestPartition ? '#00E5FF' : '#E1BEE7',
            fontWeight: 600,
            letterSpacing: '1px'
          }}
        />

        {/* ... */}
      </CardContent>
    </Card>
  );
})}
        </Stack>
      )}
    </Box>
  );
};
