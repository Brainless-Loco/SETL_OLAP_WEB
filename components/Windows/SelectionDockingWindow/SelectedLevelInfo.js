module.exports = class SelectedLevelInfo {
    constructor(levelName, filteredCondition, propertyToBeViewed, instances) {
        this.filteredCondition=filteredCondition
        this.levelName = levelName
        this.propertyToBeViewed = propertyToBeViewed
        this.instances = instances
    }

    extractName() {
        const arr = this.sub.split('#')
        this.prefix = arr[0]
        this.name = arr[1]
    }
}