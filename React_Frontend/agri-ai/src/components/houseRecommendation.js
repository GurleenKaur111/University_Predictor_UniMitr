import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core';
import api from "../api/recommenderapi"
import Alert from '@material-ui/lab/Alert';


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "../styles/croprecommenderoutput.css"
import {cropData} from "./Data"
import Loading from './Loading';

const useStyles = makeStyles({
    root: {
      maxWidth: 550,
    },
    table: {
        minWidth: 450,
    },
});


function CropRecommender() {

    const [formData, setFormData] = useState({
        area:"",
        bedrooms:"",
        yrsold:"",
    })

    const [predictionData, setPredictionData] = useState(0)

    const [loadingStatus, setLoadingStatus] = useState(false)

    const handleChange = (e) => {
        let newData = {...formData}
        newData[e.target.id] = e.target.value
        setFormData(newData)
    }

    const handleClick = async () => {

        setLoadingStatus(true)
        
        const request = new FormData()

        for(let key in formData) {
            request.append(key, formData[key])
        }
        
        const response = await api.post(
            "/predict_chances_of_housing",
            request
        )
        
        const responseData = response.data
        setPredictionData(responseData)
        setLoadingStatus(false)
    }

    const handleBackClick = () => {
        setPredictionData(0)
    }

    const classes = useStyles();

    const predictedCrop = cropData[predictionData.final_prediction]

    if(predictionData != 0) {
        const outputComponent = (
            <div className="output_container">
                <Card className={`${classes.root} output_container__card`}>

                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Approximate House Price: </b>Rs.{predictionData}
                        </Typography>
                        <br/>
   
                        </CardContent>
                    <CardActions>
                        <Button onClick={()=>handleBackClick()} className="back__button" variant="contained" size="small" color="primary">
                        Back to Prediction
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )

        return outputComponent
    }


    else if(loadingStatus) {

        return <Loading />

    }
    else return (
        <div className="form">
            <div className="form__form_group">

                {
                    predictionData.error && 
                    <Alert style={{marginTop:"20px"}} severity="error"> { predictionData.error } </Alert>
                }

                <center><div className="form__title">Housing Price Predictor</div></center>
                <TextField onChange={(e) => handleChange(e)} value={formData.area} className="form__text_field" id="area" name="area" variant="filled" label="Area(sqft)" />
                <TextField onChange={(e) => handleChange(e)} value={formData.bedrooms} className="form__text_field" id="bedrooms" name="bedrooms" variant="filled" label="Number of Bedrooms" />
                <TextField onChange={(e) => handleChange(e)} value={formData.yrsold} className="form__text_field" id="yrsold" name="yrsold" variant="filled" label="Years Old" />

                <Button onClick={()=>handleClick()} className="form__button" color="primary" variant="contained">Predict HousePrediction</Button>
            </div>
        </div>
    )
}

export default CropRecommender
