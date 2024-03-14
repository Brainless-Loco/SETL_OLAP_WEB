import '../styles/globals.css'
import '../styles/treeView.css'
import '../styles/selectionSummary.css'
import '../styles/collapsingList.css'
import '../styles/viewport.css'
import Layout from "../components/Layout/Layout"

const MyApp = ({Component, pageProps}) => {
    return (
        <Layout>
            <Component {...pageProps}/>
        </Layout>
    )
}

export default MyApp