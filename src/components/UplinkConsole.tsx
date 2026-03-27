import { faPlus, faSatelliteDish, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';

// #region [ 🏷️ TYPES ]
// Re-using the strict union from the Master Protocol
export type HumanOSEntryType =
  | 'CAPTAINS_LOG'
  | 'OS_MANIFEST'
  | 'SAFEHOOD_PROTOCOL'
  | 'ANALOG_WASTELAND';

interface UplinkFormData {
  entry_type: HumanOSEntryType;
  subject: string;
  primary_data: string;
  secondary_data: string;
}

// 🛠️ The New Interface for the Handshake
interface UplinkConsoleProps {
  onSuccess?: () => void | Promise<void>;
}
// #endregion

// 🛠️ Passing the prop into the component
export const UplinkConsole = ({ onSuccess }: UplinkConsoleProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UplinkFormData>({
    defaultValues: {
      entry_type: 'CAPTAINS_LOG',
      subject: '',
      primary_data: '',
      secondary_data: '',
    },
  });

  // #region [ 🛠️ LOGIC HANDLERS ]
  const handleAddTag = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault(); // Stop form submission
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const onSubmit = async (data: UplinkFormData) => {
    setStatus('submitting');

    // 1. Construct the JSON Payload (The "Under the Hood" translation)
    const payload = {
      id: `LOG-${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14)}`,
      timestamp: new Date().toISOString(),
      subject: data.subject,
      primary_data: data.primary_data,
      secondary_data: data.secondary_data || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    // 2. Fire the Database Injection
    const { error } = await supabase.from('captains_logs').insert({
      entry_type: data.entry_type,
      entry_text: JSON.stringify(payload), // <-- Humie text becomes JSON here
      is_deleted: false,
    });

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus('error');
      return;
    }

    // 3. Clear the deck on success
    reset();
    setTags([]);
    setStatus('success');

    // 🛠️ Trigger the refresh handshake if it was provided
    if (onSuccess) {
      onSuccess();
    }

    setTimeout(() => setStatus('idle'), 3000);
  };
  // #endregion

  // #region [ 🎨 STYLING VARS ]
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: '#00ff41',
      fontFamily: 'monospace',
      borderRadius: 0,
      bgcolor: 'rgba(0,0,0,0.4)',
      '& fieldset': { borderColor: '#1b5e20' },
      '&:hover fieldset': { borderColor: '#8a2be2' },
      '&.Mui-focused fieldset': { borderColor: '#8a2be2' },
    },
    '& .MuiInputLabel-root': { color: '#1b5e20', fontFamily: 'monospace' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#8a2be2' },
  };
  // #endregion

  return (
    <Box
      component="section"
      sx={{
        p: 3,
        border: '1px solid #1b5e20',
        bgcolor: '#0a0510',
        mb: 4,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <FontAwesomeIcon icon={faSatelliteDish} color="#8a2be2" />
        <Typography variant="h6" component="h2" sx={{ color: '#8a2be2', fontWeight: 800 }}>
          ESTABLISH UPLINK // DATA ENTRY
        </Typography>
      </Stack>

      <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={3}>
        {/* Row 1: Type and Subject */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Controller
            name="entry_type"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="PARTITION" sx={{ ...inputSx, minWidth: '200px' }}>
                <MenuItem value="CAPTAINS_LOG">CAPTAINS_LOG</MenuItem>
                <MenuItem value="OS_MANIFEST">OS_MANIFEST</MenuItem>
                <MenuItem value="SAFEHOOD_PROTOCOL">SAFEHOOD_PROTOCOL</MenuItem>
                <MenuItem value="ANALOG_WASTELAND">ANALOG_WASTELAND</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="subject"
            control={control}
            rules={{ required: 'Subject is required for indexing.' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="SUBJECT (AUDIT TITLE)"
                error={!!errors.subject}
                helperText={errors.subject?.message}
                sx={inputSx}
              />
            )}
          />
        </Stack>

        {/* Row 2: The Core Payload */}
        <Controller
          name="primary_data"
          control={control}
          rules={{ required: 'Primary data cannot be empty.' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
              label="PRIMARY DATA (BARE METAL OBSERVATION)"
              error={!!errors.primary_data}
              helperText={errors.primary_data?.message}
              sx={inputSx}
            />
          )}
        />

        {/* Row 3: Optional Context */}
        <Controller
          name="secondary_data"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              minRows={2}
              label="SECONDARY DATA (OPTIONAL CONTEXT / IMPLICATIONS)"
              sx={inputSx}
            />
          )}
        />

        {/* Row 4: Tag Array Builder */}
        <Box>
          <TextField
            fullWidth
            label="APPEND TAGS (PRESS ENTER)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            sx={inputSx}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faPlus} style={{ color: '#1b5e20' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          {tags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag.toUpperCase()}`}
                  onDelete={() => handleRemoveTag(tag)}
                  deleteIcon={<FontAwesomeIcon icon={faTimes} style={{ fontSize: '12px' }} />}
                  sx={{
                    bgcolor: 'transparent',
                    color: '#00ff41',
                    border: '1px solid #1b5e20',
                    borderRadius: 0,
                  }}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* System Status & Submit */}
        {status === 'success' && (
          <Alert severity="success" sx={{ bgcolor: '#1b5e20', color: '#00ff41', borderRadius: 0 }}>
            UPLINK SUCCESSFUL. DATA INJECTED TO MAINFRAME.
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ bgcolor: '#b71c1c', color: '#ffcdd2', borderRadius: 0 }}>
            AIRLOCK BREACH: {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={status === 'submitting'}
          sx={{
            bgcolor: '#8a2be2',
            color: '#fff',
            fontFamily: 'monospace',
            fontWeight: 800,
            borderRadius: 0,
            py: 1.5,
            '&:hover': { bgcolor: '#6a1b9a' },
            '&:disabled': { bgcolor: '#4a148c', color: 'rgba(255,255,255,0.5)' },
          }}
        >
          {status === 'submitting' ? 'TRANSMITTING...' : 'EXECUTE INJECTION'}
        </Button>
      </Stack>
    </Box>
  );
};
