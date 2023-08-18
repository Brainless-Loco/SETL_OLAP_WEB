import List from '@mui/material/List'
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import ExpandLess from "@mui/icons-material/ExpandMore"
import ExpandMore from "@mui/icons-material/ExpandLess"
import AggregateFunctionList from './AggregateFunctionList'
import Folder from '@mui/icons-material/Folder'
import { useState } from 'react'

const MeasureListItem = ({data, onMeasureAggrFuncSelect,addAggFunc}) => {
    const [isOpen, setIsOpen] = useState(true)

    const onAggrFuncSelect = (function_name) => {
        console.log("On Aggregate function select >", {data, function_name})
        onMeasureAggrFuncSelect(data, function_name)
    }

    return (
        <ListItem sx={{padding:'0px'}}>
            <List>
                <ListItem disableGutters sx={{padding:'0px',marginTop:'0px',height:'30px'}}>
                    <ListItemButton 
                        onClick={
                            () => {
                                setIsOpen(!isOpen)
                            }
                        }>
                        <ListItemIcon sx={{alignItems: 'center', justifyContent: 'center'}}>
                            <Folder/>
                        </ListItemIcon>

                        <ListItemText primary={`mdProperty:${data.name}`}/>
                        {!isOpen ? (<ExpandLess/>) : (<ExpandMore/>)}
                    </ListItemButton>
                </ListItem>
                <ListItem sx={{height:'20px',marginLeft:'40px'}}>
                    <ListItemText primary={`Range: ${data.range.split('#')[1]}`}/>
                </ListItem>
                <ListItem>
                    <AggregateFunctionList parent={data} isOpen={isOpen} addAggFunc={addAggFunc} onAggrFuncSelect={onAggrFuncSelect}/>
                </ListItem>
            </List>
        </ListItem>
    )
}

export default MeasureListItem