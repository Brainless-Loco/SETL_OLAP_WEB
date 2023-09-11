const main = async (data) => {
    const { dataset, levels, measures } = data
    let sparql = "PREFIX qb: <http://purl.org/linked-data/cube#>\n" +
    "PREFIX qb4o: <http://purl.org/qb4olap/cubes#>\n" +
    "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n" +
    "SELECT\n\t";
    const {selectedCols, query} = appendLevelsQuery(levels)
    const {selectedMeasures, measureQuery} = await appendMeasuresQuery(measures)
    sparql += query
    sparql += '\n\t'
    sparql += measureQuery
    sparql += '\nFROM <__FROM_TOKEN_GRAPH_IRI__>\n'
    sparql += `\nWHERE {\n\t?o a qb:Observation .\n\t?o qb:dataSet <${dataset.iri}> .\n\t`
    sparql += appendMeasuresFilter(measures)
    sparql += '\n\t'
    sparql += appendLevelsFilter(levels)
    sparql += "\n\tFILTER(\n\t\t"
    sparql += appendInstanceFilter(levels)
    sparql += "\n\t) .\n}\n"
    
    // Group by and order by clause
    sparql += "GROUP BY " + selectedCols.join(' ') + ' ' + selectedMeasures.join(' ') + '\n'
    sparql += "ORDER BY " + selectedCols.join(' ') + ' ' + selectedMeasures.join(' ') + '\n'
    // console.log(sparql)
    return {sparql, selectedColumns: [...selectedCols, ...selectedMeasures]}
}

const appendLevelsQuery = (levels) => {
    const hash = new Map()
    const selectedCols = []
    
    levels.forEach(item => {
        const level = item.level
        const property = item.propertyToBeViewed
        if(!hash.get(level.name)) hash.set(level.name, 0)
        selectedCols.push(`?${level.name}${Boolean(property) ? `_${property.name}` : ''}_${hash.get(level.name)}`)
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
            selectedMeasures.push(`?${m.name}_${func.name}`)
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
        const {level, levelProperty, propertyToBeViewed} = item
        
        if(!hash.get(level.name)) hash.set(level.name, 0)
        const val = hash.get(level.name)
        hash.set(level.name, val + 1)
        const r_name = `?${level.name}_${val}`

        selectedRows.push(`?o <${level.sub}> ${r_name} . `)
        // console.log("This is level Property")
        // console.log(levelProperty)

        if(Boolean(levelProperty)) {
            selectedRows.push(`${r_name} <${levelProperty.sub}> ${r_name}_${levelProperty.name} . `)
            selectedRows.push(`${r_name} qb4o:memberOf <${level.sub}> . `)
        }

        if(Boolean(propertyToBeViewed)) {
            if(!hash.get(propertyToBeViewed.name)) hash.set(propertyToBeViewed.name, 0)
            const val = hash.get(propertyToBeViewed.name)
            selectedRows.push(`${r_name} <${propertyToBeViewed.sub}> ?${level.name}_${propertyToBeViewed.name}_${val} . `)
            hash.set(propertyToBeViewed.name, val + 1)
        }
    })

    return selectedRows.join('\n\t')
}

const appendInstanceFilter = (levels) => {
    const selectedRows = []
    const hash = new Map()
    
    levels.forEach(item => {
        const {level, levelProperty, selectedInstances, filterCondition} = item
        
        if(!hash.get(level.name)) hash.set(level.name, 0)
        const val = hash.get(level.name)
        hash.set(level.name, val + 1)
        const r_name = `?${level.name}_${val}_${levelProperty.name}`

        selectedInstances.forEach(instance => {
            let temp = `(${r_name} ${filterCondition} `

            if(instance.sub.search('http') < 0) temp += `"${instance.sub}")`
            else temp += `<${instance.sub}>)`
            selectedRows.push(temp)
        })
    })

    return selectedRows.join(' ||\n\t\t')
}

export default main