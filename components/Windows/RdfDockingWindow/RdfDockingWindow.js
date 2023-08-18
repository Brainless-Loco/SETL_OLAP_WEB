import CardContent from "@mui/material/CardContent"
import CardHeader from '@mui/material/CardHeader'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

import { useEffect, useState } from "react"
import { getStorage, ref, listAll } from "firebase/storage"
import FileNameList from "../ListViewComponents/FileNameListItem"

// !Depricated: Do not use this class/component
const RdfDockingWindow = ({hidden, setTabIdx, setFileRef}) => {
    const [rdfList, setRdfList] = useState([])
    const onItemClick = (fileRef) => {
        setTabIdx(1)
        setFileRef(fileRef)
    }

    const getLists = async () => {
        const storageRef = getStorage()
        const rdfDirRef = ref(storageRef, '/rdfsource')
        const rdfRefList = await listAll(rdfDirRef)
        setRdfList(rdfRefList.items)
    }

    useEffect(() => {
        getLists()
    }, [])

    return (
        <Card sx={{ height: 'auto' }} hidden={hidden}>
            <CardHeader title='RDF Docking Window'/>
            <CardContent>
                <Stack >
                    <FileNameList listName='RDF Source Files' list={rdfList} onItemClick={onItemClick}/>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default RdfDockingWindow