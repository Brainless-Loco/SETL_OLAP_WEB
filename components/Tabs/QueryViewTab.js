import { Box } from "@mui/system"
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, getFirestore, addDoc } from 'firebase/firestore'
import { Button } from "@mui/material";

const QueryViewTab = ({queryData}) => {
    const [query, setQuery] = useState('')

    const fetchQuery = async () => {
        setQuery('Loading...')
        
        if(!Boolean(queryData.sparql) || !queryData.sparql.length) return

        // Code
        setQuery(queryData.sparql)
        
    }

    useEffect(() => {
        fetchQuery()
    }, [queryData])

    return (
        <Box sx={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
            <Editor
                height='70vh'
                defaultLanguage="sparql"
                defaultValue=""
                value={query}
                options={{readOnly: true}}/>
        </Box>
    )
}

export default QueryViewTab