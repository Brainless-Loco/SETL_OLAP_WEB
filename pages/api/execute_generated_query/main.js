import { doc, getDoc, collection, getDocs, getFirestore, addDoc } from 'firebase/firestore'
import main from './main'

const handler = async (req, res) => {
    const {queryID, fileName} = req.query
    
    const db = getFirestore()
    const docSnap = await getDoc(doc(db, 'queries', queryID))

    const filePathPromise = await fetch(`http://localhost:3000/api/get_file_path?fileName=${fileName}&fileType=abox`)
    const filePath = await filePathPromise.text();
    if(!filePathPromise.ok) {
        // console.log("File not found");
        res.status(404).send(`Cannot find reference to file ${fileName} .`)
        return
    }

    if(docSnap.exists()) {
        // Execute query here
        
    } else {
        res.status(404).send(`Cannot find reference to document ${fileName} .`)
    }
}

export default handler