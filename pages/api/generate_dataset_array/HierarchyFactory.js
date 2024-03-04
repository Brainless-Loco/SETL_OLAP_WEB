const { default: getIPV4 } = require("../sparql_client/LocalIP")
const SparqlClient = require("../sparql_client/SparqlClient")
const Dimension = require("./Dimension")
const Hierarchy = require('./Hierarchy')

module.exports = class HeirarchyFactory {
    constructor(source, dimension) {
        this.source = source ?? `http://${getIPV4()}:8890/POPTBOX`
        this.dimension = dimension ?? new Dimension()
        this.resultSet = []
        this.hierarchyList = []
    }

    async fetchDimensionHierarchyList() {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
            + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
            + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
            + `SELECT ?x FROM <${this.source}>` 
            + "WHERE { <" + this.dimension.sub + "> a qb:DimensionProperty."
            + "<" + this.dimension.sub + "> qb4o:hasHierarchy ?x.}"

        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
        return this.resultSet
    }
    
    extractHierarchies() {
        const obj = "http://purl.org/qb4olap/cubes#Hierarchy"
        const bindings = this.resultSet.results.bindings

        bindings.forEach(item => {
            const sub = item['x'].value
            this.hierarchyList.push(new Hierarchy(sub, 'a', obj))
        })
    }
    
    getHierarchyList = () => { return this.hierarchyList }
}