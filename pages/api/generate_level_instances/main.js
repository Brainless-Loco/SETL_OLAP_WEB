import LevelInstanceFactory from "./LevelInstanceFactory"

const main = async (aboxIRI, level, levelProp) => {
    // Code
    const lvlInsFact = new LevelInstanceFactory(aboxIRI)
    await lvlInsFact.fetchLevelInstances(level, levelProp)
    lvlInsFact.extractData()
    const data = lvlInsFact.getLevelInstanceArray()
    return data
}

export default main