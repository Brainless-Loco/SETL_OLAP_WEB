import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Collapse from '@mui/material/Collapse';
import FileNameList from './FileNameListItem';

const CollapsingList = ({listItems, isOpen, onItemClick, mdProperty}) => {


    return (
        <Collapse in={isOpen} timeout='auto' unmountOnExit sx={{width: '100%',marginLeft:'5px',paddingX:'0px',borderLeft:'1px solid #08094f'}}>
            <List sx={{width:'100%',padding:'0px'}}>
                {listItems.map((obj, idx) => {
                    if(obj.hierarchyList) return (<FileNameList key={`mdProp_${obj.name}_${idx}`} listName={`mdproperty:${obj.name}`} list={obj.hierarchyList} onItemClick={onItemClick}/>)
                    if(obj.hierarchyStep) return (<FileNameList key={`mdStruct_${obj.name}_${idx}`} listName={`mdStructure:${obj.name}`} list={obj.hierarchyStep} onItemClick = {onItemClick}></FileNameList>)
                    return(
                        <ListItem sx={{height:'25px',marginBottom:'1px'}} key={`${obj.name}_${idx}`} title={obj.name}>
                            <ListItemButton className='listItem_01' sx={{height:'25px'}} onClick={() => {onItemClick(obj)}}>
                                {/* <ListItemIcon sx={{alignItems: 'center', justifyContent: 'space-around'}}>
                                    <InsertDriveFileIcon/>
                                </ListItemIcon> */}
                                <ListItemText 
                                    primary={`${mdProperty ? 'mdProperty:' : ''}${obj.name}`} 
                                    primaryTypographyProps={{ 
                                    variant: 'subtitle2', 
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflowX: 'hidden',
                                        textOverflow: 'ellipsis',
                                        paddingLeft:'10px',
                                    }
                                }}/>
                            </ListItemButton>
                        </ListItem>
                    )
                    }
                )}
            </List>
        </Collapse>
    )
}

export default CollapsingList;