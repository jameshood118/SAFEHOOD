// #region [ 📦 IMPORTS ]
import {
  faBriefcase,
  faBuilding,
  faEject,
  faEnvelope,
  faFileLines,
  faPlus,
  faSearch,
  faShieldHalved,
  faUserTie,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
// #endregion

// #region [ 🏷️ TYPES ]
interface WorkOSClient {
  id: string;
  created_at: string;
  company_name: string;
  primary_contact: string;
  contact_email: string;
  industry: string;
  company_size: string;
  status: 'LEAD' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  threat_level: 'NOMINAL' | 'ELEVATED' | 'EFFICIENCY_TRAP';
  jinba_ittai_alignment: number;
  intake_data: Record<string, unknown> | null;
}

// 🛡️ NEW SATELLITE TYPE: Performance Reviews
export interface CompanyReview {
  id: string;
  client_id: string;
  rating: number;
  notes: string;
  created_at: string;
}
// #endregion

// #region [ 📡 THE EPISTEMIC FETCH ]
const fetchClients = async () => {
  const { data, error } = await supabase
    .from('work_os_clients')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as WorkOSClient[];
};
// #endregion

// #region [ 🎨 TACTICAL STYLING HELPERS ]
const getThreatColor = (level: string) => {
  switch (level) {
    case 'NOMINAL':
      return { color: '#00ff41', bg: 'rgba(0, 255, 65, 0.1)' };
    case 'ELEVATED':
      return { color: '#FF9800', bg: 'rgba(255, 152, 0, 0.1)' };
    case 'EFFICIENCY_TRAP':
      return { color: '#F44336', bg: 'rgba(244, 67, 54, 0.1)' };
    default:
      return { color: '#888', bg: 'rgba(136, 136, 136, 0.1)' };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'LEAD':
      return { color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.1)' }; // Cyan
    case 'ACTIVE':
      return { color: '#9C27B0', bg: 'rgba(156, 39, 176, 0.1)' }; // Purple
    case 'COMPLETED':
      return { color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.1)' }; // Green
    case 'ARCHIVED':
      return { color: '#757575', bg: 'rgba(117, 117, 117, 0.1)' }; // Grey
    default:
      return { color: '#888', bg: 'rgba(136, 136, 136, 0.1)' };
  }
};
// #endregion

export const Personnel = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer States
  const [isIntakeDrawerOpen, setIsIntakeDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<WorkOSClient | null>(null);

  // Form State for Manual Intake
  const [companyName, setCompanyName] = useState('');
  const [primaryContact, setPrimaryContact] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [threatLevel, setThreatLevel] = useState('NOMINAL');
  const [alignmentScore, setAlignmentScore] = useState<number>(5);

  const {
    data: clients,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['work-os-clients'],
    queryFn: fetchClients,
  });

  // 📡 Contextual Fetch: Only fires when a dossier is opened
  const { data: clientReviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['company-reviews', selectedClient?.id],
    queryFn: async () => {
      if (!selectedClient) return [];
      const { data, error } = await supabase
        .from('company_reviews')
        .select('*')
        .eq('client_id', selectedClient.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as CompanyReview[];
    },
    enabled: !!selectedClient, // 🛡️ The Structural Damper
  });

  // #region [ 🚀 THE MUTATIONS ]
  const inductClientMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        company_name: companyName,
        primary_contact: primaryContact,
        contact_email: contactEmail,
        industry: industry,
        threat_level: threatLevel,
        jinba_ittai_alignment: alignmentScore,
        status: 'LEAD',
        intake_data: { source: 'MANUAL_OVERRIDE', notes: 'Input directly via terminal.' },
      };

      const { error } = await supabase.from('work_os_clients').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-os-clients'] });
      setIsIntakeDrawerOpen(false);
      setCompanyName('');
      setPrimaryContact('');
      setContactEmail('');
      setIndustry('');
      setThreatLevel('NOMINAL');
      setAlignmentScore(5);
    },
  });

  // The Eject Button Logic
  const dischargeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('work_os_clients')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-os-clients'] });
      setSelectedClient(null); // Close the dossier
    },
  });
  // #endregion

  // #region [ 🛠️ THE DATA SCRUBBER ]
  const filteredClients =
    clients?.filter((client) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        client.company_name?.toLowerCase().includes(searchLower) ||
        client.primary_contact?.toLowerCase().includes(searchLower) ||
        client.industry?.toLowerCase().includes(searchLower)
      );
    }) || [];
  // #endregion

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* --- PAGE HEADER & CONTROLS --- */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        <Box>
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
            <FontAwesomeIcon icon={faBriefcase} color="#4CAF50" />
            Work OS: Personnel Nodes
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Tactical mapping of ForceTechh clients, vendors, and professional entities.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setIsIntakeDrawerOpen(true)}
          sx={{
            bgcolor: '#4CAF50',
            color: '#000',
            fontWeight: 800,
            fontFamily: 'monospace',
            borderRadius: 0,
            px: 3,
            py: 1.5,
            '&:hover': { bgcolor: '#388E3C' },
          }}
        >
          MANUAL INTAKE
        </Button>
      </Box>

      {/* --- SEARCH BAR --- */}
      <TextField
        fullWidth
        placeholder="SCRUB NODES (COMPANY, CONTACT, INDUSTRY)..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faSearch} style={{ color: '#4CAF50' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* --- STATE: LOADING / ERROR --- */}
      {isLoading && (
        <CircularProgress color="success" sx={{ display: 'block', mx: 'auto', mt: 8 }} />
      )}
      {isError && (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          Airlock Breach: {(error as Error).message}
        </Alert>
      )}

      {/* --- THE GRID --- */}
      {!isLoading && !isError && (
        <Grid container spacing={3}>
          {filteredClients.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 6,
                  textAlign: 'center',
                  border: '1px dashed rgba(76, 175, 80, 0.3)',
                  bgcolor: 'rgba(0,0,0,0.2)',
                }}
              >
                <FontAwesomeIcon icon={faBuilding} size="3x" color="rgba(76, 175, 80, 0.3)" />
                <Typography
                  variant="h6"
                  sx={{ color: 'text.secondary', mt: 2, fontFamily: 'monospace' }}
                >
                  NO ACTIVE NODES FOUND. AWAITING INTAKE TELEMETRY.
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredClients.map((client) => {
              const threat = getThreatColor(client.threat_level);
              const status = getStatusColor(client.status);

              return (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={client.id}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderTop: `4px solid ${status.color}`,
                      borderRadius: 0,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => setSelectedClient(client)}
                      sx={{
                        height: '100%',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                      }}
                    >
                      {/* Top Meta: Status & Threat */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={2}
                        sx={{ width: '100%' }}
                      >
                        <Chip
                          label={client.status}
                          size="small"
                          sx={{
                            bgcolor: status.bg,
                            color: status.color,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            borderRadius: 0,
                          }}
                        />
                        <Chip
                          icon={
                            <FontAwesomeIcon
                              icon={faShieldHalved}
                              style={{ color: threat.color }}
                            />
                          }
                          label={client.threat_level.replace('_', ' ')}
                          size="small"
                          sx={{
                            bgcolor: threat.bg,
                            color: threat.color,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            borderRadius: 0,
                          }}
                        />
                      </Stack>

                      {/* Core Info */}
                      <Box sx={{ width: '100%', textAlign: 'left' }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: 'primary.contrastText',
                            mb: 0.5,
                            lineHeight: 1.2,
                          }}
                        >
                          {client.company_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#4CAF50', fontFamily: 'monospace', mb: 2 }}
                        >
                          {client.industry || 'INDUSTRY: UNKNOWN'}
                        </Typography>
                      </Box>

                      <Divider
                        sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)', width: '100%' }}
                      />

                      {/* Contact Info */}
                      <Stack spacing={1.5} mb={3} sx={{ width: '100%', textAlign: 'left' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            color: 'text.secondary',
                          }}
                        >
                          <FontAwesomeIcon icon={faUserTie} />
                          <Typography variant="body2">
                            {client.primary_contact || 'No Contact Assigned'}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            color: 'text.secondary',
                          }}
                        >
                          <FontAwesomeIcon icon={faEnvelope} />
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {client.contact_email || 'Awaiting Data'}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Jinba Ittai Meter */}
                      <Box sx={{ mt: 'auto', width: '100%' }}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                          <Typography
                            variant="caption"
                            sx={{ color: 'text.secondary', fontFamily: 'monospace' }}
                          >
                            JINBA ITTAI ALIGNMENT
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                client.jinba_ittai_alignment >= 7
                                  ? '#00ff41'
                                  : client.jinba_ittai_alignment >= 4
                                    ? '#FF9800'
                                    : '#F44336',
                              fontWeight: 700,
                            }}
                          >
                            {client.jinba_ittai_alignment} / 10
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={client.jinba_ittai_alignment * 10}
                          sx={{
                            height: 6,
                            borderRadius: 0,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor:
                                client.jinba_ittai_alignment >= 7
                                  ? '#00ff41'
                                  : client.jinba_ittai_alignment >= 4
                                    ? '#FF9800'
                                    : '#F44336',
                            },
                          }}
                        />
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      )}

      {/* ========================================================= */}
      {/* 🟢 DRAWER 1: MANUAL INTAKE                                */}
      {/* ========================================================= */}
      <Drawer
        anchor="right"
        open={isIntakeDrawerOpen}
        onClose={() => setIsIntakeDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 450 },
            bgcolor: '#0a0510',
            borderLeft: '1px solid #1b5e20',
            p: 3,
          },
        }}
      >
        <Stack spacing={3} component="form" sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: '#4CAF50', fontFamily: 'monospace' }}
            >
              MANUAL INTAKE
            </Typography>
            <IconButton onClick={() => setIsIntakeDrawerOpen(false)} sx={{ color: '#4CAF50' }}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: '#1b5e20' }} />

          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            Node Identity
          </Typography>
          <TextField
            fullWidth
            label="Company Name"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />

          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, mt: 2 }}>
            Contact Telemetry
          </Typography>
          <TextField
            fullWidth
            label="Primary Contact Name"
            required
            value={primaryContact}
            onChange={(e) => setPrimaryContact(e.target.value)}
          />
          <TextField
            fullWidth
            label="Contact Email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />

          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, mt: 2 }}>
            Hazard Assessment
          </Typography>
          <TextField
            select
            fullWidth
            label="Threat Level"
            value={threatLevel}
            onChange={(e) => setThreatLevel(e.target.value)}
          >
            <MenuItem value="NOMINAL">NOMINAL (Green Flag)</MenuItem>
            <MenuItem value="ELEVATED">ELEVATED (Proceed with Caution)</MenuItem>
            <MenuItem value="EFFICIENCY_TRAP">EFFICIENCY TRAP (High Friction)</MenuItem>
          </TextField>
          <TextField
            type="number"
            fullWidth
            label="Jinba Ittai Alignment (1-10)"
            inputProps={{ min: 1, max: 10 }}
            value={alignmentScore}
            onChange={(e) => setAlignmentScore(Number(e.target.value))}
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => inductClientMutation.mutate()}
            disabled={inductClientMutation.isPending || !companyName || !primaryContact}
            sx={{
              mt: 'auto',
              py: 2,
              bgcolor: '#4CAF50',
              color: '#000',
              fontWeight: 800,
              fontFamily: 'monospace',
              borderRadius: 0,
              '&:hover': { bgcolor: '#388E3C' },
              '&:disabled': { bgcolor: 'rgba(76, 175, 80, 0.3)', color: 'rgba(255,255,255,0.3)' },
            }}
          >
            {inductClientMutation.isPending ? 'SYNCING...' : 'ESTABLISH NODE'}
          </Button>
        </Stack>
      </Drawer>

      {/* ========================================================= */}
      {/* 🟣 DRAWER 2: NODE DOSSIER (The Deep Dive)                 */}
      {/* ========================================================= */}
      <Drawer
        anchor="right"
        open={Boolean(selectedClient)}
        onClose={() => setSelectedClient(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: 500 },
            bgcolor: 'background.default',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            p: 0,
          },
        }}
      >
        {selectedClient && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Dossier Header */}
            <Box
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', fontFamily: 'monospace', letterSpacing: '2px' }}
                  >
                    NODE DOSSIER
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: 'primary.contrastText', mt: 0.5 }}
                  >
                    {selectedClient.company_name}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedClient(null)}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </Box>

              <Stack direction="row" spacing={1} mb={2}>
                <Chip
                  label={selectedClient.status}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(selectedClient.status).bg,
                    color: getStatusColor(selectedClient.status).color,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    borderRadius: 0,
                  }}
                />
                <Chip
                  icon={
                    <FontAwesomeIcon
                      icon={faShieldHalved}
                      style={{ color: getThreatColor(selectedClient.threat_level).color }}
                    />
                  }
                  label={selectedClient.threat_level.replace('_', ' ')}
                  size="small"
                  sx={{
                    bgcolor: getThreatColor(selectedClient.threat_level).bg,
                    color: getThreatColor(selectedClient.threat_level).color,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    borderRadius: 0,
                  }}
                />
              </Stack>
            </Box>

            {/* Dossier Body (Scrollable) */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#00E5FF',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontFamily: 'monospace',
                }}
              >
                <FontAwesomeIcon icon={faFileLines} /> RAW INTAKE PAYLOAD
              </Typography>

              {/* The "Human-Centric" Payload Renderer */}
              {selectedClient.intake_data && Object.keys(selectedClient.intake_data).length > 0 ? (
                <Stack spacing={2}>
                  {Object.entries(selectedClient.intake_data).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.02)',
                        p: 2,
                        borderLeft: '2px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          fontFamily: 'monospace',
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        {key.replace(/_/g, ' ')}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'primary.contrastText', whiteSpace: 'pre-wrap' }}
                      >
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ p: 3, border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                    No intake payload detected for this node.
                  </Typography>
                </Box>
              )}

              {/* ========================================= */}
              {/* 📝 PERFORMANCE REVIEWS & LOGS               */}
              {/* ========================================= */}
              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#00E5FF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'monospace',
                  }}
                >
                  <FontAwesomeIcon icon={faFileLines} /> PERFORMANCE LOGS
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => console.log('Uplink command initialized: Open Add Review Form')}
                  sx={{
                    color: '#00E5FF',
                    borderColor: 'rgba(0, 229, 255, 0.3)',
                    fontFamily: 'monospace',
                    fontSize: '0.7rem',
                  }}
                >
                  + ADD LOG
                </Button>
              </Box>

              {isLoadingReviews ? (
                <CircularProgress
                  size={24}
                  sx={{ color: '#00E5FF', display: 'block', mx: 'auto' }}
                />
              ) : clientReviews && clientReviews.length > 0 ? (
                <Stack spacing={2}>
                  {clientReviews.map((review) => (
                    <Box
                      key={review.id}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.02)',
                        p: 2,
                        borderLeft: '2px solid #00E5FF',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', fontFamily: 'monospace' }}
                        >
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={`RATING: ${review.rating}/10`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(0, 229, 255, 0.1)',
                            color: '#00E5FF',
                            fontFamily: 'monospace',
                            fontSize: '0.65rem',
                            borderRadius: 0,
                            height: 20,
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ color: 'primary.contrastText' }}>
                        {review.notes}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{ p: 3, border: '1px dashed rgba(0, 229, 255, 0.2)', textAlign: 'center' }}
                >
                  <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                    No historical logs detected for this node.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Dossier Footer (The Eject Button) */}
            <Box
              sx={{
                p: 3,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                bgcolor: 'background.paper',
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<FontAwesomeIcon icon={faEject} />}
                onClick={() => dischargeMutation.mutate(selectedClient.id)}
                disabled={dischargeMutation.isPending}
                sx={{
                  py: 1.5,
                  borderColor: 'rgba(244, 67, 54, 0.5)',
                  borderRadius: 0,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)', borderColor: '#F44336' },
                }}
              >
                {dischargeMutation.isPending ? 'PURGING NODE...' : 'ARCHIVE / DISCHARGE NODE'}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};
