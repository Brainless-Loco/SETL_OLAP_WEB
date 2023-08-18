const fs = require('fs')
const path = require('path')

const handler = async (req, res) => {
    var { file_name } = req.query
    file_name = file_name ?? 'test_turtle.jsonld'

    const dir = `./temp/${file_name}`
    if(fs.existsSync(dir)) {
        const file = fs.readFileSync(dir)
        const data = JSON.parse(file)

        const typeMap = getTypeMapOf(data)
        writeTypeMapFile(`./temp/typemap/`, file_name, typeMap)
        res.status(200).json(Object.fromEntries(typeMap))
    } else res.status(404).json({error: 'File not found.'})
}

const writeTypeMapFile = async (folderDir, file_name, data) => {
    if(!fs.existsSync(folderDir)) fs.mkdirSync(folderDir)

    fs.writeFileSync(
        `${folderDir}/${dropFileFormat(file_name)}_type_map.jsonld`,
        JSON.stringify(Object.fromEntries(data))
        // TODO Handle Error here
    )
}

const dropFileFormat = (file_name) => {
    var idx = 0
    for ( ; idx < file_name.length && file_name[idx] !== '.' ; idx++);
    return file_name.substring(0, idx)
}

const getTypeMapOf = (data) => {
    const typeMap = new Map()
    for(const obj of data) {
        seperateObjectByType(obj, typeMap)
    }

    return typeMap
}

const seperateObjectByType = (obj, typeMap) => {
    for(const [key, val] of Object.entries(obj)) {
        if(key === '@type') mapByClassName(val, obj, typeMap)
    }
}

const mapByClassName = (val, obj, typeMap) => {
    for (const className of val) {
        if (Boolean(typeMap.get(className))) {
            typeMap.set(
                className,
                [...typeMap.get(className), obj,]
            )
        }
        else
            typeMap.set(className, [obj])
    }
}

export default handler