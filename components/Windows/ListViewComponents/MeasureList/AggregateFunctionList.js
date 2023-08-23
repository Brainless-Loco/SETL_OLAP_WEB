import Collapse from '@mui/material/Collapse'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import List from '@mui/material/List'
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

const AggregateFunctionList = ({parent, isOpen, onAggrFuncSelect,addAggFunc}) => {
    // const functions = parent.aggrFuncArray ?? [{name: 'min', prefix: 'qb4o'}, {name: 'max', prefix: 'qb4o'}, {name: 'avg', prefix: 'qb4o'}, {name: 'count', prefix: 'qb4o'}]

    const temp = parent.aggrFuncArray ?? [{name: 'min', prefix: 'qb4o'}, {name: 'max', prefix: 'qb4o'}, {name: 'avg', prefix: 'qb4o'}, {name: 'count', prefix: 'qb4o'}]

    const functions = [...new Map(temp.map(item =>
        [item['sub'], item])).values()];

    // console.log(functions)


    return (
        <Collapse in={isOpen} timeout='auto' unmountOnExit sx={{padding:'0px'}}>
            <List sx={{marginY:'0px',borderLeft:'1px solid black'}}>
                {functions.map((obj, idx) => {
                    return(
                        <ListItem className='listItem_03' sx={{height:'30px'}} key={`${parent.name}_${obj.name}_${idx}`} title={obj.name}>
                            <ListItemButton sx={{height:'30px',width:'100%',paddingX:'30px',fontWeight:'bold'}} onClick={()=>{onAggrFuncSelect(obj)}}>
                                {/* <ListItemIcon sx={{alignItems: 'center', justifyContent: 'space-around'}}>
                                    <InsertDriveFileIcon/>
                                </ListItemIcon> */}
                                <ListItemText 
                                    primary={`qb4o:${obj.name}`} 
                                    primaryTypographyProps={{ 
                                    variant: 'subtitle2', 
                                    style: {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
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

export default AggregateFunctionList