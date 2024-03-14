import CardContent from "@mui/material/CardContent"
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import FileListTab from "../../Tabs/FileListTab"
import DatasetTab from "../../Tabs/DatasetTab"


const Viewport = ({onSelectDataset, onExtractDatasets, 
    onExtractCubes,
    setTBoxFileRef,
    setABoxFileRef, datasetArray, onMeasureAggrFuncSelect,
    onLevelPropSelect, addAggFunc,
    dialogData,
    setDialogData,
    aboxIRI,
    setABoxIRI,
    dimensionTree

    }) => {

    const onExtractDataset = (abox, tbox) => {
        setABoxIRI(abox)
        onExtractDatasets(abox, tbox)
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
                            onExtractCubes={onExtractCubes}
                            onLevelPropSelect={onLevelPropSelect}
                            onMeasureAggrFuncSelect={onMeasureAggrFuncSelect}
                            addAggFunc={addAggFunc}
                            dialogData = {dialogData}
                            dimensionTree={dimensionTree}
                            setDialogData={setDialogData}
                            />
                    
                </CardContent>
            </Card>
        </Box>
        
    )
}

export default Viewport