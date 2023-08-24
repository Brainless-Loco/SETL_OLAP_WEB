import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

const MyAppbar = () => {
    return (
        <AppBar position='static' sx={{height:'40px',overflow:'hidden',backgroundColor:'#08094f'}}>
            <Container maxWidth='xl' sx={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'#08094f',height:'100%',width:'100%'}}>
                <Toolbar disableGutters sx={{cursor:'pointer'}}>
                    <Typography 
                    variant='body1'
                    sx={{
                        textAlign: 'center',
                        fontStyle: 'italic',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#28ecfa',
                        width: {xs: '100%', sm: '100%', md: '100%', lg: 'auto', xl: 'auto'},
                        p: '4px'
                    }}
                    noWrap>
                        <Link href='/'><>SETL<sub>OLAP</sub></></Link>
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default MyAppbar