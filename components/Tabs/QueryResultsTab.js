import { Box } from "@mui/system"
import { DataGrid } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CircularProgress } from "@mui/material";

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

const QueryResultsTab = ({ data, aboxIRI, modalOpen}) => {
    const [columns, setColumns] = useState([])
    // TODO: Fetch rows and bind them to the view.
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)

    const [tabValue, setValue] = useState('1');

    const [res_head_vars, setres_head_vars] = useState([])

    const barChartView = ()=>{
      const labels = rows.map((item)=>{
        return item[res_head_vars[0]]
      });
      const datasets = []
      const temp_obj_struct = {
        label:'',
        data:[],
        backgroundColor: 0,
        barThickness:50,
      }
      res_head_vars.forEach((item)=>{
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



    const handleChange = (event, newValue) => {
        setValue(newValue)
        if(newValue=='2'){
          setLoading(true)
          barChartView()
          setLoading(false)
        }
      };

    const [barGraphData, setBarGraphData] = useState({})


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
        setLoading(true)
        const params = new URLSearchParams()
        params.append('sparql', data.sparql)
        params.append('aboxIRI', aboxIRI)

        const req = await fetch(`/api/execute_generated_query?${params.toString()}`)
        const res = await req.json()

        // console.log("After execution", res)
        
        // TODO: Bind data
        const cols = res.head.vars
        const bindings = res.results.bindings
        setres_head_vars(cols)
        // console.log(bindings)

        const  isValidUrl = (url) =>{
          const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
          return urlPattern.test(url);
        }

        // Process the columns
        const temp = [{field: 'id', headerName: 'ID', width: 90}]
        cols.forEach(item => {
            temp.push({field: item, headerName: formatName(item), renderCell: (params) => {
              const urlValue = params.value; // Get the URL value from the cell
      
              // Check if the value is a URL
              if (isValidUrl(urlValue)) {
                return (
                  <a style={{color:'blue'}} href={urlValue} target="_blank" rel="noopener noreferrer">
                    {urlValue}
                  </a>
                );
              }
      
              return <span>{urlValue}</span>; // Render the value as plain text
            }, flex:1})
        });

        setColumns(temp)
        // console.log(temp)

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
        // console.log(rows)
        
        setLoading(false)
    }

    useEffect(() => {
      const {sparql} = data
      // if(sparql && sparql.length>0 && aboxIRI && aboxIRI.length>0) {
        
        fetchData()
      // }
    }, [data])
    

    return (
        <Box sx={{height: '100%'}}>
            <TabContext  value={tabValue}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Tabular View" value="1" />
                    <Tab label="Graphical View" value="2" />
                </TabList>
                <TabPanel sx={{ height:'100%',minHeight:'500px', width: '100%'}} value="1">
                  <Box sx={{height:'70vh', width: '100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                    {
                      !loading && 
                      <DataGrid
                          columns={columns}
                          rows={rows}
                          pageSize={10}
                          rowsPerPageOptions={[10]} />
                    }

                    {
                      loading&& <CircularProgress/>
                    }
                  </Box>
                  
                    
                </TabPanel>
                <TabPanel  sx={{ height:'100%',width:'100%',overflowX:'auto'}} value="2">
                    {
                      loading ?
                      <Box sx={{height:'70vh', width: '100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <CircularProgress />
                      </Box>: 
                      <Box sx={{width:'100%'}}>

                        <Bar options={options} data={barGraphData}/>
                      </Box>
                    }
                </TabPanel>
            </TabContext>
            {/*  */}
        </Box>
    )
}

export default QueryResultsTab