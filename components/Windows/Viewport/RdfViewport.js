import { getBytes, getDownloadURL, getStorage, ref } from "firebase/storage"
import { TurtleParser } from "millan"
import { useEffect, useRef, useState } from "react"
import Stack from '@mui/material/Stack'
import Typography from "@mui/material/Typography"
import Editor from '@monaco-editor/react'

const RdfViewport = ({value, index, fileRef, fileType}) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('Select a RDF file to view')
    
    

    const fetchFile = async () => {
        // Code
        if(fileType !== 'ttl') {
            setFile('# Select a RDF file to view')
            setLoading(true)
            setMessage('Select a RDF file to view')
            return
        }

        setLoading(true)
        setFile('# Loading...')
        const storage = getStorage()
        const storageRef = ref(storage, fileRef.fullPath)
        getBytes(storageRef)
        .then(snapshot => {
            // Received an ArrayBuffer
            // Decode the Buffer
            // Parse the buffer as JSON
            const decoder = new TextDecoder()
            const view = new Int8Array(snapshot)
            const decodedText = decoder.decode(view)

            setFile(decodedText)
            setMessage(`Viewing RDF file: ${fileRef.name}`)
            setLoading(false)
        })
        .catch(error => {
            console.error("Cannot download file", {fileRef, error})
            setMessage('Error fetching file!')
            setFile("# Error! Cannot fetch the file.")
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchFile()
    }, [fileRef])

    return (
        <Stack spacing={2} sx={{display: (value === index ? 'grid' : 'none')}}>
            <Typography variant='body1'>{message}</Typography>
            <Editor
                height='60vh'
                language="sparql"
                value={file}
                defaultValue='# Loading...'
                options={{readOnly: true,}}
            />
        </Stack>
    )
}

export default RdfViewport