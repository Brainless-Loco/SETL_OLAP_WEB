import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

const AggrFunctionList = ({data, onRemove}) => {
    return (
        <List>
            {data.map((item, idx) => (
                <ListItem  sx={{backgroundColor:'#e6e1e1',padding:'0px',borderRadius:'5px',marginBottom:'2px'}} key={`${item.name}_${idx}`}>
                    <ListItemButton sx={{width:'100%',paddingX:'10px'}}>
                        <ListItemText primary={`qb4o:${item.name}`}/>
                        <ListItemIcon onClick={() => {onRemove(item)}}>
                            <CloseIcon sx={{marginLeft:'auto',fontSize:'32px'}}/>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default AggrFunctionList