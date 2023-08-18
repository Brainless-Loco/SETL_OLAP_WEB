import { Box, Typography } from '@mui/material'
import React from 'react'

const ALevelRow = ({data}) => {
    const styleForfullContainer = {
        backgroundColor:'#F0F7EF', 
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center',
        justifyContent:'space-between',
        width:'100%',
        height:'auto',
        padding:'5px',
        borderRadius:'8px',
        overflow:'hidden',
        rowGap:'10px',
        marginBottom:'10px'
    }
    const subContainer1 = {
        width:'85%',
        padding:'5px',
        fontWeight:'bold',
        height:'auto'

    }
    const crossButton = {
        cursor:'pointer',
        padding:'5px',
        width:'10%',
        fontSize:'20px',
        fontWeight:'bolder',
        display:'flex',
        color:'red',
        justifyContent:'center',
    }

    const functionList = {
        width:'100%',
        padding:'7px',
        borderRadius:'5px',
        backgroundColor:'#DFE2DF'
    }
    const aFunction = {
        display:'flex',
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center',
        borderRadius:'5px'
    }
    const functionName = {
        width:'90%',
        padding:'0px 8x',
        fontWeight:'bold'
    }




    return (
        <Box style={styleForfullContainer}>
            <Typography style={subContainer1}>
                Level: {data.level.name}
            </Typography>
            
            <Box style={functionList}>
                <Typography sx={{fontWeight:'bold'}}>Property: {data.levelProperty.name}</Typography>
                <Box sx={{padding:'0px'}} style={aFunction}>
                    <ul>
                        {
                            data.selectedInstances.map((item, idx) => (
                                <li key={idx}>{item.sub}</li>
                            ))
                        }
                    </ul>
                </Box>
                
            </Box>
        </Box>
  )
}

export default ALevelRow