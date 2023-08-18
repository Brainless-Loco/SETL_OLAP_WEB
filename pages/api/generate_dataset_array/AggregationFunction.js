module.exports = class AggregationFunction{
    constructor(sub, pred, obj) {
        this.sub = sub
        this.pred = pred
        this.obj = obj
        this.prefix = ''
        this.name = ''
    }

    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }
}