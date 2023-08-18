const SparqlClient = require("../sparql_client/SparqlClient")

const handler = async (req, res) => {
    const client = new SparqlClient()
    const sparql = `
        SELECT distinct ?g 
        WHERE {
            GRAPH ?g {?s ?p ?o}
        }
    `

    const result = await client.query(sparql)
    const data = result.data.results
    const graphs = data.bindings
    const graphNames = []
    graphs.forEach(graph => {
        graphNames.push(graph['g'].value)
    })
    
    res.status(200).json(
        graphNames.filter(item => {
            return item.includes('localhost')
        })
    )
}

export default handler