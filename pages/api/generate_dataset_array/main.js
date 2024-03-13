import LevelAttributeFactory from './LevelAttributeFactory'
import MeasureFactory from './MeasureFactory'

const Cube = require('./Cube')
const CubeFactory = require('./CubeFactory')
const DatasetFactory = require('./DatasetFactory')
const Dataset = require('./Dataset')
const DimensionFactory = require('./DimensionFactory')
const HeirarchyFactory = require('./HierarchyFactory')
const LevelFactory = require('./LevelFactory')

const main = async (aboxIRI, tboxIRI, datasetIRI,datasetSchemaIri) => {

    const dataset = new Dataset(datasetIRI,datasetSchemaIri)
    const dsFact = new DatasetFactory(tboxIRI, [dataset])
    const datasetList = dsFact.getDatasetArray()
    
    for(let i = 0 ; i < datasetList.length ; i++) {
        await extractCube(tboxIRI, datasetList[i])
    }

    return datasetList;
}

const extractCube = async (tbox, dataset) => {
    // console.log("tbox "+tbox)
    // console.log("dataset "+dataset.iri)
    const cuFact = new CubeFactory(tbox , dataset)
    await cuFact.extractOlapDatasetCube()
    const isCuboid = cuFact.extractData()
    
    //console.log(cuFact.cube)
    let cube = cuFact.getCube()
    
    if(isCuboid) {
        // console.log('Over here, cuboid in action')
        // Set up dimensions
        const dimFact = new DimensionFactory(tbox, cube)
        await dimFact.extractDimensionFromLevel()
        dimFact.extractLevelDim()
        cube.setDimensionList(dimFact.getDimensionArray())

        // Extract Hierarchies from each dimension, extract hierarchy level
        const dimensions = dimFact.getDimensionArray()
        for(let i = 0 ; i < dimensions.length ; i++) {
            dimensions[i].extractName();
            await extractHierarchyList(tbox, dimensions[i])
            await extractHierarchyStepLevel(tbox, dimensions[i].getHierarchyList())
        }

        // Extract and set levels to proper dimension
        // await extractCuboidLevels(tbox, cube)
    } 
    else {
        // Extract dimension from cube
        const dimFact = new DimensionFactory(tbox, dataset, cube, null)
        await dimFact.extractOlapDimension(null)
        dimFact.extractDimension()
        cube.setDimensionList(dimFact.getDimensionArray())


        // Extract Hierarchies from each dimension, extract hierarchy level
        const dimensions = dimFact.getDimensionArray()
        for(let i = 0 ; i < dimensions.length ; i++) {
            dimensions[i].extractName();
            await extractHierarchyList(tbox,dataset, dimensions[i])
            await extractHierarchyStepLevel(tbox, dataset, dimensions[i].getHierarchyList())
        }
        // console.log(dimFact.getDimensionArray())
    }
    
    cube.extractName()
    await extractMeasures(tbox, cube, dataset)
    dataset.setCube(cube)
}

const extractCuboidLevels = async (tbox, dataset) => {
    const lvlFact = new LevelFactory(tbox)
    await lvlFact.fetchCuboidLevels(dataset)
    // lvlFact.extractData()

    //console.log(lvlFact.getLevelArray())
}

const extractHierarchyStepLevel = async (tbox, dataset, hierarchyList) => {
    for(let i = 0 ; i < hierarchyList.length ; i++) {
        hierarchyList[i].extractName()
        await extractHierarchyStepLevelList(tbox, dataset, hierarchyList[i])
    }
}

const extractHierarchyStepLevelList = async (tbox, dataset, hierarchy) => {
    const lvlFact = new LevelFactory(tbox, dataset)
    lvlFact.fetchCuboidLevels(dataset)
    await lvlFact.fetchHierarchyStepLevels(hierarchy, dataset)
    lvlFact.extractData(hierarchy.sub)
    const levels = lvlFact.getLevelArray();

    for(let i = 0 ; i < levels.length ; i++){
        await extractLevelAttributes(tbox, levels[i])
    }

    hierarchy.setHierarchyStep(levels)
}

const extractLevelAttributes = async (tbox,  level) => {
    const laFact = new LevelAttributeFactory(tbox)
    await laFact.fetchLevelAttributes(level)
    laFact.extractData()
    level.setLevelAttributes(laFact.getLevelAttributesArray())
}

const extractHierarchyList = async (tbox, dataset, dimension) => {
    const hierFact = new HeirarchyFactory(tbox,dataset, dimension)
    await hierFact.fetchDimensionHierarchyList()
    hierFact.extractHierarchies()
    dimension.setHierarchyList(hierFact.getHierarchyList())
}

const extractMeasures = async (tbox, cube, dataset) => {
    const measureFact = new MeasureFactory(tbox, cube, dataset)
    await measureFact.fetchMeasureArray()
    await measureFact.extractMeasures()
    cube.setMeasureArray(measureFact.measureArray)
}

export default main
