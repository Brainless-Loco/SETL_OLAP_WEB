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
        // console.log(cuboid)
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
        + `SELECT DISTINCT ?parent ?child <${this.source}>`
        +"WHERE {"
        + "?step a qb4o:HierarchyStep. \n"
        + "?step qb4o:inHierarchy <" + hierarchy.sub + ">. \n"
        + "?step qb4o:parentLevel ?parent. \n"
        + "?step qb4o:childLevel ?child. \n"
        + "}";  

        await this.executeQuery(sparql)
    }
    
    extractData() {
        const bindings = this.resultSet.results.bindings
        // console.log(bindings)

        if(this.isCuboid){
            bindings.forEach((item, idx) => {
                console.log(item['o'].value)
                this.levelArray.push(new Level(item['o'].value, null, null))
                this.levelArray[idx].extractName()
            })
        }
        else{
            let parent = new Map()
            let child = new Map()
            bindings.forEach((item,idx)=>{
                parent.set(item.child.value,item.parent.value)
                child.set(item.parent.value, item.child.value)
            })

            let withoutParentLevel = ''

            let goOn = true
            bindings.forEach((item,idx)=>{
                if(parent.has(item.parent.value)==false && goOn == true){
                    withoutParentLevel = item.parent.value
                    goOn = false
                }
            })
            goOn = true
            while(goOn==true){
                this.levelArray.push(new Level(withoutParentLevel, null, null))
                this.levelArray[this.levelArray.length-1].extractName()
                if(child.has(withoutParentLevel)==true){
                    withoutParentLevel = child.get(withoutParentLevel)
                }
                else{
                    goOn=false
                }
            }
        }
    }
    
    getLevelArray() {
        return this.levelArray
    }

    setCubeName(cubeName) { this.cubeName = cubeName }
}