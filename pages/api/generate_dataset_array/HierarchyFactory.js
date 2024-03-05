const { default: getIPV4 } = require("../sparql_client/LocalIP")
const SparqlClient = require("../sparql_client/SparqlClient")
const Dimension = require("./Dimension")
const Hierarchy = require('./Hierarchy')

module.exports = class HeirarchyFactory {
    constructor(source, dataset, dimension) {
        this.source = source ?? `http://${getIPV4()}:8890/POPTBOX`
        this.dimension = dimension ?? new Dimension()
        this.dataset = dataset
        this.resultSet = []
        this.hierarchyList = []
    }

    async fetchDimensionHierarchyList() {

        const sparql =  "PREFIX qb: <http://purl.org/linked-data/cube#>\r\n"
            + "PREFIX qb4o: <http://purl.org/qb4olap/cubes#>\r\n"
            + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\r\n"
            + "SELECT distinct ?hierarchy\n"
            + "from <"+ this.source + ">\n"
            + "WHERE {\n"
            + "<"+ this.dataset.iri+"> qb:structure ?cuboid.\n"
            + "?cuboid qb4o:isCuboidOf ?cube.\n"
            + "?cuboid qb:component ?component.\n"
            + "?component qb4o:level ?level .\n"
            + "?hierarchy qb4o:hasLevel ?level.\n"
            + "?hierarchy qb4o:inDimension <"+this.dimension.sub+"> .\n"
            + "}"

        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
        return this.resultSet
    }
    
    extractHierarchies() {
        const obj = "http://purl.org/qb4olap/cubes#Hierarchy"
        const bindings = this.resultSet.results.bindings

        bindings.forEach(item => {
            const sub = item['hierarchy'].value
            this.hierarchyList.push(new Hierarchy(sub, 'a', obj))
        })
    }
    
    getHierarchyList = () => { return this.hierarchyList }
}