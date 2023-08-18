import { getDownloadURL } from 'firebase/storage'
import { firebaseConfig } from '../../../firebase/firebaseConfig'

const storage = require('firebase/storage')
const fs = require('fs')
const app = require('firebase/app')

if(Boolean(app) || !app.getApp()) app.initializeApp(firebaseConfig)

const handler = async (req, res) => {
    const { fileName, fileType } = req.query

    const storageRef = storage.getStorage()
    const pathRef = storage.ref(storageRef, fileType + '/' + fileName)
    const fURL = await getDownloadURL(pathRef)
    if(!Boolean(pathRef.fullPath) || !pathRef.fullPath.length) 
        res.status(404).send(`Cannot find reference to file ${fileName} .`)
    else res.status(200).send(fURL)
}

export default handler