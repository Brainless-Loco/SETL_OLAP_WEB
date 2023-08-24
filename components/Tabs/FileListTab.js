import Box from "@mui/material/Box"
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FormControl from "@mui/material/FormControl"
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from "react"
import FileNameList from "../Windows/ListViewComponents/FileNameListItem"
import { getStorage, ref, listAll } from "firebase/storage"

const FileListTab = ({value, index, onExtractDataset}) => {
    const [graphs, setGraphs] = useState([])
    const [abox, setAbox] = useState('')
    const [tbox, setTbox] = useState('')

    const handleABoxChange = (e) => {
        setAbox(e.target.value)
    }

    const handleTBoxChange = (e) => {
        setTbox(e.target.value)
    }

    const getGraphList = async () => {
        const res = await fetch('/api/get_graph_list')
        const data = await res.json()
        const temp = []
        data.forEach(item => {
            temp.push({name: item})
        })

        setGraphs(temp)
    }

    useEffect(() => {
        if(graphs.length) return
        getGraphList();
    }, [graphs])

    return (
        <Box hidden={value != index} sx={{width: 'auto',display:'flex',justifyContent:'center',flexDirection:'column',flexWrap:'wrap',}}>
            <FormControl fullWidth sx={{ marginY: '10px'}}>
                <InputLabel id='filter-cond-label' sx={{fontSize:'12px'}}>TBox IRI</InputLabel>
                <Select
                    labelId="filter-cond-select"
                    sx={{ height:'40px',}}
                    label='TBox IRI'
                    value={tbox}
                    onChange={handleTBoxChange}
                    defaultValue=''>
                    {graphs.map((item, idx) => (
                        <MenuItem key={`tbox_${idx}`} value={item.name}>{item.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                <InputLabel id='filter-cond-label' sx={{fontSize:'12px'}}>ABox IRI</InputLabel>
                <Select
                    labelId="filter-cond-select"
                    sx={{height:'40px' }}
                    label='ABox IRI'
                    value={abox}
                    onChange={handleABoxChange}
                    defaultValue=''>
                    {graphs.map((item, idx) => (
                        <MenuItem key={`abox_${idx}`} value={item.name}>{item.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            
            <Button className="extractBtn" fullWidth variant='contained' onClick={() => onExtractDataset(abox, tbox)} type="button" 
            disabled={!tbox.length || !abox.length} >
                Extract Cubes
            </Button>
        </Box>
    )
}

export default FileListTab