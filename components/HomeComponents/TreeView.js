import { useEffect } from "react"
import FileNameList from "../Windows/ListViewComponents/FileNameListItem"

const TreeView = ({data,prefixes,addOnClick}) => {
    
    return (
        <ul>
            {
                data && Object.entries(data).map(([key,val])=> {
                    if(key == "sub") {
                        const temp = val.split("#")
                        temp[0]+="#"
                        const KEY = `${prefixes.get(temp[0])}:${temp[1]}`
                        return <li key={KEY}
                                onClick={()=>{addOnClick(KEY)}}
                                className="treeViewList"
                                >
                                 {KEY}   
                                </li>
                    }
                    else if (typeof val != "string" && val!=null && key!="levelAttributes"){
                        return val.map((item, idx) => (
                            <TreeView key={idx} data={item} prefixes={prefixes} addOnClick={addOnClick}/>
                        ))
                    }
                })
                
            }
        </ul>
    )
}

export default TreeView