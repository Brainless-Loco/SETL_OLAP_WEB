module.exports = class Level {
    constructor(sub,pred,obj,hierarchy){
        this.sub = sub
        this.pred = pred;
        this.obj = obj;
        this.name = ''
        this.prefix = ''
        this.levelAttributes = []
        this.resultSet = []
        this.hierarchy = hierarchy
        this.serialForRollUp = []
    }

    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }

    setLevelAttributes(levelAttributesArray) { this.levelAttributes = levelAttributesArray }
    setSerialForRollUp (serial){this.serialForRollUp = serial}
}
  