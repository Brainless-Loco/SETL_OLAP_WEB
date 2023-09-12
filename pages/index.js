import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Grid from "@mui/material/Grid"
import Viewport from "../components/Windows/Viewport/Viewport"
import Box from "@mui/material/Box"
import SelectionDockingWindow from "../components/Windows/SelectionDockingWindow/SelectionDockingWindow"
import LevelViewport from "../components/Windows/Viewport/LevelViewport"
import QueryResultView from "../components/QueryResultView/QueryResultView"
import QuerytViewModal from "../components/QueryViewModal/QueryViewModal"

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

        // console.log('Request > Extract dataset from ' + tbox);

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
        

        // console.log('Done Fetching data');
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
        // console.log("On remove aggr func >", {measure, func})
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
            hierarchy, 
            selectedInstances, 
            propertyToBeViewed, 
            filterCondition,
            serialForRollUp 
        } = data

        const f = temp.findIndex(item => item.level.name === level.name)
        if(f > -1) {
            // Code
            let arr = selectedInstances
            arr = [...new Set(arr)]
            
            temp[f] = {
                level, 
                levelProperty, 
                selectedInstances: arr, 
                propertyToBeViewed, 
                filterCondition,
                hierarchy,
                serialForRollUp
            }
        } 
        else {
            temp.push(data)
        }
        
        setLevelPropData(temp)
    }

    const [selectedDataset, setSelectedDataset] = useState({})

    const [queryData, setQueryData] = useState({})

    
    
    
    const [aboxIRI, setABoxIRI] = useState('')
    
    const [dialogData, setDialogData] = useState({name: 'demo level'})
    
    const [sparqlQueryData, setsparqlQueryData] = useState(null)
    const [QueryView, setQueryView] = useState(false)
    const [queryResultView, setqueryResultView] = useState(false)
    
    
    // console.log(aboxIRI)

    useEffect(() => {
        // console.log(levelPropData)

        const temp_level = {
            filterCondition : "=",
            level : {
                name: dialogData.name, 
                obj: dialogData.obj, 
                sub: dialogData.sub, 
                pred: null, 
                prefix: dialogData.prefix,
            },
            hierarchy: dialogData.hierarchy,
            levelProperty:{},
            propertyToBeViewed:{},
            selectedInstances:[],
            serialForRollUp: dialogData.serialForRollUp
        }

        console.log(temp_level)
        
        const isLevelAlreadyExists = levelPropData.some(item => {
            return item.level.name === temp_level.level.name &&
            item.level.obj === temp_level.level.obj &&
            item.level.sub === temp_level.level.sub &&
            item.level.prefix === temp_level.level.prefix;
        });
        
        if (!isLevelAlreadyExists && dialogData.sub != null) {
            setLevelPropData([...levelPropData,temp_level])
        }
        
    }, [dialogData])
    

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
                        queryData={queryData}
                        onSelectDataset={dataset => setSelectedDataset(dataset)}
                        onExtract={extractDatasetArray}  setTabIdx={setTabIdx} 
                        fileRef={fileRef}  datasetArray={datasetArray}
                        prefixMap={prefixes} 
                        onMeasureAggrFuncSelect={onMeasureAggrFuncSelect}
                        setTBoxFileRef={setTBoxFileRef} setABoxFileRef={setABoxFileRef}
                        addAggFunc={handleSetSelectedAggFunc}
                        addLevels={handleSelectedLevels}
                        onLevelPropSelect={handleLevelPropSelect}
                        setDialogData={setDialogData}
                        dialogData={dialogData}
                        setABoxIRI={setABoxIRI}
                        aboxIRI={aboxIRI}
                        />
                </Grid>
                <Grid item md={4}>
                    <LevelViewport 
                        onDone={handleLevelPropSelect} 
                        addLevels={handleSelectedLevels} 
                        data={dialogData} 
                        aboxIRI={aboxIRI}
                    />
                </Grid>

                <Grid item md={4}>
                    <SelectionDockingWindow 
                    dataset={selectedDataset} 
                    measures={selectedMeasures} 
                    removeSelectedAggFunc={removeSelectedAggFunc} 
                    levels={levelPropData} 
                    aboxIRI={aboxIRI}
                    setsparqlQueryData={setsparqlQueryData}
                    setQueryView={setQueryView}
                    setqueryResultView={setqueryResultView}

                    />
                </Grid>
                
            </Grid>

        
            <QueryResultView data={sparqlQueryData} aboxIRI={aboxIRI} modalOpen={queryResultView} setmodalOpen={setqueryResultView}/>

            <QuerytViewModal  data={sparqlQueryData} aboxIRI={aboxIRI} modalOpen={QueryView} setmodalOpen={setQueryView}/>

            
        </Box>
    )
}

export default Home