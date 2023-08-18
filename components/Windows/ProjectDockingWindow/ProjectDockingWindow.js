import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import FileNameList from '../ListViewComponents/FileNameListItem'
import { getStorage, ref, listAll } from "firebase/storage"
import { useEffect, useState } from 'react'

// !Depricated: Do not use this class/component
const ProjectDockingWindow = ({setTabIdx, setTBoxFileRef, setABoxFileRef}) => {
    const [tboxList, setTBoxList] = useState([])
    const [aboxList, setABoxList] = useState([])

    const getTBoxList = async () => {
        const storageRef = getStorage()
        const rdfDirRef = ref(storageRef, '/tbox')
        const rdfRefList = await listAll(rdfDirRef)
        setTBoxList(rdfRefList.items)
    }

    const getABoxList = async () => {
        const storageRef = getStorage()
        const rdfDirRef = ref(storageRef, '/abox')
        const rdfRefList = await listAll(rdfDirRef)
        setABoxList(rdfRefList.items)
    }

    const onTBoxFileItemClick = (fileRef) => {
        setTBoxFileRef(fileRef)
    }

    const onABoxFileItemClick = (fileRef) => {
        setABoxFileRef(fileRef)
    }

    useEffect(() => {
        getTBoxList();
        getABoxList();
    }, [])

    return (
        <Box >
            <Card sx={{ height: 'auto', overflowY: 'hidden' }}>
                <CardHeader title='RDF Docking Window'/>
                <CardContent style={{overflow:'auto',maxHeight:'250px'}}>
                    <Stack>
                        <FileNameList listName='TBox Files' list={tboxList} onItemClick={onTBoxFileItemClick}/>
                        <FileNameList listName='ABox Files' list={aboxList} onItemClick={onABoxFileItemClick}/>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ProjectDockingWindow