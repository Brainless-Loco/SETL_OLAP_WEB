const { default: getIPV4 } = require('../sparql_client/LocalIP')
const SparqlClient = require('../sparql_client/SparqlClient')
const Cube = require('./Cube')
const Dataset = require('./Dataset')
const Dimension = require('./Dimension')
const Level = require('./Level')
const QueryEngine = require('@comunica/query-sparql').QueryEngine

module.exports = class DimensionFactory {
    constructor(source, cube, level) {
        this.source = source ?? `http://${getIPV4}:8890/POPTBOX`
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
        const sparql = "PREFIX qb: <http://purl.org/linked-data/cube#>"
        + "PREFIX dct: <http://purl.org/dc/terms/>"
        + "PREFIX qb4o: <http://purl.org/qb4olap/cubes#>"
        + `SELECT * FROM <${this.source}> WHERE {`
        + "?step a qb4o:HierarchyStep."
        + "?step qb4o:parentLevel ?parent."
        + "?step qb4o:childLevel ?child."
        + "?step qb4o:inHierarchy ?hierarchy."
        + "?hierarchy a qb4o:Hierarchy."
        + "?hierarchy qb4o:inDimension ?dim."
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

        const bindings = this.resultSet.results.bindings
        bindings.forEach(item => {
            let sub = item['o'].value
            let tempDimension = new Dimension(sub,'a',obj)
            tempset.push(tempDimension)

        })
        this.resultSet = tempset
    }

    async getDefaultResultSet() {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
				+ "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
				+ "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
				+ `SELECT DISTINCT ?o FROM <${this.source}> WHERE { <${this.cube.sub}> a qb:DataStructureDefinition.\n`
				+ "<" + this.cube.sub + "> qb:component ?s.\n"
				+ "?s qb4o:dimension ?o.\n"
				+ "}"

        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
        return result.data
    }
    
    getDimensionArray = () => { return this.resultSet }
}