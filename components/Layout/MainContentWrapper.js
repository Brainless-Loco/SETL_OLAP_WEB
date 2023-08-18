import { styled } from "@mui/material/styles";

const MainContentWrapper = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        height: `calc(100% - ${theme.spacing(8)})`,
        flexGrow: 1,
        padding: theme.spacing(0),
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: 5,
        }),
        ...(open && {[theme.breakpoints.up('lg')]: {
            width: `calc(100% - ${theme.measurements.drawerWidth})`,
            marginLeft: `${theme.measurements.drawerWidth}`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: 10,
            }),
        }}),
        ...(!open && {[theme.breakpoints.up('lg')] : {
            width: `calc(100% - ${theme.measurements.miniDrawerWidth})`,
            marginLeft: `${theme.measurements.miniDrawerWidth}`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: 10,
            }),
        }})
    }),
)

export default MainContentWrapper