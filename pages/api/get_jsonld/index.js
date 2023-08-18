import { firebaseConfig } from '../../../firebase/firebaseConfig'

const storage = require('firebase/storage')
const fs = require('fs')
const app = require('firebase/app')

if(Boolean(app) || !app.getApp()) app.initializeApp(firebaseConfig)

const handler = async (req, res) => {
    const { file_name } = req.query
    const dir = './temp/'

    // Download file from firebase storage
    const storageRef = storage.getStorage()
    const pathRef = storage.ref(storageRef, 'jsonld/' + file_name)
    storage.getBytes(pathRef).then((snapshot) => {
        // Received an ArrayBuffer
        // Decode the Buffer
        // Parse the buffer as JSON
        const decoder = new TextDecoder()
        const view = new Int8Array(snapshot)
        const decodedText = decoder.decode(view)
        
        // Make new temporary directory if it doesn't exist.
        if(!fs.existsSync(dir)) fs.mkdirSync(dir)
        // Write to directory
        fs.writeFileSync(dir + file_name, decodedText)
        res.status(200).json({message: 'Succesfully written to file.'})
    }).catch(error => {
        res.status(400).json(error)
    })
}

export default handler