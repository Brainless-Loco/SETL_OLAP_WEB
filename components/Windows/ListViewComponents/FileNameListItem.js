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
        <List  sx={{
            width: '100%',
            marginTop:'0px',
            padding:'0px',
            overflow:'auto',
            marginLeft:'0px'
        }}>
            <ListItem  disableGutters sx={{maxHeight:'25px',width:'100%',marginLeft:'0px',marginY:'0px'}}>
                <ListItemButton className='listItem_02'
                    sx={{width:'100%',paddingLeft:'5px',height:'25px',paddingY:'0px',marginY:'0px'}} 
                    onClick={
                        () => {
                            setIsOpen(!isOpen)
                        }
                    }>

                    <ListItemText sx={{width:'100%',fontWeight:'bold'}} primary={listName}/>
                    {!isOpen ? (<ExpandLess/>) : (<ExpandMore/>)}
                </ListItemButton>
            </ListItem>
            <ListItem sx={{width:'100%'}} >
                <CollapsingList mdProperty={mdProperty} listItems={list} isOpen={isOpen} onItemClick={onItemClick}/>
            </ListItem>
        </List>
        
    )
}

export default FileNameList