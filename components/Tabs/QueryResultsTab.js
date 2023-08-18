import Typography  from "@mui/material/Typography"
import { Box } from "@mui/system"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import SparqlClient from "../../pages/api/sparql_client/SparqlClient"
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Query Result Bar Chart View',
    },
  },
};

const QueryResultsTab = ({value, index, queryID, aboxIRI, shallExecute, onFinish}) => {
    const [sparql, setSparql] = useState('')
    const [columns, setColumns] = useState([])
    // TODO: Fetch rows and bind them to the view.
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)

    const [tabValue, setValue] = useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const [barGraphData, setBarGraphData] = useState({})

    const onQueryExecution = async () => {
        setLoading(true)
        // TODO: Exeption handling
        try {
            await fetchData()
        } catch(error) {
            console.log("ERROR > Query Results tab > fetchData >", error)
        }
        setLoading(false)
    }

    const formatName = (str) => {
        const arr = str.split('_')
        // Regex black magic found in the internet.
        // Splits camel cased string
        const ans = ''
        arr.forEach(item => {
            ans += item.replace(/([a-z])([A-Z])/g, '$1 $2') + ' '
        })
        
        return ans
    }

    const fetchData = async () => {
        // console.log('Query Results Tab > Trying to execute query and fetch data')

        // Insert the graph iri here
        const params = new URLSearchParams()
        params.append('queryID', queryID)
        params.append('aboxIRI', aboxIRI)

        const req = await fetch(`/api/execute_generated_query?${params.toString()}`)
        const res = await req.json()

        // console.log("After execution", res)
        
        // TODO: Bind data
        const cols = res.head.vars
        const bindings = res.results.bindings
        
        // Process the columns
        const temp = [{field: 'id', headerName: 'ID', width: 64}]
        cols.forEach(item => {
            temp.push({field: item, headerName: formatName(item), width: 256})
        });

        setColumns(temp)

        const tempRows = []
        bindings.forEach((item, idx) => {
            let obj = {id: idx}
            temp.forEach((c, index) => {
                /*console.log("QueryResultTab > Column >", c)*/
                if(index > 0)
                obj = {...obj, [c.field]: item[c.field].value}
            })
            tempRows.push(obj)
        })

        setRows(tempRows)

        const barChartView = ()=>{
          const labels = rows.map((item)=>{
            return item[cols[0]]
          });
          const datasets = []
          const temp_obj_struct = {
            label:'',
            data:[],
            backgroundColor: 0,
            barThickness:40
          }
          cols.forEach((item)=>{
            const temp1 = Object.assign({},temp_obj_struct)
            temp1['label']=item.split('_')[1]
            temp1['data']=rows.map((el)=>{
              return el[item]
            })
            temp1['backgroundColor']= "#"+Math.floor(Math.random()*16777215).toString(16)
            datasets.push(temp1)
          })
          datasets.shift()
          const temp2 = {
            labels:labels,
            datasets:datasets
          }
          setBarGraphData(temp2)
        }
        barChartView()
    }
    

    return (
        <Box hidden={value != index} sx={{height: '100%'}}>
            <Button 
                disabled={loading || !Boolean(queryID) || !queryID.length}
                fullWidth
                variant='contained'
                onClick={onQueryExecution} 
                sx={{marginY: '32px'}}>
                    Execute query
            </Button>
            <TabContext  value={tabValue}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Tabular View" value="1" />
                    <Tab label="Graphical View" value="2" />
                </TabList>
                <TabPanel sx={{ height:'100%'}} value="1">
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        rowsPerPageOptions={[10]} />
                </TabPanel>
                <TabPanel  sx={{ height:'100%'}} value="2">
                  <Bar options={options} data={barGraphData}/>;
                </TabPanel>
            </TabContext>
            {/*  */}
        </Box>
    )
}

export default QueryResultsTab