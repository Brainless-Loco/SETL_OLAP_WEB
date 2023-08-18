import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import { Card, CardContent, CardHeader } from '@mui/material'
import AggrFunctionList from './AggrFunctionList'
import { useEffect } from 'react'

const MeasureSelectionSummaryFragment = ({data, onRemove}) => {
    useEffect(() => {
        console.log("Measure selection list >", data)
    }, [data])

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
                    No measure is selected.
                </Typography>
            </Box>
            <Box hidden={data.length <= 0}>
                <Typography>&nbsp; &nbsp; Selected measure(s): {data.length}</Typography>
                {
                    data.map((item, idx) => (
                        <Card sx={{backgroundColor:'transparent',boxShadow:'none'}} key={`measure_${item.measure.name}_${idx}`}>
                            <CardHeader titleTypographyProps={{variant:'h6' }} title={`${item.measure.name}`}/>
                            <CardContent>
                                <Typography>Selected level(s): {item.functions.length}</Typography>
                                <AggrFunctionList data={item.functions} 
                                onRemove={(func) => {
                                    onRemove(item.measure, func)
                                }}/>
                            </CardContent>
                        </Card>
                    ))
                }
            </Box>
            
        </Box>
        
    )
}

export default MeasureSelectionSummaryFragment