import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack'
import { useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { DataGrid } from '@mui/x-data-grid'

const LevelDialog = ({ open, handleClose, data, aboxIRI, onDone }) => {
    const [selectedLevelProp, setSelectedLevelProp] = useState('')
    const [selectedFilterCondition, setSelectedFilterCondition] = useState('Equal to (=)')
    const [activeStep, setActiveStep] = useState(0)
    const [levelInstances, setLevelInstances] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedInstances, setSelectedInstances] = useState([])
    const [toBeViewedProperty, setToBeViewedProperty] = useState('')

    const cols = [
        { field: 'id', headerName: 'No.', width: 64 },
        { field: 'name', headerName: 'Instance Name', width: 128 },
        { field: 'sub', headerName: 'Instance IRI', width: 256 },
        { field: 'obj', headerName: 'Instance of', width: 128 },
    ]

    const { levelAttributes, name, prefix } = data
    const filterConditions = ['Equal to (=)', 'Not Equal to (!=)',
        'Greater Than (>)', 'Greater or Equal (>=)',
        'Less Than (<)', 'Less or Equal (<=)'
    ]

    const onClose = () => {
        setActiveStep(0)
        setSelectedLevelProp('')
        setSelectedFilterCondition('')
        setLoading(false)
        setLevelInstances([])
        setToBeViewedProperty('')
        setSelectedInstances([])
        handleClose();
    }

    const handlePropChange = (event) => {
        setSelectedLevelProp(event.target.value)
    }

    const handleFilterCondChange = (event) => {
        setSelectedFilterCondition(event.target.value)
    }

    const handleToBeViewedPropertyChange = (event) => {
        setToBeViewedProperty(event.target.value)
    }

    const handleNext = () => {
        setActiveStep((activeStep + 1) % 2) // Maybe you need t work on this
    }

    const handleBack = () => {
        setActiveStep(Math.max(0, activeStep - 1)) // No further work required
    }

    const findCurrentLevelPropObj = () => {
        for (let i = 0; i < levelAttributes.length; i++) {
            if (levelAttributes[i].name === selectedLevelProp) return levelAttributes[i];
        }
        return null
    }

    const fetchInstances = async () => {
        console.log("Request > Level Instance > Trying to fetch level instances");
        setLoading(true)

        // Code
        const lvlProp = findCurrentLevelPropObj()
        const params = new URLSearchParams()
        params.append('aboxIRI', aboxIRI)
        params.append('level', prefix + '#' + name)
        params.append('levelProp', lvlProp.prefix + '#' + lvlProp.name)


        const req = await fetch(`/api/generate_level_instances?${params.toString()}`)
        if (!req.ok) {
            console.log("Internal server error")
            setLoading(false)
            return
        }
        const res = await req.json()
        const temp = []
        res.forEach((item, idx) => {
            temp.push({ ...item, id: idx })
        })
        setLevelInstances(temp)
        ///console.log("API > generate_level_instances: ", res)
        setLoading(false)
        console.log('Level Instances > Done said good bye')
    }

    const changeSelectedInstances = (ids) => {
        let temp = []
        ids.forEach(id => {
            const item = levelInstances[id]
            temp.push(item)
        });
        setSelectedInstances(temp)
    }

    const toSymbol = (filterCond) => {
        var regex = /\(([^)]+)\)/
        const arr = regex.exec(filterCond)
        console.log(arr)
        return arr[1]
    }

    const handleDone = () => {
        const {name, obj, sub, pred, prefix} = data
        const dataPack = {
            level: {name, obj, sub, pred, prefix},
            levelProperty: findCurrentLevelPropObj(selectedLevelProp),
            propertyToBeViewed: findCurrentLevelPropObj(toBeViewedProperty),
            filterCondition: toSymbol(selectedFilterCondition),
            selectedInstances
        }

        console.log("Level Modal > Done >", dataPack)
        onDone(dataPack)
        onClose()
    }

    return (
        <Dialog sx={{ maxWidth: '1300px', margin: 'auto' }} fullWidth maxWidth='md' open={open} onClose={onClose}>
            <DialogTitle sx={{height:'55px'}}>Level Selection</DialogTitle>
            <DialogContent hidden={activeStep !== 0} sx={{ minHeight: '300px' }}>
                <DialogContentText>
                    Selected level: {data.name}
                </DialogContentText>

                {levelAttributes && <FormControl fullWidth sx={{ marginTop: '16px' }}>
                    <InputLabel id='level-prop-label'>Properties</InputLabel>
                    <Select
                        labelId="level-prop-select"
                        sx={{ width: '100%' }}
                        label='Level Property'
                        value={selectedLevelProp}
                        onChange={handlePropChange}
                        defaultValue={"Select a property"}>
                        {levelAttributes.map((item, idx) => (
                            <MenuItem key={`level_prop_${idx}`} value={item.name}>mdAttribute:{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>}

                <FormControl fullWidth sx={{ marginTop: '16px' }}>
                    <InputLabel id='filter-cond-label'>Filter Conditions</InputLabel>
                    <Select
                        labelId="filter-cond-select"
                        sx={{ width: '100%' }}
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

                {levelAttributes && <FormControl fullWidth sx={{ marginTop: '16px' }}>
                    <InputLabel id='level-prop-label'>To Be Viewed Property</InputLabel>
                    <Select
                        labelId="level-prop-to-be-viewed"
                        sx={{ width: '100%' }}
                        label='Level Property to be viewed'
                        value={toBeViewedProperty}
                        onChange={handleToBeViewedPropertyChange}
                        defaultValue={"Select a property"}>
                        {levelAttributes.map((item, idx) => (
                            <MenuItem key={`level_prop_${idx}`} value={item.name}>mdAttribute:{item.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>}
            </DialogContent>
            <DialogContent hidden={activeStep !== 1} sx={{ minHeight: '500px' }}>
                <DialogContentText>
                    Selected level: {data.name}
                </DialogContentText>

                <DialogContentText>
                    Selected property: {selectedLevelProp}
                </DialogContentText>

                <DialogContentText>
                    Selected filter condition: {selectedFilterCondition}
                </DialogContentText>
                <DialogContentText>
                    Level Instances
                </DialogContentText>
                {!levelInstances.length && 
                    <Button 
                    fullWidth
                    variant='contained'
                    onClick={fetchInstances} disabled={loading}>
                        Get Level Instances
                    </Button>
                }
                <Box sx={{ height: '380px', width: '100%' }}>
                    <DataGrid
                        checkboxSelection
                        onSelectionModelChange={(ids)=>{changeSelectedInstances(ids)}}
                        columns={cols}
                        rows={levelInstances}
                        pageSize={10}
                        rowsPerPageOptions={[10]} />
                </Box>
            </DialogContent>
            <DialogContent sx={{overflowY: 'visible'}}>
                <Stepper activeStep={activeStep}>
                    <Step>
                        <StepLabel>Properties</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Instances</StepLabel>
                    </Step>
                </Stepper>
            </DialogContent>
            <DialogActions sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Button onClick={handleBack} disabled={activeStep === 0}>Back</Button>

                <Button onClick={handleNext}
                    disabled={!Boolean(selectedFilterCondition)
                        || !Boolean(selectedLevelProp)
                        || !selectedFilterCondition.length
                        || !selectedLevelProp.length 
                        || !Boolean(toBeViewedProperty)
                        || activeStep===1}>
                    Next 
                </Button>
                <Button onClick={handleDone}
                    disabled={!selectedInstances.length}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default LevelDialog