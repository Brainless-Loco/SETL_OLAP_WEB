import { createTheme } from "@mui/material/styles";

// Overrides default MUI Light Theme with the following attributes
const LightTheme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontFamily: 'Nunito',
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        button: {
            textTransform: 'none',
            fontWeight: 700,
        }
    },
    components: {
        MuiListItemText: {
            defaultProps: {
                primaryTypographyProps: {
                    sx: {
                        fontSize: '0.9rem'
                    }
                }
            },
            
        },
        MuiListItemButton: {
            defaultProps: {
                disableGutters: true,
            }
        },
        MuiDrawer: {
            defaultProps: {
                sx: {
                    width: '256px',
                    flexShrink: 0,
                },
                PaperProps: {
                    sx: {
                        width: 'inherit',
                        boxSizing: 'border-box',
                    }
                }
            }
        },
        MuiAppBar: {
            defaultProps: {
                sx: {
                    minHeight: '64px',
                }
            }
        }
    },
    measurements: {
        drawerWidth: '256px',
        miniDrawerWidth: '72px',
        defaultAppbarHeight: '64px'
    }
})

export default LightTheme