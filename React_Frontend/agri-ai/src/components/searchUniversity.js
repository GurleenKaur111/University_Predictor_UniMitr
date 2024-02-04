import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core';
import api from "../api/recommenderapi"
import Alert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "../styles/croprecommenderoutput.css"
import Loading from './Loading';

const useStyles = makeStyles({
    root: {
        maxWidth: 650,
    },
    table: {
        minWidth: 550,
    },
});


function CropRecommender() {

    const [formData, setFormData] = useState({
        name: "",
        country: "",
    })


    const [predictionData, setPredictionData] = useState([])

    const [univData, setunivData] = useState([])

    const [loadingStatus, setLoadingStatus] = useState(false)
    const [isDataLoaded, setDataLoadingStatus] = useState(false)

    const handleChange = (e) => {
        let newData = { ...formData }
        newData[e.target.id] = e.target.value
        setFormData(newData)
    }

    const handleClick = async () => {

        setLoadingStatus(true)

        const request = new FormData()

        for (let key in formData) {
            request.append(key, formData[key])
        }

        const response = await api.post(
            "/searchUniversity",
            request
        )

        const responseData = response.data
        console.log("line 68", responseData)

        let univList = []
        let i = 0
        for (let x in responseData) {
            console.log(x + " " + responseData[x])
            univList[i] = [x, responseData[x]]
            i++
        }
        setunivData(univList)

        setPredictionData(responseData)
        setLoadingStatus(false)
        setDataLoadingStatus(true)
    }

    const handleBackClick = () => {
        setPredictionData([])
        setDataLoadingStatus(false)
    }

    const classes = useStyles();

    if (isDataLoaded) {
        const outputComponent = (
            <div className="output_container">
                <Card className={`${classes.root} output_container__card`}>

                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th" align="center"><b>NAME OF UNIVERSITY</b></TableCell>
                                        <TableCell component="th" align="center"><b>LINK TO WEBSITE</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {univData.map((u) => {
                                        const [name, websites] = u;
                                        return (
                                            <TableRow align="right">
                                                <TableCell align="center">{name}</TableCell>
                                                <TableCell align="center"><a href={websites} target='_blank'>{websites}</a></TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br />

                    </CardContent>
                    <CardActions>
                        <Button onClick={() => handleBackClick()} className="back__button" variant="contained" size="small" color="primary">
                            Back to University Search
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )

        return outputComponent
    }


    else if (loadingStatus) {

        return <Loading />

    }
    else return (
        <div className="form">
            <div className="form__form_group">

                {
                    predictionData.error &&
                    <Alert style={{ marginTop: "20px" }} severity="error"> {predictionData.error} </Alert>
                }

                <center><div className="form__title">Search Universities</div></center>
                <TextField onChange={(e) => handleChange(e)} value={formData.name} className="form__text_field" id="name" name="area" variant="filled" label="Name" />
                <TextField onChange={(e) => handleChange(e)} value={formData.country} className="form__text_field" id="country" name="country" variant="filled" label="Country" />

                <Button onClick={() => handleClick()} className="form__button" color="primary" variant="contained">Search</Button>
            </div>
        </div>
    )
}

export default CropRecommender
