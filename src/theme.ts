// src/theme.ts
import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  // 1. FORCED DARK MODE (No system-preference overrides)
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // Deepest background (WCAG base)
      paper: '#212121',   // Elevated surfaces (Cards, Drawers)
    },
    primary: {
      main: '#333333',    // Distinct from background for button boundaries
      contrastText: '#FFFFFF', // 11.5:1 Contrast Ratio
    },
    secondary: {
      main: '#E0F7FA',    // Light Cyan
      contrastText: '#000000', // 19:1 Contrast Ratio (Exceeds AAA)
    },
    error: {
      main: '#FF5252',    // Accessible red on dark backgrounds
    },
    action: {
      focus: '#00E5FF',   // High-visibility cyan for keyboard navigation
      active: '#FFFFFF',
    },
  },

  // 2. TYPOGRAPHY (Fluid Scaling + Section 508 Compliance)
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    htmlFontSize: 16,
    // The "Clampy Thing": clamp(MIN_REM, CALCULATED_REM_PLUS_VW, MAX_REM)
    h1: { fontSize: 'clamp(2.5rem, 2rem + 2.5vw, 4rem)', fontWeight: 700 },
    h2: { fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)', fontWeight: 700 },
    h3: { fontSize: 'clamp(1.75rem, 1.25rem + 1.5vw, 2.5rem)', fontWeight: 600 },
    h4: { fontSize: 'clamp(1.5rem, 1.1rem + 1vw, 2rem)', fontWeight: 600 },
    h5: { fontSize: 'clamp(1.25rem, 1rem + 0.5vw, 1.5rem)', fontWeight: 600 },
    h6: { fontSize: 'clamp(1rem, 0.9rem + 0.25vw, 1.25rem)', fontWeight: 600 },
    body1: {
      fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', // Smooth scaling, stays readable
      lineHeight: 1.6, // Section 508 readability standard
    },
    body2: {
      fontSize: 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
      lineHeight: 1.5,
    },
    button: {
      fontSize: 'clamp(0.875rem, 0.8rem + 0.25vw, 1rem)',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },

  // 3. THE COMPONENT FIREWALL
  components: {
// GLOBAL CSS & FONTAWESOME HACKS
    MuiCssBaseline: {
      styleOverrides: `
        /* Enforce smooth scrolling for cognitive accessibility */
        @media (prefers-reduced-motion: no-preference) {
          html { scroll-behavior: smooth; }
        }
        /* Fix FontAwesome Stack rendering inside MUI Flex containers */
        .fa-stack {
          width: 2em;
          height: 2em;
          line-height: 2em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
        }
        /* Ensure the FA icons don't get squished by flex-shrink */
        .svg-inline--fa, .fa, .fas, .far, .fal, .fab {
          flex-shrink: 0;
        }

        /* --------------------------------------------------- */
        /* 🟣 AG GRID GLOBAL OVERRIDES (The Cyberpunk Skin)  */
        /* --------------------------------------------------- */
        .ag-theme-alpine-dark {
          /* Match the Deepest Background (WCAG base) */
          --ag-background-color: #121212 !important;

          /* Match Elevated Surfaces (Cards, Drawers) */
          --ag-header-background-color: #212121 !important;

          /* High contrast boundaries */
          --ag-border-color: rgba(255, 255, 255, 0.12) !important;
          --ag-row-border-color: rgba(255, 255, 255, 0.05) !important;

          /* Hover state logic */
          --ag-row-hover-color: rgba(255, 255, 255, 0.03) !important;

          /* Typography mapping */
          --ag-font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
          --ag-font-size: 0.875rem !important;

          /* The Action Focus (Cyan) */
          --ag-selected-row-background-color: rgba(0, 229, 255, 0.1) !important;
          --ag-range-selection-border-color: #00E5FF !important;
          --ag-checkbox-checked-color: #00E5FF !important;
        }
      `,
    },

    // CONTAINER & SURFACES
    MuiContainer: {
      defaultProps: { disableGutters: true },
    },
    MuiCard: {
      defaultProps: { elevation: 4 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none', // Prevents weird MUI overlay blending
          border: '1px solid rgba(255, 255, 255, 0.12)', // High contrast boundary
        },
      },
    },

    // BUTTONS (The Touch Target & FA Icon Fixes)
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false, // Keep tactile feedback
      },
      styleOverrides: {
        root: {
          // WCAG 2.2 / Section 508 Universal Focus State
          '&.Mui-focusVisible': {
            outline: '3px solid #00E5FF',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: '44px', // Section 508 / Apple Touch Target Standard
          minWidth: '44px',
          padding: '8px 20px',
          borderRadius: '8px',
          gap: '10px', // Native spacing for raw <i class="fa..."> icons
        },
        // Target MUI's native icon wrappers to handle FA layering
        startIcon: {
          marginRight: 0, // Reset default margin since we use flex 'gap'
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        endIcon: {
          marginLeft: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
    },

    // ICON BUTTONS (Strict Touch Targets)
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: '44px',
          minWidth: '44px',
          borderRadius: '8px', // Square-ish is better for alignment in dashboards
          '&.Mui-focusVisible': {
            outline: '3px solid #00E5FF',
            outlineOffset: '2px',
          },
        },
      },
    },

    // INPUTS (Forms must be unmistakable)
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: '44px',
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)', // High contrast resting border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFFFFF',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00E5FF',
            borderWidth: '2px',
          },
        },
      },
    },

    // TOOLTIPS (Required for FA Icon-only buttons)
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#E0F7FA',
          color: '#000000',
          fontSize: '0.875rem',
          fontWeight: 600,
          padding: '8px 12px',
          border: '1px solid #000000',
        },
        arrow: {
          color: '#E0F7FA',
        },
      },
    },
  },
});

export default customTheme;
