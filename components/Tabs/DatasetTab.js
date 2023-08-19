import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'
import { useEffect, useState,createContext } from "react"
import FileNameList from "../Windows/ListViewComponents/FileNameListItem"
import { getBytes, getDownloadURL, getStorage, ref,firebase } from "firebase/storage"
import TreeView from "../HomeComponents/TreeView"
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material"
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import MeasuresList from "../Windows/ListViewComponents/MeasureList/MeasuresList"
import LevelDialog from "../Windows/Modals/LevelDialog"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }));

const DatasetTab = ({value, index, datasetArray, 
    prefixMap, onSelectDataset, onLevelPropSelect, 
    onMeasureAggrFuncSelect, aboxIRI, addAggFunc}) => {
    // JSON file after running the spqrql queries
    // to generate the data set(s)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [datasets, setDataSets] = useState([])
    const [cubes, setCubes] = useState([])
    const [measures, setMeasures] = useState([])
    const [dims, setDims] = useState([])
    const [selectedDataset, setSelectedDataset] = useState('')
    const [open, setOpen] = useState(false) // State for dialog(Modal)
    const [dialogData, setDialogData] = useState({name: 'demo level'})
    
    
    const onDialogCancel = () => {
        setDialogData({name: 'demo level'})
        setOpen(false)
    }

    const onLevelSelect = (levelRef) => {
        setOpen(true)
        setDialogData(levelRef)
        console.log("Level Select", levelRef)
    }

    const [selections,setSelections] = useState([])
    const [prefixes,setPrefixes] = useState(new Map())

    const fetchFile = async () => {
        // Code
        if(fileType !== 'ttl') {
            setLoading(true)
            return
        }

        setLoading(true)
        const req = await fetch(`/api/generate_dataset_array?fileName=${fileName}`)
        const data = await req.json()
        if(req.ok) {
            setLoading(false);
            setData(data);
            extractListItems(data)
        }
        
        const storage = getStorage()
        const storageRef = ref(storage, `rdfsource/${fileName}`)
        getBytes(storageRef)
        .then(snapshot => {
            const decoder = new TextDecoder()
            const view = new Int8Array(snapshot)
            const decodedText = decoder.decode(view)
            var allLines = decodedText.split('\n')
            prefixes.clear()
            allLines.forEach((item)=>{
                const temp = item.trim().split(/\s+/)
                if(temp[0]=="@prefix"){
                    const short = temp[1].slice(0,-1)
                    const broad = temp[2].slice(1,-1)
                    if(broad.slice(-1)=='>') broad=broad.slice(0,-1)
                    prefixes.set(short,broad)
                    prefixes.set(broad,short)
                }
            })
        })
        
    }

    const extractListItems = () => {
        if(!Boolean(datasetArray)) return;
        setLoading(false)

        const datasets = []
        const cubes = []
        const dimens = []
        Object.values(datasetArray).forEach(ds => {
            datasets.push({name: ds.name, iri: ds.iri})
            cubes.push({name: ds.cube.name})
            ds.cube.dimensionList.forEach(dim => {
                dimens.push(dim)
            })
            setMeasures(ds.cube.measureArray)
        })

        setDataSets(datasets)
        setCubes(cubes)
        setDims(dimens)
        
        //console.log("TreeView extraction", {datasetArray, datasets, cubes, dimens})
    }

    useEffect(() => {
        //fetchFile()
        //setSelections([])
        extractListItems()
    }, [datasetArray])

    const addOnClick = (item)=>{
        selections.push(item)
        selections = [...new Set(selections)]
        setSelections(selections)
    }
    const removeOnClick = (item)=>{
        selections = selections.filter(val => val !== item)
        selections = [...new Set(selections)]
        setSelections(selections)
    }

    const findDatasetObj = (datasetName) => {
        const f = datasets.findIndex(item => item.name === datasetName)
        if(f > -1) return datasets[f]
        return null
    }

    const handleDatasetChange = (event) => {
        setSelectedDataset(event.target.value)
        const ds = event.target.value
        onSelectDataset(findDatasetObj(ds))
    }

    return (
        <Box hidden={value != index} sx={{width: '100%'}}>
            <Box hidden={!loading}>
                <Typography sx={{color:'#08094f',fontSize:'14px',fontWeight:'bold',textAlign:'center'}}> 
                    Select a TBox File and an ABox file to extract dataset(s).
                </Typography>
            </Box>
            <Box hidden={loading} sx={{ height: '100%',marginTop:'15px' }}>
                <FormControl fullWidth>
                    <InputLabel id='dataset-label' sx={{fontSize:'90%',verticalAlign:'middle',top:'-10%'}}>Datasets</InputLabel>
                    <Select
                    labelId="dataset-select"
                    sx={{width:'100%',height:'40px'}}
                    label='Dataset'
                    value={selectedDataset}
                    onChange={handleDatasetChange}>
                        {datasets.map((item, idx) => (
                            <MenuItem key={`dataset_${idx}`} value={item.name}>dataset:{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* TODO: Dimension tree, modify it */}
                <Box sx={{marginTop:'15px'}} hidden={!Boolean(selectedDataset)}>
                    <FileNameList listName='Dimensions' list={dims} onItemClick={onLevelSelect} mdProperty/>
                    <MeasuresList list={measures} onMeasureAggrFuncSelect={onMeasureAggrFuncSelect} addAggFunc={addAggFunc}/>
                </Box>
                <LevelDialog open={open} handleClose={onDialogCancel} data={dialogData} aboxIRI={aboxIRI} onDone={onLevelPropSelect}/>
            </Box>
        </Box>
    )
}

export default DatasetTab