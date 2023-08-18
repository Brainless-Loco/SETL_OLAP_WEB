const { QueryEngine } = require("@comunica/query-sparql")
const { default: getIPV4 } = require("../sparql_client/LocalIP")
const SparqlClient = require("../sparql_client/SparqlClient")
const Level = require("./Level")
const LevelAttribute = require("./LevelAttribute")

module.exports = class LevelAttributeFactory {
    constructor(source) {
        this.source = source ?? `http://${getIPV4()}:8890/POPTBOX`
        this.resultSet = []
        this.levelAttributesArray = []
    }

    async fetchLevelAttributes(level) {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT ?s FROM <${this.source}> WHERE {<${level.sub}> qb4o:hasAttribute ?s.\r\n}`

        await this.executeQuery(sparql)
    }

    async executeQuery(sparql) {
        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
    }

    extractData() {
        const bindings = this.resultSet.results.bindings
        bindings.forEach((item, idx) => {
            this.levelAttributesArray.push(new LevelAttribute(item['s'].value, null, null))

            this.levelAttributesArray[idx].extractName()
        })
    }

    getLevelAttributesArray() { return this.levelAttributesArray }
}