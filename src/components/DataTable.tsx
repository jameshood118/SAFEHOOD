// src/components/DataTable.tsx
// #region [ 📦 IMPORTS ]
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';

// AG Grid Imports
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

// The Styles (Imported ONCE for the entire application)
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// 🚀 AG GRID REQUIREMENT: Register modules globally
ModuleRegistry.registerModules([AllCommunityModule]);
// #endregion

// #region [ 🏷️ INTERFACE ]
interface DataTableProps<T> {
  rowData: T[] | null | undefined; // 🛡️ Safe against null API returns
  columnDefs: ColDef<T>[]; // 🛡️ STRICT TYPING: Columns must match Data
  onRowClicked?: (data: T) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  emptyIcon?: IconDefinition;
}
// #endregion

export const DataTable = <T,>({
  rowData,
  columnDefs,
  onRowClicked,
  isLoading,
  isError,
  errorMessage,
  emptyMessage = 'NO DATA DETECTED IN THIS PARTITION.',
  emptyIcon = faDatabase,
}: DataTableProps<T>) => {
  // A clean, tactical default configuration for all grids
  // 🛡️ Notice the <T> here as well
  const defaultColDef: ColDef<T> = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  return (
    <Box
      sx={{ flexGrow: 1, width: '100%', minHeight: '400px', cursor: 'pointer' }}
      className="ag-theme-alpine-dark"
    >
      {isLoading ? (
        <CircularProgress sx={{ color: '#00E5FF', display: 'block', mx: 'auto', mt: 8 }} />
      ) : isError ? (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          Airlock Breach: {errorMessage || 'Unknown telemetry failure.'}
        </Alert>
      ) : !rowData || rowData.length === 0 ? ( // 🛡️ Safely checks for null/empty
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px dashed rgba(255,255,255,0.2)',
            bgcolor: 'rgba(0,0,0,0.2)',
          }}
        >
          <FontAwesomeIcon icon={emptyIcon} size="3x" color="rgba(255,255,255,0.2)" />
          <Typography variant="h6" sx={{ color: 'text.secondary', mt: 2, fontFamily: 'monospace' }}>
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowHeight={50}
          headerHeight={40}
          onRowClicked={(params) => {
            if (onRowClicked && params.data) {
              onRowClicked(params.data);
            }
          }}
        />
      )}
    </Box>
  );
};
