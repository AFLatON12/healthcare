export const colors = {
    primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff'
    },
    secondary: {
        main: '#2ecc71',
        light: '#4cd137',
        dark: '#27ae60',
        contrastText: '#ffffff'
    },
    error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#ffffff'
    },
    warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#ffffff'
    },
    info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#ffffff'
    },
    success: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
        contrastText: '#ffffff'
    },
    grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121'
    },
    background: {
        default: '#f5f7fa',
        paper: '#ffffff'
    },
    text: {
        primary: '#2c3e50',
        secondary: '#7f8c8d',
        disabled: '#bdc3c7'
    }
};

export const spacing = {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    xxl: '3rem'       // 48px
};

export const breakpoints = {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
};

export const typography = {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2
    },
    h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3
    },
    h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3
    },
    h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4
    },
    body1: {
        fontSize: '1rem',
        lineHeight: 1.5
    },
    body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5
    },
    button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'uppercase'
    },
    caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4
    }
};

export const shadows = {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
};

export const borderRadius = {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
    full: '9999px'
};

export default {
    colors,
    spacing,
    breakpoints,
    typography,
    shadows,
    borderRadius
}; 