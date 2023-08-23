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


const Viewport = ({tabIdx, setTabIdx, 
    tboxRef, onSelectDataset,
    aboxRef, onExtract, 
    setTBoxFileRef, queryID, queryData,
    setABoxFileRef, datasetArray, 
    prefixMap, onMeasureAggrFuncSelect,
    onLevelPropSelect, addAggFunc,
    dialogData,
    setDialogData,
    aboxIRI,
    setABoxIRI

    }) => {
    const handleTabChange = (e, val) => {
        setTabIdx(val);
    }

    // console.log(aboxIRI)


    // const [aboxIRI, setABoxIRI] = useState('')
    const [tboxIRI, setTBoxIRI] = useState('')

    const onExtractDataset = (abox, tbox) => {
        setABoxIRI(abox)
        setTBoxIRI(tbox)
        onExtract(abox, tbox)
    }

    const flexSetting = {
        display:'flex',
        justifyContent:'center',
        flexWrap:'wrap',
        flexDirection:'column',
        width:'100%'
    }

    const [execute, setExecute] = useState(false)
    const onQueryExecution = () => {
        setExecute(true)
    }


    // console.log(aboxIRI)

    return (
        <Box >
            <Card >
                {/* <CardHeader title='Viewport' sx={{color:'#08094f'}}/> */}
                <CardContent style={flexSetting}>
                    <Tabs value={tabIdx} onChange={handleTabChange}>
                        <Tab  label='File List' value={0}/>
                        {/* <Tab label='Dataset'/> */}
                        {/* <Tab label='Sparql Editor' sx={{alignSelf: 'right'}}/> */}
                        {/* <Tab label='Query Results' sx={{alignSelf: 'right'}}/> */}
                    </Tabs>
                    <Box sx={{ height: 'auto', overflowY: 'auto',maxWidth:'100%'}}>
                        <FileListTab value={tabIdx} index={0}
                            onExtractDataset={onExtractDataset} 
                            setTBoxFileRef={setTBoxFileRef} 
                            setABoxFileRef={setABoxFileRef}/>
                        
                        {/* <QueryViewTab 
                            value={tabIdx} 
                            index={3} 
                            queryData={queryData} 
                            onQueryExecution={onQueryExecution}/> */}

                        {/* <QueryResultsTab 
                            value={tabIdx} 
                            index={4} 
                            aboxIRI={aboxIRI}
                            onFinish={setExecute}
                            shallExecute={execute}
                            queryID={queryID} /> */}
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