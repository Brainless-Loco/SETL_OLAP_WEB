import { doc, getDoc, collection, getDocs, getFirestore, addDoc, deleteDoc } from 'firebase/firestore'
import SparqlClient from '../sparql_client/SparqlClient'

const handler = async (req, res) => {
    const {sparql, aboxIRI} = req.query
    // const db = getFirestore()
    // const docSnap = await getDoc(doc(db, 'queries', queryID))

    // if(docSnap.exists()) {
        // // Code
        // const data = docSnap.data()
        // const {sparql} = data
        const q = sparql.replace('__FROM_TOKEN_GRAPH_IRI__', aboxIRI)

        

        const client = new SparqlClient()
        const result = await client.query(q)

        // console.log("API > execute_generate_qury > query", q)

        //console.log('Deleting query from the database >', queryID)
        //deleteDoc(doc(db, 'queries', queryID))
        res.status(200).json(result.data)
    // } else res.status(404).send("Error! No such query exists on the database!")
}

export default handler