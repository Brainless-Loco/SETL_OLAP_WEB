import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useState } from 'react';
import { W3SpecSparqlParser } from 'millan';
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

const SparqlEditorViewport = ({value, index}) => {
    const [query, setQuery] = useState('')

    const sparqlParser = new W3SpecSparqlParser()

    return (
        <Stack spacing={2} sx={{display: (value === index ? 'grid' : 'none')}}>
            <Typography variant='body1'>Write your query code here.</Typography>

            <Editor
                height='48vh'
                defaultLanguage="sparql"
                defaultValue=""/>

            <Button sx={{backgroundColor:'red'}} variant='contained'>Execute Query</Button>
        </Stack>
    )
}

export default SparqlEditorViewport