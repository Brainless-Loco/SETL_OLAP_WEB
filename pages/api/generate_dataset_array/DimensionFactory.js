const { default: getIPV4 } = require('../sparql_client/LocalIP')
const SparqlClient = require('../sparql_client/SparqlClient')
const Cube = require('./Cube')
const Dataset = require('./Dataset')
const Dimension = require('./Dimension')
const Level = require('./Level')
const QueryEngine = require('@comunica/query-sparql').QueryEngine

module.exports = class DimensionFactory {
    constructor(source, dataset, cube, level) {
        this.source = source ?? `http://${getIPV4}:8890/POPTBOX`
        this.dataset = dataset
        this.cube = cube ?? new Cube()
        this.resultSet = []
        this.dimension = new Dimension()
        this.level = new Level()
    }

    async extractOlapDimension(endPoint) {
        // Case 1: No remote endpoint
        if(!Boolean(endPoint)) {
            this.resultSet = await this.getDefaultResultSet()
        }
        // TODO Case 2: Has remote endpoint (CubeFactory)
    }

    async extractDimensionFromLevel() {
        // Code
        const sparql = "PREFIX qb: <http://purl.org/linked-data/cube#>\n"
        + "PREFIX dct: <http://purl.org/dc/terms/>\n"
        + "PREFIX qb4o: <http://purl.org/qb4olap/cubes#>\n"
        + `SELECT * FROM <${this.source}> WHERE {\n`
        + "?step a qb4o:HierarchyStep.\n"
        + "?step qb4o:parentLevel ?parent.\n"
        + "?step qb4o:childLevel ?child.\n"
        + "?step qb4o:inHierarchy ?hierarchy.\n"
        + "?hierarchy a qb4o:Hierarchy.\n"
        + "?hierarchy qb4o:inDimension ?dim.\n"
        + "}"

        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
        return result.data
    }

    extractLevelDim() {
        const tempset = new Set()
        const obj = "http://purl.org/qb4olap/cubes#dimension"
        
        const bindings = this.resultSet.results.bindings

        // console.log(bindings)

        bindings.forEach(item => {
            let sub = item['dim'].value
            tempset.add(sub)
        })

        this.resultSet = []
        tempset.forEach(item => {
            this.resultSet.push(new Dimension(item, 'a', obj))
        })
    }

    // Extract data here
    extractDimension() {
        let tempset = []
        const obj = "http://purl.org/qb4olap/cubes#dimension"


        let alreadyTaken = new Map()

        const bindings = this.resultSet.results.bindings

        // console.log(bindings)

        bindings.forEach(item => {
            let sub = item['dimension'].value
            if(!alreadyTaken.has(sub)){
                let tempDimension = new Dimension(sub,'a',obj)
                tempset.push(tempDimension)
                alreadyTaken.set(sub,4444);
            }

        })
        this.resultSet = tempset
    }

    async getDefaultResultSet() {

        const sparql = "PREFIX qb: <http://purl.org/linked-data/cube#>\r\n"
                + "PREFIX qb4o: <http://purl.org/qb4olap/cubes#>\r\n"
                + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n"
                + "SELECT distinct ?dimension\n"
                + "from <"+ this.source + ">\n"
                + "WHERE {\n"
                + "<"+ this.dataset.iri+"> qb:structure ?cuboid.\n"
                + "?cuboid qb4o:isCuboidOf ?cube.\n"
                + "?cuboid qb:component ?component.\n"
                + "?component qb4o:level ?level .\n"
                + "?hierarchy qb4o:hasLevel ?level.\n"
                + "?hierarchy qb4o:inDimension ?dimension .\n"
                + "}"

        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
        

        // console.log(result.data)

        return result.data
    }
    
    getDimensionArray = () => { return this.resultSet }
}