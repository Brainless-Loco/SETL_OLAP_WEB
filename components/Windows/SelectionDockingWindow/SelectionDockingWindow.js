import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useState } from 'react'
// TODO: Optimize imports
import { Button, CardActions } from '@mui/material'
import MeasureSelectionSummaryFragment from './MeasureSelectionItem/MeasuresSelectionSummaryFragment'
import LevelSelectionSummaryFragment from './LevelSelectionItem/LevelSelectionSummaryFragment'

import main from '../../SparqlQueryGeneration/SparqlQueryGeneration'

const SelectionDockingWindow = ({measures, levels, dataset, setsparqlQueryData, setQueryView, setqueryResultView, removeSelectedAggFunc,aboxIRI,handleRemoveSelectedLevel}) => {
    const validateData = () => {
        return measures.length && levels.length;
    }

    const [loading, setLoading] = useState(!validateData())

    const getQueryResult = async()=>{
        setLoading(true)
        const newSparqlQuery = await main({measures, levels, dataset, aboxIRI})
        setsparqlQueryData(newSparqlQuery)
        setqueryResultView(true)
        setLoading(false)
    }


    const getQuery = async () => {
        setLoading(true)

        const newSparqlQuery = await main({measures, levels, dataset,aboxIRI})
        setsparqlQueryData(newSparqlQuery)
        setQueryView(true)
        setLoading(false)
    }

    useEffect(() => {
        setLoading(!validateData())   
    }, [measures, levels])

    return (
        <Card sx={{
            height: '100%',
            width: '100%',
        }}>
            <CardHeader sx={{color:'#08094f',paddingBottom:'0px',paddingTop:'5px'}} title='Selection Summary'/>
            
            <CardContent>
                <MeasureSelectionSummaryFragment 
                data={measures} 
                onRemove={removeSelectedAggFunc}/>

                <LevelSelectionSummaryFragment handleRemoveSelectedLevel={handleRemoveSelectedLevel} data={levels}/>
            </CardContent>

            <CardActions sx={{justifyContent: 'space-evenly'}}>
                <Button className='getQueryBtn' onClick={getQuery} variant='contained' disabled={loading}>
                    Get SPARQL Query
                </Button>
                <Button className='getQueryBtn' variant='contained' onClick={getQueryResult}  disabled={loading}>
                    Get Query Result
                </Button>
            </CardActions>
            
        </Card>
    )
}

export default SelectionDockingWindow