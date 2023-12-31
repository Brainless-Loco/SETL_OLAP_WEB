import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'
import { useEffect, useState,createContext } from "react"
import FileNameList from "../ListViewComponents/FileNameListItem"
import { getBytes, getDownloadURL, getStorage, ref,firebase } from "firebase/storage"
import TreeView from "../../HomeComponents/TreeView"
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material"
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import MeasuresList from "../ListViewComponents/MeasureList/MeasuresList"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }));

const TreeViewport = ({datasetArray, prefixMap, onMeasureAggrFuncSelect}) => {
    // JSON file after running the spqrql queries
    // to generate the data set(s)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [datasets, setDataSets] = useState([])
    const [cubes, setCubes] = useState([])
    const [measures, setMeasures] = useState([])
    const [dims, setDims] = useState([])
    const [selectedDataset, setSelectedDataset] = useState('')


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
            datasets.push({name: ds.name})
            cubes.push({name: ds.cube.name})
            ds.cube.dimensionList.forEach(dim => {
                dimens.push(dim)
            })
            setMeasures(ds.cube.measureArray)
        })

        setDataSets(datasets)
        setCubes(cubes)
        setDims(dimens)
        
        // console.log("TreeView extraction", {datasetArray, datasets, cubes, dimens})
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

    const handleDatasetChange = (event) => {
        setSelectedDataset(event.target.value)
    }

    return (
        <Box sx={{ height: '100%' }}>
            {/* Add a loading progress bar or something here*/}
            {loading && <Typography>Select a TBox file.</Typography>}
            <Box hidden={loading} sx={{ height: '100%' }}>
                <FormControl fullWidth>
                    <InputLabel id='dataset-label'>Dataset</InputLabel>
                    <Select
                    labelId="dataset-select"
                    sx={{width:'100%'}}
                    label='Dataset'
                    value={selectedDataset}
                    onChange={handleDatasetChange}>
                        {datasets.map((item, idx) => (
                            <MenuItem key={`dataset_${idx}`} value={item.name}>dataset:{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* TODO: Dimension tree, modify it */}
                <Box hidden={!Boolean(selectedDataset)}>
                    <FileNameList style={{marginTop:'20px'}} listName='Dimensions' list={dims} onItemClick={()=>{}} mdProperty/>
                    <MeasuresList list={measures} onMeasureAggrFuncSelect={onMeasureAggrFuncSelect}/>
                </Box>
            </Box>
            
        </Box>
    )
}

export default TreeViewport