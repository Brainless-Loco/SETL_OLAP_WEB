import { doc, getDoc, collection, getDocs, getFirestore, addDoc } from 'firebase/firestore'
import main from './main'

const handler = async (req, res) => {
    // Collection > Documents : Example retrieval
    const { docID } = req.query

    const db = getFirestore()
    const docSnap = await getDoc(doc(db, 'query_data', docID))

    if(docSnap.exists()) {
        // Generate query here
        const query = await main(docSnap.data())
        // console.log("mydata"+docSnap.data())
        console.log(query)
        res.status(200).json(query)
    } else {
        res.status(404).send(`Cannot find reference to document ${docID} .`)
    }
}

export default handler