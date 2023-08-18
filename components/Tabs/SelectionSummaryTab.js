import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from "react"

const SelectionSummaryTab = ({value, index, measureChange, funcChange}) => {
    const [selections, setSelections] = useState([])

    useEffect(() => {
        if(Boolean(measureChange) && Boolean(funcChange))
            setSelections(new Set([...selections, {name:measureChange.name, func: funcChange}]))
    }, [measureChange, funcChange])

    const removeItem = (item) => {
        const temp = selections
        temp.delete(item)
        setSelections(new Set([...temp]))
    }

    return (
        <Box hidden={value != index}>
            {/* Code */}
            {selections.size > 0 && <Box>
                    <Typography>You have selected so far,</Typography>
                    {[...selections].map((item, idx) => (
                        <Stack sx={{marginY: '8px'}} key={`selection_item_${idx}`} divider={<Divider orientation="vertical" flexItem />}>
                            <Paper>
                                <Typography>Measure: {item.name}</Typography>
                                <Typography>Function: {item.func}</Typography>
                                <Button type='button' onClick={() => removeItem(item)}>Delete</Button>
                            </Paper>
                            
                        </Stack>
                    ))}
                </Box>
            }
            
        </Box>
    )
}

export default SelectionSummaryTab