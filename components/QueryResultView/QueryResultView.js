import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import QueryResultsTab from '../Tabs/QueryResultsTab'

export default function QueryResultView({data, aboxIRI, modalOpen, setmodalOpen}) {
    return (
        <Dialog sx={{ maxWidth: '1300px', margin: 'auto' }} fullWidth maxWidth='xl' open={modalOpen}>
                <DialogTitle sx={{height:'50px'}}>Query Result</DialogTitle>
                <DialogContent sx={{ minHeight: '100%' }}>
                    <QueryResultsTab data={data} aboxIRI={aboxIRI} modalOpen={modalOpen}/>
                </DialogContent>

                <DialogActions sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button sx={{marginLeft:'auto',fontSize:'17px',backgroundColor:''}} onClick={()=>setmodalOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
    )
}
