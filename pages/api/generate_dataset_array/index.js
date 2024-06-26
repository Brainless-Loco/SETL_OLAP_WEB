import main from "./main"

const handler = async (req, res) => {
    // Code
    let { aboxIRI, tboxIRI,datasetIRI, datasetSchemaIri } = req.query
    
    if(!aboxIRI.length) aboxIRI = null
    if(!tboxIRI.length) tboxIRI = null
    if(!datasetIRI.length) datasetIRI = null

    if(!datasetSchemaIri.length) datasetSchemaIri = null
    // TODO: Config abox and tbox iri here

    const data = await main(aboxIRI, tboxIRI, datasetIRI, datasetSchemaIri)
    res.status(200).json(data)
}

export default handler