// #region [ 📦 IMPORTS ]
import {
  faBookJournalWhills,
  faClock,
  faMicrochip,
  faTerminal,
  faTimeline,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
// #endregion

// #region [ 🏷️ TYPES ]
export type HumanOSEntryType =
  | 'CAPTAINS_LOG'
  | 'OS_MANIFEST'
  | 'SAFEHOOD_PROTOCOL'
  | 'ANALOG_WASTELAND'
  | 'observation'
  | 'incident'
  | 'directive';

interface LogRecord {
  id: string;
  created_at: string;
  entry_type: HumanOSEntryType;
  entry_text: unknown; // 🛡️ NO MORE ANY: The payload is strictly unknown until parsed
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
  const {
    data: logs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['manifest-logs'],
    queryFn: fetchManifests,
  });

  // #region [ 🛠️ PARSER ENGINE (The Smart Intake Valve) ]
  const renderEntryText = (data: unknown) => {
    // 🛡️ Strictly unknown
    if (!data) return null;

    let parsedData: unknown = data; // 🛡️ Flow the unknown type down

    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data);
      } catch {
        return (
          <Typography
            variant="body1"
            sx={{ color: 'text.primary', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
          >
            {data}
          </Typography>
        );
      }
    }

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
          color: '#00ff41',
          border: '1px solid rgba(0, 255, 65, 0.1)',
          fontFamily: 'monospace',
        }}
      >
        {JSON.stringify(parsedData, null, 2)}
      </Box>
    );
  };
  // #endregion

  // #region [ 🗃️ TAB PARTITIONS ]
  // Tab 0: Chronological Timeline
  const chronologicalLogs =
    logs?.filter((l) => ['CAPTAINS_LOG', 'observation', 'incident'].includes(l.entry_type)) || [];

  // Tab 1: The Master OS Architecture
  const systemManifests =
    logs?.filter((l) => ['OS_MANIFEST', 'directive'].includes(l.entry_type)) || [];

  // Tab 2: Operational Protocols
  const coreProtocols =
    logs?.filter((l) => ['SAFEHOOD_PROTOCOL', 'ANALOG_WASTELAND'].includes(l.entry_type)) || [];

  const activeData =
    activeTab === 0 ? chronologicalLogs : activeTab === 1 ? systemManifests : coreProtocols;
  // #endregion

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      {/* --- PAGE HEADER --- */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <FontAwesomeIcon icon={faBookJournalWhills} color="#9C27B0" />
          Human OS Architecture
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
          Immutable historical record and core operating directives of the Sovereign Pilot.
        </Typography>
      </Box>

      {/* --- TRI-BAND NAVIGATION --- */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          textColor="secondary"
          indicatorColor="secondary"
          variant="scrollable" // Allows scrolling on smaller screens
          scrollButtons="auto"
        >
          <Tab
            icon={<FontAwesomeIcon icon={faTimeline} />}
            iconPosition="start"
            label="Captain's Logs"
            sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<FontAwesomeIcon icon={faMicrochip} />}
            iconPosition="start"
            label="OS Manifest"
            sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<FontAwesomeIcon icon={faUserShield} />}
            iconPosition="start"
            label="Core Protocols"
            sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
          />
        </Tabs>
      </Box>

      {/* --- STATE: LOADING / ERROR --- */}
      {isLoading && (
        <CircularProgress color="secondary" sx={{ display: 'block', mx: 'auto', mt: 8 }} />
      )}
      {isError && <Alert severity="error">Airlock Breach: {(error as Error).message}</Alert>}

      {/* --- THE ACTIVE FEED --- */}
      {!isLoading && !isError && (
        <Stack spacing={4}>
          {activeData.length === 0 && (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.2)',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No records found in this partition. Ready for uplink.
              </Typography>
            </Box>
          )}

          {activeData.map((log) => {
            const safeDateString = log.created_at || new Date().toISOString();
            const logDate = new Date(safeDateString);

            // Cyan styling for Manifests and Protocols
            const isManifestPartition = [
              'OS_MANIFEST',
              'SAFEHOOD_PROTOCOL',
              'ANALOG_WASTELAND',
              'directive',
            ].includes(log.entry_type);

            return (
              <Card
                key={log.id}
                sx={{
                  borderLeft: '4px solid',
                  borderColor: isManifestPartition ? '#00E5FF' : '#9C27B0',
                  bgcolor: 'background.paper',
                  mb: 2,
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  {/* Top Meta Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                      flexWrap: 'wrap',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        icon={<FontAwesomeIcon icon={faTerminal} />}
                        label={
                          log.entry_type
                            ? log.entry_type.replace('_', ' ').toUpperCase()
                            : 'UNKNOWN'
                        }
                        size="small"
                        sx={{
                          bgcolor: isManifestPartition
                            ? 'rgba(0, 229, 255, 0.15)'
                            : 'rgba(156, 39, 176, 0.15)',
                          color: isManifestPartition ? '#00E5FF' : '#E1BEE7',
                          fontWeight: 600,
                          letterSpacing: '1px',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.disabled', fontFamily: 'monospace' }}
                      >
                        ID: {log.id.substring(0, 8)}...
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        textAlign: { xs: 'left', md: 'right' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <FontAwesomeIcon icon={faClock} color="#888" size="sm" />
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', fontFamily: 'monospace' }}
                      >
                        {logDate.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />

                  {/* The Payload */}
                  <Box sx={{ mt: 2 }}>{renderEntryText(log.entry_text)}</Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
