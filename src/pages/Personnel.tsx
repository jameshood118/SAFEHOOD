// #region [ 📦 IMPORTS ]
import {
  faEject,
  faLightbulb,
  faTriangleExclamation,
  faUserPlus,
  faUserTie,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert, Box,
  Button,
  Card, CardContent, Chip, CircularProgress, Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
// #endregion

// #region [ 📡 THE EPISTEMIC FETCH (React Query + Supabase) ]
/**
 * This function reaches into the Temporal Vault.
 * Notice we explicitly filter out soft-deleted records.
 * The Shadow Tables remember them, but the "Operating" layer ignores them.
 */
const fetchInterns = async () => {
  const { data, error } = await supabase
    .from('interns')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
// #endregion

// #region [ 🚀 WORK OS VIEW ]
export const Personnel = () => {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [quirk, setQuirk] = useState(''); // "Likes onions"
  const [mitigation, setMitigation] = useState(''); // "Needs Peppermint Gum"

  // 1. Fetch Active Interns
  const { data: interns, isLoading, isError, error } = useQuery({
    queryKey: ['interns'],
    queryFn: fetchInterns,
  });

  // 2. Induct New Intern (INSERT MUTATION)
  const inductMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('interns').insert([
        {
          first_name: firstName,
          last_name: lastName,
          michael_scott_notes: {
            observation: quirk,
            human_os_patch: mitigation,
            hazard_level: 'Low (Social)',
          },
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interns'] });
      setIsDrawerOpen(false);
      setFirstName(''); setLastName(''); setQuirk(''); setMitigation('');
    },
  });

  // 3. Discharge Intern (SOFT DELETE MUTATION)
  const dischargeMutation = useMutation({
    mutationFn: async (id: string) => {
      // Flip the is_deleted flag. The Postgres temporal trigger handles the rest.
      const { error } = await supabase
        .from('interns')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interns'] });
    },
  });

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

      {/* --- PAGE HEADER --- */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
            Work OS: Personnel Matrix
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Live telemetry on Interns, Employees, and associated hazard protocols.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<FontAwesomeIcon icon={faUserPlus} />}
          onClick={() => setIsDrawerOpen(true)}
          sx={{ height: '44px', px: 3 }}
        >
          Induct New Intern
        </Button>
      </Box>

      {/* --- STATE: LOADING --- */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {/* --- STATE: ERROR --- */}
      {isError && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: '8px' }}>
          <strong>Airlock Breach:</strong> {(error as Error).message}
        </Alert>
      )}

      {/* --- STATE: SUCCESS (DATA GRID) --- */}
      {!isLoading && !isError && interns && (
        <Grid container spacing={3}>
          {/* If the vault is empty, show a clean fallback */}
          {interns.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                <Typography variant="body1" color="text.secondary">
                  No personnel records found in the current timeline.
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Map through the strictly-typed interns */}
          {interns.map((intern) => {
            const notes = intern.michael_scott_notes as Record<string, any> | null;

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={intern.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* Identity Block */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: '8px',
                        bgcolor: 'secondary.main', color: '#000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2
                      }}>
                        <FontAwesomeIcon icon={faUserTie} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                          {intern.first_name} {intern.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                          ID: {intern.id.substring(0, 8)}...
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.05)' }} />

                    {/* Hazard Notes (The Michael Scott Data) */}
                    <Typography variant="subtitle2" sx={{ color: 'action.focus', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={faTriangleExclamation} />
                      Behavioral Telemetry
                    </Typography>

                    <Box sx={{ flexGrow: 1 }}>
                      {/* Dynamically render whatever is in the JSONB object */}
                      {notes && Object.keys(notes).length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {Object.entries(notes).map(([key, value]) => (
                            <Box key={key} sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1.5, borderRadius: '6px' }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize', display: 'block', mb: 0.5 }}>
                                {key.replace(/_/g, ' ')}
                              </Typography>
                              {Array.isArray(value) ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {value.map((v, i) => (
                                    <Chip key={i} label={v} size="small" variant="outlined" sx={{ color: 'primary.contrastText', borderColor: 'rgba(255,255,255,0.2)' }} />
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="body2">{String(value)}</Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No hazard data logged. (Highly suspicious).
                        </Typography>
                      )}
                    </Box>

                    {/* Discharge Action */}
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      startIcon={<FontAwesomeIcon icon={faEject} />}
                      onClick={() => dischargeMutation.mutate(intern.id)}
                      disabled={dischargeMutation.isPending}
                      sx={{ mt: 3, borderColor: 'rgba(244, 67, 54, 0.5)' }}
                    >
                      Discharge Intern
                    </Button>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* --- THE INDUCTION DRAWER --- */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, bgcolor: 'background.paper', p: 3 }
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Personnel Induction</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}><FontAwesomeIcon icon={faXmark} /></IconButton>
          </Box>

          <Divider />

          <Typography variant="overline" color="secondary.main">Identity Layer</Typography>
          <TextField
            fullWidth label="First Name" value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth label="Last Name" value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Typography variant="overline" color="secondary.main" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            Michael Scott Notes (JSONB)
            <Tooltip title="Constructive behavioral observations only.">
              <Box component="span"><FontAwesomeIcon icon={faLightbulb} size="xs" /></Box>
            </Tooltip>
          </Typography>

          <TextField
            fullWidth multiline rows={2}
            label="Observation (The Quirk)"
            placeholder="e.g., Heavy onion consumer at lunch."
            value={quirk}
            onChange={(e) => setQuirk(e.target.value)}
          />

          <TextField
            fullWidth label="Mitigation (The Fix)"
            placeholder="e.g., Provide Spearmint gum before meetings."
            value={mitigation}
            onChange={(e) => setMitigation(e.target.value)}
          />

          <Button
            fullWidth size="large" variant="contained"
            color="secondary"
            onClick={() => inductMutation.mutate()}
            disabled={inductMutation.isPending || !firstName || !lastName}
            sx={{ mt: 'auto', py: 2 }}
          >
            {inductMutation.isPending ? 'Syncing...' : 'Seal Record into Vault'}
          </Button>
        </Stack>
      </Drawer>

    </Box>
  );
};
// #endregion
