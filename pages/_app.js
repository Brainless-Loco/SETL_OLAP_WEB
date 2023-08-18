import '../styles/globals.css'
import '../styles/treeView.css'
import '../styles/selectionSummary.css'
import Layout from "../components/Layout/Layout"
import firebaseApp from '../firebase/firebaseApp'

const MyApp = ({Component, pageProps}) => {
    return (
        <Layout>
            <Component {...pageProps}/>
        </Layout>
    )
}

export default MyApp