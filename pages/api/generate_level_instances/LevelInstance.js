module.exports = class LevelInstance {
    constructor(sub, pred, obj) {
        this.sub = sub
        this.pred = pred
        this.obj = obj
        this.name = ''
        this.prefix = ''
    }

    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }
}