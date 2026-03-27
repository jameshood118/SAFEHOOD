// #region [ 📦 IMPORTS ]
import { faTriangleExclamation, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
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
  // 1. The React Query Engine handles loading states, caching, and retries automatically
  const { data: interns, isLoading, isError, error } = useQuery({
    queryKey: ['interns'],
    queryFn: fetchInterns,
  });

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

      {/* --- PAGE HEADER --- */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
          Work OS: Personnel Matrix
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Live telemetry on Interns, Employees, and associated hazard protocols.
        </Typography>
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
            // Safely parse the JSONB notes. We cast it as a generic object since JSONB is flexible.
            const notes = intern.michael_scott_notes as Record<string, any> | null;

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={intern.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>

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

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
// #endregion
