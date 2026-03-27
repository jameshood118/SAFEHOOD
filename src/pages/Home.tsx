// #region [ 📦 IMPORTS ]
import {
  faAlignLeft,
  faCampground,
  faCode,
  faLink,
  faPaste,
  faServer,
  faShareNodes,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
// #endregion

// #region [ 🏷️ TYPES ]
interface BaseCampIntel {
  id: string;
  created_at: string;
  raw_content: string;
  content_type: 'UNSTRUCTURED' | 'TEXT' | 'LINK' | 'CODE_SNIPPET';
  status: 'QUARANTINE' | 'DISPATCHED';
}
// #endregion

// #region [ 📡 THE EPISTEMIC FETCH ]
const fetchQuarantinedIntel = async () => {
  const { data, error } = await supabase
    .from('base_camp_intel')
    .select('*')
    .eq('is_deleted', false)
    .eq('status', 'QUARANTINE')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as BaseCampIntel[];
};
// #endregion

export const HomeOS = () => {
  const queryClient = useQueryClient();
  const [dropzoneText, setDropzoneText] = useState('');

  const {
    data: intelList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['base-camp-intel'],
    queryFn: fetchQuarantinedIntel,
  });

  // #region [ 🚀 MUTATIONS ]
  const dumpIntelMutation = useMutation({
    mutationFn: async () => {
      // Auto-detect links and basic JSON/Code shapes for flavor
      let type = 'TEXT';
      if (dropzoneText.trim().startsWith('http')) type = 'LINK';
      if (dropzoneText.trim().startsWith('{') || dropzoneText.trim().startsWith('<'))
        type = 'CODE_SNIPPET';

      const { error } = await supabase.from('base_camp_intel').insert([
        {
          raw_content: dropzoneText,
          content_type: type,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['base-camp-intel'] });
      setDropzoneText(''); // Clear the chute
    },
  });

  const purgeIntelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('base_camp_intel')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['base-camp-intel'] }),
  });
  // #endregion

  // #region [ 🎨 HELPERS ]
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LINK':
        return faLink;
      case 'CODE_SNIPPET':
        return faCode;
      default:
        return faAlignLeft;
    }
  };
  // #endregion

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* --- PAGE HEADER --- */}
      <Box
        sx={{
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
            <FontAwesomeIcon icon={faCampground} color="#FF9800" />
            Base Camp: The Dropzone
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Unstructured intake chute. Dump raw telemetry here for later sorting and dispatch.
          </Typography>
        </Box>
      </Box>

      {/* --- THE INTAKE CHUTE (Big Dropzone) --- */}
      <Box
        sx={{
          border: '2px dashed rgba(255, 152, 0, 0.5)',
          borderRadius: 2,
          p: 3,
          bgcolor: 'rgba(0,0,0,0.3)',
          transition: 'all 0.2s',
          '&:focus-within': { borderColor: '#FF9800', bgcolor: 'rgba(255, 152, 0, 0.05)' },
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={10}
          placeholder="PASTE OR TYPE RAW INTEL HERE..."
          value={dropzoneText}
          onChange={(e) => setDropzoneText(e.target.value)}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            '& .MuiInputBase-root': {
              color: '#00ff41',
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              lineHeight: 1.6,
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
            <FontAwesomeIcon icon={faServer} style={{ marginRight: '8px' }} />
            AWAITING PAYLOAD...
          </Typography>

          <Button
            variant="contained"
            disabled={!dropzoneText.trim() || dumpIntelMutation.isPending}
            onClick={() => dumpIntelMutation.mutate()}
            startIcon={<FontAwesomeIcon icon={faPaste} />}
            sx={{
              bgcolor: '#FF9800',
              color: '#000',
              fontWeight: 800,
              fontFamily: 'monospace',
              borderRadius: 0,
              '&:hover': { bgcolor: '#F57C00' },
              '&:disabled': { bgcolor: 'rgba(255, 152, 0, 0.2)', color: 'rgba(255,255,255,0.3)' },
            }}
          >
            {dumpIntelMutation.isPending ? 'UPLOADING...' : 'DUMP TO QUARANTINE'}
          </Button>
        </Box>
      </Box>

      {/* --- STATE: LOADING / ERROR --- */}
      {isLoading && (
        <CircularProgress sx={{ color: '#FF9800', display: 'block', mx: 'auto', mt: 4 }} />
      )}
      {isError && (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          Airlock Breach: {(error as Error).message}
        </Alert>
      )}

      {/* --- QUARANTINE GRID --- */}
      {!isLoading && !isError && (
        <Grid container spacing={3}>
          {intelList?.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body1"
                sx={{ color: 'text.disabled', textAlign: 'center', mt: 4, fontFamily: 'monospace' }}
              >
                QUARANTINE ZONE EMPTY. NO PENDING INTEL.
              </Typography>
            </Grid>
          ) : (
            intelList?.map((intel) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={intel.id}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255, 152, 0, 0.2)',
                    borderTop: '4px solid #FF9800',
                    borderRadius: 0,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Chip
                        icon={<FontAwesomeIcon icon={getTypeIcon(intel.content_type)} />}
                        label={intel.content_type}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 152, 0, 0.1)',
                          color: '#FF9800',
                          fontFamily: 'monospace',
                          borderRadius: 0,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.disabled', fontFamily: 'monospace' }}
                      >
                        {new Date(intel.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        flexGrow: 1,
                        bgcolor: 'rgba(0,0,0,0.3)',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid rgba(255,255,255,0.05)',
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'primary.contrastText',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {intel.raw_content}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Actions Footer */}
                  <Box sx={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Button
                      fullWidth
                      sx={{
                        borderRadius: 0,
                        color: '#00E5FF',
                        py: 1.5,
                        fontFamily: 'monospace',
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                      }}
                      startIcon={<FontAwesomeIcon icon={faShareNodes} />}
                    >
                      DISPATCH
                    </Button>
                    <IconButton
                      onClick={() => purgeIntelMutation.mutate(intel.id)}
                      disabled={purgeIntelMutation.isPending}
                      sx={{
                        borderRadius: 0,
                        color: '#F44336',
                        width: '60px',
                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};
