// #region [ 📦 IMPORTS ]
import { faClockRotateLeft, faDatabase, faMinus, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
// #endregion

// #region [ 📡 THE EPISTEMIC FETCH ]
const fetchLogs = async () => {
  // Calling the secure RPC pipe we just built in Postgres
  const { data, error } = await supabase.rpc('get_temporal_logs');
  if (error) throw new Error(error.message);
  return data;
};
// #endregion

export const TemporalVault = () => {
  const { data: logs, isLoading, isError, error } = useQuery({
    queryKey: ['temporal-logs'],
    queryFn: fetchLogs,
  });

  // #region [ 🎨 UI HELPERS ]
  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'INSERT': return <FontAwesomeIcon icon={faPlus} color="#4CAF50" />;
      case 'UPDATE': return <FontAwesomeIcon icon={faPen} color="#FFEB3B" />;
      case 'DELETE': return <FontAwesomeIcon icon={faMinus} color="#F44336" />;
      default: return <FontAwesomeIcon icon={faDatabase} color="#00E5FF" />;
    }
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'INSERT': return 'success';
      case 'UPDATE': return 'warning';
      case 'DELETE': return 'error';
      default: return 'default';
    }
  };
  // #endregion

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.contrastText', display: 'flex', alignItems: 'center', gap: 2 }}>
          <FontAwesomeIcon icon={faClockRotateLeft} /> Temporal Vault
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Immutable ledger of all architectural and biological state changes.
        </Typography>
      </Box>

      {/* Loading & Error States */}
      {isLoading && <CircularProgress color="secondary" sx={{ display: 'block', mx: 'auto', mt: 8 }} />}
      {isError && <Alert severity="error">Airlock Breach: {(error as Error).message}</Alert>}

      {/* The Ledger */}
      {!isLoading && !isError && logs && (
        <Stack spacing={2}>
          {logs.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px' }}>
              <Typography variant="body1" color="text.secondary">
                Timeline is clean. No events recorded.
              </Typography>
            </Box>
          )}

          {logs.map((log: any) => (
            <Card key={log.log_id} sx={{ borderLeft: `4px solid`, borderColor: `${getOperationColor(log.operation)}.main` }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                {/* Log Meta */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {getOperationIcon(log.operation)}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {log.operation} ON public.{log.target_table}
                    </Typography>
                    <Chip size="small" label={`ID: ${log.record_id.substring(0, 8)}...`} variant="outlined" sx={{ color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                    {new Date(log.changed_at).toLocaleString()}
                  </Typography>
                </Box>

                {/* Data Payload (Historical Snapshot) */}
                {log.old_data && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, letterSpacing: '1px' }}>
                      RECORD SNAPSHOT
                    </Typography>
                    <Box component="pre" sx={{ m: 0, p: 1.5, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.85rem', overflowX: 'auto', color: 'primary.contrastText' }}>
                      {JSON.stringify(log.old_data, null, 2)}
                    </Box>
                  </Box>
                )}

              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};
