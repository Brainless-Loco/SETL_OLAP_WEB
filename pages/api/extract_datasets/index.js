import main from "./main"

const handler = async (req, res) => {
    // Code
    let { aboxIRI, tboxIRI } = req.query
    
    if(!aboxIRI.length) aboxIRI = null
    if(!tboxIRI.length) tboxIRI = null

    const data = await main(aboxIRI, tboxIRI)
    res.status(200).json(data)
}

export default handler