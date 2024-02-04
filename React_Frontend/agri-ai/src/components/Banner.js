import { Button } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import "../styles/Banner.css"

function Banner() {

    let history = useHistory()

    const cropRedirect = () => {
        history.push("/univ")
    }
    const houseRedirect = () => {
        history.push("/house")
    }
    const univSearchRedirect = () => {
        history.push("/search")
    }
    
    return (
        <div className="banner">
            <div className="banner__title">
                <div className="banner__title_head">
                    uni<font>Mitr</font>
                </div>
                <div className="banner__title_tail">
                    <div className="typing">A Machine Learning based Web Application for University and House Predictor</div>
                    <div className="banner__buttons">
                        
                        <Button onClick={cropRedirect} className="banner__button cropButton">University Predictor</Button>
                        <Button onClick={houseRedirect} className="banner__button cropButton">House Predictor</Button>
                        <Button onClick={univSearchRedirect} className="banner__button cropButton">Search Universities</Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Banner