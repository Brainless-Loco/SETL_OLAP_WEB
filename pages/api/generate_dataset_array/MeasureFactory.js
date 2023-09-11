const { QueryEngine } = require("@comunica/query-sparql")
const { default: getIPV4 } = require("../sparql_client/LocalIP")
const SparqlClient = require("../sparql_client/SparqlClient")
const AggregationFunction = require("./AggregationFunction")
const Level = require("./Level")
const Measure = require("./Measure")

module.exports = class MeasureFactory {
    constructor(source, cube) {
        this.source = source ?? `http://${getIPV4}:8890/POPTBOX`
        this.resultSet = []
        this.measureArray = []
        this.cube = cube
    }
    
    async executeQuery(sparql) {
        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
    }

    async fetchMeasureArray() {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT * FROM <${this.source}> WHERE { <` + this.cube.sub + "> a qb:DataStructureDefinition.\n"
        + "<" + this.cube.sub + "> qb:component ?s.\n"
        + "?s qb:measure ?o.\n"
        + "?s qb4o:aggregateFunction ?f.\n"
        + "}"

        await this.executeQuery(sparql)
    }
    
    async extractMeasures() {
        const hash = new Map()

        const bindings = this.resultSet.results.bindings

        bindings.forEach((item, idx) => {
            const measure = item['o'].value
            const func = item['f'].value
            const aggFun = new AggregationFunction(func, null, null)
            aggFun.extractName()
            if(!Boolean(hash.get(measure))) hash.set(measure, [])
            hash.set(measure, [...hash.get(measure), aggFun])
        })

        let idx = 0
        const temp = []
        hash.forEach((val, key) => {
            temp.push(new Measure(key, null, null, val))
            temp[idx++].extractName()
        })

        for(let i = 0 ; i < idx ; i++) {
            const range = await this.getMeasureRange(temp[i])
            temp[i].range = range
        }

        this.measureArray = temp
        // console.log("Measure Array", this.measureArray)
    }

    async getMeasureRange(measure) {
        // Code
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	rdfs:	<http://www.w3.org/2000/01/rdf-schema#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT DISTINCT ?range FROM <${this.source}>`
        + "WHERE {"
        + "<" + measure.sub + "> a qb:MeasureProperty."
        + "<" + measure.sub + "> rdfs:range ?range."
        + "}"
    
        const result = await this.executeQueryForRange(sparql)
    
        // Extract range
        let range = ''
        const bindings = result.results.bindings
        bindings.forEach(item => {
            range = item['range'].value
            return
        })
        return range
    }
    
    async executeQueryForRange(sparql) {
        // console.log("API > generate_query > getMeasureRange", "Executing query")
    
        const client = new SparqlClient()
        const result = await client.query(sparql)
    
        // console.log("API > generate_query > getMeasureRange", "Done said good bye")
        return result.data
    }

    setCubeName(cubeName) { this.cubeName = cubeName }
    getMeasureArray() { return this.measureArray }
}