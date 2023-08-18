module.exports = class Hierarchy {
    constructor(sub,pred,obj,inDimension){
        this.sub = sub;
        this.pred = pred;
        this.obj = obj;
        this.name = ''
        this.prefix = ''
        this.hierarchyStep = []
    }
    setSubject(sub) { this.sub = sub }
    setPredicate(pred) { this.pred = pred }
    setObject(obj) { this.obj = obj }
    setHierarchyStep(hierarchyStep) {this.hierarchyStep = hierarchyStep}
    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }
  }
  