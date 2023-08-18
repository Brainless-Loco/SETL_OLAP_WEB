module.exports = class Level {
    constructor(sub,pred,obj){
        this.sub = sub
        this.pred = pred;
        this.obj = obj;
        this.name = ''
        this.prefix = ''
        this.levelAttributes = []
        this.resultSet = []
    }

    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }

    setLevelAttributes(levelAttributesArray) { this.levelAttributes = levelAttributesArray }
}
  