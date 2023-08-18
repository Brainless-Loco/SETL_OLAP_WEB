import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"

const LevelSelectionView = ({levelChange, funcChange}) => {
    const [selections, setSelections] = useState([])

    useEffect(() => {
        if(Boolean(levelChange) && Boolean(funcChange))
            setSelections(new Set([...selections, {name:levelChange.name, func: funcChange}]))
    }, [levelChange, funcChange])

    const removeItem = (item) => {
        const temp = selections
        temp.delete(item)
        setSelections(new Set([...temp]))
    }

    return (
        <Box>
            {/* Code */}
            {selections.size > 0 && <Box>
                    <Typography>You have selected so far,</Typography>
                    {[...selections].map((item, idx) => (
                        <Stack sx={{marginY: '8px'}} key={`selection_item_${idx}`} divider={<Divider orientation="vertical" flexItem />}>
                            <Paper>
                                <Typography>Level: {item.name}</Typography>
                                <Typography>Function: {item.func.name}</Typography>
                                <Button type='button' onClick={() => removeItem(item)}>Delete</Button>
                            </Paper>
                            
                        </Stack>
                    ))}
                </Box>
            }
            
        </Box>
    )
}

export default LevelSelectionView