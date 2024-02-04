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
        G:"",
        T:"",
        U:"",
        S:"",
        L:"",
        C:"",
        R:""
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
            "/predict_chances_of_admission",
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
                            <b>Chances of Admission: </b>{predictionData}
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

                <center><div className="form__title">University Predictor</div></center>
                <TextField onChange={(e) => handleChange(e)} value={formData.G} className="form__text_field" id="G" name="GRE" variant="filled" label="GRE Score" />
                <TextField onChange={(e) => handleChange(e)} value={formData.T} className="form__text_field" id="T" name="TOEFL" variant="filled" label="TOEFL Score" />
                <TextField onChange={(e) => handleChange(e)} value={formData.U} className="form__text_field" id="U" name="University Rating" variant="filled" label="Previous University Rating" />
                <TextField onChange={(e) => handleChange(e)} value={formData.S} className="form__text_field" id="S" name="SOP" variant="filled" label="SOP" />
                <TextField onChange={(e) => handleChange(e)} value={formData.L} className="form__text_field" id="L" name="LOR" variant="filled" label="LOR" />
                <TextField onChange={(e) => handleChange(e)} value={formData.C} className="form__text_field" id="C" name="CGPA" variant="filled" label="CGPA" />
                <TextField onChange={(e) => handleChange(e)} value={formData.R} className="form__text_field" id="R" name="Research" variant="filled" label="Research Paper" />

                <Button onClick={()=>handleClick()} className="form__button" color="primary" variant="contained">Predict UniversityPrediction</Button>
            </div>
        </div>
    )
}

export default CropRecommender
