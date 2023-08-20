import { useEffect, useRef, useState } from "react"
// import { getStorage, ref, uploadBytesResumable, getDownloadURL, getBytes } from "firebase/storage"
// import axios from "axios"
// import TreeView from "../components/HomeComponents/TreeView"
// import MyAppbar from "../components/Appbar/MyAppbar"
import Head from "next/head"
// import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Viewport from "../components/Windows/Viewport/Viewport"
import Box from "@mui/material/Box"
// import JsonDockingWindow from "../components/Windows/JsonDockingWindow/JsonDockingWindow"
// import RdfDockingWindow from "../components/Windows/RdfDockingWindow/RdfDockingWindow"
// import ProjectDockingWindow from "../components/Windows/ProjectDockingWindow/ProjectDockingWindow"
// import TreeViewport from "../components/Windows/Viewport/TreeViewport"
import SelectionDockingWindow from "../components/Windows/SelectionDockingWindow/SelectionDockingWindow"
import LevelViewport from "../components/Windows/Viewport/LevelViewport"

const Home = () => {
    const [tabIdx, setTabIdx] = useState(0)
    const [fileRef, setFileRef] = useState(null)
    const [tboxFileRef, setTBoxFileRef] = useState(null)
    const [aboxFileRef, setABoxFileRef] = useState(null)
    
    const [datasetArray, setDatasetArray] = useState(null)
    const [loading, setLoading] = useState(false)
    const [prefixes, setPrefixes] = useState(new Map())

    // const [selectedMeasure,setSelectedMeasure] = useState([])
    const [selectedAggFunc, setSelectedAggFunc] = useState([])
    const [selectedLevels, setSelectedLevels] = useState([])

    const handleSetSelectedAggFunc = (item)=>{
        let temp = selectedAggFunc
        temp.push(item)
        temp = [...new Set(temp)]
        setSelectedAggFunc(temp)
    }

    const handleSelectedLevels = (item,ifToExclude)=>{
        let temp = selectedLevels.filter((level)=>{
            level['levelName']!=item['levelName']
        })
        if(!ifToExclude) temp.push(item)
        setSelectedLevels(temp)
    }

    const extractDatasetArray = async (abox, tbox) => {

        console.log('Request > Extract dataset from ' + tbox);

        // Query and get the datasets
        setLoading(true)

        const params = new URLSearchParams()
        params.append('tboxIRI', tbox)
        params.append('aboxIRI', abox)
        const req = await fetch(`/api/generate_dataset_array?${params.toString()}`)
        const data = await req.json()
        if(req.ok) {
            setLoading(false)
            setDatasetArray(data)
        }
        
        // TODO: Extract prefixes from the dataset(s)
        

        console.log('Done Fetching data');
    }

    const [selectedMeasures, setSelectedMeasures] = useState([])

    const onMeasureAggrFuncSelect = (measure, function_name) => {
        // Code
        let temp = [...selectedMeasures]
        const f = temp.findIndex(e => e.measure.name === measure.name)
        if(f > -1) {
            let f_arr = [...temp[f].functions]
            f_arr.push(function_name)
            f_arr = [...new Set(f_arr)]
            temp[f].functions = f_arr
        } else temp.push({measure: measure, functions: [function_name]})

        setSelectedMeasures(temp)
    }
    
    const removeSelectedAggFunc = (measure, func) =>{
        console.log("On remove aggr func >", {measure, func})
        let temp = [...selectedMeasures]
        
        const f = temp.findIndex(e => e.measure.name === measure.name)
        if(f > -1) {
            let f_arr = [...temp[f].functions]
            const temp_arr = f_arr.filter(item => {
                return item.name !== func.name
            })

            
            temp[f].functions = temp_arr
        }

        if(!temp[f].functions.length) temp.splice(f, 1)
        
        setSelectedMeasures(temp)
    }

    const [levelPropData, setLevelPropData] = useState([])
    const handleLevelPropSelect = (data) => {
        let temp = [...levelPropData]
        const { 
            level, 
            levelProperty, 
            selectedInstances, 
            propertyToBeViewed, 
            filterCondition 
        } = data

        const f = temp.findIndex(item => item.level.name === level.name)
        if(f > -1) {
            // Code
            let arr = [...temp[f].selectedInstances, ...selectedInstances]
            arr = [...new Set(arr)]
            
            temp[f] = {
                level, 
                levelProperty, 
                selectedInstances: arr, 
                propertyToBeViewed, 
                filterCondition
            }
        } else {
            temp.push(data)
        }
        
        setLevelPropData(temp)
    }

    const [selectedDataset, setSelectedDataset] = useState({})

    const [queryID, setQueryID] = useState('')
    const [queryData, setQueryData] = useState({})

    useEffect(() => {
        // Re-render on measure/level selection
        console.log("Index >", levelPropData)
    }, [levelPropData])


    
    const [dialogData, setDialogData] = useState({name: 'demo level'})

    return (
        <Box disableGutters sx={{height: '100%'}}>
            <Head>
                <title>SETL OLAP | Home</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {/* App mediator class */}

            <Grid container rowSpacing={{xs: 2}} columnSpacing={0.5} columns={12}
            sx={{ paddingTop: '15px', paddingX:'8px',height: 'auto', overflowY: 'auto', overflowX: 'hidden',display:'flex',justifyContent:'space-around' }}>
                <Grid item md={4}>
                    <Viewport tabIdx={tabIdx} 
                        queryID={queryID} queryData={queryData}
                        onSelectDataset={dataset => setSelectedDataset(dataset)}
                        onExtract={extractDatasetArray}  setTabIdx={setTabIdx} 
                        fileRef={fileRef}  datasetArray={datasetArray}
                        prefixMap={prefixes} 
                        onMeasureAggrFuncSelect={onMeasureAggrFuncSelect}
                        setTBoxFileRef={setTBoxFileRef} setABoxFileRef={setABoxFileRef}
                        tboxRef={tboxFileRef} aboxRef={aboxFileRef}
                        addAggFunc={handleSetSelectedAggFunc}
                        addLevels={handleSelectedLevels}
                        onLevelPropSelect={handleLevelPropSelect}
                        />
                </Grid>
                <Grid item md={4}>
                    <LevelViewport data={dialogData} />
                </Grid>

                <Grid item md={4}>
                    <SelectionDockingWindow 
                    onQueryUpload={setQueryID}
                    onQueryGeneration={setQueryData}
                    dataset={selectedDataset} measures={selectedMeasures} 
                    removeSelectedAggFunc={removeSelectedAggFunc} 
                    levels={levelPropData} aboxRef={aboxFileRef}/>
                </Grid>
                
            </Grid>
        </Box>
    )
}

export default Home