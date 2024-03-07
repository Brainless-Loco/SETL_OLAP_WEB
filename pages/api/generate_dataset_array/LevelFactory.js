const { QueryEngine } = require("@comunica/query-sparql")
const SparqlClient = require("../sparql_client/SparqlClient")
const Level = require("./Level")

module.exports = class LevelFactory {
    constructor(source, dataset) {
        this.source = source ?? "http://localhost:8890/POPTBOX"
        this.dataset = dataset
        this.resultSet = []
        this.levelArray = []
        this.isCuboid = false
        this.cuboidLevels = []
    }

    
    async fetchCuboidLevels(dataset) {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT DISTINCT ?o FROM <${this.source}> WHERE {\n`
        + ` <${dataset.iri}> a qb:DataSet;\n`
        + `qb:structure ?cuboid.\n`
        + `?cuboid qb4o:isCuboidOf ?cube.\n`
        + `?cuboid ?component ?s.\n`
        + "?s qb4o:level ?o.\n"
        + "}"
        
        await this.executeQueryForCuboidLevels(sparql)
    }
    
    async executeQueryForCuboidLevels (sparql){
        const client = new SparqlClient()
        const result = await client.query(sparql)
        let tempResult = []
        const bindings = result.data.results.bindings
        bindings.forEach((item,idx)=>{
            tempResult.push(item.o.value)
        })
        this.cuboidLevels = tempResult
    }
    
    async executeQuery(sparql) {
        const client = new SparqlClient()
        const result = await client.query(sparql)
        this.resultSet = result.data
    }

    async fetchHierarchyStepLevels(hierarchy, dataset) {
        const sparql = "PREFIX qb:	<http://purl.org/linked-data/cube#>\r\n"
        + "PREFIX	owl:	<http://www.w3.org/2002/07/owl#>\r\n"
        + "PREFIX	rdfs:	<http://www.w3.org/2000/01/rdf-schema#>\r\n"
        + "PREFIX	qb4o:	<http://purl.org/qb4olap/cubes#>\r\n"
        + `SELECT DISTINCT ?parent ?child ?rollup\r\n`
        + `FROM <${this.source}>\r\n`
        + "WHERE {\n"
        + "?step a qb4o:HierarchyStep. \n"
        + "?step qb4o:inHierarchy <" + hierarchy.sub + ">. \n"
        + "?step qb4o:parentLevel ?parent. \n"
        + "?step qb4o:childLevel ?child. \n"
        + "?step qb4o:rollup ?rollup.\n"
        + "}";  
        
        // console.log(sparql)

        await this.executeQuery(sparql)
    }
    
    extractData(hierarchy) {
        const bindings = this.resultSet.results.bindings
        // console.log(bindings)

        let serial = []

        if(this.isCuboid){
            bindings.forEach((item, idx) => {
                this.levelArray.push(new Level(item['o'].value, null, null,hierarchy))
                this.levelArray[idx].extractName()
                serial.push([item['o'].value,''])
            })
        }
        else{
            let parent = new Map()
            let child = new Map()
            let rollUp = new Map()
            bindings.forEach((item,idx)=>{
                parent.set(item.child.value,item.parent.value)
                child.set(item.parent.value, item.child.value)
                rollUp.set(item.parent.value, item.rollup.value)
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
            let serialOn = true;
            while(goOn==true){
                this.levelArray.push(new Level(withoutParentLevel, null, null,hierarchy))
                if(serialOn) {
                    serial.push([withoutParentLevel, rollUp.get(withoutParentLevel)])
                    this.levelArray[this.levelArray.length-1].disabled = false
                }
                else{
                    this.levelArray[this.levelArray.length-1].disabled = true
                }
                if(this.checkIfCuboidLevel(this.levelArray[this.levelArray.length-1].sub)){
                    serialOn = false;
                }
                
                this.levelArray[this.levelArray.length-1].extractName()
                if(child.has(withoutParentLevel)==true){
                    withoutParentLevel = child.get(withoutParentLevel)
                }
                else{
                    goOn=false
                }
            }
        }
        serial = serial.reverse()
        // console.log(this.levelArray)
        // console.log(serial)
        this.levelArray.forEach((item)=>{
            item.setSerialForRollUp(serial)
        })
    }
    
    checkIfCuboidLevel = (sub)=>{
        if(this.cuboidLevels.includes(sub)) return true;
        return false;
    }

    getLevelArray() {
        return this.levelArray
    }

    getCuboidLevels(){
        return this.cuboidLevels
    }

    setCubeName(cubeName) { this.cubeName = cubeName }
}