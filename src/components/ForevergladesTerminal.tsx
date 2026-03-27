import {
  faBiohazard,
  faSatelliteDish,
  faSearch,
  faTerminal,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useMemo, useState } from 'react';

// 📦 Import your new Data Entry Module
import { UplinkConsole } from './UplinkConsole';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface CaptainsLogEntry {
  id: string;
  timestamp: string;
  subject: string;
  primary_data: string;
  secondary_data?: string;
  tags?: string[];
  category?: string;
}

interface LogRecord {
  id: string;
  created_at: string;
  entry_type: string;
  entry_text: string | CaptainsLogEntry;
}

export const ForevergladesTerminal = () => {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [pilotAuthenticated, setPilotAuthenticated] = useState<boolean>(false);

  // 🛠️ State to toggle the Uplink Console visibility
  const [showUplink, setShowUplink] = useState<boolean>(false);

  // 📡 Extracted fetch function so we can refresh after a new entry is submitted
  const performSystemAudit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setPilotAuthenticated(true);
      const { data, error } = await supabase
        .from('captains_logs')
        .select('*')
        .eq('entry_type', 'CAPTAINS_LOG')
        .order('created_at', { ascending: false });

      if (!error && data) setLogs(data);
    }
    setIsBooting(false);
  };

  useEffect(() => {
    performSystemAudit();
  }, []);

  // Filter Logic: The "Data Scrubber"
  const filteredLogs = useMemo(() => {
    return logs.filter((record) => {
      const entry =
        typeof record.entry_text === 'string'
          ? (JSON.parse(record.entry_text) as CaptainsLogEntry)
          : (record.entry_text as CaptainsLogEntry);

      const matchesSearch =
        entry.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.primary_data?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag ? entry.tags?.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [logs, searchQuery, selectedTag]);

  if (isBooting) {
    return (
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#0a0510',
          color: '#00ff41',
        }}
      >
        <CircularProgress color="inherit" size={60} sx={{ mb: 4 }} />
        <Typography variant="h5" component="p" sx={{ fontWeight: '700' }}>
          BOOTING HUMAN_OS... VERIFYING KERNEL...
        </Typography>
      </Box>
    );
  }

  if (!pilotAuthenticated) {
    return (
      <Box
        component="main"
        sx={{ p: 8, bgcolor: '#0a0510', color: '#ff1744', minHeight: '100vh', textAlign: 'center' }}
      >
        <FontAwesomeIcon icon={faBiohazard} size="4x" />
        <Typography variant="h2" component="h1" sx={{ mt: 4, fontWeight: 900 }}>
          ACCESS DENIED
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a0510',
        color: '#00ff41',
        fontFamily: 'monospace',
        p: { xs: 2, md: 4 },
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section with Toggle Button */}
        <Box
          component="header"
          sx={{
            mb: 4,
            borderBottom: '1px solid #1b5e20',
            pb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <FontAwesomeIcon icon={faTerminal} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
              S.A.F.E.H.O.O.D. v2.1
            </Typography>
          </Stack>

          {/* 🔘 The Tactical Toggle */}
          <Button
            variant="outlined"
            onClick={() => setShowUplink(!showUplink)}
            startIcon={<FontAwesomeIcon icon={showUplink ? faTimes : faSatelliteDish} />}
            sx={{
              color: showUplink ? '#ff1744' : '#8a2be2',
              borderColor: showUplink ? '#ff1744' : '#8a2be2',
              fontFamily: 'monospace',
              fontWeight: 700,
              borderRadius: 0,
              '&:hover': {
                bgcolor: showUplink ? 'rgba(255, 23, 68, 0.1)' : 'rgba(138, 43, 226, 0.1)',
                borderColor: showUplink ? '#ff1744' : '#8a2be2',
              },
            }}
          >
            {showUplink ? 'CLOSE CONNECTION' : 'INITIATE UPLINK'}
          </Button>
        </Box>

        {/* 🚀 Expandable Data Entry Module */}
        <Collapse in={showUplink} unmountOnExit>
          <Box sx={{ mb: 6 }}>
            {/* Note: Pass performSystemAudit so it re-fetches logs immediately upon success */}
            <UplinkConsole onSuccess={performSystemAudit} />
          </Box>
        </Collapse>

        {/* The Search & Filter Interface */}
        <Stack spacing={2} sx={{ mb: 6 }}>
          <TextField
            fullWidth
            placeholder="SCRUB DATA (ID, SUBJECT, OR TAGS)..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faSearch} style={{ color: '#00ff41' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#00ff41',
                fontFamily: 'monospace',
                borderRadius: 0,
                '& fieldset': { borderColor: '#1b5e20' },
                '&:hover fieldset': { borderColor: '#8a2be2' },
                '&.Mui-focused fieldset': { borderColor: '#8a2be2' },
              },
            }}
          />

          {selectedTag && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="caption" component="span" sx={{ color: '#8a2be2' }}>
                ACTIVE FILTER:
              </Typography>
              <Chip
                label={`#${selectedTag.toUpperCase()}`}
                onDelete={() => setSelectedTag(null)}
                deleteIcon={<FontAwesomeIcon icon={faTimes} style={{ fontSize: '10px' }} />}
                sx={{ bgcolor: '#8a2be2', color: 'white', borderRadius: 0, fontSize: '0.7rem' }}
              />
            </Stack>
          )}
        </Stack>

        {/* The Timeline Feed */}
        <Stack spacing={3}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((record) => {
              const entry =
                typeof record.entry_text === 'string'
                  ? (JSON.parse(record.entry_text) as CaptainsLogEntry)
                  : (record.entry_text as CaptainsLogEntry);

              return (
                <Paper
                  key={record.id}
                  elevation={0}
                  component="article"
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    border: '1px solid #1b5e20',
                    borderRadius: 0,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" component="time" sx={{ color: '#8a2be2' }}>
                      [{new Date(record.created_at).toLocaleString()}]
                    </Typography>
                    <Typography variant="caption" component="span" sx={{ opacity: 0.4 }}>
                      {entry.id}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ mb: 2, textTransform: 'uppercase' }}
                  >
                    {entry.subject}
                  </Typography>

                  <Typography variant="body2" component="p" sx={{ color: '#e0e0e0', mb: 3 }}>
                    {entry.primary_data}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {entry.tags?.map((tag) => (
                      <Chip
                        key={tag}
                        label={`#${tag.toUpperCase()}`}
                        onClick={() => setSelectedTag(tag)}
                        size="small"
                        sx={{
                          bgcolor: 'transparent',
                          color: '#00ff41',
                          border: '1px solid #1b5e20',
                          borderRadius: 0,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'rgba(138, 43, 226, 0.2)', borderColor: '#8a2be2' },
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>
              );
            })
          ) : (
            <Box sx={{ textAlign: 'center', p: 10, border: '1px dashed #1b5e20' }}>
              <Typography variant="body1" component="p">
                NO RECORDS MATCH THE CURRENT FILTER. SCRUBBING COMPLETE.
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
