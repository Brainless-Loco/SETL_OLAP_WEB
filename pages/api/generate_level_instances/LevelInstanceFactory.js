const { QueryEngine } = require("@comunica/query-sparql")
const { default: getIPV4 } = require("../sparql_client/LocalIP")
const SparqlClient = require("../sparql_client/SparqlClient")
const LevelInstance = require("./LevelInstance")

module.exports = class LevelInstanceFactory {
    constructor(source) {
        this.source = source ?? `http://${getIPV4()}:8890/POPABOX`
        this.level = ''
        this.levelProp = ''
        this.resultSet = []
        this.levelInstanceArray = []
    }

    async fetchLevelInstances(level, levelProp) {
        this.level = level
        this.levelProp = levelProp

        // console.log('source', this.source)
        // console.log("Level", level)
        // console.log("Level Property", levelProp)

        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	rdfs:	<http://www.w3.org/2000/01/rdf-schema#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT DISTINCT ?value FROM <${this.source}> WHERE {\n`
        + "?sub qb4o:memberOf <"+ level +">.\n"
        + "?sub <"+ levelProp +"> ?value.\n"
        + "} GROUP BY ?value \n"
        + "ORDER BY ?value" 
        
        await this.executeQuery(sparql)
    }

    async executeQuery(sparql) {
        // console.log("API > get_level_instance > Executing query", sparql)

        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data

        // console.log("API > get_level_instance", "Done said good bye")
    }

    extractData() {
        const bindings = this.resultSet.results.bindings

        bindings.forEach((item, idx) => {
            const ins = new LevelInstance(item['value'].value, 'inLevel', this.level)
            ins.extractName()
            this.levelInstanceArray.push(ins)
        })
    }

    getLevelInstanceArray() {
        return this.levelInstanceArray
    }
}