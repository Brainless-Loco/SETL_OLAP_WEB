import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography'
import { useEffect, useState } from "react"
import FileNameList from "../Windows/ListViewComponents/FileNameListItem"
import Button  from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import MeasuresList from "../Windows/ListViewComponents/MeasureList/MeasuresList"


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }));


const DatasetTab = ({datasetArray, onSelectDataset, onLevelPropSelect, 
    onExtractCubes,
    onMeasureAggrFuncSelect, addAggFunc, 
    setDialogData,
    dimensionTree

    }) => {
    // JSON file after running the spqrql queries
    // to generate the data set(s)
    const [loading, setLoading] = useState(true)
    const [datasets, setDataSets] = useState([])
    const [cubes, setCubes] = useState([])
    const [measures, setMeasures] = useState([])
    const [dims, setDims] = useState([])
    const [selectedDataset, setSelectedDataset] = useState('')
    const [open, setOpen] = useState(false) // State for dialog(Modal)
    

    const onLevelSelect = (levelRef) => {
        setOpen(true)
        setDialogData(levelRef)
        // console.log("Level Select", levelRef)
    }


    const extractListItems = () => {
        if(!Boolean(datasetArray)) return;
        setLoading(false)

        const datasets = []
        const cubes = []
        const dimens = []
        Object.values(datasetArray).forEach(ds => {
            datasets.push({name: ds.name, iri: ds.iri, schemaIri:ds.schemaIri })
            cubes.push({name: ds.cube.name})
        })
        

        setDataSets(datasets)
        setCubes(cubes)
        
        //console.log("TreeView extraction", {datasetArray, datasets, cubes, dimens})
    }

    useEffect(()=>{
        const extractDimensionTree = ()=>{
            const dimens = []
            if(Object.keys(dimensionTree).length>0){
                dimensionTree.cube.dimensionList.map((dim)=>{
                    dimens.push(dim)
                })
                
                setDims(dimens)
                setMeasures(dimensionTree.cube.measureArray)
            }
        }
        extractDimensionTree()
    },[dimensionTree])


    useEffect(() => {
        //fetchFile()
        //setSelections([])
        extractListItems()
    }, [datasetArray])

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
        <Box sx={{width: '100%'}}>
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
                        sx={{width:'100%',height:'40px',marginBottom:'10px'}}
                        label='Dataset'
                        value={selectedDataset}
                        onChange={handleDatasetChange}>

                        {datasets.map((item, idx) => (
                            <MenuItem key={`dataset_${idx}`} value={item.name}>dataset:{item.name}</MenuItem>
                        ))}

                    </Select>
                    <Button className="extractBtn" fullWidth variant='contained' 
                    onClick={()=>{onExtractCubes()}} type="button" 
                    disabled={!selectedDataset} >
                        Extract Cubes
                    </Button>
                </FormControl>
                {/* Ekhanei Tree Generate Hobe */}


                <Box sx={{marginTop:'15px'}} hidden={!Boolean(selectedDataset)}>
                    <FileNameList listName='Dimensions' list={dims} onItemClick={onLevelSelect} mdProperty/>
                    <MeasuresList list={measures} onMeasureAggrFuncSelect={onMeasureAggrFuncSelect} addAggFunc={addAggFunc}/>
                </Box>

            </Box>
            {/* {
                loading&& <Box sx={{height:'100px',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <CircularProgress sx={{color:'#08094f'}}/>
                </Box>
            } */}
        </Box>
    )
}

export default DatasetTab