const Cube = require('./Cube')
const SparqlClient = require('../sparql_client/SparqlClient')
const Dataset = require('./Dataset')
const { default: getIPV4 } = require('../sparql_client/LocalIP')
const QueryEngine = require('@comunica/query-sparql').QueryEngine

module.exports = class CubeFactory {
    constructor(source, dataset) {
        this.source = source ?? `http://${getIPV4()}:8890/POPTBOX`
        this.dataset = dataset ?? new Dataset()
        this.resultSet = []
        this.cube = new Cube()
        this.isCuboid = false
    }

    // Extract cube from the tbox of a dataset, no endpoints by default
    async extractOlapDatasetCube(endPoint) {
        // Case 1: No remote endpoint
        if(!Boolean(endPoint)) {
            this.resultSet = await this.getDefaultResultSet()
        }
        // TODO Case 2: Has remote endpoint (CubeFactory)
    }

    // Extract data here
    extractData() {
        // Extract data from the result set accordingly

        // Extracting cube
        this.isCuboid = false      // If it is a cuboid, then extract the levels
        const bindings = this.resultSet.results.bindings

        // console.log(bindings)

        bindings.forEach(item => {

            const sub = item['obj'].value
            // const pred = item['pred'].value
            // const obj = item['obj'].value

            this.cube.setSubject(sub)
            // this.cube.setPredicate(pred)
            // this.cube.setObject(obj)
            this.cube.name = sub;

            // if(pred.includes('isCuboidOf')) {
            //     this.isCuboid = true
            //     // console.log('Cuboid found')
            //     return
            // }
        })

        return this.isCuboid
    }

    async getDefaultResultSet() {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT * FROM <${this.source}> WHERE { <${this.dataset.iri}> a qb:DataSet.\n`
        + `<${this.dataset.iri}> qb:structure ?cube.\n`
        + "?cube a qb:DataStructureDefinition.\n"
        + "?cube qb4o:isCuboidOf ?obj.\n"
        + "}"

        // console.log(sparql)

        const client = new SparqlClient()
        const result = await client.query(sparql)
        
        return result.data
    }

    getCube() { return this.cube }
}