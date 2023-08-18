const AggregationFunction = require('./AggregationFunction')

module.exports = class Dimension {
    constructor(sub, pred, obj){
        this.sub = sub;
        this.pred = pred ?? 'a';
        this.obj = obj;
        this.name = ''
        this.prefix = ''
        this.hierarchyList = []
    }
    setSubject(sub) { this.sub = sub }
    setPredicate(pred) { this.pred = pred }
    setObject(obj) { this.obj = obj }
    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }

    getHierarchyList() { return this.hierarchyList }
    setHierarchyList(hierarchyList) { this.hierarchyList = hierarchyList }
  }
  