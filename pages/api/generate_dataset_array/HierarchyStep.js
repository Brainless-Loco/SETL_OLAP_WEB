class HierarchyStep {
    constructor(sub,pred,obj,inHierarchy,childLevel, parentLevel) {
        this.sub = sub;
        this.pred = pred;
        this.obj = obj; 
        this.name = ''
        this.prefix = ''
        this.inHierarchy = inHierarchy; //tuple of (inHierarchyDefinition,inHierarchySub)
        this.childLevel = childLevel; //tuple of (childLevelDefinition,ChildLevelSub)
        this.parentLevel = parentLevel; //tuple of (parentLevelDefinition,parentLevelSub)
    }

    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }
}
  