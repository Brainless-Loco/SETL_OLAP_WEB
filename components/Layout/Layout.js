import { ThemeProvider } from '@mui/material/styles'
import LightTheme from '../../theme/LightTheme'
import { useState } from 'react'
import MyAppbar from '../Appbar/MyAppbar'
import MainContentWrapper from './MainContentWrapper'

const Layout = ({children}) => {
    const [currentTheme, setCurrentTheme] = useState(LightTheme)

    return (
        <ThemeProvider theme={currentTheme}>
            <MyAppbar/>

            <MainContentWrapper>{children}</MainContentWrapper>
        </ThemeProvider>
    )
}

export default Layout