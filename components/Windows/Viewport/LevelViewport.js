import { Box, CircularProgress, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';

export default function LevelViewport({ data, aboxIRI, onDone}) {

    // console.log(aboxIRI)

  const [selectedLevelProp, setSelectedLevelProp] = useState('')
  const [selectedFilterCondition, setSelectedFilterCondition] = useState('Equal to (=)')
  const [activeStep, setActiveStep] = useState(0)
  const [levelInstances, setLevelInstances] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedInstances, setSelectedInstances] = useState([])
  const [toBeViewedProperty, setToBeViewedProperty] = useState('')
  const [levelAttributes, setlevelAttributes] = useState([])

//   console.log(data)


  const cols = [
        { field: 'id', headerName: 'No.', width: 64 },
        // { field: 'name', headerName: 'Instance Name', width: 128 },
        { field: 'sub', headerName: 'Instance IRI', width: 256 },
        { field: 'obj', headerName: 'Instance of', width: 256 },
    ]

    const filterConditions = ['Equal to (=)', 'Not Equal to (!=)',
        'Greater Than (>)', 'Greater or Equal (>=)',
        'Less Than (<)', 'Less or Equal (<=)'
    ]

    const handlePropChange = (event) => {
        setSelectedLevelProp(event.target.value)
    }

    const handleFilterCondChange = (event) => {
        setSelectedFilterCondition(event.target.value)
    }

    const handleToBeViewedPropertyChange = (event) => {
        setToBeViewedProperty(event.target.value)
    }

    const findCurrentLevelPropObj = () => {
        for (let i = 0; i < levelAttributes.length; i++) {
            if (levelAttributes[i].name === selectedLevelProp) return levelAttributes[i];
        }
        return null
    }

    const fetchInstances = async () => {
        // console.log("Request > Level Instance > Trying to fetch level instances");
        setLoading(true)

        // Code
        const lvlProp = findCurrentLevelPropObj()
        const params = new URLSearchParams()
        params.append('aboxIRI', aboxIRI)
        params.append('level', data.prefix + '#' + data.name)
        params.append('levelProp', lvlProp.prefix + '#' + lvlProp.name)


        const req = await fetch(`/api/generate_level_instances?${params.toString()}`)
        if (!req.ok) {
            // console.log("Internal server error")
            setLoading(false)
            return
        }
        const res = await req.json()
        const temp = []
        res.forEach((item, idx) => {
            temp.push({ ...item, id: idx })
        })
        setLevelInstances(temp)
        // console.log(temp)
        ///console.log("API > generate_level_instances: ", res)
        setLoading(false)
        // console.log('Level Instances > Done said good bye')
    }

    const changeSelectedInstances = (ids) => {
        let temp = []
        ids.forEach(id => {
            const item = levelInstances[id]
            temp.push(item)
        });
        setSelectedInstances(temp)

        const {name, obj, sub, pred, prefix,hierarchy,serialForRollUp} = data
        const dataPack = {
            level: {name, obj, sub, pred, prefix},
            hierarchy: hierarchy,
            levelProperty: findCurrentLevelPropObj(selectedLevelProp),
            propertyToBeViewed: findCurrentLevelPropObj(toBeViewedProperty),
            filterCondition: toSymbol(selectedFilterCondition),
            serialForRollUp: serialForRollUp,
            selectedInstances:temp
        }
        onDone(dataPack)
    }
    

    const toSymbol = (filterCond) => {
        var regex = /\(([^)]+)\)/
        const arr = regex.exec(filterCond)
        // console.log(arr)
        return arr[1]
    }

    const handleDone = () => {
        const {name, obj, sub, pred, prefix,hierarchy,serialForRollUp} = data
        const dataPack = {
            level: {name, obj, sub, pred, prefix},
            hierarchy: hierarchy,
            levelProperty: findCurrentLevelPropObj(selectedLevelProp),
            propertyToBeViewed: findCurrentLevelPropObj(toBeViewedProperty),
            filterCondition: toSymbol(selectedFilterCondition),
            serialForRollUp: serialForRollUp,
            selectedInstances
        }
        onDone(dataPack)
    }



    useEffect(() => {
        if(data.name!='demo level'){
            // console.log(data.levelAttributes)
            setlevelAttributes(data.levelAttributes)
            setSelectedLevelProp('')
            setToBeViewedProperty('')
        }
        else{
            // setLevelInstances([])
            
        }
        setSelectedLevelProp('')
        setToBeViewedProperty('')
        setLevelInstances([])
    }, [data.name])


    useEffect(() => {
        if(selectedLevelProp.length>0 && toBeViewedProperty.length>0){
            fetchInstances()
        }else{
            // setLevelInstances([])
        }
    }, [selectedLevelProp,toBeViewedProperty])

    
    


  return (
    <Box sx={{height:'auto'}}>
       <Card sx={{
            height: '100%',
            width: '100%',
        }}>
            {/* Bad practice, use card header instead */}
            <CardHeader sx={{color:'#08094f',paddingBottom:'0px',paddingTop:'5px'}} title='Level Selections'/>
            
            {/* Seperate the components. */}
            <CardContent sx={{paddingTop:'5px'}}>
                <Typography sx={{color:'#08094f'}}>
                        Selected level: {data.name!='demo level' ? data.name:""}
                </Typography>
                <FormControl fullWidth sx={{ marginTop: '10px' }}>
                    <InputLabel id='level-prop-label' sx={{fontSize:'90%',top:'-10%'}}>Properties</InputLabel>
                    <Select
                        labelId="level-prop-select"
                        sx={{width:'100%',height:'40px'}}
                        label='Level Property'
                        value={selectedLevelProp}
                        onChange={handlePropChange}
                        defaultValue={"Select a property"}>
                        {levelAttributes.map((item, idx) => (
                            <MenuItem key={`level_prop_${idx}`} value={item.name}>mdAttribute:{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: '10px' }}>
                    <InputLabel id='filter-cond-label'>Filter Conditions</InputLabel>
                    <Select
                        labelId="filter-cond-select"
                        sx={{ width: '100%',height:'40px' }}
                        label='Filter Condition'
                        value={selectedFilterCondition}
                        onChange={handleFilterCondChange}
                        defaultValue={filterConditions[0]}>
                        {filterConditions.map((item, idx) => (
                            idx? 
                            <MenuItem disabled key={`level_prop_${idx}`} value={item}>{item}</MenuItem>:
                            <MenuItem key={`level_prop_${idx}`} value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ marginTop: '15px' }}>
                    <InputLabel id='level-prop-label' sx={{fontSize:'90%',top:'-10%'}}>To Be Viewed Property</InputLabel>
                    <Select
                        labelId="level-prop-to-be-viewed"
                        sx={{ width: '100%',height:'40px' }}
                        label='Level Property to be viewed'
                        value={toBeViewedProperty}
                        onChange={handleToBeViewedPropertyChange}
                        defaultValue={"Select a property"}>
                        {levelAttributes.map((item, idx) => (
                            <MenuItem key={`level_prop_${idx}`} value={item.name}>mdAttribute:{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ height: '400px', width: '100%',marginTop:'10px' }}>
                    {
                        !loading? 
                            levelInstances.length>0?
                                <DataGrid
                                    checkboxSelection
                                    onSelectionModelChange={(ids)=>{changeSelectedInstances(ids)}}
                                    columns={cols}
                                    rows={levelInstances}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]} />:
                                    <></>:
                        <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
                            <CircularProgress sx={{color:"#08094f"}} size={60}/>
                        </Box>
                        
                    }
                    
                        
                </Box>
                {/* <Button onClick={handleDone}
                    disabled={!selectedInstances.length}>
                    Done
                </Button> */}

              
            </CardContent>

            <CardActions sx={{justifyContent: 'space-between'}}>
                
            </CardActions>
            
        </Card>
    </Box>
  )
}
