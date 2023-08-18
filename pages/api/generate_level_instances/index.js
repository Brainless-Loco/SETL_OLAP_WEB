import main from "./main";

const handler = async (req, res) => {
    // Code
    const { aboxIRI, level, levelProp } = req.query
    console.log('A Box iri', aboxIRI)
    
    const data = await main(aboxIRI, level, levelProp)
    res.status(200).json(data)
}

export default handler