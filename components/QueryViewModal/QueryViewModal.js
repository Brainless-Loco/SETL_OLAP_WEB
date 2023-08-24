import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import QueryViewTab from '../Tabs/QueryViewTab'

export default function QuerytViewModal({data, modalOpen,setmodalOpen}) {

    // const [modalOpen, setmodalOpen] = useState(false)

  return (
    <Dialog sx={{ maxWidth: '1300px', margin: 'auto' }} fullWidth maxWidth='xl' open={modalOpen}>
            <DialogTitle sx={{height:'50px'}}>Sparql Query</DialogTitle>
            <DialogContent sx={{ minHeight: '100%' }}>
                <QueryViewTab queryData={data} />
            </DialogContent>

            <DialogActions sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Button sx={{marginLeft:'auto',fontSize:'17px',backgroundColor:''}} onClick={()=>{setmodalOpen(false)}}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
  )
}
