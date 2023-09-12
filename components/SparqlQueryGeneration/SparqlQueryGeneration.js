const main = async (data) => {
    const { dataset, levels, measures,aboxIRI } = data
    let sparql = "PREFIX qb: <http://purl.org/linked-data/cube#>\n" +
    "PREFIX qb4o: <http://purl.org/qb4olap/cubes#>\n" +
    "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n" +
    "SELECT\n\t";
    const {selectedCols, query} = appendLevelsQuery(levels)
    const {selectedMeasures, measureQuery} = await appendMeasuresQuery(measures)
    sparql += query
    sparql += '\n\t'
    sparql += measureQuery
    sparql += `\nFROM <${aboxIRI}>\n`
    sparql += `\nWHERE {\n\t?o a qb:Observation .\n\t?o qb:dataSet <${dataset.iri}> .\n\t`

    sparql += appendMeasuresFilter(measures)
    sparql += '\n\t'
    sparql += appendLevelsFilter(levels)
    
    // console.log(checkIfWithInstance(levels))
    if(checkIfWithInstance(levels)==true){
        sparql += "\n\tFILTER(\n\t\t"
        sparql += appendInstanceFilter(levels)
        sparql += "\n\t) .\n}\n"
    }
    else{
        sparql += '\n}\n'
    }
    
    // Group by and order by clause
    sparql += "GROUP BY " + selectedCols.join(' ') + ' ' + selectedMeasures.join(' ') + '\n'
    sparql += "ORDER BY " + selectedCols.join(' ') + ' ' + selectedMeasures.join(' ') + '\n'
    // console.log(sparql)
    return {sparql, selectedColumns: [...selectedCols, ...selectedMeasures]}
}

const checkIfWithInstance = (levels)=>{
    // selectedInstances

    let to_be_return = false;

    levels.forEach(item => {
        if(item.selectedInstances.length>0){
            // console.log('paisi')
            to_be_return = true;
        }
    })
    return to_be_return;
}

const appendLevelsQuery = (levels) => {
    const hash = new Map()
    const selectedCols = []
    
    levels.forEach(item => {
        // Object.keys(property).length !== 0
        const level = item.level
        const property = item.propertyToBeViewed
        const hierarchy = item.hierarchy
        // console.log(level)
        // console.log(property)
        if(!hash.get(level.name)) hash.set(level.name, 0)
        selectedCols.push(` ?${hierarchy.split('#')[1]}_${level.name}${Object.keys(property).length !== 0 ? `_${property.name}` : ''}`)
        hash.set(level.name, hash.get(level.name) + 1)
    })

    return {selectedCols, query: selectedCols.join('\n\t')}
}

const appendMeasuresQuery = async (measures) => {
    let count = 1
    const selectedCols = []
    const selectedMeasures = []

    for(let idx = 0 ; idx < measures.length ; idx++) {
        const m = measures[idx].measure
        const funs = measures[idx].functions
        const range = m.range
        
        
        funs.forEach(func => {
            // Code
            const f_query = `(${func.name.toUpperCase()}(<${range}>(?m${count})) as ?${m.name}_${func.name})`
            selectedCols.push(f_query)
            selectedMeasures.push(` ?${m.name}_${func.name}`)
        })
    }

    return {selectedMeasures, measureQuery: selectedCols.join('\n\t')}
}

const appendMeasuresFilter = (measures) => {
    let count = 1
    const selectedRows = []

    for(let idx = 0 ; idx < measures.length ; idx++) {
        const m = measures[idx].measure
        selectedRows.push(`?o <${m.sub}> ?m${count} . `)
    }
    return selectedRows.join('\n\t')
}

const appendLevelsFilter = (levels) => {
    // Code
    const hash = new Map()
    const selectedRows = []
    
    levels.forEach(item => {
        const {level, levelProperty, propertyToBeViewed,hierarchy,serialForRollUp} = item

        // console.log(level.sub)
        // console.log(hierarchy)

        // const {levelProperty} = level

        if(!hash.get(level.name)) hash.set(level.name, 0)
        const val = hash.get(level.name)
        hash.set(level.name, val + 1)
        // const r_name = `?${hierarchy.split('#')[1]}_${level.name}_${val}`
        let lastRName = ''

        let loopOn = true

        serialForRollUp.forEach((item,idx) => {
            const r_name = `${hierarchy.split('#')[1]}_${item[0].split('#')[1]}`
            if(idx==0){
                selectedRows.push(`?o <${item[0]}> ?${r_name} . `)
                if(level.sub==item[0]){
                    loopOn = false
                }
                else{ 
                    selectedRows.push(`?${r_name} qb4o:memberOf <${item[0]}>. `)
                }
                lastRName = r_name
            }
            else if(loopOn==true){
                selectedRows.push(`?${lastRName} <${item[1]}> ?${r_name} .`)
                selectedRows.push(`?${r_name} qb4o:memberOf <${item[0]}> . `)
                lastRName = r_name
            }
            if(level.sub==item[0]) loopOn = false
        });

        // selectedRows.push(`?o <${level.sub}> ${r_name} . `)
        // console.log(selectedRows)

        if(Object.keys(levelProperty).length !== 0) {
            selectedRows.push(`?${lastRName} <${levelProperty.sub}> ?${lastRName}_${levelProperty.name} . `)
            // selectedRows.push(`?${lastRName} qb4o:memberOf <${level.sub}>.`)
        }

        if(Object.keys(propertyToBeViewed).length !== 0) {
            if(!hash.get(propertyToBeViewed.name)) hash.set(propertyToBeViewed.name, 0)
            const val = hash.get(propertyToBeViewed.name)
            selectedRows.push(`?${lastRName} <${propertyToBeViewed.sub}> ?${level.name}_${propertyToBeViewed.name} . `)
            hash.set(propertyToBeViewed.name, val + 1)
        }
    }) 
    selectedRows = [...new Set(selectedRows)]
    // console.log(selectedRows)
    return selectedRows.join('\n\t')
}

const appendInstanceFilter = (levels) => {
    const selectedRows = []
    const hash = new Map()
    
    levels.forEach(item => {
        const {level, levelProperty, selectedInstances, filterCondition, hierarchy} = item

        if(selectedInstances.length>0){
            if(!hash.get(level.name)) hash.set(level.name, 0)
            const val = hash.get(level.name)
            hash.set(level.name, val + 1)
            const r_name = `?${hierarchy.split('#')[1]}_${level.name}_${levelProperty.name}`
    
            selectedInstances.forEach(instance => {
                let temp = `(${r_name} ${filterCondition} `
    
                if(instance.sub.search('http') < 0) temp += `"${instance.sub}")`
                else temp += `<${instance.sub}>)`
                selectedRows.push(temp)
            })
        }
        
    })

    return selectedRows.join(' ||\n\t\t')
}

export default main