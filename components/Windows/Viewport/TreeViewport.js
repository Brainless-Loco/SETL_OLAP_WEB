import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'
import { useEffect, useState } from "react"
import FileNameList from "../ListViewComponents/FileNameListItem"
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
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
    const [loading, setLoading] = useState(true)
    const [datasets, setDataSets] = useState([])
    const [cubes, setCubes] = useState([])
    const [measures, setMeasures] = useState([])
    const [dims, setDims] = useState([])
    const [selectedDataset, setSelectedDataset] = useState('')


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