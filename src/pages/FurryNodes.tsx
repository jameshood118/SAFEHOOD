// src/pages/FurryNodes.tsx
// #region [ 📦 IMPORTS ]
import {
  faBriefcase,
  faCat,
  faEject,
  faFileLines,
  faHeartPulse,
  faHouseUser,
  faPaw,
  faPlus,
  faSearch,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

// 🚀 INJECT REUSABLE DATA TABLE
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { DataTable } from '../components/DataTable';
// #endregion

// #region [ 🏷️ TYPES ]
export interface FurryNode {
  id: string;
  created_at: string;
  name: string;
  species: string;
  os_partition: 'HUMAN_OS' | 'WORK_OS';
  status: 'NOMINAL' | 'ZOOMIES' | 'HUNGRY' | 'MAINTENANCE_REQUIRED';
  telemetry_data: Record<string, unknown> | null;
}
// #endregion

// #region [ 📡 THE EPISTEMIC FETCH ]
const fetchFurryNodes = async () => {
  const { data, error } = await supabase
    .from('furry_nodes')
    .select('*')
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as FurryNode[];
};
// #endregion

// #region [ 🎨 TACTICAL STYLING HELPERS ]
const getStatusColor = (status: string) => {
  switch (status) {
    case 'NOMINAL':
      return { color: '#00ff41', bg: 'rgba(0, 255, 65, 0.1)' };
    case 'ZOOMIES':
      return { color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.1)' };
    case 'HUNGRY':
      return { color: '#FF9800', bg: 'rgba(255, 152, 0, 0.1)' };
    case 'MAINTENANCE_REQUIRED':
      return { color: '#F44336', bg: 'rgba(244, 67, 54, 0.1)' };
    default:
      return { color: '#888', bg: 'rgba(136, 136, 136, 0.1)' };
  }
};
// #endregion

export const FurryNodes = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [partitionFilter, setPartitionFilter] = useState<'ALL' | 'HUMAN_OS' | 'WORK_OS'>('ALL');

  // Drawer States
  const [isRegisterDrawerOpen, setIsRegisterDrawerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<FurryNode | null>(null);

  // Form State
  const [nodeName, setNodeName] = useState('');
  const [species, setSpecies] = useState('');
  const [partition, setPartition] = useState<'HUMAN_OS' | 'WORK_OS'>('HUMAN_OS');
  const [status, setStatus] = useState('NOMINAL');

  const {
    data: nodes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['furry-nodes'],
    queryFn: fetchFurryNodes,
  });

  // #region [ 🚀 MUTATIONS ]
  const inductNodeMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: nodeName,
        species: species,
        os_partition: partition,
        status: status,
        telemetry_data: { source: 'MANUAL_INTAKE' },
      };
      const { error } = await supabase.from('furry_nodes').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['furry-nodes'] });
      setIsRegisterDrawerOpen(false);
      setNodeName('');
      setSpecies('');
      setPartition('HUMAN_OS');
      setStatus('NOMINAL');
    },
  });

  const dischargeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('furry_nodes')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['furry-nodes'] });
      setSelectedNode(null);
    },
  });
  // #endregion

  // #region [ 🛠️ DATA SCRUBBER & FILTER ]
  const filteredNodes =
    nodes?.filter((node) => {
      if (partitionFilter !== 'ALL' && node.os_partition !== partitionFilter) return false;
      const searchLower = searchQuery.toLowerCase();
      return (
        node.name?.toLowerCase().includes(searchLower) ||
        node.species?.toLowerCase().includes(searchLower)
      );
    }) || [];
  // #endregion

  // #region [ 📊 AG GRID COLUMN DEFINITIONS ]
  const columnDefs = useMemo<ColDef[]>(
    () => [
      { field: 'name', headerName: 'DESIGNATION', fontWeight: 'bold', flex: 1.5 },
      { field: 'species', headerName: 'SPECIES', flex: 1.5 },
      {
        field: 'os_partition',
        headerName: 'OS PARTITION',
        cellRenderer: (params: ICellRendererParams<FurryNode>) => {
          if (!params.value) return null;
          const isWork = params.value === 'WORK_OS';
          return (
            <Chip
              icon={<FontAwesomeIcon icon={isWork ? faBriefcase : faHouseUser} />}
              label={params.value.replace('_', ' ')}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'text.secondary',
                fontWeight: 700,
                fontFamily: 'monospace',
                borderRadius: 0,
                mt: 0.5,
              }}
            />
          );
        },
      },
      {
        field: 'status',
        headerName: 'STATUS',
        cellRenderer: (params: ICellRendererParams<FurryNode>) => {
          if (!params.value) return null;
          const colorData = getStatusColor(params.value);
          return (
            <Chip
              icon={<FontAwesomeIcon icon={faHeartPulse} style={{ color: colorData.color }} />}
              label={params.value.replace('_', ' ')}
              size="small"
              sx={{
                bgcolor: colorData.bg,
                color: colorData.color,
                fontWeight: 700,
                fontFamily: 'monospace',
                borderRadius: 0,
                mt: 0.5,
              }}
            />
          );
        },
      },
    ],
    [],
  );
  // #endregion

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* --- PAGE HEADER --- */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 3,
          flexShrink: 0,
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
            <FontAwesomeIcon icon={faCat} color="#FFF" /> Global Furry Nodes
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            Master telemetry database for all biological assets.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setIsRegisterDrawerOpen(true)}
          sx={{
            bgcolor: '#FFF',
            color: '#000',
            fontWeight: 800,
            fontFamily: 'monospace',
            borderRadius: 0,
            px: 3,
            py: 1.5,
            '&:hover': { bgcolor: '#E0E0E0' },
          }}
        >
          REGISTER NODE
        </Button>
      </Box>

      {/* --- TACTICAL CONTROLS --- */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4, flexShrink: 0 }}>
        <TextField
          fullWidth
          placeholder="SCRUB NODES (NAME, SPECIES)..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#00ff41',
              fontFamily: 'monospace',
              borderRadius: 0,
              bgcolor: 'rgba(0,0,0,0.4)',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
              '&.Mui-focused fieldset': { borderColor: '#FFF' },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faSearch} style={{ color: '#FFF' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <ToggleButtonGroup
          value={partitionFilter}
          exclusive
          onChange={(_, newVal) => newVal && setPartitionFilter(newVal)}
          sx={{
            height: '56px',
            '& .MuiToggleButton-root': {
              color: 'text.secondary',
              borderColor: 'rgba(255,255,255,0.2)',
              fontFamily: 'monospace',
              borderRadius: 0,
              px: 3,
              '&.Mui-selected': {
                color: '#000',
                bgcolor: '#FFF',
                '&:hover': { bgcolor: '#E0E0E0' },
              },
            },
          }}
        >
          <ToggleButton value="ALL">GLOBAL</ToggleButton>
          <ToggleButton value="HUMAN_OS">
            <FontAwesomeIcon icon={faHouseUser} style={{ marginRight: '8px' }} /> HUMAN OS
          </ToggleButton>
          <ToggleButton value="WORK_OS">
            <FontAwesomeIcon icon={faBriefcase} style={{ marginRight: '8px' }} /> WORK OS
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* 🚀 THE REUSABLE DATATABLE */}
      <DataTable
        rowData={filteredNodes}
        columnDefs={columnDefs}
        onRowClicked={(node) => setSelectedNode(node)}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        emptyMessage="NO BIOLOGICAL NODES DETECTED IN THIS PARTITION."
        emptyIcon={faPaw}
      />

      {/* ========================================================= */}
      {/* 🟢 DRAWER 1: MANUAL INTAKE                                */}
      {/* ========================================================= */}
      <Drawer
        anchor="right"
        open={isRegisterDrawerOpen}
        onClose={() => setIsRegisterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 450 },
            bgcolor: '#0a0510',
            borderLeft: '1px solid rgba(255,255,255,0.2)',
            p: 3,
          },
        }}
      >
        <Stack spacing={3} component="form" sx={{ height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: '#FFF', fontFamily: 'monospace' }}
            >
              REGISTER NODE
            </Typography>
            <IconButton onClick={() => setIsRegisterDrawerOpen(false)} sx={{ color: '#FFF' }}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <TextField
            fullWidth
            label="Designation (Name)"
            required
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#00ff41',
                fontFamily: 'monospace',
                borderRadius: 0,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#FFF' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
            }}
          />
          <TextField
            fullWidth
            label="Species / Breed"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#00ff41',
                fontFamily: 'monospace',
                borderRadius: 0,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#FFF' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
            }}
          />
          <TextField
            select
            fullWidth
            label="OS Partition"
            value={partition}
            onChange={(e) => setPartition(e.target.value as 'HUMAN_OS' | 'WORK_OS')}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#00ff41',
                fontFamily: 'monospace',
                borderRadius: 0,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#FFF' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
            }}
          >
            <MenuItem value="HUMAN_OS">HUMAN OS (Personal / Base Camp)</MenuItem>
            <MenuItem value="WORK_OS">WORK OS (Professional / Office)</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            label="Current Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#00ff41',
                fontFamily: 'monospace',
                borderRadius: 0,
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#FFF' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
            }}
          >
            <MenuItem value="NOMINAL">NOMINAL</MenuItem>
            <MenuItem value="ZOOMIES">CRITICAL ZOOMIES</MenuItem>
            <MenuItem value="HUNGRY">LOW FUEL (Hungry)</MenuItem>
            <MenuItem value="MAINTENANCE_REQUIRED">MAINTENANCE (Vet Required)</MenuItem>
          </TextField>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => inductNodeMutation.mutate()}
            disabled={inductNodeMutation.isPending || !nodeName}
            sx={{
              mt: 'auto',
              py: 2,
              bgcolor: '#FFF',
              color: '#000',
              fontWeight: 800,
              fontFamily: 'monospace',
              borderRadius: 0,
              '&:hover': { bgcolor: '#E0E0E0' },
              '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
            }}
          >
            {inductNodeMutation.isPending ? 'SYNCING...' : 'INITIALIZE NODE'}
          </Button>
        </Stack>
      </Drawer>

      {/* ========================================================= */}
      {/* 🟣 DRAWER 2: NODE DOSSIER (The Deep Dive)                 */}
      {/* ========================================================= */}
      <Drawer
        anchor="right"
        open={Boolean(selectedNode)}
        onClose={() => setSelectedNode(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: 500 },
            bgcolor: 'background.default',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            p: 0,
          },
        }}
      >
        {selectedNode && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                    BIOLOGICAL DOSSIER
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: 'primary.contrastText', mt: 0.5 }}
                  >
                    {selectedNode.name}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedNode(null)}>
                  <FontAwesomeIcon icon={faXmark} />
                </IconButton>
              </Box>
              <Stack direction="row" spacing={1} mb={2}>
                <Chip
                  icon={
                    <FontAwesomeIcon
                      icon={selectedNode.os_partition === 'WORK_OS' ? faBriefcase : faHouseUser}
                    />
                  }
                  label={selectedNode.os_partition.replace('_', ' ')}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'text.secondary',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    borderRadius: 0,
                  }}
                />
                <Chip
                  icon={
                    <FontAwesomeIcon
                      icon={faHeartPulse}
                      style={{ color: getStatusColor(selectedNode.status).color }}
                    />
                  }
                  label={selectedNode.status.replace('_', ' ')}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(selectedNode.status).bg,
                    color: getStatusColor(selectedNode.status).color,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    borderRadius: 0,
                  }}
                />
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#00ff41',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontFamily: 'monospace',
                }}
              >
                <FontAwesomeIcon icon={faFileLines} /> TELEMETRY PAYLOAD
              </Typography>
              {selectedNode.telemetry_data &&
              Object.keys(selectedNode.telemetry_data).length > 0 ? (
                <Stack spacing={2}>
                  {Object.entries(selectedNode.telemetry_data).map(([key, value]) => (
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
                      {Array.isArray(value) ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {value.map((v, i) => (
                            <Chip
                              key={i}
                              label={v}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                borderRadius: 0,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'primary.contrastText',
                              }}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: 'primary.contrastText', whiteSpace: 'pre-wrap' }}
                        >
                          {String(value)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ p: 3, border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                    No telemetry data logged.
                  </Typography>
                </Box>
              )}
            </Box>

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
                onClick={() => dischargeMutation.mutate(selectedNode.id)}
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
                {dischargeMutation.isPending ? 'PURGING NODE...' : 'ARCHIVE NODE'}
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};
