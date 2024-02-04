import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import CropRecommender from "./components/CropRecommender";
import UniversityPrediction from "./components/UniversityPrediction";
import searchUniversity from "./components/searchUniversity";
import houseRecommendation from "./components/houseRecommendation";
import FertilizerRecommender from "./components/FertilizerRecommender";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div style={{
      backgroundImage:`url(${process.env.PUBLIC_URL + 'assets/background.jpg'})`
    }} className="container">
      <div class="overlay">
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />

          <Route exact path="/univ" component={CropRecommender} />
          <Route exact path="/house" component={houseRecommendation} />
          <Route exact path="/univ" component={UniversityPrediction} />
          <Route exact path="/search" component={searchUniversity} />

          {/* <Route exact path="/fertilizer" component={FertilizerRecommender} /> */}
        </Switch>
      </Router>
      </div>
    </div>
  );
}

export default App;
