class Cuboid{
    constructor(sub,pred,obj,isCuboidOfType,isCuboidOf){
        this.sub = sub;
        this.pred = pred;
        this.obj = obj;
        this.isCuboidOfType = isCuboidOfType;
        this.isCuboidOf = isCuboidOf;
    }
    hasDimensions = [
        (
            type,
            ids = []
        )
    ] //array of arrayS of tuples<hasDimensionType (eg: qb4o:hasDimension ), DimensionId(s)>
}