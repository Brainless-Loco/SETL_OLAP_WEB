module.exports = class Cube {
  constructor(sub, pred, obj){
    this.sub = sub;
    this.pred = pred;
    this.obj = obj;
    this.name = ''
    this.prefix = ''
    this.dimensionList = []
  }

  setSubject(sub) { this.sub = sub }
  setPredicate(pred) { this.pred = pred }
  setObject(obj) { this.obj = obj }
  extractName() {
    const arr = this.sub.split('#')
    this.name = arr[1]
    this.prefix = arr[0]
  }

  setMeasureArray(measureArray) {
    this.measureArray = [...measureArray]
    console.log("Cube measure array", this.measureArray)
  }

  setDimensionList(dimensionList) { this.dimensionList = dimensionList }
  getDimensionList() { return this.dimensionList }
}
  
