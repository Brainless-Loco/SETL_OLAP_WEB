import List from '@mui/material/List'
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import ExpandLess from "@mui/icons-material/ExpandMore"
import ExpandMore from "@mui/icons-material/ExpandLess"
import Folder from '@mui/icons-material/Folder'
import Collapse from '@mui/material/Collapse'
import { useState } from "react"
import MeasureListItem from './MeasureListItem'

const MeasuresList = ({list, onMeasureAggrFuncSelect,addAggFunc}) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <List sx={{
            width: 'auto',
            margin:'0px',
            padding:'0px',
            overflow:'auto',
            marginTop:'10px',
        }}>
            <ListItem disableGutters sx={{height:'auto',paddingY:'5px',}}>
                <ListItemButton sx={{marginY:'0px',paddingX:'5px',height:'25px'}} onClick={ () => {setIsOpen(!isOpen) } }>
                    {/* <ListItemIcon sx={{alignItems: 'center', justifyContent: 'center',alignItems:'center'}}>
                        <Folder/>
                    </ListItemIcon> */}

                    <ListItemText primary={"Measures"}/>
                    {!isOpen ? (<ExpandLess/>) : (<ExpandMore/>)}
                </ListItemButton>
            </ListItem>
            <ListItem sx={{height:'80%',width:'100%',paddingY:'0px',}}>
                <Collapse in={isOpen} timeout='auto' unmountOnExit sx={{width: '100%'}}>
                    <List sx={{paddingY:'0px',marginY:'0px',}}>
                        {list.map((item, idx) => (
                            <MeasureListItem key={`measure_${item.name}`} isParentOpen={isOpen} data={item} addAggFunc={addAggFunc} onMeasureAggrFuncSelect={onMeasureAggrFuncSelect}/>
                        ))}
                    </List>
                </Collapse>
            </ListItem>
            
            
        </List>
    )
}

export default MeasuresList