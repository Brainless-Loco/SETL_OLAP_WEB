import LevelAttributeFactory from './LevelAttributeFactory'
import MeasureFactory from './MeasureFactory'

const Cube = require('./Cube')
const CubeFactory = require('./CubeFactory')
const DatasetFactory = require('./DatasetFactory')
const DimensionFactory = require('./DimensionFactory')
const HeirarchyFactory = require('./HierarchyFactory')
const LevelFactory = require('./LevelFactory')
const fs = require('fs')

const main = async (aboxIRI, tboxIRI) => {
    const dsFact = new DatasetFactory(tboxIRI, null)
    await dsFact.extractEndpointDataset(null)
    dsFact.extractDataset()
    
    // To be able to use the dataset array here
    //console.log(dsFact.getDatasetArray())

    // Extract cube, level, heirarchy etc
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
        await extractCuboidLevel(tbox, cube)
    } else {
        // Extract dimension from cube
        const dimFact = new DimensionFactory(tbox, cube, null)
        await dimFact.extractOlapDimension(null)
        dimFact.extractDimension()
        cube.setDimensionList(dimFact.getDimensionArray())
        //console.log(dimFact.getDimensionArray())

        // Extract Hierarchies from each dimension, extract hierarchy level
        const dimensions = dimFact.getDimensionArray()
        for(let i = 0 ; i < dimensions.length ; i++) {
            dimensions[i].extractName();
            await extractHierarchyList(tbox, dimensions[i])
            await extractHierarchyStepLevel(tbox, dimensions[i].getHierarchyList())
        }
    }
    
    cube.extractName()
    await extractMeasures(tbox, cube)
    dataset.setCube(cube)
}

const extractCuboidLevel = async (tbox, cuboid) => {
    const lvlFact = new LevelFactory(tbox)
    await lvlFact.fetchCuboidLevel(cuboid)
    lvlFact.extractData()

    const levels = lvlFact.getLevelArray()

    //console.log(lvlFact.getLevelArray())
}

const extractHierarchyStepLevel = async (tbox, hierarchyList) => {
    for(let i = 0 ; i < hierarchyList.length ; i++) {
        hierarchyList[i].extractName()
        // console.log(hierarchyList[i].sub)
        await extractHierarchyStepLevelList(tbox, hierarchyList[i])
    }
}

const extractHierarchyStepLevelList = async (tbox, hierarchy) => {
    const lvlFact = new LevelFactory(tbox)
    await lvlFact.fetchHierarchyStepLevels(hierarchy)
    lvlFact.extractData(hierarchy.sub)
    const levels = lvlFact.getLevelArray();

    for(let i = 0 ; i < levels.length ; i++){
        await extractLevelAttributes(tbox, levels[i])
    }

    // console.log(levels)

    hierarchy.setHierarchyStep(levels)
}

const extractLevelAttributes = async (tbox, level) => {
    const laFact = new LevelAttributeFactory(tbox)
    await laFact.fetchLevelAttributes(level)
    laFact.extractData()
    level.setLevelAttributes(laFact.getLevelAttributesArray())
}

const extractHierarchyList = async (tbox, dimension) => {
    const hierFact = new HeirarchyFactory(tbox, dimension)
    await hierFact.fetchDimensionHierarchyList()
    hierFact.extractHierarchies()
    dimension.setHierarchyList(hierFact.getHierarchyList())
    //console.log(dimension)
}

const extractMeasures = async (tbox, cube) => {
    const measureFact = new MeasureFactory(tbox, cube)
    await measureFact.fetchMeasureArray()
    await measureFact.extractMeasures()
    cube.setMeasureArray(measureFact.measureArray)
}

export default main