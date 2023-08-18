const { QueryEngine } = require("@comunica/query-sparql")
const SparqlClient = require("../sparql_client/SparqlClient")
const Level = require("./Level")

module.exports = class LevelFactory {
    constructor(source) {
        this.source = source ?? "http://localhost:8890/POPTBOX"
        this.resultSet = []
        this.levelArray = []
        this.isCuboid = false
    }

    
    async fetchCuboidLevel(cuboid) {
        this.isCuboid = true
        console.log(cuboid)
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT DISTINCT ?o FROM <${this.source}> WHERE { <${cuboid.sub}> a qb:DataStructureDefinition.\n`
        + `<${cuboid.sub}> qb:component ?s.\n`
        + "?s qb4o:level ?o.\n"
        + "}"
        
        await this.executeQuery(sparql)
    }
    
    async executeQuery(sparql) {
        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
    }

    async fetchHierarchyStepLevels(hierarchy) {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	rdfs:	<http://www.w3.org/2000/01/rdf-schema#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT * FROM <${this.source}>` + "WHERE {"
        + "?heir a qb4o:Hierarchy. \n"
        + "?heir qb4o:hasLevel ?level. \n"
        + `FILTER(?heir=<${hierarchy.sub}>)`
        + "}"

        await this.executeQuery(sparql)
    }
    
    extractData() {
        const bindings = this.resultSet.results.bindings
        bindings.forEach((item, idx) => {
            if(this.isCuboid)
                this.levelArray.push(new Level(item['o'].value, null, null))
            else this.levelArray.push(new Level(item['level'].value, null, null))

            this.levelArray[idx].extractName()
        })
    }
    
    getLevelArray() {
        return this.levelArray
    }

    setCubeName(cubeName) { this.cubeName = cubeName }
}