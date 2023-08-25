import CardContent from "@mui/material/CardContent"
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import { useState } from "react"
import TreeViewport from "./TreeViewport"
import JsonViewport from "./JsonViewport"
import RdfViewport from "./RdfViewport"
import SparqlEditorViewport from "./SparqlEditorViewport"
import SparqlResultViewport from "./SparqlResultViewport"
import { getBytes, getDownloadURL, getStorage, ref, firebase } from "firebase/storage"
import SelectionSummaryTab from "../../Tabs/SelectionSummaryTab"
import FileListTab from "../../Tabs/FileListTab"
import DatasetTab from "../../Tabs/DatasetTab"
import QueryViewTab from "../../Tabs/QueryViewTab"
import QueryResultsTab from "../../Tabs/QueryResultsTab"


const Viewport = ({tabIdx, setTabIdx, onSelectDataset, onExtract, 
    setTBoxFileRef,
    setABoxFileRef, datasetArray, 
    prefixMap, onMeasureAggrFuncSelect,
    onLevelPropSelect, addAggFunc,
    dialogData,
    setDialogData,
    aboxIRI,
    setABoxIRI

    }) => {

    const onExtractDataset = (abox, tbox) => {
        setABoxIRI(abox)
        onExtract(abox, tbox)
    }

    const flexSetting = {
        display:'flex',
        justifyContent:'center',
        flexWrap:'wrap',
        flexDirection:'row',
        width:'100%',
        maxHeight:'100vh',
        overflowY:'auto'
    }

    // console.log(aboxIRI)

    return (
        <Box >
            <Card>
                <CardHeader title='Cube Extraction' sx={{color:'#08094f',marginBottom:'0px',paddingBottom:'0px',paddingTop:'5px'}}/>
                <CardContent style={flexSetting}>
                    <Box sx={{ height: 'auto', overflowY: 'auto',width:'100%'}}>
                        <FileListTab
                            onExtractDataset={onExtractDataset} 
                            setTBoxFileRef={setTBoxFileRef} 
                            setABoxFileRef={setABoxFileRef}/>
                    </Box>
                    <DatasetTab
                            onSelectDataset={onSelectDataset}
                            aboxIRI={aboxIRI}
                            datasetArray={datasetArray}
                            onLevelPropSelect={onLevelPropSelect}
                            onMeasureAggrFuncSelect={onMeasureAggrFuncSelect}
                            addAggFunc={addAggFunc}
                            dialogData = {dialogData}
                            setDialogData={setDialogData}
                            />
                    
                </CardContent>
            </Card>
        </Box>
        
    )
}

export default Viewport