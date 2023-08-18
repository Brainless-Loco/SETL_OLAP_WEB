const SparqlResultViewport = ({value, index}) => {
    return (
        <div hidden={value != index}>
            SPARQL Query Results Viewport<br/>
            Work in progress...
        </div>
    )
}

export default SparqlResultViewport