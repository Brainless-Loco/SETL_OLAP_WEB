import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import FileNameList from '../ListViewComponents/FileNameListItem'
import { getStorage, ref, listAll } from "firebase/storage"
import { useEffect, useState } from 'react'
import AggrFuncSelectionView from './SelectionSummaryRows/AggrFuncSelectionView'
// TODO: Optimize imports
import { Button, CardActionArea, CardActions, List, ListItem, Paper, Typography } from '@mui/material'
import ALevelRow from './LevelSelectionItem/ALevelRow'
import MeasureSelectionSummaryFragment from './MeasureSelectionItem/MeasuresSelectionSummaryFragment'
import LevelSelectionSummaryFragment from './LevelSelectionItem/LevelSelectionSummaryFragment'

import main from '../../SparqlQueryGeneration/SparqlQueryGeneration'

const SelectionDockingWindow = ({measures, levels, aboxRef, dataset, setsparqlQueryData, setQueryView, setqueryResultView, onQueryUpload, onQueryGeneration, selectedLevels,changeSelectedLevels,removeSelectedAggFunc}) => {
    const validateData = () => {
        return measures.length && levels.length;
    }

    const [loading, setLoading] = useState(!validateData())

    const getQueryResult = async()=>{
        setLoading(true)
        const newSparqlQuery = await main({measures, levels, dataset})
        setsparqlQueryData(newSparqlQuery)
        setqueryResultView(true)
        setLoading(false)
    }


    const getQuery = async () => {
        setLoading(true)

        // const db = getFirestore()
        // Collection > Documents : Upload data
        // if(validateData()) {
        //     const docID = await addDoc(collection(db, 'query_data'), {measures, levels, dataset})

        //     const req = await fetch(`/api/generate_query?docID=${docID.id}`)
        //     const data = await req.json()

        //     // TODO: Show the query and run the query on click
        //     const queryID = await addDoc(collection(db, 'queries'), data)
        //     onQueryUpload(queryID.id)
        //     onQueryGeneration(data)
            
        //     console.log("Deleting temporary doc >", docID.id)
        //     deleteDoc(doc(db, 'query_data', docID.id))
        // } else {
        //     console.log("Cannot upload empty data!")
        // }

        const newSparqlQuery = await main({measures, levels, dataset})
        setsparqlQueryData(newSparqlQuery)
        // console.log(newsp)
        setQueryView(true)
        setLoading(false)
    }

    useEffect(() => {
        // Do nothing
        // console.log("Selection DW measures >", measures)
        // console.log("Selection DW levels >", levels)     
        setLoading(!validateData())   
    }, [measures, levels])

    return (
        <Card sx={{
            height: '100%',
            width: '100%',
        }}>
            {/* Bad practice, use card header instead */}
            <CardHeader sx={{color:'#08094f',paddingBottom:'0px'}} title='Selection Summary'/>
            
            {/* Seperate the components. */}
            <CardContent>
                <MeasureSelectionSummaryFragment 
                data={measures} 
                onRemove={removeSelectedAggFunc}/>

                <LevelSelectionSummaryFragment data={levels}/>
            </CardContent>

            <CardActions sx={{justifyContent: 'space-between'}}>
                <Button onClick={getQuery} variant='contained' disabled={loading}>
                    Get SPARQL Query
                </Button>
                <Button  variant='contained' onClick={getQueryResult}  disabled={loading}>
                    Get Query Result
                </Button>
            </CardActions>
            
        </Card>
    )
}

export default SelectionDockingWindow