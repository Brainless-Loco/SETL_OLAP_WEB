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
const JsonDockingWindow = ({hidden, setTabIdx, setFileRef}) => {
    const [typeMapList, setTypeMapList] = useState([])
    const [jsonLdList, setJsonLdList] = useState([])

    const onItemClick = (fileRef) => {
        setTabIdx(0)
        setFileRef(fileRef)
    }

    const getLists = async () => {
        // Gets the file list of available files on the storage/jsonld and storage/jsonld/typemap
        const storageRef = getStorage()
        const jsonLdDirRef = ref(storageRef, '/jsonld')
        const typeMapDirRef = ref(storageRef, '/typemap')
        const jsonLdRefList = await listAll(jsonLdDirRef)
        const typeMapRefList = await listAll(typeMapDirRef)
        setJsonLdList(jsonLdRefList.items)
        setTypeMapList(typeMapRefList.items)
    }

    useEffect(() => {
        getLists()
    }, [])
    return (
        <Card sx={{height: '100%'}} hidden={hidden}>
            <CardHeader title='JSON-LD Docking Window'/>
            <CardContent sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Stack sx={{width: '100%'}}>
                    <FileNameList listName={'JSON-LD Files'} list={jsonLdList} onItemClick={onItemClick}/>
                    <Divider variant="middle" sx={{mt: '8px', mb: '8px'}}/>
                    <FileNameList listName={'Type Map Files'} list={typeMapList} onItemClick={onItemClick}/>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default JsonDockingWindow