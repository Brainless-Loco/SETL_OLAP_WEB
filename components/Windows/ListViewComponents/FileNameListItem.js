import List from '@mui/material/List'
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import ExpandLess from "@mui/icons-material/ExpandMore"
import ExpandMore from "@mui/icons-material/ExpandLess"
import Folder from '@mui/icons-material/Folder'
import { useState } from "react"
import CollapsingList from "./CollapsingList"

const FileNameList = ({listName, list, onItemClick, mdProperty}) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <List sx={{
            width: 'auto',
            marginTop:'0px',
            padding:'0px',
            overflow:'auto'
        }}>
            <ListItem disableGutters sx={{height:'25px'}}>
                <ListItemButton 
                    onClick={
                        () => {
                            setIsOpen(!isOpen)
                        }
                    }>
                    <ListItemIcon sx={{alignItems: 'center', justifyContent: 'center',display:'flex'}}>
                        <Folder/>
                    </ListItemIcon>

                    <ListItemText primary={listName}/>
                    {!isOpen ? (<ExpandLess/>) : (<ExpandMore/>)}
                </ListItemButton>
            </ListItem>
            <ListItem >
                <CollapsingList mdProperty={mdProperty} listItems={list} isOpen={isOpen} onItemClick={onItemClick}/>
            </ListItem>
        </List>
        
    )
}

export default FileNameList