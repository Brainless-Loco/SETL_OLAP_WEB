
const DatasetFactory = require('../generate_dataset_array/DatasetFactory')


const main = async (aboxIRI, tboxIRI) => {
    const dsFact = new DatasetFactory(tboxIRI, null)
    await dsFact.extractEndpointDataset(null)
    dsFact.extractDataset()
    
    // To be able to use the dataset array here
    //console.log(dsFact.getDatasetArray())

    // Extract cube, level, heirarchy etc
    const datasetList = dsFact.getDatasetArray();
    
    return datasetList;
}


export default main