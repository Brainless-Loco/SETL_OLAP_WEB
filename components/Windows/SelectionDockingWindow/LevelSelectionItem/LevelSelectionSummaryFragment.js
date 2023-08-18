import Box from '@mui/material/Box'
import { Card, CardHeader, Grid, CardContent, List } from '@mui/material'
import Typography from '@mui/material/Typography'
import ALevelRow from './ALevelRow'

const LevelSelectionSummaryFragment = ({data}) => {

    return (
        <Box sx={{
            height: '300px', 
            overflowY: 'auto', 
            border: '1px solid black',
            borderRadius: '8px', 
            marginTop:'8px'}}>
            <Box 
            sx={{height: '100%', 
            alignItems: 'center', 
            justifyContent: 'center', 
            display: (data.length ? 'none' : 'flex')}}>
                <Typography variant='body1' textAlign={'center'}>
                    No level is selected.
                </Typography>
            </Box>
            <Card hidden={!data.length}>
                <CardHeader sx={{padding:'10px'}} title={'Selected Levels: '}/>
                <CardContent sx={{padding:'5px',margin:'0px'}}>
                    <Grid item sx={{width: '100%'}}>
                        <List>
                            {data.map((item, idx) => (
                                <ALevelRow data={item} key={`levelProp_${idx}`}/>
                            ))}
                        </List>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

export default LevelSelectionSummaryFragment