module.exports = class Measure{
    constructor(sub, pred, obj, aggrFuncArray){
        this.sub = sub;
        this.pred = pred;
        this.obj = obj;
        this.name = ''
        this.prefix = ''
        this.range = ''
        this.aggrFuncArray = aggrFuncArray
    }

    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }
}